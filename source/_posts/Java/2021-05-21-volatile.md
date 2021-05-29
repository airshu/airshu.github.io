---
title: volatile
tags: Java
---


在 Java 并发编程中，volatile 是经常用到的一个关键字，它可以用于保证不同的线程共享一个变量时每次都能获取最新的值。volatile具有锁的部分功能并且性能比锁更好，所以也被称为轻量级锁。

一个变量被volatile修饰，则：

1. 保证了不同线程对这个变量进行操作时的可见性，即一个线程修改了某个变量的值，这新值对其他线程来说是立即可见的。
2. 禁止进行指令重排序。


## 并发编程的一些基本概念

### 原子性

即一个操作或者多个操作 要么全部执行并且执行的过程不会被任何因素打断，要么就都不执行。


## 可见性

指当多个线程访问同一个变量时，一个线程修改了这个变量的值，其他线程能够立即看得到修改的值。

## 重排序

处理器为了提高程序运行效率，可能会对输入代码进行优化，它不保证程序中各个语句的执行先后顺序同代码中的顺序一致，但是它会保证程序最终执行结果和代码顺序执行的结果是一致的

olatile关键字禁止指令重排序有两层意思：

1. 当程序执行到volatile变量的读操作或者写操作时，在其前面的操作的更改肯定全部已经进行，且结果已经对后面的操作可见；在其后面的操作肯定还没有进行；
2. 在进行指令优化时，不能将在对volatile变量访问的语句放在其后面执行，也不能把volatile变量后面的语句放到其前面执行。

```
//x、y为非volatile变量
//flag为volatile变量
 
x = 2;        //语句1
y = 0;        //语句2
flag = true;  //语句3
x = 4;         //语句4
y = -1;       //语句5
```

由于flag变量为volatile变量，那么在进行指令重排序的过程的时候，不会将语句3放到语句1、语句2前面，也不会讲语句3放到语句4、语句5后面。但是要注意语句1和语句2的顺序、语句4和语句5的顺序是不作任何保证的。

并且volatile关键字能保证，执行到语句3时，语句1和语句2必定是执行完毕了的，且语句1和语句2的执行结果对语句3、语句4、语句5是可见的。



## 使用场景


### 修饰boolean变量

```
volatile boolean flag = false;
 
while(!flag){
    doSomething();
}
 
public void setFlag() {
    flag = true;
}
```

### 双重锁校验

```
class Singleton {
    private static volatile Singleton instance;

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }

}
```


其实问题出在 instance = new Singleton(); 这一行，这里是创建 Singleton 对象的地方，其实这里可以看成三个步骤：

```
memory = allocate(); //1: 分配对象的内存空间
ctorInstance(memory); //2: 初始化对象
instance = memory； //3: 设置 instance 指向刚分配的内存地址
```


上面的伪代码可能会被重排序。什么是重排序？编译器以及处理器有时候会为了执行的效率改变代码的执行顺序，这个被称为重排序。上面的三个步骤可能会被重排序为下面的步骤：
```
memory = allocate(); //1: 分配对象的内存空间
instance = memory； //2: 设置 instance 指向刚分配的内存地址
// 注意：此时对象还没有被初始化
ctorInstance(memory); //3: 初始化对象
```

在这种情况下，当一个线程执行到 instance = memory; 的时候，对象还没有被初始化，另一个线程也调用了 getInstance 方法，发现 instance 引用不为 null，就会认为这个对象已经创建好了，从而使用了未初始化的对象。

为什么 volatile 可以避免上面的问题？其实是因为 volatile 会禁止重排序，方法是插入了内存屏障。

观察加入volatile关键字和没有加入volatile关键字时所生成的汇编代码发现，加入volatile关键字时，会多出一个lock前缀指令。

lock前缀指令实际上相当于一个内存屏障（也成内存栅栏），内存屏障会提供3个功能：
1. 它确保指令重排序时不会把其后面的指令排到内存屏障之前的位置，也不会把前面的指令排到内存屏障的后面；即在执行到内存屏障这句指令时，在它前面的操作已经全部完成；
2. 它会强制将对缓存的修改操作立即写入主存；
3. 如果是写操作，它会导致其他CPU中对应的缓存行无效。


## 参考

- [https://mp.weixin.qq.com/s/Oa3tcfAFO9IgsbE22C5TEg](https://mp.weixin.qq.com/s/Oa3tcfAFO9IgsbE22C5TEg)
- [https://www.cnblogs.com/dolphin0520/p/3920373.html](https://www.cnblogs.com/dolphin0520/p/3920373.html)

