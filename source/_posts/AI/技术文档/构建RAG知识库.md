---
title: 构建RAG知识库
toc: true
tags: AI, RAG, 知识库
---

## 基础概念

| 分类 | 名词 | 英文/缩写 | 通俗解释 | 主要作用 |
|-|-|-|-|-|
| 基础概念 | RAG | Retrieval-Augmented Generation | 检索增强生成。先从知识库检索资料，再让大模型基于资料回答。 | 降低幻觉，让回答基于企业知识 |
| 基础概念 | 大语言模型 | LLM | 负责理解问题和生成答案的模型，如 GPT、Claude、Qwen、DeepSeek。 | 生成最终回答 |
| 基础概念 | 知识库 | Knowledge Base | 企业文档、制度、FAQ、产品手册、Wiki 等资料集合。 | 提供回答依据 |
| 基础概念 | Prompt | Prompt | 发给大模型的指令和上下文。 | 控制模型回答方式 |
| 基础概念 | 上下文 | Context | 提供给模型参考的资料，通常是检索出来的文档片段。 | 支撑模型回答 |
| 基础概念 | 引用 | Citation | 答案中标明依据来自哪个文档、章节、页码或链接。 | 让答案可追溯 |
| 文档处理 | 文档入库 | Ingestion | 文档从外部系统进入知识库的处理流程。 | 拉取、解析、清洗、切分、建索引 |
| 文档处理 | 连接器 | Connector | 连接飞书、Confluence、SharePoint、网盘、数据库等知识源的程序。 | 自动同步外部文档 |
| 文档处理 | 文档解析器 | Parser | 把 PDF、Word、HTML、Excel 等文件解析成文本和结构。 | 提取可检索内容 |
| 文档处理 | OCR | Optical Character Recognition | 图片文字识别，用于扫描版 PDF 或图片。 | 提取图片中的文字 |
| 文档处理 | 清洗 | Cleaning | 去掉页眉页脚、乱码、重复内容、无用导航等。 | 提升知识质量 |
| 文档处理 | 切片 | Chunk | 把长文档拆成较小片段。 | 方便检索和引用 |
| 文档处理 | 切片大小 | Chunk Size | 每个切片的长度，比如 500 tokens。 | 控制检索粒度 |
| 文档处理 | 重叠 | Overlap | 相邻切片之间保留一部分重复内容。 | 避免上下文被切断 |
| 文档处理 | 父子切片 | Parent-child Chunk | 小切片用于精准检索，大切片或章节用于生成答案。 | 兼顾精度和完整性 |
| 文档处理 | 元数据 | Metadata | 描述文档的数据，如标题、部门、版本、作者、生效日期、权限。 | 过滤、排序、权限控制 |
| 向量与检索 | 向量化 | Embedding | 把文本转成一组数字向量，表示语义。 | 支持语义检索 |
| 向量与检索 | 向量模型 | Embedding Model | 生成文本向量的模型，如 OpenAI embedding、BGE、Jina Embeddings。 | 把文本变成向量 |
| 向量与检索 | 向量 | Vector | 文本的数字表示，例如 `[0.12, -0.03, ...]`。 | 用于相似度计算 |
| 向量与检索 | 向量数据库 | Vector Database | 存储和搜索向量的数据库，如 Qdrant、Milvus、Weaviate、pgvector。 | 快速查找语义相似内容 |
| 向量与检索 | 语义检索 | Semantic Search | 按"意思相近"搜索，而不是只按关键词匹配。 | 找到表达不同但含义相近的内容 |
| 向量与检索 | 稠密检索 | Dense Retrieval | 使用 embedding 向量做语义检索。 | 适合同义、近义表达 |
| 向量与检索 | 稀疏检索 | Sparse Retrieval | 更接近关键词检索。 | 适合编号、制度名、错误码、专有名词 |
| 向量与检索 | BM25 | BM25 | Best Matching 25，经典关键词搜索算法。 | 精确词匹配 |
| 向量与检索 | 混合检索 | Hybrid Search | 同时使用向量检索和关键词检索，再合并结果。 | 提升召回稳定性 |
| 向量与检索 | 元数据过滤 | Metadata Filtering | 根据权限、部门、版本、生效日期等过滤结果。 | 保证结果合规、有效 |
| 向量与检索 | Top-K | Top-K | 返回前 K 个最相关结果。 | 控制候选结果数量 |
| 向量与检索 | 召回率 | Recall | 正确资料有没有被找出来。 | 衡量是否漏掉关键资料 |
| 向量与检索 | 精确率 | Precision | 找出来的资料里有多少是真的相关。 | 衡量检索噪声大小 |
| 排序与上下文 | 重排 | Rerank | 初步检索后，用更强模型重新排序。 | 把最相关资料排前面 |
| 排序与上下文 | 重排模型 | Reranker | 执行重排的模型，如 Cohere Rerank、BGE reranker、Jina reranker。 | 提升最终上下文质量 |
| 排序与上下文 | Cross-Encoder | Cross-Encoder | 同时看"问题 + 文档片段"，判断是否匹配的模型。 | 更准确判断相关性 |
| 排序与上下文 | RRF | Reciprocal Rank Fusion | 多路检索结果融合算法。 | 合并向量检索和关键词检索结果 |
| 排序与上下文 | 上下文压缩 | Context Compression | 从检索结果里提取最关键内容，减少无关文字。 | 降低 token 消耗 |
| 排序与上下文 | 证据选择 | Evidence Selection | 从多个候选片段里选出真正支撑答案的证据。 | 提高回答可靠性 |
| 排序与上下文 | Token | Token | 模型处理文本的基本单位，可粗略理解为字/词片段。 | 计算输入长度、成本和延迟 |
| 生成与安全 | 有依据性 | Groundedness | 答案是否有资料依据。 | 判断答案能否被检索内容支撑 |
| 生成与安全 | 忠实性 | Faithfulness | 答案是否忠实于上下文，没有编造。 | 衡量幻觉风险 |
| 生成与安全 | 幻觉 | Hallucination | 模型编造知识库没有的内容，或把内容说错。 | 需要重点控制的风险 |
| 生成与安全 | 拒答 | Refusal | 当资料不足、无权限或问题超出范围时，系统明确说无法回答。 | 避免无依据回答 |
| 生成与安全 | 护栏 | Guardrail | 限制模型行为的规则或检查机制。 | 防止泄密、越权、误导 |
| 生成与安全 | 访问控制列表 | ACL | 规定哪些用户或角色可以访问哪些文档。 | 文档权限控制 |
| 生成与安全 | 基于角色的权限控制 | RBAC | 按角色控制权限，如员工、经理、HR、管理员。 | 企业权限管理 |
| 生成与安全 | 个人敏感信息 | PII | 可识别个人身份的信息，如身份证、手机号、工资、住址。 | 敏感信息保护 |
| 评测与观测 | 评测 | Evaluation / Eval | 用测试集和指标评估 RAG 效果。 | 判断系统质量 |
| 评测与观测 | 黄金集 | Golden Set | 高质量人工标注测试集，包含问题、标准答案、标准依据。 | 作为评测基准 |
| 评测与观测 | 大模型裁判 | LLM-as-Judge | 用另一个大模型评估答案是否正确、有依据。 | 自动化评测 |
| 评测与观测 | 答案相关性 | Answer Relevancy | 答案是否切题。 | 判断是否回答了问题 |
| 评测与观测 | 答案正确性 | Answer Correctness | 答案是否和标准答案一致。 | 判断回答对不对 |
| 评测与观测 | 上下文精确率 | Context Precision | 检索出来的上下文里，相关内容占比高不高。 | 衡量检索噪声 |
| 评测与观测 | 上下文召回率 | Context Recall | 标准答案需要的资料是否被检索出来。 | 衡量检索是否漏召回 |
| 评测与观测 | 链路追踪 | Trace | 记录一次请求从问题、检索、重排、生成到答案的全过程。 | 定位问题来源 |
| 评测与观测 | 可观测性 | Observability | 通过日志、指标、trace 看系统运行状态和错误来源。 | 监控和排障 |
| 评测与观测 | 回归测试 | Regression Test | 每次改模型、prompt、索引、切片策略后重新跑测试。 | 防止效果退化 |
| 系统和工具 | Qdrant | Qdrant | 常见向量数据库。 | 向量存储和检索 |
| 系统和工具 | Milvus | Milvus | 常见向量数据库。 | 大规模向量检索 |
| 系统和工具 | Weaviate | Weaviate | 常见向量数据库。 | 向量存储和检索 |
| 系统和工具 | pgvector | pgvector | PostgreSQL 的向量检索扩展。 | 中小规模向量检索 |
| 系统和工具 | Elasticsearch | Elasticsearch | 搜索引擎。 | 关键词检索、过滤、排序 |
| 系统和工具 | OpenSearch | OpenSearch | Elasticsearch 的开源替代方案之一。 | 关键词检索、日志分析 |
| 系统和工具 | LlamaIndex | LlamaIndex | RAG 应用开发框架。 | 文档索引和检索编排 |
| 系统和工具 | LangChain | LangChain | LLM 应用开发框架。 | 构建链、工具调用、RAG、Agent |
| 系统和工具 | Haystack | Haystack | 开源 NLP/RAG 框架。 | 搜索和问答系统 |
| 系统和工具 | Ragas | Ragas | RAG 自动评测工具。 | 评测忠实性、召回等指标 |
| 系统和工具 | TruLens | TruLens | RAG/LLM 评测和可解释性工具。 | 分析检索、依据、回答质量 |
| 系统和工具 | Phoenix | Phoenix | LLM/RAG 可观测和评测工具。 | Trace、线上分析、评测 |
| 系统和工具 | LangSmith | LangSmith | LLM 应用实验、评测和 trace 平台。 | 数据集、实验、回归测试 |
| 系统和工具 | OpenTelemetry | OpenTelemetry | 通用可观测性标准。 | 采集 trace、日志、指标 |

