---
title: MMKV
tags: Android
toc: true
---

## 概述

MMKV 是基于 `mmap` 内存映射的 key-value 组件，底层序列化/反序列化使用 protobuf 实现，性能高，稳定性强。

MMKV 本质上是将文件 mmap 到内存块中，将新增的 key-value 统统 append 到内存中；到达边界后，进行重整回写以腾出空间，空间还是不够的话，就 double 内存空间；对于内存文件中可能存在的重复键值，MMKV 只选用最后写入的作为有效键值。

MMKV支持多进程。如果要自己实现的话，一般能想到的是基于ContentProvider。但这种方式启动慢、访问也慢。


## 使用

```java

// 初始化
String rootDir = MMKV.initialize(this);
System.out.println("mmkv root: " + rootDir);

// 提供默认的全局实例
MMKV kv = MMKV.defaultMMKV();

kv.encode("bool", true);
System.out.println("bool: " + kv.decodeBool("bool"));

kv.encode("int", Integer.MIN_VALUE);
System.out.println("int: " + kv.decodeInt("int"));

kv.encode("long", Long.MAX_VALUE);
System.out.println("long: " + kv.decodeLong("long"));

kv.encode("float", -3.14f);
System.out.println("float: " + kv.decodeFloat("float"));

kv.encode("double", Double.MIN_VALUE);
System.out.println("double: " + kv.decodeDouble("double"));

kv.encode("string", "Hello from mmkv");
System.out.println("string: " + kv.decodeString("string"));

byte[] bytes = {'m', 'm', 'k', 'v'};
kv.encode("bytes", bytes);
System.out.println("bytes: " + new String(kv.decodeBytes("bytes")));

// 删除和查询
kv.removeValueForKey("bool");
System.out.println("bool: " + kv.decodeBool("bool"));
    
kv.removeValuesForKeys(new String[]{"int", "long"});
System.out.println("allKeys: " + Arrays.toString(kv.allKeys()));

boolean hasBool = kv.containsKey("bool");

// 如果不同业务需要区别存储，也可以单独创建自己的实例
MMKV kv = MMKV.mmkvWithID("MyID");
kv.encode("bool", true);


// 如果业务需要多进程访问，那么在初始化的时候加上标志位 MMKV.MULTI_PROCESS_MODE
MMKV kv = MMKV.mmkvWithID("InterProcessKV", MMKV.MULTI_PROCESS_MODE);
kv.encode("bool", true);

```

## 参考
- [https://github.com/Tencent/MMKV](https://github.com/Tencent/MMKV)


