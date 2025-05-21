---
title: mcp-python-sdk说明
toc: true
tags: MCP AI
---


[https://github.com/modelcontextprotocol/python-sdk/tree/main](https://github.com/modelcontextprotocol/python-sdk/tree/main)



- fastmcp：高级封装
- lowlevel：底层实现，更灵活


## Server

Server提供了多个装饰器

### @server.list_tools()

列出所有可用的工具

```python
@server.list_tools()
async def my_tool() -> List[types.Tool]:
    return [types.Tool(name="get_top_issues", description="",inputSchema={
      "type": "object",
      "properties": {
        "project_id": {
          "type": "string",
          "description": "The project ID to get top issues for."
        },
        "limit": {
          "type": "number",
          "description": "The maximum number of issues to return."
          "minimum": 1,
          "maximum": 100
        },
        "required": ["project_id"]
      }
    })]
```

### @server.call_tool()

调用指定的工具

```python

@server.call_tool()
async def handle_call_tool(name: str, arguments: Dict | None) -> List[types.TextContent]:
    if not arguments:
        raise ValueError("Missing arguments")

    if name == "get_top_issues":
        project_id = arguments.get("project_id")
        if not project_id:
            raise ValueError("Missing project_id argument")
        limit = int(arguments.get("limit", 10))
        result = await handle_top_issues(http_client, auth_token, org_slug, project_id, limit)
        return result.to_tool_result()

    elif name == "analyze_issue":
        issue_url = arguments.get("issue_url")
        if not issue_url:
            raise ValueError("Missing issue_url argument")
        result = await handle_sentry_issue(http_client, auth_token, org_slug, issue_url)
        return result.to_tool_result()

    else:
        raise ValueError(f"Unknown tool: {name}")

```

### @server.list_resources()

列出所有可用的资源

### @server.list_resource_templates()

列出所有可用的资源模板

### @server.read_resource()

读取指定资源的内容

### @server.list_prompts()

列出所有可用的提示词

### @server.get_prompt()

获取指定提示词的内容
