---
title: struct模块
tags: Python
toc: true
---

struct模块主要二进制和结构体之间的互相转化。在业务场景中，socket数据的处理会使用到。纯文本是无法进行传输到，因为不同系统硬件的存储方式是不一样的。这个时候使用struct可以按照某种规则进行pack处理成二进制数据，另一端
接收到时按照约定进行unpack成相应数据。

### 常用API

|函数 | return|explain|
|----|------|-----|
|pack(fmt,v1,v2…) |   string | 按照给定的格式(fmt),把数据转换成字符串(字节流),并将该字符串返回.|
|pack_into(fmt,buffer,offset,v1,v2…)| None|    按照给定的格式(fmt),将数据转换成字符串(字节流),并将字节流写入以offset开始的buffer中.(buffer为可写的缓冲区,可用array模块)|
|unpack(fmt,v1,v2…..)   | tuple  | 按照给定的格式(fmt)解析字节流,并返回解析结果|
|pack_from(fmt,buffer,offset)   | tuple  | 按照给定的格式(fmt)解析以offset开始的缓冲区,并返回解析结果|
|calcsize(fmt)  | size of fmt |计算给定的格式(fmt)占用多少字节的内存，注意对齐方式|


### Hello World

    values = (1, b'abc', 2.5)
    s = struct.Struct('I3sf') # 声明每个值的类型，I表示整型、3s表示长度为3的字符串、f表示浮点型
    packed_data = s.pack(*values)  
    print(packed_data)
    unpacked_data = s.unpack(packed_data)
    print(type(unpacked_data), unpacked_data)


### 字节顺序，大小，对齐

默认情况下，C语言类型以机器的本地格式和字节顺序表示。

| Character（字符） | Byte order（字节顺序） | Size | Alignment       |
| -------------- | ------------------- | ---- | ------------ |
| @(默认)           | 本机                   | 本机 | 本机,凑够4字节  |
| =                 | 本机                   | 标准 | none,按原字节数 |
| <                 | 小端                   | 标准 | none,按原字节数 |
| >                 | 大端                   | 标准 | none,按原字节数 |
| !                 | network(大端)          | 标准 | none,按原字节数 |

### 格式字符


| 文件格式 | C 类型             | Python数据类型    | Standard size | 注释     |
| -------- | ------------------ | ----------------- | ------------- | -------- |
| x        | pad byte           | no value          |
| c        | char               | bytes of length 1 | 1             |
| b        | signed char        | integer           | 1             | (1),(3)  |
| B        | unsigned char      | integer           | 1             | (3)      |
| ?        | _Bool              | bool              | 1             | (1)      |
| h        | short              | integer           | 2             | (3)      |
| H        | unsigned short     | integer           | 2             | (3)      |
| i        | int                | integer           | 4             | (3)      |
| I        | unsigned int       | integer           | 4             | (3)      |
| l        | long               | integer           | 4             | (3)      |
| L        | unsigned long      | integer           | 4             | (3)      |
| q        | long long          | integer           | 8             | (2), (3) |
| Q        | unsigned long long | integer           | 8             | (2), (3) |
| n        | ssize_t            | integer           |               | (4)      |
| N        | size_t             | integer           |               | (4)      |
| e        | (7)                | float             | 2             | (5)      |
| f        | float              | float             | 4             | (5)      |
| d        | double             | float             | 8             | (5)      |
| s        | char[]             | bytes             |               |
| p        | char[]             | bytes             |               |
| P        | void *             | integer           |               | (6)      |




### 实例：


```Python


```


**参考**
- [https://docs.python.org/zh-cn/3.7/library/struct.html](https://docs.python.org/zh-cn/3.7/library/struct.html)
- [https://docs.python.org/3/library/struct.html](https://docs.python.org/3/library/struct.html)


