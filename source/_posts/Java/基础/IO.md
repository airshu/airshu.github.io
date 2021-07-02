---
title: IO
date: 2021-05-29
toc: true
tags:
---

## 基于字节的IO操作

![](./1.jpg)

![](./2.jpg)



## 基于字符的IO操作


![](./3.jpg)

![](./4.jpg)


## 常用类


### 节点流

FileInputStream/FileOutputStream， FileReader/FileWriter

这四个类是专门操作文件流的，用法高度相似，区别在于前面两个是操作字节流， 后面两个是操作字符流。它们都会直接操作文件流，直接与 OS 底层交互。
因此他们也被称为`节点流`。


### 包装流

PrintStream/PrintWriter/Scanner

- PrintStream 可以封装(包装)直接与文件交互的节点流对象 OutputStream, 使 得编程人员可以忽略设备底层的差异，进行一致的 IO 操作。因此这种流也称为处理流或者包装流。
- PrintWriter 除了可以包装字节流 OutputStream 之外，还能包装字符流 Writer
- Scanner 可以包装键盘输入，方便地将键盘输入的内容转换成我们想要的数据类 型。


### 字符串流

StringReader/StringWriter

这两个操作的是专门操作 String 字符串的流，其中 StringReader 能从 String 中 方便地读取数据并保存到 char 数组，而 StringWriter 则将字符串类型的数据写 入到 StringBuffer 中(因为 String 不可写)。


### 转换流

InputStreamReader/OutputStreamReader

这两个类可以将字节流转换成字符流，被称为字节流与字符流之间的桥梁。我们 经常在读取键盘输入(System.in)或网络通信的时候，需要使用这两个类


### 缓冲流

BufferedReader/BufferedWriter ， BufferedInputStream/BufferedOutputStream


## 总结

- FileInputStream/FileOutputStream 需要逐个字节处理原始二进制流的时 候使用，效率低下
- FileReader/FileWriter 需要组个字符处理的时候使用
- StringReader/StringWriter 需要处理字符串的时候，可以将字符串保存为 字符数组
- PrintStream/PrintWriter 用来包装 FileOutputStream 对象，方便直接将 String 字符串写入文件
- Scanner 用来包装 System.in 流，很方便地将输入的 String 字符串转换 成需要的数据类型
- InputStreamReader/OutputStreamReader , 字节和字符的转换桥梁，在网 络通信或者处理键盘输入的时候用
- BufferedReader/BufferedWriter ， BufferedInputStream/BufferedOutputStream ， 缓冲流用来包装字节流后者 字符流，提升 IO 性能，
  BufferedReader 还可以方便地读取一行，简化编程。
