---
title: 非静态内部类造成的OOM的处理方式
tags: Android
toc: true
---

## 问题分析

我们日常写代码中，很容易写一些以下样子的代码：

```java
public class OOMInnerClassActivity extends Activity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_oom_inner_class);


        EditText editText = findViewById(R.id.oom_edittext);
        TextView textView = findViewById(R.id.oom_textview);
        editText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                textView.setText(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });


    }
}
```

上面的代码中，TextWatcher的匿名内部类是会持有Activity的引用的。如果它没有跟着Activity的生命周期一起销毁，则会引发内存泄漏。

为什么匿名内部类会持有外部引用而静态内部类不会呢？静态内部类它是静态的呀，只能访问外部的静态变量，无需持有外部对象的引用。



## 解决方式

其实这种现象跟Handler的处理方式是类似的，监听器持有弱引用，且生命周期结束时同步销毁。可参考以下代码：

```java
class OOMInnerClassRightActivity extends Activity {
    public TextView textView;
    EditText editText;
    WeakTextWatcher weakTextWatcher;
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_oom_inner_class);

        editText = findViewById(R.id.oom_edittext);
        textView = findViewById(R.id.oom_edittext);

        weakTextWatcher = new WeakTextWatcher(this);
        editText.addTextChangedListener(weakTextWatcher);
    }

    //使用静态内部类
    private static class WeakTextWatcher implements TextWatcher {
        //使用弱引用
        private WeakReference<OOMInnerClassRightActivity> activityWeakReference;

        WeakTextWatcher(OOMInnerClassRightActivity activity) {
            activityWeakReference = new WeakReference<OOMInnerClassRightActivity>(activity);
        }
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {
        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
            OOMInnerClassRightActivity activity = activityWeakReference.get();
            if(activity != null) {
                activity.textView.setText(s.toString());
            }
        }

        @Override
        public void afterTextChanged(Editable s) {
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        //释放监听
        editText.removeTextChangedListener(weakTextWatcher);
        weakTextWatcher = null;

    }
}
```

也可以参考[Handler基本用法](/wiki/Android/基础/Handler基本用法/)

## 参考

- [Android - 匿名内部类导致内存泄露的处理办法](http://cashow.github.io/Android-Anonymous-Inner-Class-Leaks-Memory.html)
- [匿名内部类导致内存泄露的面试题](https://cloud.tencent.com/developer/article/1179625)
