---
title: 为你的 Agent 添加 Skills
tags: Vercel AI SDK
toc: true
---


> https://ai-sdk.dev/cookbook/guides/agent-skills



在本指南中，你将学习如何使用 **Agent Skills** 扩展你的 Agent。

**Agent Skills** 是一种轻量级、开放格式，用于通过 Markdown 文件在运行时加载专门知识和工作流。

从本质上讲，一个 Skill 就是一个文件夹，其中包含一个 `SKILL.md` 文件。该文件包含元数据和指令，用于告诉 Agent 如何执行某个特定任务。

```Plain Text
my-skill/
├── SKILL.md      # 必需：指令 + 元数据
├── scripts/      # 可选：可执行代码
├── references/   # 可选：文档资料
└── assets/       # 可选：模板、资源
```

---

# Skills 的工作方式

Skills 使用“渐进式披露”来高效管理上下文：

1. **发现 Discovery**  
 Agent 启动时，只加载每个可用 Skill 的名称和描述。  
 这些信息足以让 Agent 判断某个 Skill 什么时候可能相关。
2. **激活 Activation**  
 当任务与某个 Skill 的描述匹配时，Agent 会将完整的 `SKILL.md` 指令读取到上下文中。
3. **执行 Execution**  
 Agent 按照指令执行任务，并在需要时加载被引用的文件，或执行 Skill 中打包的代码。

这种方式可以让 Agent 保持快速响应，同时在需要时访问更多上下文信息。

---

# `SKILL.md` 文件

每个 Skill 都从一个 `SKILL.md` 文件开始。该文件包含 YAML frontmatter 和 Markdown 指令：

```Markdown
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents.
---
# PDF Processing
## When to use this skill

Use this skill when the user needs to work with PDF files...

## How to extract text

1. Use pdfplumber for text extraction...

## How to fill forms

...
```

frontmatter 中必须包含：

- `name`：一个简短的标识符。
- `description`：说明什么时候应该使用该 Skill。

Markdown 正文则包含实际的 Skill 内容。正文的结构和内容没有限制。

---

# 前置条件

为了支持 Skills，你的 Agent 需要具备以下能力：

1. **文件系统访问能力**  
 用于发现和加载 Skill 文件，例如读取文件、读取目录。
2. **加载 Skill 的工具**  
 用于将 `SKILL.md` 内容读取到上下文中。
3. **命令执行能力，可选**  
 如果 Skill 中打包了脚本，例如完整的沙箱环境，则需要支持命令执行。

---

# 第 1 步：定义沙箱抽象

本指南使用一个通用的沙箱抽象，以便适配不同环境。

如果你正在为 Node.js 构建，可以直接使用 `fs/promises` 和 `child_process`。否则，你可以创建一个通用的沙箱接口，用一致的方式与文件系统交互。

这种抽象允许你根据不同环境进行不同实现，例如：

- Node.js 文件系统；
- 容器化沙箱；
- 云存储；
- 其他受控执行环境。

```TypeScript
interface Sandbox {
  readFile(path: string, encoding: 'utf-8'): Promise<string>;

  readdir(
    path: string,
    opts: { withFileTypes: true },
  ): Promise<{ name: string; isDirectory(): boolean }[]>;

  exec(command: string): Promise<{ stdout: string; stderr: string }>;
}
```

---

# 第 2 步：在启动时发现 Skills

扫描 Skill 目录，并从每个 `SKILL.md` 中提取元数据：

```TypeScript
interface SkillMetadata {
  name: string;
  description: string;
  path: string;
}

async function discoverSkills(sandbox: Sandbox,
  directories: string[],
): Promise<SkillMetadata[]> {
  const skills: SkillMetadata[] = [];
  const seenNames = new Set<string>();

  for (const dir of directories) {
    let entries;

    try {
      entries = await sandbox.readdir(dir, { withFileTypes: true });
    } catch {
      continue; // 跳过不存在的目录
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const skillDir = `${dir}/${entry.name}`;
      const skillFile = `${skillDir}/SKILL.md`;

      try {
        const content = await sandbox.readFile(skillFile, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        // 同名 Skill 中，优先使用第一个。// 这允许项目级 Skill 覆盖全局 Skill。if (seenNames.has(frontmatter.name)) continue;

        seenNames.add(frontmatter.name);

        skills.push({
          name: frontmatter.name,
          description: frontmatter.description,
          path: skillDir,
        });
      } catch {
        continue; // 跳过没有有效 SKILL.md 的目录
      }
    }
  }

  return skills;
}

function parseFrontmatter(content: string) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match?.[1]) {
    throw new Error('No frontmatter found');
  }

  // 使用你偏好的 YAML 库进行解析return yaml.parse(match[1]);
}
```

---

# 第 3 步：构建系统提示词

将发现到的 Skills 加入系统提示词中，这样 Agent 就知道有哪些 Skill 可用：

