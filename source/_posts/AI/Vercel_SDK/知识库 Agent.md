---
title: 知识库 Agent
tags: Vercel AI SDK
toc: true
---


> https://ai-sdk.dev/cookbook/node/knowledge-base-agent



在本教程中，你将学习如何使用 **Upstash Search** 构建一个可以与知识库交互的 AI Agent。

这个 Agent 能够：

- 从知识库中检索信息；
- 向知识库中添加新的资源；
- 根据需要删除已有资源；
- 借助 AI SDK tools 完成这些操作。

**Upstash Search** 提供了输入增强、重排序、语义搜索和全文搜索能力，可以返回高准确度的搜索结果。它还内置了 embedding 服务，因此不需要额外接入单独的 embedding provider。

这使得它非常适合用来构建和管理简单的知识库。

本示例使用一篇 essay 作为输入数据，文件名为 `essay.txt`。

如果你想查看更深入的指南，可以参考 **RAG Agent Guide**，该指南展示了如何使用 Next.js、Drizzle ORM 和 Postgres 构建一个 RAG Agent。

---

# 开始使用

首先，在 **Upstash Console** 上创建一个 Upstash Search 数据库。

创建完成后，你会得到：

- REST URL；
- token。

将它们配置到环境变量中：

```Bash
UPSTASH_SEARCH_REST_URL="***"
UPSTASH_SEARCH_REST_TOKEN="***"
```

---

# 项目设置

创建一个新的空目录，并初始化 pnpm：

```Bash
mkdir knowledge-base-agent
cd knowledge-base-agent
pnpm init
```

安装 AI SDK、OpenAI provider、Upstash Search 包，以及作为开发依赖的 `tsx`：

```Bash
pnpm i ai zod @ai-sdk/openai @upstash/search
pnpm i -D tsx
```

最后，下载并保存输入 essay：

```Bash
curl -o essay.txt https://raw.githubusercontent.com/run-llama/llama_index/main/docs/docs/examples/data/paul_graham/paul_graham_essay.txt
```

---

# 设置知识库

接下来，我们来设置初始知识库：读取一个文件，并将它的内容上传到 Upstash Search。

创建一个名为 `setup.ts` 的脚本：

```TypeScript
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { Search } from '@upstash/search';

type KnowledgeContent = {
  text: string;
  section: string;
  title?: string;
};

// 初始化 Upstash Search 客户端const search = new Search({
  url: process.env.UPSTASH_SEARCH_REST_URL!,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN!,
});

const index = search.index<KnowledgeContent>('knowledge-base');

async function setupKnowledgeBase() {
  // 读取并处理源文件const content = fs.readFileSync(path.join(__dirname, 'essay.txt'), 'utf8');

  // 将内容切分成有意义的片段const chunks = content
    .split(/\n\s*\n/) // 按双换行切分，也就是按段落切分
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.length > 50); // 只保留有实质内容的片段// 以每批 100 条的方式上传片段到 Upstash Searchconst batchSize = 100;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize).map((chunk, j) => ({
      id: `chunk-${i + j}`,
      content: {
        text: chunk,
        section: `section-${Math.floor((i + j) / 10)}`,
        title: chunk.split('\n')[0] || `Chunk ${i + j + 1}`,
      },
    }));

    await index.upsert(batch);

    console.log(
      `Upserted ${Math.min(
        i + batch.length,
        chunks.length,
      )} chunks out of ${chunks.length} chunks`,
    );
  }
}

// 运行初始化setupKnowledgeBase().catch(console.error);
```

运行 setup 脚本，将数据填充到知识库中：

```Bash
pnpm tsx setup.ts
```

然后进入 Upstash Console，查看 Search 数据库的数据浏览器。

你应该能看到 essay 已经被索引。

---

# 构建知识库 Agent

现在，我们来创建一个可以与知识库交互的 Agent。

创建一个新文件 `agent.ts`：

