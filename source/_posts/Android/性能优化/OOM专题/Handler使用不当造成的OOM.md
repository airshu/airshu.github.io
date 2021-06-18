---
title: Handler使用不当造成的OOM
tags: Android
toc: true
---


## 问题重现

编写以下代码

```java
public class OOMHandlerActivity extends Activity {

    private Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            ((EditText) findViewById(R.id.oom_handler_edit_text)).setText("aaaas");
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_oom_handler);
        
        mHandler.sendEmptyMessageDelayed(1, 1000 * 60); //这里注意，当延迟时间较小时，Profile中Leaks显示为0
    }
}
```

使用Android Studio自带的Profile进行监控，打开OOMHandlerActivity页面，然后返回上一个页面。Dump内存后，会出现以下提示：

![](./handler_1.jpg)


## 原因分析

依据Handler的实现原理，我们可知，内存泄漏的引用链如下：

`主线程 —> threadlocal —> Looper —> MessageQueue —> Message —> Handler —> Activity`



## 解决办法

对于Handler的使用技巧，我们应该：

- 使用静态内部类的方式
- 如果需要处理宿主，则通过弱引用的传入进来
- Activity生命周期结束时，释放Handler资源

参考以下代码：

```java
package com.lqd.androidpractice.oom.handler;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.widget.TextView;

import com.lqd.androidpractice.R;

import java.lang.ref.WeakReference;

/**
 * @author: shjlone
 * @Date 2021/6/18
 */
public class OOMHandlerRightActivity extends Activity {
    private MyHandler mHandler = new MyHandler(this);
    private TextView mTextView;

    //使用静态内部类
    private static class MyHandler extends Handler {
        private WeakReference<Context> reference;//使用弱引用

        public MyHandler(Context context) {
            reference = new WeakReference<>(context);
        }

        @Override
        public void handleMessage(Message msg) {
            OOMHandlerRightActivity activity = (OOMHandlerRightActivity) reference.get();
            if (activity != null) {
                activity.mTextView.setText("");
            }
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_oom_handler);
        mTextView = (TextView) findViewById(R.id.textview);
        mHandler.sendEmptyMessageDelayed(1, 1000 * 60);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mHandler.removeCallbacksAndMessages(null);//Activity销毁时同时移除handler的监听
    }
}

```

## 参考

- [https://www.cnblogs.com/jimuzz/p/14187408.html](https://www.cnblogs.com/jimuzz/p/14187408.html)
