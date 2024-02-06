---
title: native crash 分析
toc: true
tags: Android
---


## **Crash类型：**

- Framework/App Crash：Java层崩溃
- Native Crash：C/C++层崩溃
- Kernel Crash：内核崩溃


## **tombstone文件的组成部分：**

- Build fingerprint
- Crashed process and PIDS
- Terminated signal and fault address
- CPU registers
- Call stack
- Stack content of each call

```
--logversion:utracea
Process Name: 'com.feiteng.lieyou'
Thread Name: 'RenderThread'
pid: 25031, tid: 25237 >>> com.feiteng.lieyou <<<
killed by pid: 25031, comm: .feiteng.lieyou, uid: 10125.
signal 6 (SIGABRT), code -6 (SI_TKILL), fault addr --------
r0 00000000 r1 00006295 r2 00000006 r3 00000008
r4 c587c978 r5 00000006 r6 c587c920 r7 0000010c
r8 bf249bc8 r9 00000000 10 bf249bbc fp bf249bb8
ip 00000004 sp c587c3b0 lr eba21907 pc eba24188 cpsr 20070010
d0 0000000000000000 d1 0000000000000000
d2 0000000000000000 d3 0000000000000000

```

<b>signal指定异常类型。如果pid等于tid，则说明程序是在主线程中崩溃。</b>

- signal下一行为寄存器快照
- backtrace下面为异常调用堆栈

### **信号类型:**

软中断信号（signal，又简称为信号）用来通知进程发生了事件。进程之间可以通过调用kill库函数发送软中断信号。Linux内核也可能给进程发送信号，
通知进程发生了某个事件（例如内存越界）。

信号只是用来通知某进程发生了什么事件，无法给进程传递任何数据，进程对信号的处理方法有三种：

1. 第一种方法是，忽略某个信号，对该信号不做任何处理，就象未发生过一样。
2. 第二种是设置中断的处理函数，收到信号后，由该函数来处理。
3. 第三种方法是，对该信号的处理采用系统的默认操作，大部分的信号的默认操作是终止进程。


```C++

//信号监听
sighandler_t signal(int signum, sighandler_t handler);
/*
参数signum表示信号的编号。
参数handler表示信号的处理方式，有三种情况：
1）SIG_IGN：忽略参数signum所指的信号。
2）一个自定义的处理信号的函数，信号的编号为这个自定义函数的参数。
3）SIG_DFL：恢复参数signum所指信号的处理方法为默认值。
*/

//发送信号
int kill(pid_t pid, int sig);
/*
kill函数将参数sig指定的信号给参数pid 指定的进程。
参数pid 有几种情况：
1）pid>0 将信号传给进程号为pid 的进程。
2）pid=0 将信号传给和目前进程相同进程组的所有进程，常用于父进程给子进程发送信号，注意，发送信号者进程也会收到自己发出的信号。
3）pid=-1 将信号广播传送给系统内所有的进程，例如系统关机时，会向所有的登录窗口广播关机信息。
sig：准备发送的信号代码，假如其值为零则没有任何信号送出，但是系统会执行错误检查，通常会利用sig值为零来检验某个进程是否仍在运行。
返回值说明： 成功执行时，返回0；失败返回-1，errno被设为以下的某个值。
EINVAL：指定的信号码无效（参数 sig 不合法）。
EPERM：权限不够无法传送信号给指定进程。
ESRCH：参数 pid 所指定的进程或进程组不存在。
*/

#define SIGHUP 1  // 终端连接结束时发出(不管正常或非正常)
#define SIGINT 2  // 程序终止(例如Ctrl-C)
#define SIGQUIT 3 // 程序退出(Ctrl-\)
#define SIGILL 4 // 执行了非法指令，或者试图执行数据段，堆栈溢出
#define SIGTRAP 5 // 断点时产生，由debugger使用
#define SIGABRT 6 // 调用abort函数生成的信号，表示程序异常
#define SIGIOT 6 // 同上，更全，IO异常也会发出
#define SIGBUS 7 // 非法地址，包括内存地址对齐出错，比如访问一个4字节的整数, 但其地址不是4的倍数
#define SIGFPE 8 // 计算错误，比如除0、溢出
#define SIGKILL 9 // 强制结束程序，具有最高优先级，本信号不能被阻塞、处理和忽略
#define SIGUSR1 10 // 未使用，保留
#define SIGSEGV 11 // 非法内存操作，与SIGBUS不同，他是对合法地址的非法访问，比如访问没有读权限的内存，向没有写权限的地址写数据
#define SIGUSR2 12 // 未使用，保留
#define SIGPIPE 13 // 管道破裂，通常在进程间通信产生
#define SIGALRM 14 // 定时信号,
#define SIGTERM 15 // 结束程序，类似温和的SIGKILL，可被阻塞和处理。通常程序如果终止不了，才会尝试SIGKILL
#define SIGSTKFLT 16  // 协处理器堆栈错误
#define SIGCHLD 17 // 子进程结束时, 父进程会收到这个信号。
#define SIGCONT 18 // 让一个停止的进程继续执行
#define SIGSTOP 19 // 停止进程,本信号不能被阻塞,处理或忽略
#define SIGTSTP 20 // 停止进程,但该信号可以被处理和忽略
#define SIGTTIN 21 // 当后台作业要从用户终端读数据时, 该作业中的所有进程会收到SIGTTIN信号
#define SIGTTOU 22 // 类似于SIGTTIN, 但在写终端时收到
#define SIGURG 23 // 有紧急数据或out-of-band数据到达socket时产生
#define SIGXCPU 24 // 超过CPU时间资源限制时发出
#define SIGXFSZ 25 // 当进程企图扩大文件以至于超过文件大小资源限制
#define SIGVTALRM 26 // 虚拟时钟信号. 类似于SIGALRM, 但是计算的是该进程占用的CPU时间.
#define SIGPROF 27 // 类似于SIGALRM/SIGVTALRM, 但包括该进程用的CPU时间以及系统调用的时间
#define SIGWINCH 28 // 窗口大小改变时发出
#define SIGIO 29 // 文件描述符准备就绪, 可以开始进行输入/输出操作
#define SIGPOLL SIGIO // 同上，别称
#define SIGPWR 30 // 电源异常
#define SIGSYS 31 // 非法的系统调用
```