## 文档接入/同步

### 目标

将企业内部不同来源的文档同步到知识库系统中。

常见来源：

| 来源 | 示例 |
|-|-|
| 协作文档 | 飞书文档、语雀、Notion |
| 企业 Wiki | Confluence、SharePoint |
| 文件系统 | 网盘、对象存储、本地目录 |
| 业务系统 | CRM、工单系统、ERP、OA |
| 代码仓库 | GitLab、GitHub、内部 Git |

### 技术实现

通过 Connector 服务定时或事件触发拉取文档。

```
Connector Service
  -> 调用外部系统 API
  -> 拉取文档内容和元数据
  -> 判断是否新增/更新/删除
  -> 写入原文存储和同步任务表
```

建议保存字段：

| 字段 | 说明 |
|-|-|
| doc_id | 文档唯一 ID |
| source_type | 来源类型 |
| source_url | 原始链接 |
| title | 文档标题 |
| updated_at | 外部系统更新时间 |
| sync_status | 同步状态 |
| content_hash | 内容哈希，用于判断是否变更 |

## 权限与元数据治理

### 目标

确保用户只能检索和查看自己有权限的知识，同时避免旧版本、过期文档被错误使用。

### 元数据设计

```json
{
  "doc_id": "HR_POLICY_2026_LEAVE",
  "title": "员工休假管理制度",
  "department": "HR",
  "version": "2026.03",
  "status": "active",
  "effective_date": "2026-03-01",
  "expire_date": null,
  "owner": "hr-ops",
  "acl": ["employee", "manager", "hr"],
  "sensitivity": "internal"
}
```

