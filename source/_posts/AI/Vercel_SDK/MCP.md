---
title: MCP
tags: Vercel AI SDK
toc: true
---


# Vercel AI SDK 的 MCP 支持

本文整理 Vercel AI SDK 对 Model Context Protocol（MCP）的支持能力，基于项目实际使用的 ai@7.0.77 + @ai-sdk/mcp@2.0.57 核实（类型定义与官方文档双重确认）。AI SDK 的 MCP 客户端能力已从主包 `ai` 迁出到独立包 `@ai-sdk/mcp`，安装：`pnpm add @ai-sdk/mcp`。npm dist-tags 对应关系：latest（v2.x）配 ai v7；ai-v6 标签对应 1.0.x；ai-v5 标签对应 0.0.x。

> 💡 **核心心智模型**：AI SDK 不内置 MCP 服务器管理，只提供一个**轻量 MCP 客户端**，负责「连接 server → 发现工具 → 转成 AI SDK 的 tool 对象 → 合入 streamText/generateText 的 tools 参数」。会话管理、token 存储、工具审批策略、缓存与生命周期都由应用层自己负责。

## 1. 客户端创建与 Transport

### 1.1 createMCPClient

```typescript
import { createMCPClient } from '@ai-sdk/mcp';

const mcpClient = await createMCPClient({
  transport: {
    type: 'http',                          // 'http' | 'sse'
    url: 'https://your-server.com/mcp',
    headers: { Authorization: 'Bearer my-api-key' },  // 可选：静态 header 认证
    authProvider: myOAuthClientProvider,   // 可选：OAuth 自动授权
    redirect: 'error',                     // 默认 'error'，拒绝重定向防 SSRF
  },
  maxRetries: 0,                           // tools/call 瞬时失败重试，默认关闭
  capabilities: { elicitation: {} },       // 可选：声明支持 elicitation
  clientName: 'ai-sdk-mcp-client',         // 默认值
});
```

transport 有四种形态：`http`（Streamable HTTP，生产推荐）、`sse`（旧版 HTTP 长连接）、`stdio`（仅本地开发，从 `@ai-sdk/mcp/mcp-stdio` 导入 `Experimental_StdioMCPTransport` 或用 MCP 官方 SDK 的 `StdioClientTransport`）、自定义（实现 `MCPTransport` 接口的 start/send/close/onmessage 等方法）。也可以直接传 MCP 官方 SDK 的 transport 实例（如 `StreamableHTTPClientTransport`）。

协议版本上，v2 同时支持旧版 initialize 握手协议和无状态的 MCP `2026-07-28`；stdio transport 会先用 `server/discover` 探测，失败自动回退旧握手。

### 1.2 Streamable HTTP 会话重连

旧版协议的 Streamable HTTP server 会维护会话。v2 支持把会话持久化后重连：保存 `sessionId` 和 `mcpClient.initializeResult`，重建客户端时传 `initialSessionId` + `initialInitializeResult`（复用缓存的 initialize 元数据，不再发 initialize 请求），并用 `onSessionIdChange` / `onSessionExpired` 回调维护会话生命周期；`terminateSessionOnClose: false` 用于只关本地客户端、保留服务端会话供下次重连。会话过期后需去掉这些参数重建客户端重试。MCP `2026-07-28` 是无状态协议，不使用这些选项。

### 1.3 重试与关闭

`maxRetries`（默认 0，opt-in）只针对 `tools/call` 的瞬时 HTTP/网络失败；JSON-RPC 应用错误（如参数不合法）和 `isError: true` 的工具结果会立即返回不重试。**非幂等工具（发邮件、建记录）不要开重试**，可能重复副作用。

客户端关闭时机跟使用模式走：短生命周期（单次请求）在响应结束后 close——streamText 用 `onEnd` 回调，非流式用 try/finally；长驻客户端在应用退出时 close。这个客户端是轻量版，不支持自动会话持久化、可恢复流、接收 server 通知等完整客户端特性。

## 2. 工具发现与调用

### 2.1 tools()：MCP 工具 → AI SDK 工具的适配器

`mcpClient.tools()` 返回 `Record<toolName, Tool>`，可直接传给 streamText/generateText。两种模式：

