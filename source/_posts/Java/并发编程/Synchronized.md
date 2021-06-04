---
title: Synchronized 
tags: Java 
---



## 前言

在学习synchronized之前，应该先了解多线程的机制和锁的概念，请先阅读以下文章：

- [Java锁](/Java/2021/05/21/Java锁.html)
- [Java多线程]()


## **使用方式**

- 同步普通方法，锁的是当前对象this。
    ```
  public class SynchronizedTest {
    public synchronized void sayHello(){

    }
  }
  
  //对应字节码
    Compiled from "SynchronizedTest.java"
    public class com.myth.SynchronizedTest {
    public com.myth.SynchronizedTest();
    Code:
    0: aload_0
    1: invokespecial #1                  // Method java/lang/Object."<init>":()V
    4: return
    
    public synchronized void sayHello();
    Code:
    0: return
    }

    ```
- 同步静态方法，锁的是当前 Class 对象。
    ```
  public class SynchronizedTest {
    public synchronized static void sayHello(){

    }
  }
  
  //对应字节码
  public class com.myth.SynchronizedTest {
  public com.myth.SynchronizedTest();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static synchronized void sayHello();
    Code:
       0: return
  }

    ```
- 同步块，锁的是 () 中的对象。
    ```
  public class SynchronizedTest {
    private String words;
    public void sayHello(){
        synchronized(words){
  
        }
    }
  }
  
  //对应字节码
    Compiled from "SynchronizedTest.java"
    public class com.myth.SynchronizedTest {
    public com.myth.SynchronizedTest();
    Code:
    0: aload_0
    1: invokespecial #1                  // Method java/lang/Object."<init>":()V
    4: return
    
    public void sayHello();
    Code:
    0: aload_0
    1: getfield      #2                  // Field words:Ljava/lang/String;
    4: dup
    5: astore_1
    6: monitorenter
    7: aload_1
    8: monitorexit
    9: goto          17
    12: astore_2
    13: aload_1
    14: monitorexit
    15: aload_2
    16: athrow
    17: return
    Exception table:
    from    to  target type
    7     9    12   any
    12    15    12   any
    }

    ```
  
通过查阅字节码（javap -c XXX.class）可知，synchronized修饰对象时，使用monitorenter、monitorexit来实现同步操作，修饰方法时网络上很多资源都说使用ACC_SYNCHRONIZED来实现同步，
ACC_SYNCHRONIZED内部隐式的调用monitorenter、monitorexit，可自己查看的字节码却没有看到，不知道啥原因，🤷‍



## 底层原理

### 对象头

我们编写一个Java类，编译后会生成.class文件，当类加载器将class文件加载到jvm时，会生成一个Klass类型的对象(c++)，称为类描述元数据，存储在方法区中，
即jdk1.8之后的元数据区。当使用new创建对象时，就是根据类描述元数据Klass创建的对象oop，存储在堆中。每个java对象都有相同的组成部分，称为对象头。


- 对象头
    - Mark Word（标记字段）：默认存储对象的HashCode，分代年龄和锁标志位信息。它会根据对象的状态复用自己的存储空间，也就是说在运行期间Mark Word里存储的数据会随着锁标志位的变化而变化。
      
        MarkWord在64位JVM中的结构：
        ![](./synchronized_1.png)

        MarkWord在32位JVM中的结构：
        ![](./synchronized_2.png)
      
    - Klass Point（类型指针）：对象指向它的类元数据的指针，虚拟机通过这个指针来确定这个对象是哪个类的实例。
- 实例数据
    - 这部分主要是存放类的数据信息，父类的信息。
- 对其填充
    - 由于虚拟机要求对象起始地址必须是8字节的整数倍，填充数据不是必须存在的，仅仅是为了字节对齐。

### 查看对象占用内存

通过jol-core可以分析出内存占用情况和锁的情况


```
//添加依赖
<dependency>
  <groupId>org.openjdk.jol</groupId>
  <artifactId>jol-core</artifactId>
  <version>0.9</version>
</dependency>

//使用
public class App {
    public static void main(String[] args) {
        System.out.println(ClassLayout.parseInstance(new MyObject()).toPrintable());
    }
}

class MyObject {
    public int age;
}


//结果
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
      0     4        (object header)                           01 00 00 00 (00000001 00000000 00000000 00000000) (1)
      4     4        (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
      8     4        (object header)                           41 c1 00 f8 (01000001 11000001 00000000 11111000) (-134168255)
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

```



### 锁升级

JDK 1.6之前，synchronized 是一个重量级锁，是一个效率比较低下的锁，但是在JDK 1.6后，Jvm为了提高锁的获取与释放效率对（synchronized ）进行了优化，
引入了"偏向锁"和"轻量级锁"，从此以后锁的状态就有了四种（无锁、偏向锁、轻量级锁、重量级锁），并且四种状态会随着竞争的情况逐渐升级，而且是不可逆的过程。

关于锁的概念，参考[Java锁](/Java/2021/05/21/Java锁.html)



## 参考

- [https://juejin.cn/post/6844904069845221384](https://juejin.cn/post/6844904069845221384)
