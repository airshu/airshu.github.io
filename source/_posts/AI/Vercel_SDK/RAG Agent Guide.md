---
title: RAG Agent Guide
tags: Vercel AI SDK
toc: true
---

> https://ai-sdk.dev/cookbook/guides/rag-chatbot

在本指南中，你将学习如何构建一个检索增强生成（Retrieval-Augmented Generation，RAG）Agent。

在开始之前，我们先看看什么是 RAG，以及为什么要使用它。

---

## 什么是 RAG？

RAG 是 Retrieval-Augmented Generation 的缩写，即"检索增强生成"。

简单来说，RAG 指的是：向大语言模型（LLM）提供与用户提示词相关的特定信息，让模型基于这些信息生成回答。

---

## 为什么 RAG 很重要？

虽然 LLM 非常强大，但它能推理的信息受限于训练数据。

当你向 LLM 询问训练数据之外的信息时，这个问题就会很明显，例如：

- 私有数据
- 公司内部知识
- 模型训练截止时间之后发生的公共知识

RAG 通过以下方式解决这个问题：

1. 获取与用户问题相关的信息
2. 将这些信息作为上下文传递给模型
3. 让模型基于上下文生成回答

举个简单例子，假设你问模型：

```text
input

What is my favorite food?

generation

I don't have access to personal information about individuals, including their favorite foods.
```

毫不意外，模型并不知道你的个人偏好。

但如果在提示词中额外提供一些上下文：

```text
input

Respond to the user's prompt using only the provided context.

user prompt: 'What is my favorite food?'

context: user loves chicken nuggets

generation

Your favorite food is chicken nuggets!
```

通过提供与查询相关的信息，你增强了模型的生成能力。

只要模型拥有合适的信息，它就很有可能对用户问题给出准确回答。

那么，它如何检索相关信息呢？

答案依赖于一个概念：Embedding。

你可以为 RAG 应用从任何来源获取上下文，例如 Google 搜索。Embedding 和向量数据库只是实现语义搜索的一种特定检索方式。

---

## Embedding

Embedding 是一种将单词、短语或图片表示为高维空间中向量的方式。

在这个空间中，语义相近的词彼此距离更近，词之间的距离可以用来衡量它们的相似度。

例如，如果你对 `cat` 和 `dog` 这两个词做 embedding，你会期望它们在向量空间中的位置比较接近。

计算两个向量相似度的过程称为"余弦相似度"（cosine similarity）：

- 值为 `1` 表示高度相似
- 值为 `-1` 表示高度相反

如果这听起来有些复杂，不用担心。入门时只需要理解高层概念即可。

如前所述，embedding 是表示单词和短语语义的一种方式。这意味着：输入内容越长，embedding 的质量往往越低。

那么，如果要对比简单短语更长的内容做 embedding，该怎么办？

---

## Chunking

Chunking 指的是将某个源材料拆分成更小片段的过程。

Chunking 有很多不同做法，并且非常值得根据具体用例进行实验，因为最有效的方法会因场景而异。

一种简单且常见的 chunking 方法是：按句子拆分文本内容。本指南中也会使用这种方法。

当源材料被合理切分之后，你可以：

1. 对每个 chunk 做 embedding
2. 将 embedding 和对应 chunk 一起存储到数据库中

Embedding 可以存储在任何支持向量的数据库中。

本教程将使用 Postgres 和 `pgvector` 插件。

---

## 整体流程

把这些内容组合起来，RAG 的过程就是：

1. 对用户查询做 embedding
2. 检索与该查询语义相似度最高的源材料片段，也就是 chunks
3. 将这些片段作为上下文连同原始查询一起传给模型
4. 让模型基于这些上下文回答训练数据之外的问题

回到前面询问"我最喜欢的食物是什么"的例子，提示词准备过程大致就是：检索出相关上下文，并将其传给模型。

通过传入合适的上下文，并明确模型的目标，你就可以充分发挥模型作为推理机器的能力。

现在进入项目部分。

---

# 项目设置

在这个项目中，你将构建一个 Agent，它只会根据知识库中的信息回答问题。

这个 Agent 能够：

- 存储信息
- 检索信息

这个项目有很多有趣的用例，例如：

- 客服支持
- 构建你自己的"第二大脑"

本项目使用的技术栈包括：

- Next.js 14，App Router
- AI SDK
- Vercel AI Gateway
- Drizzle ORM
- 带有 pgvector 的 Postgres
- shadcn-ui 和 TailwindCSS 用于样式

---

## 克隆仓库

为了降低本指南的范围，你会从一个已经完成部分初始化配置的仓库开始。

