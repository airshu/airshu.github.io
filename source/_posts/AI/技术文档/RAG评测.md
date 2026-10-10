---
title: RAG评测
toc: true
tags: AI, RAG, 评测
---

# 一、总览：三层指标

```
用户问题
  ↓
检索层：有没有找对知识
  ↓
生成层：有没有基于知识回答
  ↓
业务层：答案能不能用、是否合规
```

对应指标：

| 层级 | 典型指标 |
|-|-|
| 检索层 | Recall@K、Precision@K、Hit Rate、MRR、NDCG、Context Precision、Context Recall |
| 生成层 | Faithfulness、Answer Relevancy、Answer Accuracy、Groundedness |
| 业务层 | 正确性、完整性、引用准确性、拒答能力、权限合规、可执行性 |

评测的主线是六个环节：**A. 构建评测集 → B. 检索评测 → C. 生成评测 → D. 安全与权限评测 → E. 人工复核 → F. 持续回归与线上监控**。

RAG 评估核心内容就是两块：**检索**和**生成**。衡量的是 RAG 系统在实际应用中的性能表现。

# 二、构建评测集

每条样本至少包含：

```
问题
标准答案
应命中的文档/段落
可接受答案要点
是否允许回答
用户角色/权限
业务标签
难度
问题类型
```

问题类型要覆盖：

- 单文档事实问答
- 多文档综合问答
- 条件判断
- 表格/制度条款问答
- 新旧版本对比
- 无答案问题
- 权限敏感问题
- 模糊表达问题
- 高风险业务问题

# 三、评测指标详解

## 检索层指标

| 指标 | 说明 |
|-|-|
| 召回@k `Recall@k` | 在所有相关文档中，有多少个文档被检索到排名前 k 之列？ |
| 命中率 `Hit@k` | 前 k 个结果中是否至少出现过一个相关条目？（是/否） |
| `NDCG@k` | Normalized Discounted Cumulative Gain，归一化折扣累计收益：用来衡量排名前 k 个检索结果的相关性和排序合理性 |
| `MRR` | Mean Reciprocal Rank，平均倒数排名。看第一个正确结果排在第几位。 |
| `Precision@k` | 前 k 条检索结果中，有多少比例是真正相关的。`Precision@k = Top k 中相关结果数量 / k` |
| retrieved_contexts | 检索器返回给 LLM 的上下文片段 |
| retrieval_scores | 每个检索片段的相关性分数，通常来自向量相似度、BM25、reranker 或混合检索。分数越高，表示系统认为这个片段越相关。注意不同检索算法的分数范围不一定可直接比较。 |

## 生成层指标

| 指标 | 说明 |
|-|-|
| `Faithfulness` | 忠实度，也叫 groundedness。衡量回答是否被检索到的上下文支持。 |
| `cosine_similarity` | 余弦相似度，用来衡量两个向量方向是否接近。常用于比较"LLM 实际回答"和"期望答案"的语义相似度，或比较"问题"和"知识片段"的向量相关性。范围通常是 `-1 ~ 1`，在 embedding 场景里更常见是 `0 ~ 1`：越接近 `1` 语义越相似；越接近 `0` 关联较弱；小于 `0` 方向相反，实际较少见。 |

# 四、检索评测

> 核心问题：正确依据有没有被检索出来？

建议指标：

- Recall@5 / Recall@10：<80%，优先优化切片、embedding、rerank、query rewrite
- Precision@K
- Hit Rate
- MRR
- NDCG
- Context Recall
- Context Precision

## 评测流程：先看是否真的走了 RAG

1. **是否真的走了 RAG**

   - tool_called/工具调用率：有没有调用知识库
   - 空召回率：工具调用了，但 retrieved_contexts 为空的比例
   - 错误率/超时率：网络失败、SSE error、工具 error、脚本 timeout
   - 耗时：建议看 p50 / p90 / p95，不要只看平均值

2. **检索质量**

   如果你有"标准答案对应的正确文档/正确 chunk/source_url"，核心看：

   - `Hit@k`：Top-k 里是否命中正确来源。最直观。
   - `Recall@k`：应该召回的相关资料，有多少被召回。
   - `MRR`：正确资料排得越靠前越好。
   - `NDCG@k`：如果相关性有等级，比如强相关/弱相关，NDCG 比 Hit@k 更合理。
   - `Precision@k`：Top-k 里有多少是真相关。它有用，但 RAG 场景里通常不如 Recall@k 和 Hit@k 优先，因为只要关键证据被召回，LLM 仍可能回答对。

   如果没有人工标注的正确文档，那就先记录：

   - retrieved_contexts
   - retrieval_scores
   - source_urls
   - Top-k score 分布
   - source 是否覆盖预期知识空间

   但这类只能做分析，不能严格算 Recall@k / NDCG@k。

检索阶段的评估有三种取值方式：**有真值**（有人工标注时用上面第 2 步的指标）、**人工标注**（抽检线上真实请求补标注）、**LLM 评估**（用 LLM-as-Judge 判断召回片段与问题的相关性，成本介于两者之间）。

# 五、生成评测

> 核心问题：模型有没有忠实地基于检索内容回答？

建议指标：

- Faithfulness / Groundedness：答案是否被上下文支持
- Answer Relevancy：有没有回答用户真正的问题
- Answer Correctness：是否符合标准答案
- Citation Accuracy：引用是否真的支撑答案
- Completeness
- Refusal Accuracy：知识库没有依据时是否拒答

## 评测流程：回答质量

最终还是要看答案：

- answer_correctness：答案是否正确，最好人工或 LLM-as-judge 打分。
- faithfulness / groundedness：答案是否被召回内容支持，是否幻觉。
- answer_relevancy：是否回答了用户问题。
- cosine_similarity：可以保留，但只能作为粗略语义相似度，不建议当唯一核心指标。它可能把"语义接近但事实错误"的答案打高分。

## 两种评估方式

- **基于参考的评估**：将 RAG 系统的输出与预定义的参考答案进行比较，这就需要构建标注好的数据集，适用于开发或测试环境。
- **无参考评估**：当没有参考答案时，仍然可以使用指标来评估质量，比如模型回答结构、语气、长度、完整性、是否包含必要的免责声明等特定属性。这类方法适用于灰度阶段和生产环境。

# 六、安全与权限评测

| 项目 | 评测问题 |
|-|-|
| 权限隔离 | 普通员工能否看到管理层/财务/客户隐私内容 |
| 版本正确性 | 是否引用了最新制度，而不是旧版本 |
| 引用可追溯 | 答案是否能定位到文档、章节、段落 |
| 拒答边界 | 知识库没有内容时是否编造 |
| 敏感信息 | 是否泄露薪酬、客户、合同、个人信息 |
| 口径一致性 | 是否符合公司正式表述 |
| 可执行性 | 用户能否按答案完成流程 |

# 七、评测工具

- Ragas：离线批量 RAG 指标
- TruLens：RAG Triad 定位问题
- Phoenix：Tracing + 生产观测
- LangSmith：数据集、实验和回归

# 八、人工复核与持续回归

人工复核（E）和持续回归与线上监控（F）贯穿全流程：评测集要随真实用户查询持续补充，每次改模型、prompt、索引、切片策略后都要复跑评测防止效果退化，线上则通过 trace 和监控指标（拒答率、点踩率、无引用回答率、幻觉率、权限违规数）持续归因。

# 参考

- https://huggingface.co/learn/cookbook/zh-CN/rag_evaluation
- [打破文本边界：如何进行多模态RAG评测](https://evalscope.readthedocs.io/zh-cn/latest/blog/RAG/multimodal_RAG.html)