| 模式 | 用法 | 特点 |
|-|-|-|
| Schema 发现（默认） | `await mcpClient.tools()` | 自动列出 server 全部工具，输入类型从 server 下发的 JSON Schema 推断；无 TS 类型安全，但与 server 自动同步 |
| 显式 Schema | `await mcpClient.tools({ schemas: { 'get-data': { inputSchema: z.object({...}) } } })` | 只拉显式声明的工具，全量 TS 类型安全；无参数工具用 `z.object({})` |

`schemas` 里每项还可加 `outputSchema` 获得类型化输出：server 按 MCP 规范返回 `structuredContent` 时，客户端提取并按 schema 校验，拿到类型安全的 result；没有 structuredContent 时回退解析文本内容里的 JSON；都没有则抛错。不传 outputSchema 时，工具返回原始 `CallToolResult`（含 `content`、可选 `isError` 字段）。

server 下发的工具注解（`readOnlyHint` / `destructiveHint` / `idempotentHint` / `openWorldHint`）暴露在 `tool.metadata.annotations` 和 `toolCall.toolMetadata.annotations` 上。**注解是不可信的服务端提示**，SDK 不会自动转成审批策略；官方建议配合 `toolApproval` 使用，例如仅 `readOnlyHint === true` 的工具自动执行、其余要求用户批准。

### 2.2 listTools / toolsFromDefinitions / callTool

除了 tools() 一站式转换，还有三个底层方法：`listTools()` 只列出工具定义（含分页）不转换；`toolsFromDefinitions(definitions)` 把已有定义转成 AI SDK 工具而不再发一次 listTools（MCP Apps 场景下先 `splitMCPAppTools` 过滤再转换的标准用法）；`callTool({ name, arguments })` 直接调用工具（MCP Apps iframe 代理等 host 主导的调用场景）。另外客户端暴露 `serverInfo`（server 名称/版本）和可选 `instructions`（server 在 initialize 握手时下发的使用说明，适合拼进系统提示词）。

### 2.3 工具定义漂移检测（防 rug pull）

MCP server 首次连接时下发工具定义（名称/描述/schema），协议不阻止它之后对同名工具下发**不同**的定义——描述夹带注入指令、schema 悄悄加字段，这就是 "rug pull" 攻击面。SDK 提供一对函数：

```typescript
import { fingerprintTools, detectToolDrift } from 'ai';

// 信任时刻（首次连接、人工 review 后）：固化基线
const baseline = await fingerprintTools(await mcpClient.tools());

// 之后每次拉取，交给模型前先比对
const tools = await mcpClient.tools();
const drift = detectToolDrift(await fingerprintTools(tools), baseline);
if (drift.changed.length || drift.added.length) {
  // 被钉住的定义变了或新增了工具：按策略阻断 / 重新审批 / 告警
}
```

`fingerprintTools` 对 server 可控的安全相关字段（description 字符串、resolved input schema、title）做稳定摘要，返回 `Record<name, digest>`；`detectToolDrift` 返回 `{ added, removed, changed }`。基线存储和处置动作由应用负责。局限：无法检测 name/description/schema 均未变的远程行为替换——工具在 server 端执行，客户端不可见。

## 3. Resources / Prompts / Completions

按 MCP 规范，Resources 是**应用驱动**的上下文数据源（应用决定何时取、传给模型），与模型驱动的 tools 相对。客户端提供 `listResources()`、`readResource({ uri })`、`listResourceTemplates()` 三个方法。

Prompts 是用户可控的模板（仍是实验性 API）：`experimental_listPrompts()`、`experimental_getPrompt({ name, arguments })`。

Completions 用于 prompt 参数和资源模板变量的自动补全建议：`mcpClient.complete({ ref, argument, context? })`；server 未声明 `capabilities.completions` 时抛 `MCPClientError`。

## 4. Elicitation（工具执行中向用户要输入）

Elicitation 是 server 在工具执行过程中请求客户端补信息的机制（例如补一个表单字段、确认敏感操作）。两步启用：

```typescript
const mcpClient = await createMCPClient({
  transport: { type: 'http', url: 'https://...' },
  capabilities: { elicitation: {} },   // 1. 创建时声明
});

import { ElicitationRequestSchema } from '@ai-sdk/mcp';

mcpClient.onElicitationRequest(ElicitationRequestSchema, async request => {
  // request.params.message：需要什么输入
  // request.params.requestedSchema：输入结构的 JSON Schema
  const userInput = await getInputFromUser(
    request.params.message,
    request.params.requestedSchema,
  );
  return { action: 'accept', content: userInput };
  // action: 'accept'（必须带 content）| 'decline' | 'cancel'
});
```

