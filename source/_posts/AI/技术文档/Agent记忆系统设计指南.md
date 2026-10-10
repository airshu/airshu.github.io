---
title: Agent记忆系统设计指南
toc: true
tags: AI, Agent
---

# 一、背景与目标

Agent 记忆系统用于管理和复用长期上下文，使 Agent 在不同会话和任务之间保持连续性。它不同于聊天历史和知识库，关注的是可长期复用的用户偏好、协作方式、业务约定、历史反馈和任务经验。

核心目标：不是"记住一切"，而是"只记住未来有复用价值、且可治理的内容"。

| 能力 | 解决的问题 |
|-|-|
| 长期偏好 | 用户喜欢什么、不喜欢什么 |
| 协作方式 | 用户希望 Agent 如何工作和输出 |
| Skill 经验 | 某个 Skill 下反复强调的规则 |
| 历史反馈 | 用户纠正过的 Agent 行为 |
| 项目背景 | 长期稳定的项目上下文 |
| 决策记录 | 已确认的技术或产品决策 |

# 二、记忆、会话历史、知识库的边界

| 类型 | 存储内容 | 生命周期 | 典型用途 |
|-|-|-|-|
| 会话历史 | 当前对话消息 | 当前 conversation | 保持上下文连续 |
| Agent 记忆 | 用户偏好、规则、反馈 | 跨会话长期存在 | 个性化协作 |
| 知识库 RAG | 文档、PRD、资料、制度 | 文档级管理 | 提供事实依据 |

不要把聊天记录原样写入记忆库。记忆应该是抽取后的事实、偏好和规则。

# 三、常见记忆范围

| Scope | 说明 | 示例 |
|-|-|-|
| global | 用户全局记忆，所有 Agent / Skill 可用 | 用户偏好简洁回答 |
| user_agent | 用户在某个 agent 下的专属记忆 | 文档评审时优先关注风险、边界条件和数据指标 |
| conversation | 会话级短期记忆，可选 | 本轮讨论的是某个功能改版方案 |
| agent | Agent / Skill 自身通用经验 | 文档评审 Agent 默认输出风险等级和修改建议 |
| app / org | 应用级或组织级共享记忆 | 团队统一使用某套术语、模板或交付标准 |

# 四、常见记忆分类

| 分类 | 说明 | 是否建议自动写入 |
|-|-|-|
| preference | 用户稳定偏好 | 是 |
| work_style | 用户希望 Agent 如何协作 | 是 |
| skill_instruction | 某个 Skill 下的稳定规则 | 是 |
| feedback | 用户对 Agent 的纠正 | 是 |
| project_context | 长期项目背景 | 仅显式写入 |
| decision | 已确认的历史决策 | 仅显式写入 |
| domain_glossary | 团队术语 | 仅显式写入 |

自动写入要保守：宁可少记，也不要乱记。

# 五、典型调用流程

1. 用户发送请求。
2. 后端识别 `user_id`、`conversation_id`、`skill_id`。
3. 检查用户是否开启记忆。
4. 检索相关长期记忆。
5. 合并、去重、限量。
6. 注入 system message 的低优先级上下文区。
7. 调用 LLM / Agent Loop。
8. 保存 assistant 消息。
9. 异步判断是否值得写入记忆。
10. 过滤敏感信息。
11. 写入记忆库。
12. 记录事件、耗时、成本和错误。

检索发生在 LLM 调用前；写入发生在 assistant 消息保存后。写入不要阻塞用户看到最终回答。

# 六、检索设计要点

| 要点 | 建议 |
|-|-|
| 用户隔离 | 所有检索必须带 `user_id` |
| agent 隔离 | Agent 记忆使用 `user_id + agent_id / skill_id` |
| 检索数量 | V1 注入 3-8 条即可 |
| 超时预算 | 例如 500ms，超时直接跳过 |
| 降级语义 | 检索失败不能影响主聊天 |
| 去重 | 按 memory id 和 content hash 去重 |

记忆注入时必须明确：记忆低于系统规则、工具结果和当前用户输入，不能让旧记忆覆盖当前指令。

# 七、写入设计要点

适合写入的内容：

| 用户表达 | 示例 |
|-|-|
| 长期偏好 | 以后回答都先给结论 |
| 协作方式 | 方案先列 3 个方向，再推荐一个 |
| Skill 规则 | 以后评审 PRD 都重点看异常流 |
| 纠正反馈 | 不要写营销化文案 |
| 显式记住 | 记住，我们项目叫 Crafter |

不适合自动写入的内容：

| 内容 | 原因 |
|-|-|
| 一次性任务 | 没有长期复用价值 |
| 工具返回原文 | 可能被 prompt injection 污染 |
| 上传文件全文 | 成本高、隐私风险大 |
| 密钥、token、手机号 | 敏感信息 |
| 推理过程 thinking | 可能包含内部推理或敏感细节 |