### 技术实现

权限过滤必须发生在检索阶段，而不是生成阶段。

```
用户身份
  -> 查询用户角色、部门、项目组
  -> 转换为 metadata filter
  -> 检索时只返回有权限的 chunk
```

示例过滤条件：

```json
{
  "acl": { "$contains": "employee" },
  "status": "active",
  "effective_date": { "$lte": "2026-06-01" }
}
```

## 结构化解析/清洗

### 目标

将 PDF、Word、HTML、Excel、Markdown 等文档解析成结构化文本，保留标题、章节、表格、页码等信息。

### 技术实现

```
原始文档
  -> 格式识别
  -> 文本抽取
  -> OCR 识别
  -> 表格解析
  -> 标题层级识别
  -> 页眉页脚清理
  -> 重复内容去除
  -> 输出结构化 Document AST
```

### 清洗策略

| 内容 | 处理方式 |
|-|-|
| 页眉页脚 | 删除 |
| 目录 | 可删除或降权 |
| 重复水印 | 删除 |
| 表格 | 转为 Markdown 表格或结构化 JSON |
| 图片 | OCR 或生成图片说明 |
| 扫描 PDF | 使用 OCR |
| 多版本文档 | 只保留 active 版本参与默认检索 |

## 上下文化切块

### 目标