该仓库已经包含：

- Drizzle ORM，位于 `lib/db`
- 初始 migration
- 用于迁移的脚本 `db:migrate`
- `resources` 表的基础 schema，用于存储源材料
- 一个用于创建 resource 的 Server Action

运行以下命令克隆 starter 仓库：

```bash
git clone https://github.com/vercel/ai-sdk-rag-starter
cd ai-sdk-rag-starter
```

首先安装项目依赖：

```bash
pnpm install
```

---

## 创建数据库

你需要一个 Postgres 数据库来完成本教程。

如果你本地没有安装 Postgres，可以选择：

1. 使用 Vercel 创建一个免费的 Postgres 数据库，推荐方式，下面有说明
2. 按照相关指南在本地安装配置 Postgres

---

## 使用 Vercel 设置 Postgres

要在 Vercel 账户中设置 Postgres 实例：

1. 访问 Vercel.com，并确保已经登录
2. 进入你的团队首页
3. 点击 `Integrations` 选项卡
4. 点击 `Browse Marketplace`
5. 在侧边栏中找到 `Storage` 选项
6. 选择 `Neon`，推荐使用，但其他 PostgreSQL 数据库提供商也应该可以工作
7. 点击 `Install`，然后在右上角再次点击 `Install`
8. 在 "Get Started with Neon" 页面右侧点击 `Create Database`
9. 选择你的区域，例如 Washington, D.C., U.S. East
10. 关闭 Auth
11. 点击 `Continue`
12. 为数据库命名，可以使用默认名称，也可以改成类似 `RagTutorial`
13. 点击右下角的 `Create`
14. 看到 "Database created successfully" 后点击 `Done`
15. 你会被重定向到数据库实例页面
16. 在 `Quick Start` 区域点击 `Show secrets`
17. 复制完整的 `DATABASE_URL` 环境变量

---

## 迁移数据库

有了 Postgres 数据库后，你需要将连接字符串添加为环境变量。

复制 `.env.example` 文件，并重命名为 `.env`：

```bash
cp .env.example .env
```

打开新的 `.env` 文件，你应该会看到一个名为 `DATABASE_URL` 的项目。

将你的数据库连接字符串复制到等号后面。

配置完成后，可以运行第一次数据库迁移：

```bash
pnpm db:migrate
```

这个命令会先向数据库添加 `pgvector` 扩展，然后创建一个新的 `resources` 表。

该表的 schema 定义在：

```text
lib/db/schema/resources.ts
```

这个 schema 有四列：

- `id`
- `content`
- `createdAt`
- `updatedAt`

如果迁移时遇到错误，可以查看文末的故障排查部分。

---

## Vercel AI Gateway Key

本指南需要一个 Vercel AI Gateway API key。它可以让你使用一个 API key 访问来自不同提供商的数百个模型。

如果你还没有 Vercel AI Gateway API key，可以在 Vercel 网站上注册获取。

AI SDK 的 Vercel AI Gateway Provider 是默认的全局 provider，因此你可以在模型配置中直接使用一个简单字符串来访问模型。

如果你更希望直接使用 OpenAI 等特定 provider，可以查看 provider 管理文档。

现在，打开 `.env` 文件并添加 API Gateway key：

```text
AI_GATEWAY_API_KEY=your-api-key
```

将 `your-api-key` 替换为你真实的 Vercel AI Gateway API key。

---

# 构建

我们先列一个简单任务清单：

1. 在数据库中创建一张表，用于存储 embeddings
2. 在创建 resources 时，添加 chunking 和创建 embeddings 的逻辑
3. 创建一个 Agent
4. 为 Agent 提供工具，使其能够查询和创建知识库资源

---

## 创建 Embeddings 表

当前应用只有一张表：`resources`。

其中有一列 `content` 用于存储内容。

记住，每个 resource，也就是源材料，都需要被：

1. 拆分成 chunks
2. 做 embedding
3. 存储起来

接下来创建一张名为 `embeddings` 的表，用来存储这些 chunks。

创建新文件：

```text
lib/db/schema/embeddings.ts
```

并添加以下代码：

```typescript
import { nanoid } from '@/lib/utils';
import { index, pgTable, text, varchar, vector } from 'drizzle-orm/pg-core';
import { resources } from './resources';

export const embeddings = pgTable(
  'embeddings',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    resourceId: varchar('resource_id', { length: 191 }).references(
      () => resources.id,
      { onDelete: 'cascade' },
    ),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
  },
  table => ({
    embeddingIndex: index('embeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  }),
);
```

这张表有四列：