# 八、幂等与重试

记忆写入必须做业务幂等，不能只依赖记忆库自身去重。

推荐幂等键：

`idempotency_key = sha256(userId + conversationId + assistantMessageId + scope + skillIdOrNone)`

| 场景 | 处理方式 |
|-|-|
| 同一轮重试 | 不重复调用 memory add |
| global 无 agent | 使用固定占位符，如 `__none__` |
| user_skill 无 skillId | 拒绝写入，不降级成 global |
| running 卡住 | 超时后最多重试一次 |
| 写入失败 | 记录 error，不影响聊天 |

# 九、服务抽象层

业务代码不要直接依赖 Mem0、Zep 或某个 SDK。建议封装统一服务层。这样未来切换底层 provider 时，聊天主流程、前端 API 和管理后台都不用大改。

| 方法 | 作用 |
|-|-|
| searchForChat | 聊天前检索记忆 |
| rememberAfterChat | 聊天后异步写入记忆 |
| listUserMemories | 查看用户记忆 |
| deleteMemory | 删除单条记忆 |
| clearUserMemories | 清空用户记忆 |
| setUserMemoryEnabled | 设置用户记忆开关 |

# 十、治理能力

| 能力 | 用户侧 | 管理员侧 |
|-|-|-|
| 关闭记忆 | 需要 | 可查看 |
| 清空全部记忆 | 需要 | 需要 |
| 清空 Skill 记忆 | 建议 | 需要 |
| 查看记忆列表 | 建议 | 需要 |
| 删除单条记忆 | 建议 | 需要 |
| 查看调用事件 | 不开放 | 需要 |

只要上线自动写入，就必须提供关闭、删除和清空能力。

# 十一、可观测性

每次 search、add、delete、clear、settings 都应该记录事件。

| 字段 | 用途 |
|-|-|
| user_id | 目标用户 |
| actor_user_id | 操作者，管理员操作时不同于目标用户 |
| operation | search / add / delete / clear / settings |
| status | running / success / skipped / error |
| reason | skipped 原因 |
| latency_ms | 性能观测 |
| memory_count | 检索或写入条数 |
| estimated_tokens | 成本估算 |
| idempotency_key | 写入幂等 |
| error_message | 错误排查 |

没有事件表，后续很难解释"为什么没记住""为什么乱记了""成本为什么变高"。

# 十二、开发常见坑

| 问题 | 后果 | 建议 |
|-|-|-|
| 把所有聊天原文写入记忆 | 成本高、污染严重 | 只写稳定信息 |
| 不做 user_id 隔离 | 串用户、隐私事故 | 所有检索和写入都带 user_id |
| bot 使用固定 user_id | 所有 bot 用户共享记忆 | 身份未对齐前禁用 bot 记忆 |
| 不做幂等 | 重试产生重复记忆 | 用 message id 派生 idempotency key |
| 记忆追加到 system 末尾 | 覆盖高优先级规则 | 放在低优先级上下文区 |
| 使用 in-memory store 上线 | 重启丢记忆 | 生产必须配置持久化存储 |
| embedding 模型漂移 | 检索结果失真 | 写入和检索使用同一 embedding profile |
| 信任 SDK 返回结构 | 升级后字段变动 | 做 normalize 层 |
| 写入阻塞 SSE | 用户体感变慢 | assistant 保存后异步写入 |
| 无管理后台 | 无法排查和治理 | 至少提供内部排查入口 |

# 十三、V1 推荐落地顺序

1. 定义 `AgentMemoryService` 抽象。
2. 增加总开关和用户级 settings。
3. 接入持久化 vector store。
4. 实现 `searchForChat`，限制注入数量和超时。
5. 实现 `rememberAfterChat`，做候选判断、敏感过滤和幂等。
6. 增加事件表和调用日志。
7. 增加用户关闭、清空 API。
8. 增加管理员查询、删除、事件页。
9. 做 Skill 隔离和重启持久化验证。
10. 灰度上线，人工抽检错记率和成本。

# 十四、核心原则

一个好的 Agent 记忆系统，不是"记得多"，而是：

- 记得准。
- 查得快。
- 隔离严。
- 能解释。
- 能关闭。
- 能删除。
- 出错不影响主流程。
- 未来能切换底层 provider。

记忆能力做对后，Agent 会从"每次重新认识用户"变成"能持续协作的助手"。但如果做错，也最容易变成隐私、污染和成本问题，所以第一版必须保守、可控、可观测。

# 十五、方案对比