tombstone 文件位于路径 /data/tombstones/下


### **调用栈信息**

调用栈信息是分析程序崩溃的非常重要的一个信息，它主要记录了程序在 Crash 前的函数调用关系以及当前正在执行函数的信息，它对应的是我们tombstone
文件中 backtrace 符号开始的信息，上面例子中的 backtrace 的信息如下所示

```
backtrace:
    #00 pc 00006639  /system/lib/libui.so (android::Fence::waitForever(char const*)+41)
    #01 pc 00034b86  /system/lib/libsurfaceflinger.so
    #02 pc 0003229e  /system/lib/libsurfaceflinger.so
    #03 pc 0002cb9c  /system/lib/libgui.so (android::BufferQueue::ProxyConsumerListener::onFrameAvailable(android::BufferItem const&)+652)
    #04 pc 000342f4  /system/lib/libgui.so (android::BufferQueueProducer::queueBuffer(int, android::IGraphicBufferProducer::QueueBufferInput const&, android::IGraphicBufferProducer::QueueBufferOutput*)+2580)

    ##00 等表示函数调用栈中栈帧的编号
    pc 后面的16进制数表示当前函数正在执行语句在共享链接库或可执行文件的位置
    最后一行表示当前指令在哪个文件
```

## 如何定位崩溃位置



完整的so文件包含代码和一些debug信息，release版的so文件需要经过一个strip操作，debug信息会被剥离，整个so文件的大小会变小。要定位具体位置，则需要使用debug版本的so文件

### 常用工具


#### **nm**

```
查看动态库的符号表
nm -D libName.so
```

#### **addr2line**

用来分析单个pc地址对应的源码行数

```
Usage: /Users/loneqd/Android/sdk/ndk-bundle/toolchains/aarch64-linux-android-4.9/prebuilt/darwin-x86_64/bin/aarch64-linux-android-addr2line [option(s)] [addr(s)]
 Convert addresses into line number/file name pairs.
 If no addresses are specified on the command line, they will be read from stdin
 The options are:
  @<file>                Read options from <file>
  -a --addresses         Show addresses
  -b --target=<bfdname>  Set the binary file format
  -e --exe=<executable>  Set the input file name (default is a.out)
  -i --inlines           Unwind inlined functions
  -j --section=<name>    Read section-relative offsets instead of addresses
  -p --pretty-print      Make the output easier to read for humans
  -s --basenames         Strip directory names
  -f --functions         Show function names
  -C --demangle[=style]  Demangle function names
  -h --help              Display this information
  -v --version           Display the program's version

实例：(需使用带symbol的动态库)
addr2line -f -e libui.so 00006639 _ZN7android5Fence11waitForeverE  
```




#### **ndk-stack**

将崩溃时的调用内存地址和C++代码对应起来

```
usage: ndk-stack.py [-h] -sym SYMBOL_DIR [-i INPUT]

Symbolizes Android crashes.

optional arguments:
  -h, --help            show this help message and exit
  -sym SYMBOL_DIR, --sym SYMBOL_DIR
                        directory containing unstripped .so files
  -i INPUT, -dump INPUT, --dump INPUT
                        input filename

See <https://developer.android.com/ndk/guides/ndk-stack>.

sym指项目编译成功之后，obj目录
dump指崩溃文件
```


## xCrash的使用

- [https://github.com/iqiyi/xCrash](https://github.com/iqiyi/xCrash)

native异常日志文件的格式

```
日志分为：
    头部信息（为应用的基本信息）
    异常信号部分。（哪个异常信号导致异常，信号参见Linux信号）
    backtrace
    so库的编译信息，build id
    堆栈信息
    内存信息
    内存映射
    logcat日志输出部分，包括main,system,event
    app应用进程打开的文件描述符
    内存信息
    app应用进程信息
    异常回调填充信息
```

一般根据backtrace，再使用addr2line命令定位具体的错误代码位置。

<br/>

## 参考

- [http://gityuan.com/2016/06/25/android-native-crash/](http://gityuan.com/2016/06/25/android-native-crash/)
- [https://toutiao.io/posts/jflx6c/preview](https://toutiao.io/posts/jflx6c/preview)
- [https://source.android.google.cn/devices/tech/debug/native-crash?hl=zh-cn](https://source.android.google.cn/devices/tech/debug/native-crash?hl=zh-cn)
- [http://www.droidsec.cn/%E5%B8%B8%E8%A7%81android-native%E5%B4%A9%E6%BA%83%E5%8F%8A%E9%94%99%E8%AF%AF%E5%8E%9F%E5%9B%A0/](http://www.droidsec.cn/%E5%B8%B8%E8%A7%81android-native%E5%B4%A9%E6%BA%83%E5%8F%8A%E9%94%99%E8%AF%AF%E5%8E%9F%E5%9B%A0/)
- [https://github.com/iqiyi/xCrash](https://github.com/iqiyi/xCrash)
- [https://source.android.com/devices/tech/debug](https://source.android.com/devices/tech/debug)
- [xCrash日志文件格式](https://blog.csdn.net/cxmfzu/article/details/102624295)
- [介绍addr2line调试命令](http://gityuan.com/2017/09/02/addr2line/)