- `id`：唯一标识符
- `resourceId`：关联完整源材料的外键
- `content`：纯文本 chunk
- `embedding`：纯文本 chunk 的向量表示

为了执行相似度搜索，你还需要在该列上添加索引，例如 `HNSW` 或 `IVFFlat`，以提升性能。

运行以下命令将变更推送到数据库：

```bash
pnpm db:push
```

---

## 添加 Embedding 逻辑

现在你有了一张用于存储 embeddings 的表，接下来需要编写创建 embeddings 的逻辑。

运行以下命令创建文件：

```bash
mkdir lib/ai && touch lib/ai/embedding.ts
```

---

## 生成 Chunks

要创建 embedding，你会从一段源材料开始，它的长度未知。

然后：

1. 将它拆成更小的 chunks
2. 对每个 chunk 做 embedding
3. 将 chunk 保存到数据库

先创建一个函数，将源材料拆成小 chunks。

```typescript
const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
};
```

这个函数接收一个输入字符串，并按照句号进行拆分，同时过滤掉空项。

最终会返回一个字符串数组。

在你的项目中，非常值得尝试不同的 chunking 技术，因为最佳技术会因场景而异。

---

## 安装 AI SDK

你将使用 AI SDK 来创建 embeddings。

这需要安装两个额外依赖：

```bash
pnpm add ai @ai-sdk/react
```

这会安装：

- AI SDK
- AI SDK 的 React hooks

AI SDK 被设计为与任意大语言模型交互的统一接口。

这意味着你可以只改一行代码，就切换模型和 provider。

---

## 生成 Embeddings

接下来添加一个生成 embeddings 的函数。

将以下代码复制到：

```text
lib/ai/embedding.ts
```

```typescript
import { embedMany } from 'ai';

const embeddingModel = 'openai/text-embedding-ada-002';

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};
```

在这段代码中：

1. 首先定义用于 embeddings 的模型
   本例使用 OpenAI 的 `text-embedding-ada-002` embedding 模型。
2. 然后创建异步函数 `generateEmbeddings`
   它接收源材料 `value` 作为输入，并返回一个 Promise。
3. 返回值是一个对象数组，每个对象包含：
   - `embedding`
   - `content`
4. 在函数内部：
   - 先对输入生成 chunks
   - 然后将 chunks 传给 AI SDK 的 `embedMany`
   - `embedMany` 会返回这些 chunks 的 embeddings
   - 最后将 embeddings 映射成可直接保存到数据库的格式

---

## 更新 Server Action

打开文件：

```text
lib/actions/resources.ts
```

该文件中有一个函数 `createResource`，顾名思义，用于创建 resource。

原始代码如下：

```typescript
'use server';

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from '@/lib/db/schema/resources';
import { db } from '../db';

export const createResource = async (input: NewResourceParams) => {
  try {
    const { content } = insertResourceSchema.parse(input);

    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();

    return 'Resource successfully created.';
  } catch (e) {
    if (e instanceof Error)
      return e.message.length > 0 ? e.message : 'Error, please try again.';
  }
};
```

这个函数是一个 Server Action，文件顶部的 `"use server"` 指令表明了这一点。

这意味着它可以在 Next.js 应用中的任何位置被调用。

该函数会：

1. 接收一个输入
2. 使用 Zod schema 验证输入是否符合正确结构
3. 在数据库中创建一个新的 resource

这里正是生成并存储新 resource embeddings 的理想位置。

将文件更新为以下代码：

```typescript
'use server';

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from '@/lib/db/schema/resources';
import { db } from '../db';
import { generateEmbeddings } from '../ai/embedding';
import { embeddings as embeddingsTable } from '../db/schema/embeddings';

export const createResource = async (input: NewResourceParams) => {
  try {
    const { content } = insertResourceSchema.parse(input);

    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();

    const embeddings = await generateEmbeddings(content);
    await db.insert(embeddingsTable).values(
      embeddings.map(embedding => ({
        resourceId: resource.id,
        ...embedding,
      })),
    );

    return 'Resource successfully created and embedded.';
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : 'Error, please try again.';
  }
};
```

这里首先调用上一步创建的 `generateEmbeddings` 函数，并传入源材料 `content`。

得到源材料的 embeddings 后，就可以将它们保存到数据库中，同时为每个 embedding 带上对应的 `resourceId`。

---

# 创建首页

很好，接下来构建前端。

AI SDK 的 `useChat` hook 可以让你轻松为 Agent 创建对话式用户界面。

将根页面：

```text
app/page.tsx
```

替换为以下代码：