将文档拆成适合检索和生成的 chunk，同时保留足够上下文。

### 切块原则

| 文档类型 | 切块策略 |
|-|-|
| 制度文档 | 按章节、条款切 |
| FAQ | 一问一答一个 chunk |
| 产品文档 | 按功能模块切 |
| 表格 | 按表头 + 行组切 |
| 技术文档 | 按标题层级和代码块切 |
| 长文档 | 使用 parent-child chunk |

### Parent-child Chunk

```
child chunk:
  用于检索，粒度较小，约 200-500 tokens

parent chunk:
  用于生成，粒度较大，约 800-2000 tokens
```

### Chunk 元数据

```json
{
  "chunk_id": "chunk_001",
  "doc_id": "HR_POLICY_2026_LEAVE",
  "section": "3.2 婚假",
  "page": 4,
  "text": "婚假申请需提前 5 个工作日提交...",
  "parent_chunk_id": "section_3",
  "token_count": 312
}
```

## 索引构建

### 目标

同时建立向量索引和关键词索引，支持混合检索。

```
chunk text
  -> embedding model
  -> vector
  -> 写入向量数据库
```

保存内容：

| 字段 | 说明 |
|-|-|
| chunk_id | 切片 ID |
| vector | 文本向量 |
| text | 切片文本 |
| metadata | 权限、版本、章节、页码等 |

### 关键词索引

将 chunk 文本写入 Elasticsearch / OpenSearch，用于 BM25 检索。

适合匹配：

| 类型 | 示例 |
|-|-|
| 制度名称 | 员工休假管理制度 |
| 产品型号 | X100-Pro |
| 错误码 | ERR_5021 |
| 人名/部门 | 财务共享中心 |
| 合同编号 | CN-2026-001 |

## 查询处理

### 目标

将用户问题转换成更适合检索的查询。

## 权限过滤

### 目标

防止用户检索到无权限内容。

### 技术实现

在向量检索和关键词检索时同时加 metadata filter。

```
检索请求 = query + user_acl_filter + version_filter + status_filter
```

禁止做法：

```
先检索所有文档，再让大模型不要泄露
```

正确做法：

```
检索阶段直接过滤无权限 chunk
```

## 混合检索

### 目标

同时利用语义检索和关键词检索，提高召回稳定性。

### 技术实现

```
query
  -> dense vector search top 50
  -> BM25 / sparse search top 50
  -> RRF 融合
  -> 输出候选 chunk
```

### 结果融合

可以使用 RRF：

```
score = 1 / (k + rank)
```

## Rerank 重排

### 目标

对初步召回结果重新排序，选出最能回答问题的 chunk。

```
候选 chunk top 50-100
  -> reranker(question, chunk)
  -> relevance score
  -> 排序
  -> 取 top 5-10
```

## 证据选择/上下文压缩

### 目标

从 Rerank 后的结果中选择真正支撑答案的证据，减少无关内容。

### 技术实现

```
rerank top 10
  -> 去重
  -> 合并同章节 chunk
  -> 删除低相关内容
  -> 控制总 token 长度
  -> 生成 evidence list
```

## 引用约束生成

### 目标

让大模型只基于证据回答，并输出引用来源。

