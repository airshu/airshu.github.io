---
title: openai文档学习
toc: true
tags: openai AI
---

## 调用模型时，一个最小可运行请求通常至少包含哪几个核心要素？

身份认证：有效的 API Key（放在 Authorization 头里）。
模型标识：要调用的模型名（例如某个 GPT 模型）。
输入内容：给模型的文本输入（常见是 messages 或 input）。
输出内容：模型生成的文本输出（通常在 response 的 choices 字段里）。

## model、input、temperature、max_output_tokens、instructions、tools、 response_format、stream 分别控制什么？


## 什么是工具调用？它和“模型自己直接回答”有什么区别？


## 什么是 prompt injection？为什么 Agent 场景更危险？

## 如果你要做一个企业内部 Agent，最担心的安全风险有哪些？

