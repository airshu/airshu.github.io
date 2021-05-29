---
title: json解析库选择和使用
tags: Python 
---

## 比较

- simplejson：django的内置模块，如果没有C扩展加速，效率极其低下。
- rapidjson：
- ujson：使用C语言实现
- orjson：使用Rust语言实现

**测试代码**

```Python
from time import time
import sys
import string
 
num = int(sys.argv[1])
lib = sys.argv[2]
 
items = []
for i in range(num):
    items.append({c:c for c in string.ascii_letters})
 
start = time()
if lib == 'ujson':
    import ujson
    ujson.dumps(items)
elif lib == 'rapidjson':
    import rapidjson
    rapidjson.dumps(items)
elif lib == 'orjson':
	import orjson
	orjson.dumps(items)
else:
    import json
    json.dumps(items)
 
print(time() - start)

>>python 1000|10000|100000|1000000 json|ujson|rapidjson|orjson
```


## orjson

[github地址](https://github.com/ijl/orjson)

### 安装

1. 首先安装rust，从rust官网下载rustup-init.exe安装程序。选择安装nightly类型。[参考](https://stackoverflow.com/questions/62207959/how-do-i-setup-rust-toolchain-for-orjson-python-library-build-in-an-alpine-docke)。

2. 安装orjson，pip install orjson


**注意**

orjson is tested for amd64 and aarch64 on Linux, macOS, and Windows. It may not work on **32-bit** targets.


## ujson

### 安装

需要依赖C&C++编译环境，参考[https://github.com/statsmodels/statsmodels/issues/4160](https://github.com/statsmodels/statsmodels/issues/4160)


## 参考

- [https://yanbin.blog/python-json-choose-ujson-if-necessary/](https://yanbin.blog/python-json-choose-ujson-if-necessary/)