### Prompt 约束

```
你是企业知识库助手。
只能根据提供的资料回答。
如果资料不足，请说明无法根据当前知识库确认。
不得使用资料之外的信息补充企业政策。
回答中必须标明引用来源。
```

## 拒答/安全校验

### 拒答条件

| 条件 | 处理方式 |
|-|-|
| 无相关检索结果 | 拒答 |
| Rerank 分数过低 | 拒答 |
| 资料相互冲突 | 提示冲突并要求人工确认 |
| 用户无权限 | 拒绝回答或提示无权限 |
| 涉及敏感信息 | 脱敏或拒答 |
| 无引用来源 | 不返回确定性答案 |

### 技术实现

```sql
if top_rerank_score < threshold:
    return "当前知识库中没有找到足够依据。"

if citations is empty:
    return "无法基于当前资料确认。"

if evidence contains restricted metadata:
    return "你没有权限查看相关内容。"
```

## 最终答案

最终返回给用户的内容应包含：

| 字段 | 说明 |
|-|-|
| answer | 答案正文 |
| citations | 引用来源 |
| confidence | 置信度 |
| follow_up | 可选追问 |
| trace_id | 链路追踪 ID |

## 离线评测

### 目标

在上线前或每次变更后，评估 RAG 系统质量。

### 评测集

每条样本包含：

| 字段 | 说明 |
|-|-|
| question | 用户问题 |
| ground_truth | 标准答案 |
| expected_doc_ids | 标准依据文档 |
| user_role | 用户角色 |
| question_type | 问题类型 |
| risk_level | 风险等级 |

### 指标

| 指标 | 说明 |
|-|-|
| Recall@K | 正确资料是否被召回 |
| Precision@K | 召回结果是否相关 |
| Faithfulness | 答案是否忠实于资料 |
| Answer Correctness | 答案是否正确 |
| Citation Accuracy | 引用是否准确 |
| Refusal Accuracy | 应拒答时是否拒答 |
| Permission Violation | 是否发生权限违规 |

### 上线门槛

Recall@5 >= 85%-90%

Faithfulness >= 90%

引用准确率 >= 90%

权限违规 = 0

高风险 P0 错误 = 0

## 线上观测

### 目标

记录真实请求链路，定位线上问题。

### Trace 内容

```
用户问题
查询改写结果
检索结果
Rerank 分数
最终证据
Prompt
模型回答
引用来源
安全校验结果
用户反馈
```

### 关键监控指标

| 指标 | 说明 |
|-|-|
| 平均响应时间 | 性能指标 |
| 检索耗时 | 检索服务性能 |
| LLM 耗时 | 模型调用性能 |
| 拒答率 | 资料覆盖情况 |
| 点踩率 | 用户满意度 |
| 无引用回答率 | 可信度风险 |
| 幻觉率 | 生成风险 |
| 权限违规数 | 安全风险 |

## 反馈回流

### 目标

将线上失败案例转化为知识库优化和评测样本。

### 回流来源

| 来源 | 说明 |
|-|-|
| 用户点踩 | 用户认为答案不好 |
| 人工纠错 | 业务专家修正答案 |
| 无答案问题 | 知识库缺失内容 |
| 低分 Trace | 自动评测低分请求 |
| 高风险问题 | 法务、财务、人事等敏感场景 |

### 处理方式

```
失败样本
  -> 标注错误原因
  -> 判断是文档问题、检索问题还是生成问题
  -> 修复知识库或检索策略
  -> 加入黄金评测集
  -> 下次版本回归测试
```

错误分类：

| 类型 | 说明 |
|-|-|
| 知识缺失 | 知识库没有相关内容 |
| 文档过期 | 召回了旧版本 |
| 切块错误 | 正确信息被切断 |
| 召回失败 | 正确 chunk 没被检索到 |
| 排序失败 | 正确 chunk 排名太低 |
| 生成错误 | 模型没有按证据回答 |
| 权限错误 | 返回了无权限内容 |
| 引用错误 | 引用不能支撑答案 |
