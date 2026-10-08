---
title: Chat SDK 和 Workflow SDK 实现 Human-in-the-Loop
tags: Vercel AI SDK
toc: true
---


> 原文：[https://vercel.com/kb/guide/human-in-the-loop-with-chat-sdk-and-workflow-sdk](https://vercel.com/kb/guide/human-in-the-loop-with-chat-sdk-and-workflow-sdk)  
> 作者：Ben Sabic  
> 分类：Knowledge Base / Chat SDK  
> 阅读时长：11 分钟  
> 最后更新：2026 年 6 月 17 日

将 Chat SDK 与 Workflow SDK 结合使用，可以在聊天平台中通过审批卡片暂停工作流，并在用户点击后通过 `createWebhook` 恢复工作流。

你可以将 Chat SDK 与 Workflow SDK 结合起来，让一个持久化工作流在 Slack 中等待人工审批。Chat SDK 会发布一张带有“批准”和“拒绝”按钮的交互式卡片；Workflow SDK 的 `createWebhook` 会生成一个 URL，当这些按钮被点击时会向该 URL 发送 POST 请求，从而让工作流一直暂停，直到点击事件到达。

工作流会携带点击事件的 payload 恢复执行，然后根据用户的选择决定下一步操作并继续运行。整个过程不需要 `onAction` 处理器、不需要自定义审批数据库，也不需要轮询。

本指南会带你完成以下内容：使用 `createWebhook` 暂停工作流、发布一张带有 `callbackUrl` 按钮的 Chat SDK 审批卡片，并根据用户选择恢复工作流。你还会添加超时机制，避免无人处理的审批无限期挂起，并了解如何将这一模式扩展到单个工作流中的多个决策点。

## 前置条件

开始之前，请确保你具备：

- Node.js 18 或更高版本
- 一个已有的 Chat SDK 机器人（可参考 Slack agent 指南或 Slack file bot 指南）
- 一个已配置 Workflow SDK 的项目
- 如果要部署到 Vercel，需要一个 Vercel 账号

Workflow SDK 可以运行在任意 **World** 之上；World 是一个可插拔的后端，用于存储、排队和认证。当你部署到 Vercel 时，会自动选择 Vercel Workflows，且无需任何配置。对于自托管部署，请参考 Postgres World 以及其他 provider。

## 工作原理

这里有三个部分协同工作：

1. **Workflow SDK 运行长生命周期流程。**  
当你用 `"use workflow"` 标记一个函数时，该函数就会变成持久化函数：它可以暂停、恢复，并且能在崩溃后继续执行而不丢失状态。
2. **`createWebhook()` 返回一个包含 `url` 的对象，这个 URL 是一个公开端点。**  
当你 `await` 它时，工作流会暂停，直到该端点收到一个 HTTP 请求。
3. **Chat SDK 将决策呈现给人类用户。**  
`<Button callbackUrl="...">` 会在按钮点击时，把该点击动作的数据 POST 到你提供的 URL，同时也会触发任何已有的 `onAction` 处理器。当这个 URL 是工作流的 `webhook.url` 时，点击会直接恢复该工作流。

这种组合消除了常见的“胶水代码”。你不需要单独的审批表，不需要让 `onAction` 回调去查找哪个工作流正在等待，也不需要轮询。工作流暂停，用户点击，然后同一个工作流函数会携带点击 payload 从暂停点继续执行。

当恢复 URL 由工作流本身持有时，`createWebhook()` 是合适的原语。如果你更希望 URL 保持私密，并从自己的服务端代码恢复工作流，请改用 `createHook()`，并配合确定性的业务 token。

## 步骤

### 1. 安装依赖

在已经设置好 Chat SDK 机器人的项目中添加 Workflow SDK：

```bash
pnpm add workflow
```

如果你是从零开始，也需要安装几个 Chat SDK 包：

```bash
pnpm add chat @chat-adapter/slack @chat-adapter/state-redis
```

`workflow` 包是 Workflow SDK 的核心。`chat` 包是 Chat SDK 的核心，而 `@chat-adapter/slack` 和 `@chat-adapter/state-redis` 分别是 Slack 平台适配器和 Redis 状态适配器。如果你还没有机器人，请参考 Chat SDK 入门指南和 Slack agent 指南。

### 2. 定义审批工作流

创建 `workflows/approval.ts`：

```ts
import { createWebhook } from "workflow";
import {
  finalizeApprovalCard,
  postApprovalCard,
  postReply,
} from "@/lib/slack";

export async function requestDeployApproval(opts: {
  threadId: string;
  version: string;
  requestedBy: string;
}) {
  "use workflow";

  using webhook = createWebhook();

  const messageId = await postApprovalCard({
    threadId: opts.threadId,
    version: opts.version,
    requestedBy: opts.requestedBy,
    webhookUrl: webhook.url,
  });

  const request = await webhook;
  const payload = await request.json();

  if (payload.actionId === "approve") {
    await deploy(opts.version);

    await finalizeApprovalCard({
      threadId: opts.threadId,
      messageId,
      version: opts.version,
      requestedBy: opts.requestedBy,
      outcome: `Approved by <@${payload.user.id}> — ${opts.version} deployed.`,
    });

    await postReply(
      opts.threadId,
      `Deployed **${opts.version}** by <@${payload.user.id}>.`,
    );
  } else {
    await finalizeApprovalCard({
      threadId: opts.threadId,
      messageId,
      version: opts.version,
      requestedBy: opts.requestedBy,
      outcome: `Denied by <@${payload.user.id}>.`,
    });

    await postReply(
      opts.threadId,
      `Deploy of **${opts.version}** denied by <@${payload.user.id}>.`,
    );
  }
}

async function deploy(version: string) {
  "use step";
  // 在这里触发你的部署。
  // 这会作为一个持久化步骤运行，
  // 因此重试和可观测性都是内置能力。
}
```

这个工作流有意保持精简。它负责 webhook 和恢复逻辑；其他所有事情（发布卡片、发送后续消息、触发部署）都是步骤。这样的分离可以让工作流主体保持确定性，并把副作用推到可重试的单元中。

接下来，在 `lib/slack.ts` 中定义辅助步骤：

```ts
import { Card, CardText, Actions, Button } from "chat";
import { bot } from "@/lib/bot";

export async function postApprovalCard(opts: {
  threadId: string;
  version: string;
  requestedBy: string;
  webhookUrl: string;
}): Promise<string> {
  "use step";

  const thread = bot.thread(opts.threadId);
  const sent = await thread.post(
    <Card
      title={`Deploy ${opts.version}?`}
      subtitle={`Requested by ${opts.requestedBy}`}
    >
      <CardText>
        Approve to roll out **{opts.version}**, or deny to abort.
      </CardText>
      <Actions>
        <Button id="approve" style="primary" callbackUrl={opts.webhookUrl}>
          Approve
        </Button>
        <Button id="deny" style="danger" callbackUrl={opts.webhookUrl}>
          Deny
        </Button>
      </Actions>
    </Card>,
  );

  return sent.id;
}

// 重新渲染审批卡片，移除 Actions 块，
// 将按钮替换成一行静态结果。
// 标题、副标题和正文保持不变，便于线程保留上下文。
export async function finalizeApprovalCard(opts: {
  threadId: string;
  messageId: string;
  version: string;
  requestedBy: string;
  outcome: string;
}) {
  "use step";

  const thread = bot.thread(opts.threadId);
  await thread.adapter.editMessage(
    thread.id,
    opts.messageId,
    <Card
      title={`Deploy ${opts.version}?`}
      subtitle={`Requested by ${opts.requestedBy}`}
    >
      <CardText>
        Approve to roll out **{opts.version}**, or deny to abort.
      </CardText>
      <CardText>{opts.outcome}</CardText>
    </Card>,
  );
}

// 以 markdown 形式发布后续消息，
// 这样支持原生 markdown 的平台会渲染粗体、斜体和链接，
// 而不是显示字面量星号。
// 普通字符串会原样传递；`{ markdown }` 是显式形式。
export async function postReply(threadId: string, markdown: string) {
  "use step";

  await bot.thread(threadId).post({ markdown });
}
```

`bot.thread(threadId)` 会从序列化 ID 构造一个 Thread 引用，这正是 Chat SDK 在事件处理器之外发帖所提供的入口。Thread ID 的格式为 `adapter:channel:thread`（例如 `slack:C123ABC:1234567890.123456`），并且可以干净地通过 JSON 往返传递，因此可以安全地作为工作流输入。

#### 此工作流中的关键细节

- `using` 声明确保 webhook 会在工作流退出时自动清理，即使工作流抛出异常也一样。
- 两个按钮都指向同一个 `webhook.url`。`actionId` 会随 callback payload 一起传递，因此单个 webhook 就可以处理卡片上的所有按钮。
- `await webhook` 会暂停工作流。函数会在这里暂停，直到用户点击按钮；这可能需要几秒、几小时或几天。Workflow SDK 会持久化状态，并在点击发生后恢复。
- `deploy` 函数被标记为 `"use step"`，这会让它成为一个持久化步骤，具备自动重试和可观测性。Workflow SDK 只会在步骤失败时重新运行步骤，而不会在恢复时重复运行。
- `postApprovalCard` 返回已发布消息的 `id`，而 `finalizeApprovalCard` 调用 `thread.adapter.editMessage` 重新渲染卡片，并在决策完成后移除按钮。这能防止用户点击原卡片上的过期按钮命中已消费的 webhook，同时在线程中留下清晰的审计记录。
- `postReply` 使用 `{ markdown }` 而不是裸字符串发布消息。裸字符串会原样传递，因此在 Slack 和 Teams 上，`**bold**` 会显示为字面量星号；`{ markdown }` 形式会转换为平台原生标记。

如果你需要跨越工作流边界保留更多原始线程上下文（例如触发消息或线程元数据），可以在进入工作流前使用 `thread.toJSON()`，并在另一侧恢复时使用 `bot.reviver()`。对于上面的审批流程，线程 ID 已经足够。

### 3. 启动工作流

从审批请求产生的任意位置触发工作流。例如，从 Chat SDK 处理器中触发：

```ts
import { start } from "workflow/api";
import { requestDeployApproval } from "@/workflows/approval";

bot.onNewMention(async (thread, message) => {
  const version = parseVersion(message.text);
  if (!version) {
    await thread.post("Usage: @bot deploy v1.2.3");
    return;
  }

  await start(requestDeployApproval, [
    {
      threadId: thread.id,
      version,
      requestedBy: message.author.fullName,
    },
  ]);
});
```

`start` 会将工作流运行加入队列，并立即返回一个运行句柄，使 mention 处理器无需阻塞即可响应。之后由工作流接管：发布卡片、在 webhook 上暂停，并在用户点击时恢复。

### 4. 读取 callback payload

Chat SDK 会向 callback URL POST 一个 JSON body，其结构如下：

```json
{
  "type": "action",
  "actionId": "approve",
  "value": "approve",
  "user": {
    "id": "U123",
    "name": "alice"
  },
  "threadId": "slack:C123:1234567890.123",
  "messageId": "1234567890.456"
}
```

- `actionId` 是按钮的 `id` 属性：在这个工作流中是 `"approve"` 或 `"deny"`。
- `value` 是你在按钮上设置的可选 `value` 属性；它是一个字符串，可用于向处理器传递额外上下文。当多个按钮共享同一个 `id`（因此只靠 `actionId` 无法区分），或者按钮需要携带记录标识（如 `"item-123"`）时，它最有用。在上面的审批工作流中，按钮拥有不同的 `id`，因此未设置 `value`，到达时为 `undefined`。
- `user` 是点击按钮的用户，不论是谁触发了该工作流。使用 `actionId` 判断按下了哪个按钮，并用 `user.id` 记录或校验审批人。

## 处理多个决策点

对于需要多个审批的工作流，可以多次调用 `createWebhook()`。每次调用都会生成一个新的 URL，因此各次暂停互不影响：

```ts
export async function multiStageApproval(opts: { threadId: string }) {
  "use workflow";

  using draftReview = createWebhook();
  const draftTitle = "Approve draft?";
  const draftMessageId = await postPrompt(
    opts.threadId,
    draftTitle,
    draftReview.url,
  );
  const draftPayload = await (await draftReview).json();

  if (draftPayload.actionId !== "approve") {
    await finalizePromptCard(
      opts.threadId,
      draftMessageId,
      draftTitle,
      `Rejected by <@${draftPayload.user.id}>.`,
    );
    return;
  }

  await finalizePromptCard(
    opts.threadId,
    draftMessageId,
    draftTitle,
    `Approved by <@${draftPayload.user.id}>.`,
  );

  using finalReview = createWebhook();
  const finalTitle = "Approve final?";
  const finalMessageId = await postPrompt(
    opts.threadId,
    finalTitle,
    finalReview.url,
  );
  const finalPayload = await (await finalReview).json();

  if (finalPayload.actionId !== "approve") {
    await finalizePromptCard(
      opts.threadId,
      finalMessageId,
      finalTitle,
      `Rejected by <@${finalPayload.user.id}>.`,
    );
    return;
  }

  await finalizePromptCard(
    opts.threadId,
    finalMessageId,
    finalTitle,
    `Approved by <@${finalPayload.user.id}>.`,
  );

  await publish();
}
```

该工作流依赖两个在每个阶段都会用到的辅助函数。在 `lib/slack.ts` 中添加 `postPrompt` 和 `finalizePromptCard`：

```ts
export async function postPrompt(
  threadId: string,
  title: string,
  webhookUrl: string,
): Promise<string> {
  "use step";

  const thread = bot.thread(threadId);
  const sent = await thread.post(
    <Card title={title}>
      <Actions>
        <Button id="approve" style="primary" callbackUrl={webhookUrl}>
          Approve
        </Button>
        <Button id="deny" style="danger" callbackUrl={webhookUrl}>
          Deny
        </Button>
      </Actions>
    </Card>,
  );

  return sent.id;
}

export async function finalizePromptCard(
  threadId: string,
  messageId: string,
  title: string,
  outcome: string,
) {
  "use step";

  const thread = bot.thread(threadId);
  await thread.adapter.editMessage(
    thread.id,
    messageId,
    <Card title={title}>
      <CardText>{outcome}</CardText>
    </Card>,
  );
}
```

每个 `using` 声明都会将 webhook 作用域限定在自己的代码块中，因此工作流一旦越过该审批阶段就会进行清理。`finalizePromptCard` 会在决策到达后移除按钮，因此每个阶段都会显示其最终状态，而不会在线程中留下过期按钮。工作流本身可以在任何点暂停，你不需要跟踪哪个 webhook 对应哪个审批，因为运行时会处理这些事情。

## 添加超时

让工作流无限期挂起在 webhook 上本身没有问题，直到有人忘了点击按钮。可以让 webhook 与一个持久化 sleep 竞争，从而限制等待时间：

```ts
import { createWebhook, sleep } from "workflow";

export async function approvalWithTimeout(opts: { threadId: string }) {
  "use workflow";

  using webhook = createWebhook();
  const title = "Proceed with the change?";
  const messageId = await postPrompt(opts.threadId, title, webhook.url);

  const result = await Promise.race([
    webhook.then(async (req) => ({
      kind: "clicked" as const,
      body: await req.json(),
    })),
    sleep("24h").then(() => ({ kind: "timeout" as const })),
  ]);

  if (result.kind === "timeout") {
    await finalizePromptCard(
      opts.threadId,
      messageId,
      title,
      "Timed out after 24h — no decision recorded.",
    );
    return;
  }

  await finalizePromptCard(
    opts.threadId,
    messageId,
    title,
    `${result.body.actionId === "approve" ? "Approved" : "Denied"} by <@${result.body.user.id}>.`,
  );

  if (result.body.actionId === "approve") {
    await proceed();
  }
}
```

`sleep` 本身也是一个持久化暂停，因此这个 24 小时等待在 pending 状态下不会产生消耗，并且能够跨部署存活。当超时赢得竞争时，工作流会继续执行，而不会恢复 webhook；随后 `using` 清理会释放该 URL。两个分支都会最终化卡片，因此超时会在线程中可见，而不是悄悄留下一个过期按钮集合。

## 校验审批人

callback URL 只通过自身 token 认证，这意味着任何能截获该 URL 的人都可以恢复工作流。对于敏感操作，在继续执行之前应校验 payload 中的用户：

```ts
const APPROVERS = new Set(["U_ALICE", "U_BOB"]);

const request = await webhook;
const payload = await request.json();

if (!APPROVERS.has(payload.user.id)) {
  await thread.post(
    `<@${payload.user.id}> isn't authorized to approve this deploy.`,
  );
  return;
}
```

如果需要更强的保证，请切换到 `createHook()`，并从你自己的已认证路由中使用 `resumeHook()` 恢复工作流。该模式会让恢复 URL 保持私密，并让你完全控制授权检查，代价是需要编写一个 route handler。

## 故障排查

### 点击后工作流从未恢复

确认按钮的 `callbackUrl` 与 `webhook.url` 完全一致。该 URL 包含一个与本次暂停绑定的 token，因此过期或手动编辑过的 URL 都无法解析。

检查 Workflow SDK CLI，查看工作流是否仍然暂停在 webhook 上：

```bash
npx workflow inspect runs --web
```

如果点击已经到达 URL，但工作流没有推进，请检查工作流日志中是否有错误。`using` 声明会在下一次抛出异常时释放 webhook，因此工作流主体中未捕获的错误可能会在点击到达前释放该 URL。

### 在 Discord 或 Telegram 上发布卡片时出现 ValidationError

Discord 的 `custom_id` 长度限制为 100 个字符；Telegram 的 `callback_data` 限制为 64 字节。编码后的按钮数据是 action ID 加 callback token，这可能会超过这些上限。请缩短 action ID（例如使用 `"a"` 而不是 `"approve-deploy-v1-2-3"`），并将较长上下文移入 `value`，或完全移出卡片。Slack 和 Teams 没有这个限制。

### 同一张审批卡片被点击两次

上面的主流程通过在决策到达后立即调用 `finalizeApprovalCard` 来防止这种情况。卡片会在重新渲染时移除 `Actions` 块，因此不会再有可点击内容。

如果你跳过这一步，Chat SDK 不会替你对点击去重：一旦 `await webhook` 已经 resolved，第二次点击会命中一个不再存在的 webhook，用户会看到平台默认错误。你可以编辑卡片以移除按钮（如上所示，通过 `thread.adapter.editMessage`），也可以接受只有第一次点击有效，并忽略其余点击。

### 某个工作流运行显示为永久暂停

工作流会一直暂停，直到有什么东西恢复它。如果你的 callback URL 丢失了（例如卡片在有人点击前被删除），该运行会一直暂停，直到相关 webhook 被清理。

请使用超时机制（见上文）为每次暂停设置上限，并使用 Workflow SDK CLI 取消不应继续等待的运行：

```bash
npx workflow inspect runs
# 找到 run ID 后执行：
npx workflow runs cancel <run-id>
```

## 相关资源

- Chat SDK Threads、Messages 和 Channels
- Chat SDK Actions
- Workflow SDK `createWebhook`
- Workflow SDK `createHook`
- Workflow SDK Human-in-the-Loop 示例
- 如何使用 Chat SDK 和 AI SDK 构建 Slack AI agent

## FAQ

### Chat SDK 和 Workflow SDK 如何协同工作？

Chat SDK 会将来自 Slack、Teams、Discord、Google Chat、Telegram 以及其他平台的事件标准化为一致的 thread、message 和 action API。Workflow SDK 增加了持久化执行能力：被标记为 `"use workflow"` 的函数可以在 `createWebhook()`、`createHook()` 或 `sleep()` 上暂停，并在之后带着完整状态恢复。

两者结合后，聊天机器人就可以运行多步骤审批流程、跨函数超时保留会话状态、调度发帖，并在部署后继续存活，而无需额外的任务队列。

### 什么时候应该使用 Chat SDK Button 的 `callbackUrl`，而不是 `onAction` 处理器？

当某个工作流需要暂停直到按钮被点击时，使用 `callbackUrl`。将 Workflow SDK 的 `createWebhook().url` 作为按钮的 `callbackUrl` 传入，会让点击事件直接 POST 到已暂停的工作流，使其携带 payload 恢复。

对于不需要恢复长运行流程的无状态点击反应，请使用 `onAction`。两者可以在同一个按钮上共存：点击会同时触发二者。

### 使用 Chat SDK 构建 Slack 审批机器人是否必须使用 Workflow SDK？

不需要。对于一次性审批，只使用 Chat SDK 就足够了：发布一张包含“批准”和“拒绝”按钮的 Card，然后用 `bot.onAction()` 处理点击。

当审批位于一个更长的流程中，并且该流程需要在重启后存活、对失败步骤进行内置可观测的重试、干净地超时，或串联多个决策时，再使用 Workflow SDK。它还消除了自定义审批表的需求，因为暂停中的工作流运行本身就是事实来源。

### 哪些平台支持这种审批模式？

大多数带交互控件的 Chat SDK 适配器都支持。卡片和按钮会在 Slack（Block Kit）、Teams（Adaptive Cards）、Discord（Embeds）和 Google Chat（Cards）上以原生形式渲染。Telegram 使用 inline keyboard；WhatsApp 和 Messenger 会将卡片映射为它们的 reply-button 模板（每张最多 3 个按钮）。

需要注意的平台限制包括：Discord 的 `custom_id` 上限为 100 个字符，Telegram 的 `callback_data` 上限为 64 字节，Messenger 和 WhatsApp 的按钮标题上限为 20 个字符。

### 工作流可以挂起多久来等待审批？

可以无限期挂起。Workflow SDK 会将暂停状态持久化到其 World adapter，因此等待 `createWebhook()` 的工作流可以跨函数超时、部署和重启存活，并且在 pending 期间不会产生消耗。

对于无人处理的审批，请使用 `Promise.race` 让 webhook 与 `sleep("24h")` 竞争，从而让工作流进入超时分支，而不是永远停留在运行列表中。你可以随时用以下命令检查已暂停运行：

```bash
npx workflow inspect runs
```