```typescript
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <div className="font-bold">{m.role}</div>
              {m.parts.map(part => {
                switch (part.type) {
                  case 'text':
                    return <p>{part.text}</p>;
                }
              })}
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
```

`useChat` hook 可以：

- 从 AI provider 流式传输聊天消息
- 管理聊天输入状态
- 在收到新消息时自动更新 UI

本指南中，你将通过 Vercel AI Gateway 使用 OpenAI。

运行以下命令启动 Next.js 开发服务器：

```bash
pnpm run dev
```

访问：

```text
http://localhost:3000
```

你应该会看到一个空页面，底部有一个悬浮输入框。

尝试发送一条消息。

消息会在 UI 中短暂出现，然后消失。

这是因为你还没有设置对应的 API route 来调用模型。

默认情况下，`useChat` 会向 `/api/chat` 端点发送 POST 请求，并将 `messages` 作为请求体。

你也可以在 `useChat` 配置对象中自定义端点。

---

# 创建 API Route

在 Next.js 中，你可以使用 Route Handlers 为指定路由创建自定义请求处理程序。

Route Handlers 定义在 `route.ts` 文件中，并且可以导出 HTTP 方法，例如：

- `GET`
- `POST`
- `PUT`
- `PATCH`

运行以下命令创建文件：

```bash
mkdir -p app/api/chat && touch app/api/chat/route.ts
```

打开文件并添加以下代码：

