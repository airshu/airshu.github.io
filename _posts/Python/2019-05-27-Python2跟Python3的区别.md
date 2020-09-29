---
layout: post
title: Pyhon2跟Python3的区别
category: Python
tags: Python
keywords: Python
description: 
---


## str和bytes

### 基本概念

- **字节（Byte ）：**是计算机信息技术用于计量存储容量的一种计量单位，作为一个单位来处理的一个二进制数字串，是构成信息的一个小单位。最常用的字节是八位的字节，即它包含八位的二进制数;
- **位(bit)：**是计算机 内部数据 储存的最小单位，11001100是一个八位二进制数;
- **字节(byte)：**是计算机中 数据处理 的基本单位，习惯上用大写  B  来表示,1B(byte,字节)= 8bit(位); 
- **字符：**指计算机中使用的字母、数字、字和符号，包括：1、2、3、A、B、C、~！·#￥%……—*（）——+等等。
- **字符串：**字符串是字符序列，它是一种抽象的概念，不能直接存储在硬盘 – 字节串是给计算机看的 ，给计算机传输或者保存的， 在Python中，程序中的文本都用字符串表示。
- **字节串：**字节串是字节序列，它可以直接存储在硬盘， 字节串是给计算机看的 。它们之间的映射被称为编码/解码 – 字符串是给人看的，用来操作的。
- **字符集：**为每一个字符分配一个唯一的ID（码位/码点/Code Point）。Unicode是字符集。
- **编码规则：**将码位转换为字节序列的规则（编码/解码 可以理解为 加密/解密 的过程）。utf-8是编码规则。

```
1 KB = 1024 B(字节)；
1 MB = 1024 KB;  (2^10 B)
1 GB = 1024 MB;  (2^20 B)
1 TB = 1024 GB;  (2^30 B)
```

### Python2中的str和unicode

- str:表示由bytes序列的字符串。
- unicode:表示unicode码点序列的字符串。

```python
>>> a='你好'
>>> a
'\xe4\xbd\xa0\xe5\xa5\xbd'
>>> b=u'你好'
>>> b
u'\u4f60\u597d'
>>> print(a)
你好
>>> print(b)
你好
>>> a.__class__
<type 'str'>
>>> b.__class__
<type 'unicode'>
>>> len(a)
6
>>> len(b)
2
>>> a.decode('utf-8')
u'\u4f60\u597d'
>>> b.encode('utf-8')
'\xe4\xbd\xa0\xe5\xa5\xbd'
```

**总结：**

- string直接用引号来表示，unicode在引号前加一个u。
- 直接输入的string常量会用系统缺省编码方式来编码。
- len(string)返回string的字节数，len(unicode)返回的是字符数。
- encode和decode使得str和unicode之间进行相互转换。

### Python3中的str和byte

- **str：**str格式的定义变更为”Unicode类型的字符串“，也就是说在默认情况下，被引号框起来的字符串，是使用Unicode编码的。也就是说unicode类型在python3中没有了，python3中的str就相当于python2中的unicode。
- **bytes：**bytes 函数返回一个新的 bytes 对象，该对象是一个 0 <= x < 256 区间内的整数不可变序列。它是 bytearray 的不可变版本。bytes 只负责以字节序列的形式（二进制形式）来存储数据，至于这些数据到底表示什么内容（字符串、数字、图片、音频等），完全由程序的解析方式决定。如果采用合适的字符编码方式（字符集），字节串可以恢复成字符串；反之亦然，字符串也可以转换成字节串。
- **bytearray：**可变的子节数组。


```python
>>> a='你好'
>>> a
'你好'
>>> type(a)
<class 'str'>
>>> b = bytes(a, encoding='utf-8')
>>> b
b'\xe4\xbd\xa0\xe5\xa5\xbd'
>>> type(b)
<class 'bytes'>
>>> a.encode()
b'\xe4\xbd\xa0\xe5\xa5\xbd'
>>> b.decode()
'你好'
```