```TypeScript
function buildSkillsPrompt(skills: SkillMetadata[]): string {
  const skillsList = skills
    .map(s => `- ${s.name}: ${s.description}`)
    .join('\n');

  return `
## Skills

Use the \`loadSkill\` tool to load a skill when the user's request
would benefit from specialized instructions.

Available skills:
${skillsList}
`;
}
```

Agent 只会看到 Skill 的名称和描述。

完整指令不会进入上下文窗口，直到该 Skill 被真正加载。

---

# 第 4 步：创建加载 Skill 的工具

加载 Skill 的工具会读取完整的 `SKILL.md`，并返回去除 frontmatter 后的正文内容：

```TypeScript
function stripFrontmatter(content: string): string {
  const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);

  return match ? content.slice(match[0].length).trim() : content.trim();
}

const loadSkillTool = tool({
  description: 'Load a skill to get specialized instructions',

  inputSchema: z.object({
    name: z.string().describe('The skill name to load'),
  }),

  execute: async ({ name }, { experimental_context }) => {
    const { sandbox, skills } = experimental_context as {
      sandbox: Sandbox;
      skills: SkillMetadata[];
    };

    const skill = skills.find(
      s => s.name.toLowerCase() === name.toLowerCase(),
    );

    if (!skill) {
      return {
        error: `Skill '${name}' not found`,
      };
    }

    const skillFile = `${skill.path}/SKILL.md`;
    const content = await sandbox.readFile(skillFile, 'utf-8');
    const body = stripFrontmatter(content);

    return {
      skillDirectory: skill.path,
      content: body,
    };
  },
});
```

这个工具会返回 Skill 目录路径以及 Skill 内容。

这样 Agent 就可以基于该目录路径，构造 Skill 中附带资源文件的完整路径。

---

# 第 5 步：创建 Agent

使用 `callOptionsSchema` 和 `prepareCall` 将沙箱与 Skills 连接起来：

```TypeScript
const callOptionsSchema = z.object({
  sandbox: z.custom<Sandbox>(),

  skills: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      path: z.string(),
    }),
  ),
});

const readFileTool = tool({
  description: 'Read a file from the filesystem',

  inputSchema: z.object({
    path: z.string(),
  }),

  execute: async ({ path }, { experimental_context }) => {
    const { sandbox } = experimental_context as { sandbox: Sandbox };

    return sandbox.readFile(path, 'utf-8');
  },
});

const bashTool = tool({
  description: 'Execute a bash command',

  inputSchema: z.object({
    command: z.string(),
  }),

  execute: async ({ command }, { experimental_context }) => {
    const { sandbox } = experimental_context as { sandbox: Sandbox };

    return sandbox.exec(command);
  },
});

const agent = new ToolLoopAgent({
  model: yourModel,

  tools: {
    loadSkill: loadSkillTool,
    readFile: readFileTool,
    bash: bashTool,
  },

  callOptionsSchema,

  prepareCall: ({ options, ...settings }) => ({
    ...settings,

    instructions: `${settings.instructions}\n\n${buildSkillsPrompt(
      options.skills,
    )}`,

    experimental_context: {
      sandbox: options.sandbox,
      skills: options.skills,
    },
  }),
});
```

---

# 第 6 步：运行 Agent

```TypeScript
// 创建沙箱，也就是你的文件系统 / 执行环境抽象const sandbox = createSandbox({
  workingDirectory: process.cwd(),
});

// 启动时发现 Skillsconst skills = await discoverSkills(sandbox, [
  '.agents/skills',
  '~/.config/agent/skills',
]);

// 运行 Agentconst result = await agent.run({
  prompt: userMessage,

  options: {
    sandbox,
    skills,
  },
});
```

当用户请求与某个 Skill 的描述匹配时，Agent 会调用 `loadSkill`。

随后，完整指令会被加载到上下文中，Agent 会根据这些指令，使用 `bash` 和 `readFile` 等工具访问 Skill 中附带的资源。

---

# 访问 Skill 中附带的资源

Skills 可以引用相对于自身目录的文件。

Agent 使用已有工具访问这些文件：

```Plain Text
Skill directory: /path/to/.agents/skills/my-skill

# My Skill Instructions

Read the configuration template:
templates/config.json

Run the setup script:
bash scripts/setup.sh
```

Agent 会在工具结果中看到 Skill 目录路径。

当 Agent 访问 `templates/config.json` 或 `scripts/setup.sh` 时，会基于 Skill 目录路径拼接完整路径。

不需要特殊的资源加载机制。Agent 使用的仍然是它平时使用的工具。

---

# 了解更多

你可以继续查看以下资料：

- **Agent Skills specification**：完整格式规范。
- **Example skills on GitHub**：GitHub 上的示例 Skills。
- **Authoring best practices**：编写高质量 Skills 的最佳实践。
- **Reference library**：用于验证 Skills 并生成 prompt XML 的参考库。
- **skills.sh**：用于浏览和发现社区 Skills。