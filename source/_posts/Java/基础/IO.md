---
title: IO
date: 2021-05-29
toc: true
tags:
---



- BIO：BlockIO，同步阻塞IO。发起请求 –>一直阻塞–>处理完成
- NIO：New IO Non-Block IO，同步非阻塞IO。 Selector主动轮询channel–>处理请求–>处理完成
- AIO：异步非阻塞IO。发起请求–> 通知回调

NIO主要有三大核心部分:Channel(通道)，Buffer(缓冲区), Selector。
传统IO基于字节流和字符流进行操作，而NIO基于Channel和Buffer(缓冲区)进行操作，数据总是从通道读取到缓冲区中，或者从缓冲区写入到通道中。
Selector(选择区)用于监听多个通道的事件(比如:连接打开，数据到 达)。因此，单个线程可以监听多个数据通道。

NIO和传统IO(一下简称IO)之间第一个最大的区别是，IO是面向流的，NIO是面向缓冲区的。 Java IO面向流意味着每次从流中读一个或多个字节，直至读取所有字节，
它们没有被缓存在任何 地方。此外，它不能前后移动流中的数据。如果需要前后移动从流中读取的数据，需要先将它缓 存到一个缓冲区。NIO的缓冲导向方法略有不同。
数据读取到一个它稍后处理的缓冲区，需要时 可在缓冲区中前后移动。这就增加了处理过程中的灵活性。但是，还需要检查是否该缓冲区中包 含所有您需要处理的数据。
而且，需确保当更多的数据读入缓冲区时，不要覆盖缓冲区里尚未处 理的数据。

IO的各种流是阻塞的。这意味着，当一个线程调用read() 或 write()时，该线程被阻塞，直到有一 些数据被读取，或数据完全写入。该线程在此期间不能再干任何事情了。
NIO的非阻塞模式，使 一个线程从某通道发送请求读取数据，但是它仅能得到目前可用的数据，如果目前没有数据可用 时，就什么都不会获取。而不是保持线程阻塞，
所以直至数据变得可以读取之前，该线程可以继 续做其他的事情。 非阻塞写也是如此。一个线程请求写入一些数据到某通道，但不需要等待它完 全写入，
这个线程同时可以去做别的事情。 线程通常将非阻塞IO的空闲时间用于在其它通道上执 行IO操作，所以一个单独的线程现在可以管理多个输入和输出通道(channel)。





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