注意：如何向用户收集输入完全由应用决定，SDK 只负责把请求从 server 带到应用代码。

## 5. OAuth 授权

### 5.1 总体机制

HTTP/SSE transport 通过 `authProvider` 支持 OAuth 自动授权。SDK 内置了 MCP 规范要求的完整流程：受保护资源元数据发现（`/.well-known/oauth-protected-resource`）→ 授权服务器元数据发现（RFC 8414）→ 动态客户端注册（RFC 7591）→ PKCE 授权码流程 + token 刷新。应用只需实现 `OAuthClientProvider` 接口，把 token 存取接管过来。

### 5.2 OAuthClientProvider 接口（@ai-sdk/mcp@2.0.57 d.ts 核实）

| 成员 | 类型 | 说明 |
|-|-|-|
| `tokens()` | 返回 OAuthTokens \| undefined | 当前访问令牌 |
| `saveTokens(tokens)` | void \| Promise | 保存 token（含 refresh_token / expires_in） |
| `redirectUrl` | getter，string \| URL | OAuth 回调地址 |
| `clientMetadata` | getter，OAuthClientMetadata | 注册元数据（redirect_uris、grant_types 等）；可覆盖自动推断的 application_type：loopback/localhost/自定义 scheme → native，远程 HTTPS → web |
| `clientInformation()` | 返回信息 \| undefined | 动态注册得到的 client_id 等 |
| `saveClientInformation?(info)` | void \| Promise | 持久化注册结果 |
| `isClientInformationDynamicallyRegistered?()` | boolean | 仅当 client 信息来自动态注册时返回 true；省略/false 时视为预注册，遇 invalid_client/unauthorized_client 不自动作废凭证 |
| `redirectToAuthorization(url)` | void \| Promise | 把用户带到授权页——浏览器环境做跳转；**服务端语境改为抛错/返回 needsAuthorization 信号** |
| `state?() / saveState? / storedState?` | string 相关 | CSRF state 的生成与存取 |
| `saveCodeVerifier(v) / codeVerifier()` | void / string | PKCE code_verifier 存取 |
| `invalidateCredentials?(scope)` | void \| Promise | 'all' \| 'client' \| 'tokens' \| 'verifier'；server 指示凭证失效时清对应 credential，免得用户手动干预 |
| `validateAuthorizationServerURL?(serverUrl, authServerUrl)` | void \| Promise | **安全钩子**：MCP server 可以广告任意授权服务器，接入不受控 server 时实现此方法做 origin 白名单校验，拒绝的 URL 不会发起请求 |
| `validateResourceURL?(serverUrl, resource?)` | Promise<URL \| undefined> | 校验 resource indicator |
| `authorizationServerInformation?() / saveAuthorizationServerInformation?()` | 存取 | 缓存认证服务器发现结果（issuer、tokenEndpoint 等） |
| `addClientAuthentication?(headers, params, url, metadata?)` | void \| Promise | 可选：自定义 token 请求的客户端认证方式（默认逻辑之外，如 JWT bearer / 自定义 header） |

### 5.3 auth() 辅助函数（处理授权回调）

```typescript
import { auth } from '@ai-sdk/mcp';

const callbackUrl = new URL(request.url);

const result = await auth(myOAuthClientProvider, {
  serverUrl: 'https://mcp.example.com',
  authorizationCode: callbackUrl.searchParams.get('code')!,
  callbackState: callbackUrl.searchParams.get('state') ?? undefined,
  callbackIssuer: callbackUrl.searchParams.get('iss') ?? undefined,
});
// result: 'AUTHORIZED' | 'REDIRECT'（REDIRECT = 需要先走浏览器授权）
```

`auth()` 内部完成发现/注册/token 交换整条链路，返回 `'AUTHORIZED'` 或 `'REDIRECT'`（此时需要拿 `redirectToAuthorization` 的 URL 引导用户授权，授权后带 code 回调重入）。安全细节：回调的 `iss` 参数若存在，必须与发现的授权服务器 issuer 完全一致，否则不交换授权码。

### 5.4 工具执行 401 的处理路径

建连接时 transport 遇 401 会自动走 authProvider 的授权流程（无有效 token 则触发 redirectToAuthorization）；token 过期时 SDK 自动用 refresh_token 刷新。应用层需处理的是：刷新也失败（refresh_token 吊销）时的重新授权引导——抛 `UnauthorizedError` 或在工具结果里返回结构化信号。