| 方案 | 定位 | 优点 | 风险/限制 | 适合场景 |
|-|-|-|-|-|
| Mem0 | 专门的 agent 长期记忆 API/SDK | 上手最快；支持用户、会话、agent 维度；适合快速验证 | 外部依赖；数据合规和记忆写入策略需要额外审计 | 快速做"用户偏好/事实记忆"的 SaaS |
| Zep / Graphiti | agent memory + temporal knowledge graph | 强在实体、关系、时间线；适合复杂上下文 | 架构复杂度高于 Mem0 | 用户、项目、文档、任务关系复杂的 agent |
| Letta / MemGPT | stateful agent runtime | 把 memory 当 agent 状态管理；核心记忆 + 归档记忆思想成熟 | 更像 agent 平台，不只是插件 | 长期自主 agent、研究型 agent |
| LangGraph / LangMem | 框架级长期记忆 | 语义、情景、程序性记忆分类清晰；适合复杂 agent flow | 更适合 LangChain/LangGraph 技术栈 | 已经用 LangGraph 构建 agent 的团队 |
| LlamaIndex Memory | RAG/agent 框架内存模块 | 和索引、检索、文档知识结合自然 | 框架绑定明显 | 文档型、知识型 agent |
| Vercel AI SDK Memory | AI SDK 里的 memory/context 能力 | 和当前项目栈最接近；适合会话历史和上下文注入 | 不是完整长期记忆产品 | 当前项目可作为第一层集成参考 |
| OpenAI Agents SDK Sessions | 会话持久化 | 简化多轮对话状态 | 更偏 session，不等同长期用户记忆 | OpenAI Agents SDK 项目 |
| Anthropic Memory Tool | Claude 持久记忆工具 | 原生工具化；适合 Claude 生态 | provider 绑定 | Anthropic-first agent |
| AWS Bedrock AgentCore Memory | 云厂商托管 memory | 企业合规、托管、AWS 集成 | 云平台绑定；成本和迁移复杂 | AWS 企业架构 |
| Google ADK Memory | Google agent 开发套件 memory | 与 Google/Vertex 生态融合 | 平台绑定 | Google Cloud/ADK 项目 |
| CrewAI Memory | 多 agent 团队记忆 | 简单；适合多 agent 协作 demo | 深度和可控性一般 | CrewAI 编排项目 |

# 记忆能力分类

1. 短期记忆：当前会话窗口、最近消息、摘要。你们已经有 messages，但还需要 token-aware summarization。
2. 长期语义记忆：用户偏好、稳定事实，例如"用户偏好中文简洁回答""常做 PRD 评审"。
3. 情景记忆：过去任务、决策、项目上下文，例如"上次为 X 项目生成过登录页原型"。
4. 程序性记忆：用户或团队偏好的工作方式，例如"PRD 评审先看目标用户，再看异常流"。
5. 关系/图记忆：人、项目、文档、技能、需求之间的关系，Zep/Graphiti 这类方案强在这里。

# mem0

https://github.com/mem0ai/mem0

| 概念 | 开发者要理解什么 |
|-|-|
| Memory Layer | Mem0 是 agent 的长期记忆层，不是普通聊天记录库，也不替代 RAG 知识库。 |
| Memory Types | 官方分为 `conversation memory`、`session memory`、`user memory`、`organizational memory`。 |
| Entity Scope | 用 `user_id`、`agent_id`、`run_id`、`app_id` 控制记忆归属和隔离。  <br/>user_id  = 用户级记忆  <br/>agent_id = 技能级记忆  <br/>run_id   = 会话级记忆  <br/>app_id   = 应用级记忆 |
| Add Memory | `add` 会从对话中抽取值得记住的事实、偏好、反馈；默认 `infer=True`，不是原样存全文。 |
| Search Memory | `search` 用自然语言查询相关记忆，可配 `top_k`、`threshold`、`rerank`、filters。  <br/>filters    控制用户/技能/会话隔离  <br/>top_k      控制返回数量  <br/>threshold  控制相似度门槛  <br/>rerank     提升召回精度  <br/>metadata   做业务过滤 |
| Metadata | 用来挂业务字段，例如 `skill_id`、`conversation_id`、`memory_category`、`source_message_id`。 |
| Categories | Mem0 会自动给记忆打分类；Platform 支持项目级 custom categories。 |
| Update/Delete | 记忆需要能更新、删除、批量清除，避免错记、过期、隐私问题。 |
| Graph Memory | 可选能力，用图存人、项目、事件、关系；适合复杂关系上下文，不是第一版必需。 |
| Platform vs OSS | Platform 是托管 API、dashboard、graph/rerank 等能力；OSS 更可控，但运维和存储要自己处理。 |

开发者需要设计的能力：

- 记忆开关
- 查看记忆
- 删除单条记忆
- 清空用户记忆
- 按 skill 清空记忆
- 敏感信息过滤
- 记忆来源追踪
- 写入失败降级
- 搜索超时降级

## 待办

- [ ] 监控记忆相关 LLM token 消耗
- [ ] 确认向量数据库维度是否匹配
