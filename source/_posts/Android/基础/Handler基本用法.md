---
title: Handler基本用法
tags: Android
toc: true
---


Hanlder系列目录：

- [Handler基本用法](./Handler基本用法.html)
- [Handler原理](./Handler原理.html)



## 概要


A Handler allows you to send and process Message and Runnable objects associated with a thread's MessageQueue. Each Handler instance 
is associated with a single thread and that thread's message queue. When you create a new Handler it is bound to a Looper. 
It will deliver messages and runnables to that Looper's message queue and execute them on that Looper's thread.

There are two main uses for a Handler: (1) to schedule messages and runnables to be executed at some point in the future; 
and (2) to enqueue an action to be performed on a different thread than your own.

Scheduling messages is accomplished with the post(Runnable), postAtTime(java.lang.Runnable, long), 
postDelayed(Runnable, Object, long), sendEmptyMessage(int), sendMessage(Message), sendMessageAtTime(Message, long), and 
sendMessageDelayed(Message, long) methods. The post versions allow you to enqueue Runnable objects to be called by the 
message queue when they are received; the sendMessage versions allow you to enqueue a Message object containing a bundle
of data that will be processed by the Handler's handleMessage(Message) method (requiring that you implement a subclass of Handler).

When posting or sending to a Handler, you can either allow the item to be processed as soon as the message queue is ready
to do so, or specify a delay before it gets processed or absolute time for it to be processed. The latter two allow you 
to implement timeouts, ticks, and other timing-based behavior.

When a process is created for your application, its main thread is dedicated to running a message queue that takes care 
of managing the top-level application objects (activities, broadcast receivers, etc) and any windows they create. You 
can create your own threads, and communicate back with the main application thread through a Handler. This is done by 
calling the same post or sendMessage methods as before, but from your new thread. The given Runnable or Message will then 
be scheduled in the Handler's message queue and processed when appropriate.

Handler用于Android中的线程通信。主要的用于在异步线程中发送`Message`或者直接运行一个`Runnable`，即可回到主线程执行UI操作。Handler在哪个线程
初始化，则它依附在哪个线程。Activity中有一个runOnUiThread方法，封装了Handler可以直接在异步线程中使用。Handler也可以延迟执行。

## 代码实例

```java
package com.lqd.androidpractice.handler;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.lqd.androidpractice.R;

import org.jetbrains.annotations.NotNull;

import java.lang.ref.WeakReference;

/**
 * handler 使用实例
 *
 * 在异步线程发送消息到主线程刷新UI
 *
 * @author: a564
 * @Date 2021/6/7
 */
public class HandlerActivity extends Activity {

    private static String TAG = "HandlerActivity";

    private TextView textView;

    private MyHandler myHandler;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_handler);

        textView = findViewById(R.id.ah_textview);
        findViewById(R.id.ah_btn1).setOnClickListener(v -> {
            new Thread() {
                @Override
                public void run() {
                    super.run();

                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }

                    Log.d(TAG, Thread.currentThread().getStackTrace()[2].getMethodName());

                    Message msg = Message.obtain();
                    msg.what = 1; // 消息标识
                    msg.obj = "A"; // 消息内存存放
                    myHandler.sendMessage(msg); // 异步线程发送消息

                    //使用post
                    myHandler.post(new Runnable() {
                        @Override
                        public void run() {
                            //回到UI线程
                        }
                    });
                }
            }.start();
        });

        myHandler = new MyHandler(this);

    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        myHandler.removeCallbacksAndMessages(null);//跟随Activity销毁
        myHandler = null;
    }

    //静态内部类
    private static class MyHandler extends Handler {
        //弱引用
        WeakReference<HandlerActivity> activityWeakReference;

        public MyHandler(HandlerActivity activity) {
            activityWeakReference = new WeakReference<HandlerActivity>(activity);
        }


        @Override
        public void handleMessage(@NonNull @NotNull Message msg) {
            super.handleMessage(msg);

            Log.d(TAG, Thread.currentThread().getStackTrace()[2].getMethodName());
            Log.d(TAG, msg.toString());
            HandlerActivity activity = activityWeakReference.get();
            if (activity == null)
                return;

            switch (msg.what) {
                case 1:
                    activity.textView.setText("执行了线程1的UI操作");
                    break;
                case 2:
                    activity.textView.setText("执行了线程2的UI操作");
                    break;
            }
        }
    };
}

```

## HandlerThread

顾名思义，HandlerThread使得Thread拥有的Handler的特性，可以在此线程中进行消息的分发和处理。使用场景也是创建异步线程并有数据交互。我们也可以
将其封装成一个工具类，这样不需要每次都new一个线程出来，方便使用且节省性能。

```java

class BackgroundHandlerThread {
    private static class Holder{
        private static BackgroundHandlerThread _instance = new BackgroundHandlerThread();
        static{
            _instance.init();
        }
    }

    public static BackgroundHandlerThread getInstance(){
        return Holder._instance;
    }

    private HandlerThread mHandlerThread;
    private Handler mHandler;

    private void init(){
    //HandlerThread的第二个参数为线程优先级
        mHandlerThread = new HandlerThread(BackgroundHandlerThread.class.getSimpleName());
        mHandlerThread.start();

        mHandler = new Handler(mHandlerThread.getLooper()){
            @Override
            public void handleMessage(Message msg) {
            }
        };
    }

    public Looper getLooper(){
        return mHandlerThread.getLooper();
    }

    public Handler getHandler(){
        return this.mHandler;
    }
}
// 当需要异步执行的地方可以直接使用下面的代码
BackgroundHandlerThread.getInstance().getHandler().post(Runnable)

```

## API介绍

`sendMessage(Message message)`

发送消息到消息队列

`post(Runnable runable)`

把一个Runnable对象添加到消息队列中，这个方法会在对应Looper的线程中运行。

`dispatchMessage(Message msg)`

将消息分发给对应的Handler

`handleMessage`

根据某个消息类型进行处理





## 参考

- [https://developer.android.com/reference/android/os/Handler](https://developer.android.com/reference/android/os/Handler)
- [详解 Android 中的 HandlerThread](https://droidyue.com/blog/2015/11/08/make-use-of-handlerthread/)