## 6. MCP Apps（工具的交互式 UI）

MCP Apps 给 MCP 工具扩展了交互式 UI：工具可以指向 `ui://` 资源（`text/html;profile=mcp-app` MIME），宿主应用在**沙箱 iframe** 里渲染。模型仍调用普通工具，但用户看到的是 server 定制的 UI。

Host 侧标准流程：带 `mcpAppClientCapabilities` 建连 → `listTools()` 后用 `splitMCPAppTools()` 把工具拆成 model-visible / app-visible 两组 → **只有 modelVisible 传给 streamText**（app-only 工具绝不让模型看到）→ 工具调用带 app 元数据时用 `readMCPAppResource()` 读 `ui://` 资源 → 沙箱 iframe 渲染 HTML → iframe 发起的 JSON-RPC 请求（如 app-visible tools/call）经 host 校验后代理回 MCP server。

| @ai-sdk/mcp 导出 | 作用 |
|-|-|
| `mcpAppClientCapabilities` | 创建客户端时广告宿主支持渲染 mcp-app HTML |
| `splitMCPAppTools(definitions)` | 按 `_meta.ui.visibility` 拆 model-visible / app-visible |
| `readMCPAppResource({ client, uri })` | 读 ui:// 资源，校验 URI/MIME，返回 { html, meta: CSP/permissions/prefersBorder } |
| `MCP_APP_MIME_TYPE` | 'text/html;profile=mcp-app' |

React 宿主用 `@ai-sdk/react` 的 `experimental_MCPAppRenderer` 渲染（实验性），传入 loadResource、handlers（callTool/openLink 桥接）、sandbox 配置。安全红线：MCP App 的 HTML 是不可信内容，必须沙箱 iframe（最好独立 origin 的 sandbox 代理路由）；每个 iframe 请求都要在 server 侧校验后才转发。

## 7. OpenAI Responses API 的替代路径

若 provider 是 OpenAI Responses API，还可以用内置 `openai.tools.mcp` 工具类型，由 OpenAI 服务端直连 MCP server，无需本地转换工具。适合不想维护客户端连接的场景，但工具执行发生在 OpenAI 侧（数据、审批、鉴权都由其托管），与自建客户端的取舍需按数据边界评估。

## 8. 错误类型

客户端抛 `MCPClientError` 的场景：初始化失败、协议版本不匹配、server 能力缺失、连接失败；工具执行错误包装为 `CallToolError`；未覆盖的未知错误走 `onUncaughtError` 回调；授权失效抛 `UnauthorizedError`。

## 9. 与本项目的关联

Crafter 计划支持用户级 MCP server 配置（方案见 docs 目录）。基于以上能力映射：

- 连接层用 `createMCPClient` + http/sse transport，静态 header 认证走 `headers`，OAuth 走 `authProvider`（DbBackedOAuthProvider 实现 token 加密存取 + redirectToAuthorization 抛 needsAuthorization 信号）
- 工具发现用 `mcpClient.tools()`（schema discovery 模式），返回的 JSON Schema 可经主包 `jsonSchema()` 包裹为 AI SDK schema
- 审批：MCP 工具的注解不可信，默认要求人工审批（readOnlyHint 也不豁免），经 `toolApproval` 策略组合
- 防 rug pull：`fingerprintTools` 基线存入 tools_cache，每次拉取后 `detectToolDrift` 比对，变更即告警/重新审批
- 生命周期：连接缓存由应用层 registry 管理（懒连接 + 空闲驱逐 + 失败退避），AI SDK 不管

## 10. 参考链接

- [MCP Tools 指南](https://ai-sdk.dev/docs/ai-sdk-core/mcp-tools)
- [createMCPClient API 参考](https://ai-sdk.dev/docs/reference/ai-sdk-core/create-mcp-client)
- [MCP Apps 指南](https://ai-sdk.dev/docs/ai-sdk-core/mcp-apps)
- [Experimental_StdioMCPTransport](https://ai-sdk.dev/docs/reference/ai-sdk-core/mcp-stdio-transport)
- [官方示例（mcp-tools / mcp-elicitation / mcp-apps）](https://github.com/vercel/ai/tree/main/examples)
- [Rug pull 攻击原始披露](https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks)