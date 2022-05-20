---
title: Mac M1使用问题记录
category: 工具软件
tags: 效率
toc: true
---





## Python命令使用不同CPU架构


> mach-o file, but is an incompatible architecture (have 'x86_64', need 'arm64e')

```
# 使用苹果架构
arch -arm64 python xxx.py

# 使用intel架构
arch -x86_64 python xxx.py
```

注意：有时候终端工具会设置开启罗赛塔，这个时候默认会使用intel架构的。