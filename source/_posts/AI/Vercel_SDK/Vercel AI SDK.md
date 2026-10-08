---
title: Vercel AI SDK
tags: Vercel AI SDK
toc: true
---



[https://ai-sdk.dev](https://ai-sdk.dev/)



https://github.com/vercel/ai











https://ai-sdk.dev/docs/getting-started/nodejs

## Vercel AI SDK - Node.js 快速入门教程



> 本教程将帮助你构建一个能在终端交互的 AI Agent。你会学到核心概念：流式输出、工具调用、多步推理。

---

### 环境准备

前置要求

- Node.js 18+
- pnpm 包管理器（或 npm/yarn/bun）
- Vercel AI Gateway API Key

创建项目

```Shell
mkdir my-ai-app
cd my-ai-app
pnpm init
```



安装依赖

```Shell
pnpm add ai zod dotenv
pnpm add -D @types/node tsx typescript

```

ai - 核心 SDK 包  
zod - 定义类型安全的 schema  
dotenv - 读取环境变量  
tsx - 运行 TypeScript 文件  
typescript - 开发依赖



配置 API Key

在项目根目录创建 .env 文件：

AI_GATEWAY_API_KEY=你的密钥

> 在 Vercel AI Gateway (https://vercel.com/ai-gateway) 获取 API Key

---

### 基础聊天应用

创建 index.ts：

```JavaScript
import { ModelMessage, streamText } from 'ai';
import 'dotenv/config';
import * as readline from 'node:readline/promises';
const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const messages: ModelMessage[] = [];
async function main() {
  while (true) {
    const userInput = await terminal.question('You: ');
    messages.push({ role: 'user', content: userInput });
    const result = streamText({
      model: "anthropic/claude-sonnet-4.5",
      messages,
    });
    let fullResponse = '';
    process.stdout.write('\nAssistant: ');
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write('\n\n');
    messages.push({ role: 'assistant', content: fullResponse });
  }
}
main().catch(console.error);
```



代码解析

部分        说明

streamText        核心函数，发起流式文本生成

messages        存储对话历史，让 AI 理解上下文

result.textStream        可迭代的文本流，逐块获取输出

ModelMessage[]        消息数组，格式 { role: 'user'/'assistant', content: string }

运行

pnpm tsx index.ts

---

### 切换模型提供商

默认使用 Vercel AI Gateway，一行切换模型：

// Anthropic

model: "anthropic/claude-sonnet-4.5"

// OpenAI

model: "openai/gpt-5.1"

// Google

model: "google/gemini-2.0-flash"

或显式导入：

import { openai } from '@ai-sdk/openai';

model: openai('gpt-5.1');

---

### 添加工具调用

工具让 AI 能执行外部操作（如查天气、数据库查询）。

修改 index.ts：

```JavaScript
import { ModelMessage, streamText, tool } from 'ai';
import 'dotenv/config';
import { z } from 'zod';
const messages: ModelMessage[] = [];
const result = streamText({
  model: "anthropic/claude-sonnet-4.5",
  messages,
  tools: {
    weather: tool({
      description: 'Get the weather in a location (fahrenheit)',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => {
        const temperature = Math.round(Math.random() * (90 - 32) + 32);
        return { location, temperature };
      },
    }),
  },
});
```



工具结构

字段        说明

description        帮助 AI 判断何时使用该工具

inputSchema        Zod 定义输入参数

execute        实际执行的异步函数

工作原理

当用户问 "纽约天气怎么样？"

1. AI 识别需要调用 weather 工具
2. 自动提取 location 参数（纽约）
3. 执行 execute 函数获取结果
4. 将结果合并到回答中

---

### 多步工具调用

默认情况下，工具执行完就停止。要让 AI 用工具结果继续回答，配置 stopWhen：

```JavaScript
import { stepCountIs } from 'ai';
const result = streamText({
  model: "anthropic/claude-sonnet-4.5",
  messages,
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => {
        const temperature = Math.round(Math.random() * (90 - 32) + 32);
        return { location, temperature };
      },
    }),
  },
  stopWhen: stepCountIs(5),  // 最多允许 5 步
  onStepFinish: async ({ toolResults }) => {
    if (toolResults.length) {
      console.log(JSON.stringify(toolResults, null, 2));
    }
  },
});
```

参数说明

参数        说明

stopWhen: stepCountIs(5)        最多执行 5 步然后停止

onStepFinish        每步完成后执行的回调

---

### 添加第二个工具（温度转换）

```YAML
tools: {
  weather: tool({ ... }),
  convertFahrenheitToCelsius: tool({
    description: 'Convert fahrenheit to celsius',
    inputSchema: z.object({
      temperature: z.number().describe('The temperature in fahrenheit'),
    }),
    execute: async ({ temperature }) => {
      const celsius = Math.round((temperature - 32) * (5 / 9));
      return { celsius };
    },
  }),
}
```

完整交互流程

问："纽约天气多少摄氏度？"

1. Agent 调用 weather 工具 → 获取华氏温度
2. 自动调用 convertFahrenheitToCelsius 转换
3. 生成自然语言回答："纽约现在大约 25°C..."

---

### 总结

通过本教程，你学到了：

- ✅ 流式文本生成 (streamText)
- ✅ 对话历史管理 (messages)
- ✅ 工具定义 (tool)
- ✅ 多步推理 (stopWhen)
- ✅ 切换模型提供商

下一步

- Next.js 快速入门 (https://sdk.vercel.ai/docs/getting-started/nextjs-app-router) - 构建 Web UI
- RAG Chatbot 指南 (https://sdk.vercel.ai/docs/cookbook/guides/rag-chatbot) - 知识库问答
- 多模态 Chatbot (https://sdk.vercel.ai/docs/cookbook/guides/multi-modal-chatbot) - 支持图片





## Prompts

https://ai-sdk.dev/docs/foundations/prompts

| 类型                 | 用途 | API 属性 |
|-|-|-|
| Text Prompt | 简单生成场景，字符串模板 | prompt |
| System Prompt | 设置模型行为约束 | system |
| Message Prompt  | 聊天/多模态对话         | messages 数组 |



## Toos

Tools 是 AI 可以调用的外部动作，让它完成不确定知识、实时数据、执行代码等任务。

一个工具包含三个属性：

- 描述：工具的可选描述，可以影响何时选择该工具。 
- inputSchema：一个 Zod 模式或 JSON 模式，用于定义工具运行所需的输入。LLM 会使用此模式，并且该模式还用于验证 LLM 工具调用。 
- execute：一个可选的异步函数，使用来自工具调用的参数来调用。

https://ai-sdk.dev/docs/foundations/tools

| 类型 | 执行方 | 你需要做的 | 特点 |
|-|-|-|-|
| Custom Tools | 你的代码 | 定义 schema + 实现 execute | 完全控制、自定义功能 |
| Provider-Defined | 你的代码 | 只实现 execute | provider 优化过的工具（如 Anthropic bash） |
| Provider-Executed | Provider 服务器 | 只配置 | 搜索、代码执行等现成功能 |

```JavaScript
import { tool } from 'ai';
import { z } from 'zod';
const weatherTool = tool({
  description: '获取某地天气',
  inputSchema: z.object({
    location: z.string().describe('地点'),
  }),
  execute: async ({ location }) => {
    return { temperature: 25, conditions: '晴' };
  },
});
// 使用 Tool
const result = await generateText({
  model: openai('gpt-4o'),
  tools: { weather: weatherTool },
  prompt: '北京今天天气怎么样？'
});
```





## Provider Options

https://ai-sdk.dev/docs/foundations/provider-options

LLM的额外参数配置

### OpenAI 选项

| 选项 | 值 | 说明 |
|-|-|-|
| reasoningEffort | none \| minimal \| low \| medium \| high \| xhigh | 推理深度 |
| reasoningSummary | auto \| detailed | 推理过程摘要 |
| textVerbosity | low \| medium \| high | 响应详细程度 |



Anthropic 选项

| 选项 | 值 | 说明 |
|-|-|-|
| thinking | { type: 'enabled', budgetTokens: number } | 扩展推理 (特定模型) |
| effort | low \| medium \| high | 推理努力程度 |
| speed | fast \| standard | 输出速度 (claude-opus-4-6) |





## Agents

https://ai-sdk.dev/docs/agents/overview

Agent = LLM + Tools + Loop

| 组件 | 作用 |
|-|-|
| LLM | 处理输入，决定下一步做什么 |
| Tools | 扩展能力（读文件、调用 API、写数据库等） |
| Loop | Orchestration：上下文管理 + 停止条件 |

```JavaScript
import { ToolLoopAgent, tool } from 'ai';
import { z } from 'zod';
const weatherAgent = new ToolLoopAgent({
  model: anthropic('claude-sonnet-4-5'),
  tools: {
    weather: tool({
      description: 'Get weather',
      inputSchema: z.object({ location: z.string() }),
      execute: async ({ location }) => ({ temp: 25 }),
    }),
  },
});
const result = await weatherAgent.generate({
  prompt: '北京天气怎么样？',
});
```



### Building Agents

配置选项

| 选项 | 说明 |
|-|-|
| model | 使用的模型 |
| instructions | 系统指令 (角色 / 行为) |
| tools | Agent 可用的工具 |
| stopWhen | 停止条件  <br/>stopWhen: stepCountIs(20)  // 默认 20 步  <br/>stopWhen: [stepCountIs(20), yourCondition()]  // 组合条件 |
| toolChoice | 强制 / 禁用工具  <br/>toolChoice: 'required'  // 强制调用工具  <br/>toolChoice: 'none'     // 禁用工具  <br/>toolChoice: 'auto'     // 模型决定 (默认)  <br/>toolChoice: { type: 'tool', toolName: 'weather' }  // 强制用特定工具 |
| output | 结构化输出 schema |



### Workflow Patterns

| 模式 | 说明 | 适用场景 |
|-|-|-|
| Sequential Processing | 步骤按顺序执行 | 内容生成、数据转换 |
| Routing | 模型决定走哪个分支 | 复杂输入分类处理 |
| Parallel Processing | 并行执行独立任务 | 多文档分析、代码审查 |
| Orchestrator-Worker | 一个模型协调多个专家 | 复杂功能实现 |
| Evaluator-Optimizer | 评估 - 优化循环 | 质量控制、翻译 |



### Loop Control

循环在以下情况停止：

- 模型返回文本（非工具调用）
- 调用的工具没有 execute 函数
- 工具调用需要批准
- 满足停止条件



停止条件 (stopWhen)

| 条件 | 说明 |
|-|-|
| stepCountIs(n) | 执行 n 步后停止 |
| hasToolCall('toolName') | 调用特定工具后停止 |
| isLoopFinished() | 无限循环，无步数限制 |
| 数组（如 [条件 1, 条件 2]） | 任一条件满足即停止 |



### Configuring Call Options

为什么需要 Call Options

运行时动态修改 Agent 配置，而不用创建多个 Agent：

- 注入用户上下文、偏好
- 根据请求复杂度选模型
- 按用户权限配置工具
- 动态设置 provider 参数

三步使用

1. 定义 schema - callOptionsSchema
2. 配置 prepareCall - 用选项修改设置
3. 运行时传入 - options 参数

```JavaScript
const agent = new ToolLoopAgent({
  model: "anthropic/claude-sonnet-4-5",
  callOptionsSchema: z.object({
    userId: z.string(),
    accountType: z.enum(['free', 'pro', 'enterprise']),
  }),
  instructions: '你是客服助手',
  prepareCall: ({ options, ...settings }) => ({
    ...settings,
    instructions: settings.instructions + 
      `\n用户类型: ${options.accountType}`,
  }),
});
// 调用时传入
await agent.generate({
  prompt: '如何升级？',
  options: { userId: '123', accountType: 'free' },
});

// 动态配置
// 换模型:
prepareCall: ({ options }) => ({
  model: options.complexity === 'simple' 
    ? 'gpt-4o-mini' 
    : 'o1-mini',
})
//配置工具:
prepareCall: ({ options }) => ({
  tools: {
    web_search: openai.tools.webSearch({
      userLocation: { city: options.userCity },
    }),
  },
})
//RAG:
prepareCall: async ({ options }) => {
  const docs = await vectorSearch(options.query);
  return {
    instructions: `用以下上下文回答:\n${docs.join('\n')}`,
  };
}
```





### Memory

三种方案对比

| 方案 | 工作量 | 灵活性 | 锁定情况 |
|-|-|-|-|
| Provider-Defined | 低 | 中 | 是 |
| Memory Providers | 低 | 低 | 取决于提供商 |
| Custom Tool | 高 | 高 | 无 |

1. Provider-Defined Tools

```JavaScript
//Anthropic 的 Memory Tool（仅 Claude 可用）：
const memory = anthropic.tools.memory_20250818({
  execute: async action => {
    // action: { command, path, ... }
    // 实现：view/create/str_replace/insert/delete/rename
    return '执行结果';
  },
});
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-haiku-4.5',
  tools: { memory },
});
```



1. Memory Providers

```JavaScript
//Letta（内置记忆管理）：
import { lettaCloud } from '@letta-ai/vercel-ai-sdk-provider';
const agent = new ToolLoopAgent({
  model: lettaCloud(),
  providerOptions: { letta: { agent: { id: 'your-agent-id' } } },
});
//Mem0（跨 Provider 使用）：
import { createMem0 } from '@mem0/vercel-ai-provider';
const mem0 = createMem0({
  provider: 'openai',
  mem0ApiKey: process.env.MEM0_API_KEY,
});
const agent = new ToolLoopAgent({
  model: mem0('gpt-4.1', { user_id: 'user-123' }),
});
//Supermemory（语义搜索）：
import { supermemoryTools } from '@supermemory/tools/ai-sdk';
const agent = new ToolLoopAgent({
  model: "anthropic/claude-sonnet-4.5",
  tools: supermemoryTools(process.env.SUPERMEMORY_API_KEY!),
});
//Hindsight（自托管/云服务）：
import { HindsightClient } from '@vectorize-io/hindsight-client';
import { createHindsightTools } from '@vectorize-io/hindsight-ai-sdk';
const client = new HindsightClient({ baseUrl: process.env.HINDSIGHT_API_URL });
const agent = new ToolLoopAgent({
  model: "anthropic/claude-sonnet-4.5",
  tools: createHindsightTools({ client, bankId: 'user-123' }),
});
```



1. Custom Tool

https://ai-sdk.dev/cookbook/guides/custom-memory-tool



### Subagents

父代理通过工具调用的子代理，独立执行后返回结果：

父代理 → researchTool → 子代理(独立上下文) → 返回结果

何时使用

| 使用场景 | 说明 |
|-|-|
| 避免任务需要大量 token（读文件、搜索代码库） | 通过子代理独立处理高 token 消耗任务，减轻父代理上下文负担 |
| 任务简单专注需要并行独立研究 | 子代理可并行执行独立任务，提升整体效率 |
| 顺序处理会导致上下文超出模型限制 | 子代理拥有独立上下文，避免父代理上下文累积超限 |
| 上下文可控想按能力隔离工具访问 | 子代理可按能力分配工具，实现工具访问权限隔离 |
| 所有工具可安全共存 | 子代理独立运行环境，工具间无冲突风险 |





```JavaScript
// 1. 定义子代理
const researchSubagent = new ToolLoopAgent({
  model: "anthropic/claude-sonnet-4.5",
  instructions: '你是研究代理，总结发现。',
  tools: { read: readFileTool, search: searchTool },
});
// 2. 创建工具让主代理调用
const researchTool = tool({
  description: '深度研究主题',
  inputSchema: z.object({ task: z.string() }),
  execute: async ({ task }, { abortSignal }) => {
    const result = await researchSubagent.generate({ prompt: task, abortSignal });
    return result.text;
  },
});
// 3. 主代理使用子代理工具
const mainAgent = new ToolLoopAgent({
  model: "anthropic/claude-sonnet-4.5",
  tools: { research: researchTool },
});


//流式子代理进度
//用 async function* + yield 发送增量更新：
const researchTool = tool({
  execute: async function* ({ task }, { abortSignal }) {
    const result = await researchSubagent.stream({ prompt: task, abortSignal });
    
    // 每个迭代产生完整的 UIMessage
    for await (const message of readUIMessageStream({ 
      stream: result.toUIMessageStream() 
    })) {
      yield message;
    }
  },
  toModelOutput: ({ output: message }) => {
    // 模型只看到最终总结文本，不看到完整过程
    const lastText = message?.parts.findLast(p => p.type === 'text');
    return { type: 'text', value: lastText?.text ?? '完成' };
  },
});
```



关键点

| 概念 | 说明 |
|-|-|
| 上下文隔离 | 子代理每次调用都是新上下文 |
| toModelOutput | 控制主模型看到什么（通常只返回总结） |
| abortSignal | 传递到子代理支持取消 |
| no tool approvals | 子代理工具不能需要用户确认 |







## AI SDK Core

提供统一 API  用于调用语言模型／生成文本、结构化对象／数组、工具调用、流式响应等。通过统一接口屏蔽不同模型 Provider 的差异。SDK  本身不绑死任何模型，而是通过 Provider 机制适配众多模型提供商 (LLM)。如官方支持  DeepSeek、OpenAI、Anthropic、Google、xAI Grok 等，还支持自定义 Provider



### Generating Text

| 函数 | 用法 | 适合场景 |
|-|-|-|
| generateText | 一次性生成完整文本 | 写邮件、摘要、不需要实时显示的场景 |
| streamText | 逐字流式输出 | 聊天机器人、实时显示、用户要看到 "打字效果" 的场景 |

#### generateText - 一次性生成

```JavaScript
import { generateText } from 'ai';
// 最简单用法
const { text } = await generateText({
  model: "anthropic/claude-sonnet-4-5",
  prompt: '写一个素食千层面食谱，4人份。',
});
console.log(text);  // 完整的食谱文本


//generateText 的回调：
const result = await generateText({
  model: "anthropic/claude-sonnet-4-5",
  prompt: '...',
  
  // 生成完成后调用（保存历史、记录用量）
  onFinish({ text, usage, finishReason }) {
    console.log('生成完了！用了', usage.totalTokens, '个 token');
  },
  
  // 实验性功能：生成开始时
  experimental_onStart() {
    console.log('开始生成...');
  },
  
  // 实验性功能：每一步开始/结束
  experimental_onStepStart({ stepNumber }) {
    console.log(`第 ${stepNumber} 步开始`);
  },
  
  // 实验性功能：工具调用开始/结束
  experimental_onToolCallStart({ toolName }) {
    console.log(`工具 ${toolName} 开始执行`);
  },
});
```

返回的东西（都在 result 里）：

- text - 生成的文字
- reasoning / reasoningText - 模型的"内心独白"（有些模型支持）
- usage - 用了多少 token（计费依据）
- finishReason - 为什么停了（用完、调用工具、出错等）
- toolCalls / toolResults - 如果模型调用了工具
- steps - 每一步的详情（多步骤生成时有用）
- warnings - 警告（比如某个设置不支持）
- response - 原始响应（想看底层数据就查这个）



#### streamText - 流式输出

```JavaScript
import { streamText } from 'ai';
const result = streamText({
  model: "anthropic/claude-sonnet-4-5",
  prompt: '发明一个新节日，描述它的传统。',
});
// 一边生成一边输出（像打字机效果）
for await (const chunk of result.textStream) {
  process.stdout.write(chunk);  // 逐个字符输出
}

const result = streamText({
  model: "anthropic/claude-sonnet-4-5",
  prompt: '...',
  
  // 出错时（不会崩溃服务器）
  onError({ error }) {
    console.error('出错了：', error);
  },
  
  // 每个数据块（可以拦截处理）
  onChunk({ chunk }) {
    if (chunk.type === 'text') {
      console.log('收到文字：', chunk.text);
    }
  },
  
  // 流结束后
  onFinish({ text, usage }) {
    console.log('流式输出完成！');
  },
});
```

为什么要用流式？

- 模型可能要 1 分钟才能生成完，用户不想干等
- 聊天界面要实时显示"正在输入..."
- 用户随时可以取消

返回的东西（都在 result 里）：

- textStream - 文本流（可以逐个字符读取）
- text - 完整文本（等流结束后才有）
- fullStream - 完整流（包含文本、工具调用、推理等所有事件）



#### 流转换

在输出前偷偷改内容（平滑、过滤、转大写等）

```JavaScript
//smoothStream - 让输出更平滑（避免大段文字突然蹦出来）
import { smoothStream, streamText } from 'ai';
const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream(),  // 自动平滑输出
});
//自定义转换 - 全部转大写（演示用）
const result = streamText({
  model,
  prompt,
  experimental_transform: () => new TransformStream({
    transform(chunk, controller) {
      if (chunk.type === 'text-delta') {
        // 把所有文字转成大写
        controller.enqueue({
          ...chunk,
          text: chunk.text.toUpperCase()
        });
      } else {
        controller.enqueue(chunk);
      }
    }
  })
});
```



### Generating Structured Data

模型生成的是纯文本，但你的程序往往需要结构化数据（JSON 对象、数组等）。比如：

- 从文章提取关键信息
- 给内容分类
- 生成模拟数据

AI SDK 用 output 参数搞定这事，支持 Zod、Valibot、JSON Schema。



四种输出类型

| 类型 | 用法 | 适合场景 |
|-|-|-|
| Output.text() | 纯文本 | 不需要结构，就跟普通生成一样 |
| Output.object() | 单个对象 | 提取信息、生成一条记录 |
| Output.array() | 数组 | 批量生成、列表数据 |
| Output.choice() | 固定选项 | 分类、选择题 |
| Output.json() | 任意 JSON | 灵活结构，不验证格式 |

#### Output.text() - 纯文本

```JavaScript
import { generateText, Output } from 'ai';
const { output } = await generateText({
  model: "anthropic/claude-sonnet-4-5",
  output: Output.text(),  // 不强制结构
  prompt: '讲个笑话。',
});
// output 就是一个字符串
```



Output.object() - 单个对象（最常用）

```SQL
import { generateText, Output } from 'ai';
import { z } from 'zod';
const { output } = await generateText({
  model: "anthropic/claude-sonnet-4-5",
  output: Output.object({
    schema: z.object({
      name: z.string().describe('菜名'),
      ingredients: z.array(
        z.object({
          name: z.string(),
          amount: z.string().describe('用量（克或毫升）'),
        })
      ).describe('配料列表'),
      steps: z.array(z.string()).describe('步骤说明'),
    }),
  }),
  prompt: '生成一个千层面食谱。',
});
// output 自动符合 schema，类型安全！
console.log(output.name);        // "千层面"
console.log(output.ingredients);  // [{ name: '面皮', amount: '250g' }, ...]
```

关键点：

- schema 定义结构（用 Zod）
- .describe() 给模型提示，提高准确性
- 自动验证，不符合会报错





#### Output.array() - 数组

```YAML
const { output } = await generateText({
  model: "anthropic/claude-sonnet-4-5",
  output: Output.array({
    element: z.object({
      location: z.string(),
      temperature: z.number(),
      condition: z.string(),
    }),
  }),
  prompt: '列出旧金山和巴黎的天气。',
});
// output 是数组
// [
//   { location: '旧金山', temperature: 70, condition: '晴' },
//   { location: '巴黎', temperature: 65, condition: '多云' },
// ]
```



#### 流式接收（逐个元素）

```JavaScript
const { elementStream } = streamText({
  model,
  output: Output.array({ element: schema }),
  prompt: '生成3个游戏角色。',
});
for await (const hero of elementStream) {
  console.log(hero);  // 每个角色完成后就收到
}
```





#### Output.choice() - 固定选项

```Python
const { output } = await generateText({
  model: "anthropic/claude-sonnet-4-5",
  output: Output.choice({
    options: ['晴天', '雨天', '雪天'],
  }),
  prompt: '今天天气是晴天、雨天还是雪天？',
});
// output 一定是三个选项之一：'晴天' | '雨天' | '雪天'
```



#### Output.json() - 任意 JSON

```Python
const { output } = await generateText({
  model: "anthropic/claude-sonnet-4-5",
  output: Output.json(),
  prompt: '返回每个城市的温度和天气，JSON 格式。',
});
// output 可以是任何合法 JSON
// {
//   "旧金山": { "temperature": 70, "condition": "晴" },
//   "巴黎": { "temperature": 65, "condition": "多云" }
// }
```





### Tool Calling

#### 如何定义工具

```JavaScript
import { tool } from 'ai';
import { z } from 'zod';
const weatherTool = tool({
  description: '获取某地天气',          // 告诉模型这个是干嘛的
  inputSchema: z.object({             // 定义输入参数
    location: z.string().describe('地点'),
  }),
  execute: async ({ location }) => {   // 实际执行的函数
    return { temperature: 25, condition: '晴' };
  },
});
```

关键点：

- description：模型靠它决定要不要调用这个工具
- inputSchema：定义参数格式，自动验证
- execute：工具实际干的事（可以是异步的）



#### 严格模式（Strict Mode）

```JavaScript
//让模型生成的工具调用必须符合 schema，减少错误：
const myTool = tool({
  description: '...',
  inputSchema: z.object({ ... }),
  strict: true,    // 开启严格模式
  execute: async (args) => { ... },
});
//注意：不是所有模型/provider 都支持。
```



#### 给模型举例子（Input Examples）

```TypeScript
//当 schema 不够清楚时，可以给模型看例子：
const weatherTool = tool({
  description: '获取天气',
  inputSchema: z.object({ location: z.string() }),
  inputExamples: [              // 给模型看正确例子
    { input: { location: '旧金山' } },
    { input: { location: '伦敦' } },
  ],
  execute: async (args) => { ... },
});
//目前只有 Anthropic provider 原生支持。
```



#### 工具执行审批（Tool Execution Approval）

```TypeScript
const dangerousTool = tool({
  description: '删除文件',
  inputSchema: z.object({ filename: z.string() }),
  needsApproval: true,    // 需要审批
  execute: async ({ filename }) => {
    return fs.unlinkSync(filename);
  },
});
```



工作流程：

1. 模型生成工具调用
2. generateText 返回，结果里包含 tool-approval-request 部分
3. 你的应用请求用户批准
4. 把批准/拒绝结果（tool-approval-response）加回 messages
5. 再次调用 generateText：批准则执行工具，拒绝则模型收到通知



#### 动态审批（根据参数决定）

```TypeScript
const paymentTool = tool({
  description: '付款',
  inputSchema: z.object({ amount: z.number() }),
  needsApproval: async ({ amount }) => amount > 1000,  // 超过1000才要审批
  execute: async ({ amount }) => { ... },
});
```



#### 多步调用（Multi-Step Calls）

```TypeScript
//模型可以连续调用多个工具，直到完成任务：
const { text, steps } = await generateText({
  model: "anthropic/claude-sonnet-4-5",
  tools: { weather: weatherTool },
  stopWhen: stepCountIs(5),    // 最多5步
  prompt: '旧金山天气怎么样？',
});
//默认：最多20步（防止无限循环）。
```

内置停止条件：

- stepCountIs(n)：n 步后停
- hasToolCall('toolName')：调用特定工具后停
- isLoopFinished()：无限循环，直到模型自然结束



#### 步骤信息（Steps）

```JavaScript
//想知道每一步发生了什么？用 steps 或 onStepFinish：
const { steps } = await generateText({ ... });
// 提取所有工具调用
const allToolCalls = steps.flatMap(step => step.toolCalls);
// 或者用回调
const result = await generateText({
  ...,
  onStepFinish({ stepNumber, text, toolCalls, usage }) {
    console.log(`第 ${stepNumber} 步完成`);
  },
});
```



#### 动态工具（Dynamic Tools）

```TypeScript
//当工具的 schema 运行时才知道（比如从 MCP 服务器加载），用 dynamicTool：
import { dynamicTool } from 'ai';
const myTool = dynamicTool({
  description: '执行自定义函数',
  inputSchema: z.object({}),    // 运行时才知道具体结构
  execute: async (input) => {
    // input 类型是 unknown，需要自己验证
    const { action } = input as any;
    return { result: `执行了 ${action}` };
  },
});
```



#### 类型安全处理

```C++
for (const toolCall of toolCalls) {
  if (toolCall.dynamic) {
    // 动态工具：input 是 unknown
    console.log(toolCall.input);
  } else {
    // 静态工具：有完整类型推断
    switch (toolCall.toolName) {
      case 'weather': console.log(toolCall.input.location); break;
    }
  }
}
```



#### 工具选择（Tool Choice）

```Java
强制模型怎么用工具：
// 强制调用某个工具
const result = await generateText({
  tools: { weather, search },
  toolChoice: { type: 'tool', toolName: 'weather' },
  prompt: '...',
});
// 强制必须调用工具（不能只生成文本）
//toolChoice: 'required'
// 禁止调用工具（只要文本）
//toolChoice: 'none'
// 默认：模型自己决定
//toolChoice: 'auto'
```



#### 工具执行选项

```JavaScript
//工具执行时能拿到额外信息：
const myTool = tool({
  description: '...',
  inputSchema: ...,
  execute: async (args, { 
    toolCallId,    // 这次工具调用的ID
    messages,       // 发给模型的消息历史
    abortSignal,   // 取消信号（用户取消请求时）
    experimental_context,  // 自定义上下文
  }) => {
    // 比如把 abortSignal 传给 fetch
    return fetch(url, { signal: abortSignal });
  },
});
```



#### 流式工具结果（Preliminary Tool Results）

```JavaScript
//想让 UI 实时显示工具执行进度？用 async function* + yield：
const myTool = tool({
  description: '...',
  inputSchema: ...,
  execute: async function* ({ task }, { abortSignal }) {
    yield { status: '开始搜索...' };
    
    const result = await search(task);
    
    yield { status: '搜索完成，正在总结...' };
    
    return { summary: result.summary };  // 最终结果
  },
});

//配合 readUIMessageStream 可以在 UI 实时显示这些增量更新
```



#### 错误处理

| 错误类型 | 原因说明 |
|-|-|
| NoSuchToolError | 模型调用了不存在的工具 |
| InvalidToolInputError | 模型传的参数不符合 schema |
| ToolCallRepairError | 工具调用修复失败 |



```JavaScript
try {
  await generateText({ tools: ..., prompt: '...' });
} catch (error) {
  if (NoSuchToolError.isInstance(error)) {
    console.log('模型调用了不存在的工具');
  } else if (InvalidToolInputError.isInstance(error)) {
    console.log('参数无效：', error.input);
  }
}
//工具执行出错：不会抛异常，而是作为 tool-error 部分出现在结果里。
```



#### 工具调用修复（Tool Call Repair，实验性）

```JavaScript
//模型有时会生成无效的工具调用（比如参数格式错）。AI SDK 可以尝试自动修复：
const result = await generateText({
  tools: ...,
  experimental_repairToolCall: async ({ toolCall, tools, error }) => {
    // 用更强的模型重新生成正确的参数
    const { output } = await generateText({
      model: '更强的模型',
      output: Output.object({ schema: tool.inputSchema }),
      prompt: `修复这个工具调用：${JSON.stringify(toolCall)}`,
    });
    return { ...toolCall, input: output };
  },
});
```



#### 活跃工具（Active Tools）

当工具太多，模型处理不过来时，可以限制当前可用的工具

```TypeScript

const result = await generateText({
  model: ...,
  tools: myToolSet,          // 定义了20个工具
  activeTools: ['weather', 'search'],  // 但这次只用这两个
});
```



#### 多模态工具结果

有些工具会返回图片、文件等多模态内容，需要转换成模型能理解的格式

```JavaScript
const computerTool = anthropic.tools.computer_20241022({
  execute: async ({ action }) => {
    if (action === 'screenshot') {
      return {
        type: 'image',
        data: screenshot.toString('base64'),  // 转成 base64
      };
    }
  },
  toModelOutput: ({ output }) => {
    // 把工具结果转成模型能理解的内容部分
    return {
      type: 'content',
      value: [{ type: 'image', data: output.data, mediaType: 'image/png' }],
    };
  },
});
```





### [Model Context Protocol (MCP)](https://ai-sdk.dev/docs/ai-sdk-core/mcp-tools#model-context-protocol-mcp)







### [Settings](https://ai-sdk.dev/docs/ai-sdk-core/settings#settings)



### [Embeddings](https://ai-sdk.dev/docs/ai-sdk-core/embeddings#embeddings)

Embeddings 是把词语、短语、文本或图像表示为高维向量的方法。在这个向量空间里，语义相近的内容距离更近，因此可以用向量距离衡量相似度。





#### 单个值嵌入



AI SDK 提供 embed 函数，用来把单个值转换成 embedding。适合做相似短语查找、文本聚类等任务。

```JavaScript
  import { embed } from 'ai';

  const { embedding } = await embed({
    model: 'openai/text-embedding-3-small',
    value: 'sunny day at the beach',
  });
```

  返回的 embedding 是一个 number[] 向量。



#### 批量嵌入



当准备 RAG 数据库、向量库或检索索引时，通常需要一次性处理多段文本。AI SDK 提供 embedMany。

```JavaScript
  import { embedMany } from 'ai';

  const { embeddings } = await embedMany({
    model: 'openai/text-embedding-3-small',
    values: [
      'sunny day at the beach',
      'rainy afternoon in the city',
      'snowy night in the mountains',
    ],
  });
```



返回的 embeddings 是 number[][]，顺序与输入 values 一致。



#### 相似度计算



生成 embedding 后，可以用 cosineSimilarity 计算两个向量的余弦相似度。常用于相似文本搜索、排序、过滤相关内容。

```JavaScript
  import { cosineSimilarity, embedMany } from 'ai';

  const { embeddings } = await embedMany({
    model: 'openai/text-embedding-3-small',
    values: ['sunny day at the beach', 'rainy afternoon in the city'],
  });

  const score = cosineSimilarity(embeddings[0], embeddings[1]);
```



#### Token 使用量



很多供应商按 token 计费。embed 和 embedMany 的返回结果都包含 usage，可用于查看消耗。

```TypeScript
  const { embedding, usage } = await embed({
    model: 'openai/text-embedding-3-small',
    value: 'sunny day at the beach',
  });
```





#### 配置项



可以通过 providerOptions 设置供应商特定参数。例如 OpenAI 支持指定 embedding 维度：

```TypeScript
  const { embedding } = await embed({
    model: 'openai/text-embedding-3-small',
    value: 'sunny day at the beach',
    providerOptions: {
      openai: {
        dimensions: 512,
      },
    },
  });
```



embedMany 支持 maxParallelCalls，可限制并发请求数，适合批量处理时控制吞吐和稳定性。



embed 和 embedMany 都支持：

- maxRetries：最大重试次数，默认重试 2 次，也就是最多 3 次尝试。
- abortSignal：可中断请求或设置超时。
- headers：添加自定义请求头。
- response：返回底层供应商响应信息，便于调试或记录。



#### Embedding Middleware

AI SDK 支持通过 wrapEmbeddingModel 和 EmbeddingModelMiddleware 包装 embedding 模型，例如统一设置默认参数。文档示例中使用 defaultEmbeddingSettingsMiddleware 给 Google embedding 模型设置默认输出维度和任务类型。



#### 总结

- Embedding 本质是“语义向量化”，让文本、短语、图片等内容可以被相似度计算。
- embed 处理单条输入，embedMany 处理批量输入。
- RAG 场景通常用 embedMany 预处理知识库，再用查询文本 embedding 做相似检索。
- cosineSimilarity 可直接计算两个 embedding 的相似度。
- 生产环境要关注 token 用量、重试、超时、并发限制和供应商参数。
- 不同模型的向量维度不同，入库前要固定模型和维度，避免向量库 schema 不兼容。
- providerOptions 和 middleware 适合封装项目级默认配置。



### [Reranking](https://ai-sdk.dev/docs/ai-sdk-core/reranking#reranking)

精排利器，在 RAG 流程中通常配合 Embedding 使用：

1. 先用 Embedding 粗筛出一批候选文档（快）
2. 再用 Reranking 精排，找出最相关的几个（准）



重排序是一种通过对一组文档按照与查询的相关性重新排序来提升搜索精度的技术。与基于 embedding 的相似度搜索不同，重排序模型专门训练用于理解查询与文档之间的关系，通常能产生更准确的相关性评分。



#### 对文档进行重排序

AI SDK 提供了 rerank 函数，根据文档与查询的相关性对文档重新排序。可以搭配重排序模型使用，例如 cohere.reranking('rerank-v3.5') 或 bedrock.reranking('cohere.rerank-v3-5:0')。

```JavaScript
import { rerank } from 'ai';
import { cohere } from '@ai-sdk/cohere';

const documents = [
  'sunny day at the beach',
  'rainy afternoon in the city',
  'snowy night in the mountains',
];

const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents,
  query: 'talk about rain',
  topN: 2, // 返回最相关的前 2 个文档
});

console.log(ranking);
// [
//   { originalIndex: 1, score: 0.9, document: 'rainy afternoon in the city' },
//   { originalIndex: 0, score: 0.3, document: 'sunny day at the beach' }
// ]

```



#### 支持结构化对象文档

重排序也支持结构化文档（JSON 对象），适合搜索数据库记录、邮件或其他结构化内容：

```Python
import { rerank } from 'ai';
import { cohere } from '@ai-sdk/cohere';

const documents = [
  {
    from: 'Paul Doe',
    subject: 'Follow-up',
    text: 'We are happy to give you a discount of 20% on your next order.',
  },
  {
    from: 'John McGill',
    subject: 'Missing Info',
    text: 'Sorry, but here is the pricing information from Oracle: $5000/month',
  },
];

const { ranking, rerankedDocuments } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents,
  query: 'Which pricing did we get from Oracle?',
  topN: 1,
});

console.log(rerankedDocuments[0]);
// { from: 'John McGill', subject: 'Missing Info', text: '...' }

```



#### 理解返回结果

```JavaScript
const { ranking, rerankedDocuments, originalDocuments } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
});

// ranking: 按相关性排序的数组，每项包含 { originalIndex, score, document }
// rerankedDocuments: 按相关性排序的文档（便捷属性）
// originalDocuments: 原始文档数组

```

ranking 数组中每一项包含：

- originalIndex：文档在原始数组中的位置
- score：相关性评分（通常 0-1，越高越相关）
- document：原始文档内容



#### 配置项

Top-N 结果数：用 topN 限制返回数量，只获取最相关的文档。

Provider 选项：通过 providerOptions 传入特定提供商的参数，如 Cohere 的 maxTokensPerDoc。

重试：maxRetries 参数设置最大重试次数，默认 2 次（共 3 次尝试），设为 0 禁用重试。

中止信号和超时：abortSignal 参数接受 AbortSignal，可用于中止请求或设置超时。

自定义请求头：headers 参数传入自定义 HTTP 头。



#### 响应信息

返回的 response 对象包含原始提供商响应：{ id, timestamp, modelId, headers, body }。







## AI SDK UI

提供面向前端／前端框架 (React、Vue、Svelte、Angular 等) 的 hooks 或组件 (如 `useChat`, `useCompletion` 等)，方便构建聊天界面、生成式 UI、流式聊天界面、Agent UI 等。可以在多种前端架构中复用