```TypeScript
import { tool, stepCountIs, generateText, generateId } from 'ai';
import { z } from 'zod';
import { Search } from '@upstash/search';

import 'dotenv/config';

const search = new Search({
  url: process.env.UPSTASH_SEARCH_REST_URL!,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN!,
});

type KnowledgeContent = {
  text: string;
  section: string;
  title?: string;
};

const index = search.index<KnowledgeContent>('knowledge-base');

async function main(prompt: string) {
  const { text } = await generateText({
    model: 'openai/gpt-4o',
    prompt,
    stopWhen: stepCountIs(5),

    tools: {
      addResource: tool({
        description:
          'Add a new resource or piece of information to the knowledge base',

        inputSchema: z.object({
          resource: z
            .string()
            .describe('The content or resource to add to the knowledge base'),

          title: z
            .string()
            .optional()
            .describe('Optional title for the resource'),
        }),

        execute: async ({ resource, title }) => {
          const id = generateId();

          await index.upsert({
            id,
            content: {
              text: resource,
              section: 'user-added',
              title: title || `Resource ${id.slice(0, 8)}`,
            },
          });

          return `Successfully added resource "${
            title || 'Untitled'
          }" to knowledge base with ID: ${id}`;
        },
      }),

      searchKnowledge: tool({
        description:
          'Search the knowledge base to find relevant information for answering questions',

        inputSchema: z.object({
          query: z
            .string()
            .describe('The search query to find relevant information'),

          limit: z
            .number()
            .optional()
            .describe('Maximum number of results to return (default: 3)'),
        }),

        execute: async ({ query, limit = 3 }) => {
          const results = await index.search({
            query,
            limit,
            reranking: true,
          });

          if (results.length === 0) {
            return 'No relevant information found in the knowledge base.';
          }

          return results.map((hit, i) => ({
            resourceId: hit.id,
            rank: i + 1,
            title: hit.content.title || 'Untitled',
            content: hit.content.text || '',
            section: hit.content.section || 'unknown',
            score: hit.score,
          }));
        },
      }),

      deleteResource: tool({
        description: 'Delete a resource from the knowledge base',

        inputSchema: z.object({
          resourceId: z.string().describe('The ID of the resource to delete'),
        }),

        execute: async ({ resourceId }) => {
          try {
            await index.delete({ ids: [resourceId] });

            return `Successfully deleted resource with ID: ${resourceId}`;
          } catch (error) {
            return `Failed to delete resource: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`;
          }
        },
      }),
    },

    // 输出中间步骤日志onStepFinish: ({ toolResults }) => {
      if (toolResults.length > 0) {
        console.log('Tool results:');
        console.dir(toolResults, { depth: null });
      }
    },
  });

  return text;
}

const question =
  'What are the two main things I worked on before college? (utilize knowledge base)';

main(question).then(console.log).catch(console.error);
```

---

# 运行 Agent

现在运行 Agent：

```Bash
pnpm tsx agent.ts
```

Agent 会利用知识库来回答问题，并根据需要：

- 查询知识库；
- 添加新的资源；
- 删除已有资源。

你可以修改 `question` 变量，测试不同的问题，以及与知识库的不同交互方式。

---

# 代码逻辑说明

这篇教程的核心是创建三个工具，并把它们交给 AI SDK 的 `generateText` 使用。

## 1. `searchKnowledge`

用于搜索知识库。

它接收：

- `query`：搜索查询；
- `limit`：返回结果数量，默认为 3。

核心逻辑是：

```TypeScript
const results = await index.search({
  query,
  limit,
  reranking: true,
});
```

这里开启了 `reranking: true`，表示对搜索结果进行重排序，以提升结果相关性。

返回结果中包含：

- 资源 ID；
- 排名；
- 标题；
- 内容；
- 所属 section；
- 分数。

---

## 2. `addResource`

用于向知识库中添加新资源。

它接收：

- `resource`：要添加的内容；
- `title`：可选标题。

核心逻辑是：

```TypeScript
await index.upsert({
  id,
  content: {
    text: resource,
    section: 'user-added',
    title: title || `Resource ${id.slice(0, 8)}`,
  },
});
```

这里使用 `generateId()` 生成唯一 ID，然后通过 `index.upsert()` 写入 Upstash Search。

---

## 3. `deleteResource`

用于从知识库中删除资源。

它接收：

- `resourceId`：要删除的资源 ID。

核心逻辑是：

```TypeScript
await index.delete({ ids: [resourceId] });
```

如果删除成功，会返回成功提示；如果失败，会返回错误信息。

---

# 为什么使用 `stopWhen: stepCountIs(5)`

代码中设置了：

```TypeScript
stopWhen: stepCountIs(5)
```

这表示模型最多可以进行 5 个步骤。

这样做的作用是让 Agent 可以进行多轮工具调用，例如：

1. 先搜索知识库；
2. 根据搜索结果判断是否足够；
3. 如果不够，再搜索一次；
4. 生成最终回答；
5. 必要时添加或删除资源。

如果不设置多步骤能力，模型可能只能完成一次简单生成，无法形成更完整的 Agent 工作流。