```typescript
import { convertToModelMessages, streamText, UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'openai/gpt-4o',
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

在这段代码中：

1. 声明并导出一个名为 `POST` 的异步函数
2. 从请求体中获取 `messages`
3. 将它们传给 AI SDK 的 `streamText` 函数
4. 同时指定要使用的模型
5. 最后以 `UIMessageStreamResponse` 格式返回模型响应

回到浏览器，再次尝试发送消息。

你应该能看到模型响应以流式方式直接显示出来。

---

# 优化提示词

现在你已经有了一个可以工作的 Agent，但它还没做什么特别的事情。

接下来添加 system instructions，以优化并限制模型行为。

在这个场景中，我们希望模型只使用它检索到的信息来生成回答。

将 route handler 更新为以下代码：

```typescript
import { convertToModelMessages, streamText, UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'openai/gpt-4o',
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
Only respond to questions using information from tool calls.
if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

回到浏览器，尝试问模型你最喜欢的食物是什么。

由于它没有任何相关信息，模型现在应该会严格按照上面的指令回答：

```text
Sorry, I don't know.
```

以当前形式来看，你的 Agent 基本上还没什么用。

那么，如何让模型具备添加和查询信息的能力呢？

---

# 使用 Tools

Tool 是一个可以被模型调用的函数，用于执行特定任务。

你可以把 tool 理解为：给模型的一个程序，模型可以在认为必要时运行它。

接下来看看如何创建一个 tool，让模型能够：

1. 创建 resource
2. 做 embedding
3. 保存到 Agent 的知识库

---

## 添加 Resource Tool

将 route handler 更新为以下代码：

```typescript
import { createResource } from '@/lib/actions/resources';
import { convertToModelMessages, streamText, tool, UIMessage } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'openai/gpt-4o',
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
Only respond to questions using information from tool calls.
if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages: await convertToModelMessages(messages),
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        inputSchema: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base'),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
```

这里定义了一个名为 `addResource` 的 tool。

它包含三个部分：

- `description`：tool 描述，会影响模型什么时候选择使用该 tool
- `inputSchema`：Zod schema，定义运行 tool 所需的输入
- `execute`：异步函数，会使用 tool call 中提供的参数执行

简单来说，每次生成时，模型都会判断是否应该调用 tool。

如果模型认为需要调用 tool，它会：

1. 提取输入
2. 向 `messages` 数组追加一条类型为 `tool-call` 的新消息
3. AI SDK 会使用 tool-call 消息中的参数执行 `execute` 函数

回到浏览器，告诉模型你最喜欢的食物。

你应该会在 UI 中看到一个空响应。

发生了什么吗？我们检查一下。

在新的终端窗口中运行：

```bash
pnpm db:studio
```

这会启动 Drizzle Studio，你可以在其中查看数据库行。

你应该会在：

- `embeddings`
- `resources`

两张表中看到关于你最喜欢食物的新记录。

接下来修改 UI，让用户能看到 tool 被调用了。

回到根页面：

```text
app/page.tsx
```

添加以下代码：

```typescript
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <div className="font-bold">{m.role}</div>
              {m.parts.map(part => {
                switch (part.type) {
                  case 'text':
                    return <p>{part.text}</p>;
                  case 'tool-addResource':
                  case 'tool-getInformation':
                    return (
                      <p>
                        call{part.state === 'output-available' ? 'ed' : 'ing'}{' '}
                        tool: {part.type}
                        <pre className="my-4 bg-zinc-100 p-2 rounded-sm">
                          {JSON.stringify(part.input, null, 2)}
                        </pre>
                      </p>
                    );
                }
              })}
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
```

通过这个修改，你现在可以在 UI 中根据条件直接渲染被调用的 tool。

保存文件并回到浏览器。

告诉模型你最喜欢的电影。

你应该会看到被调用的 tool，而不是模型常规的文本响应。

不用担心 `tool-getInformation` 这个 case，后面会添加这个 tool。

---

# 使用多步骤调用改善用户体验

如果模型还能总结一下刚才执行的操作，会更好。

但从技术上讲，当模型调用 tool 后，它已经完成了本次生成，因为它"生成"的是一次 tool call。

那么，如何实现这个想要的行为呢？

AI SDK 有一个名为 `stopWhen` 的特性，它允许你设置当模型生成 tool call 时的停止条件。

如果还没有满足这些停止条件，AI SDK 会自动把 tool call 的结果发回给模型。

打开：

```text
api/chat/route.ts
```

向 `streamText` 配置对象中添加以下字段：

```typescript
import { createResource } from '@/lib/actions/resources';
import {
  convertToModelMessages,
  streamText,
  tool,
  UIMessage,
  stepCountIs,
} from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'openai/gpt-4o',
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
Only respond to questions using information from tool calls.
if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        inputSchema: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base'),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
```

回到浏览器，告诉模型你最喜欢的披萨配料。

注：菠萝不是一个选项。

你应该会看到模型后续给出一个确认操作的响应。

---

# 检索 Resource Tool

现在模型可以向知识库中添加并嵌入任意信息。

但它仍然不能查询这些信息。

接下来创建一个新的 tool，让模型可以通过查找知识库中的相关信息来回答问题。

为了找到相似内容，你需要：

1. 对用户查询做 embedding
2. 在数据库中搜索语义相似项
3. 将这些项目作为上下文连同查询一起传给模型

为此，更新 embedding 逻辑文件：

```text
lib/ai/embedding.ts
```

```typescript
import { embed, embedMany } from 'ai';
import { db } from '../db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings } from '../db/schema/embeddings';

const embeddingModel = 'openai/text-embedding-ada-002';

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy(t => desc(t.similarity))
    .limit(4);
  return similarGuides;
};
```

在这段代码中，新增了两个函数：

- `generateEmbedding`
  从输入字符串生成单个 embedding
- `findRelevantContent`
  对用户查询做 embedding，在数据库中搜索相似项，然后返回相关项目

完成后，进入最后一步：创建 tool。

回到 route handler：

```text
api/chat/route.ts
```

添加一个名为 `getInformation` 的新 tool：

```typescript
import { createResource } from '@/lib/actions/resources';
import {
  convertToModelMessages,
  streamText,
  tool,
  UIMessage,
  stepCountIs,
} from 'ai';
import { z } from 'zod';
import { findRelevantContent } from '@/lib/ai/embedding';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'openai/gpt-4o',
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
Only respond to questions using information from tool calls.
if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        inputSchema: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base'),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        inputSchema: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
```

回到浏览器，刷新页面，然后询问你最喜欢的食物。

你应该会看到模型调用 `getInformation` tool，然后使用相关信息组织回答。

---

# 总结

恭喜，你已经成功构建了一个 AI Agent。

它可以动态地：

- 向知识库添加信息
- 从知识库检索信息
- 基于检索到的信息回答问题

在本指南中，你学习了如何：

1. 创建并存储 embeddings
2. 设置 Server Actions 来管理 resources
3. 使用 tools 扩展 Agent 的能力

---

# 故障排查：Migration Error

如果你在迁移时遇到错误，请打开 migration 文件：

```text
lib/db/migrations/0000_yielding_bloodaxe.sql
```

剪切第一行，也就是复制并删除它，然后直接在你的 Postgres 实例上运行这一行 SQL。

之后你应该就可以运行更新后的 migration。

如果你使用的是上面提到的 Vercel 设置方式，可以通过以下方式直接运行命令：

1. 进入 Neon 控制台，在那里输入命令
2. 或者回到 Vercel 平台：

   - 进入数据库的 `Quick Start` 区域
   - 找到 PSQL 连接命令，位于第二个标签页
   - 这会在终端中连接到你的实例
   - 然后你可以直接运行该命令
