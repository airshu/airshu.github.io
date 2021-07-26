---
title: WMRouter
tags: Android
toc: true
---


## 概述

WMRouter主要提供URI分发、ServiceLoader两大功能。基于注解的方式来实现解耦。

提供了以下标注：

- RouterPage：指定一个内部页面跳转，此注解可以用在Activity和UriHandler上
- RouterProvider：指定一个静态方法，用于构造Service。提供构造对象的替代方法，比如getInstance。
- RouterRegex：指定一个正则匹配的跳转，此注解可以用在Activity和UriHandler上
- RouterService：声明一个Service，通过interface和key加载实现类
- RouterUri：指定一个Uri跳转，此注解可以用在Activity和UriHandler上


> 注：WMRouter中运用了反射、注解、责任链模式等技术，请先了解相关技术。


## URI分发


### 使用RouterUri

使用路由功能，我们可以使用以下标注

```java

// 指定路径、scheme、host
@RouterUri(path = "/test/schemehost", scheme = "test", host = "test.demo.com")
public static class TestSchemeHostHandler extends EmptyHandler {

}

// 指定path、拦截器
@RouterUri(path = "/test/interceptor", interceptors = UriParamInterceptor.class)
public static class TestInterceptorHandler extends EmptyHandler {

}

// 指定路径
@RouterUri(path = DemoConstant.ADVANCED_DEMO)
public class AdvancedDemoActivity extends BaseActivity { }

```

### 跳转到具体Uri

```java

Router.startUri(context, "/home");

Router.startUri(context, "demo_scheme://demo_host/path1");

Router.startUri(new UriRequest(context, "/account"))

```

### 解析RouterUri

UriAnnotationProcessor对RouterUri标注进行解析处理：

```java

public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment env) {
    if (annotations == null || annotations.isEmpty()) {
        return false;
    }
    CodeBlock.Builder builder = CodeBlock.builder();
    String hash = null;
    for (Element element : env.getElementsAnnotatedWith(RouterUri.class)) {
        if (!(element instanceof Symbol.ClassSymbol)) {
            continue;
        }
        // 判断是否是Activity
        boolean isActivity = isActivity(element);
        // 判断是否UriHandler的子类
        boolean isHandler = isHandler(element);

        if (!isActivity && !isHandler) {
            continue;
        }

        Symbol.ClassSymbol cls = (Symbol.ClassSymbol) element;
        RouterUri uri = cls.getAnnotation(RouterUri.class);
        if (uri == null) {
            continue;
        }

        if (hash == null) {
            hash = hash(cls.className());
        }
        CodeBlock handler = buildHandler(isActivity, cls);
        CodeBlock interceptors = buildInterceptors(getInterceptors(uri));

        // scheme, host, path, handler, exported, interceptors
        String[] pathList = uri.path();
        for (String path : pathList) {
            builder.addStatement("handler.register($S, $S, $S, $L, $L$L)",
                    uri.scheme(),
                    uri.host(),
                    path,
                    handler,
                    uri.exported(),
                    interceptors);
        }
    }
    if (hash == null) {
        hash = randomHash();
    }
    // 生成对应的初始化文件，将对应的Class添加到ServiceLoader中的Map中
    buildHandlerInitClass(builder.build(), "UriAnnotationInit" + Const.SPLITTER + hash,
            Const.URI_ANNOTATION_HANDLER_CLASS, Const.URI_ANNOTATION_INIT_CLASS);
    return true;
}

```

UriHandler运用责任链模式，用于拦截相关URI。

### RouterRegex

用于设置路由匹配的正则，可以设置的属性有：

- regex：完整uri的正则表达式匹配
- priority：优先级，数字越大越先执行，默认为0
- exported：是否允许外部跳转
- interceptors：要添加的interceptors，需要实现UriInterceptor，拦截器处理后决定是继续还是结束。



```java

@RouterRegex(regex = "http(s)?://.*")
public class SystemBrowserHandler extends UriHandler { 
    // 是否要处理
    @Override
    protected boolean shouldHandle(@NonNull UriRequest request) {
        return true;
    }

    // 根据实际业务需要进行处理
    @Override
    protected void handleInternal(@NonNull UriRequest request, @NonNull UriCallback callback) {
        try {
            Intent intent = new Intent();
            intent.setAction(Intent.ACTION_VIEW);
            intent.setData(request.getUri());
            request.getContext().startActivity(intent);
            callback.onComplete(UriResult.CODE_SUCCESS);
        } catch (Exception e) {
            callback.onComplete(UriResult.CODE_ERROR);
        }
    }

}


@RouterRegex(regex = "http(s)://test.demo.com/test/interceptor.*", interceptors = UriParamInterceptor.class)
public static class TestInterceptorHandler extends EmptyHandler {

}

```


### RouterPage

RouterPage用于内部页面跳转，此注解可以用在Activity、Fragment和UriHandler上。可以设置拦截器UriInterceptor。

```java

@RouterPage(path = "/test/interceptor", interceptors = UriParamInterceptor.class)
public static class TestInterceptorHandler extends EmptyHandler {

}

@RouterPage(path = DemoConstant.TEST_DEMO_FRAGMENT_2, interceptors = DemoFragmentInterceptor.class)
public class Demo2Fragment extends Fragment { }

```

## ServiceLoader

ServiceLoader帮助我们到项目实现解耦的效果，跟Dagger等框架等功能类似。不过WMRouter内部是沟通反射来构造对象的，感觉性能上没有google官方提供的框架好。

### 使用RouterService

RouterService可以设置以下属性：

- interfaces：实现的接口（或继承的父类）
- key：同一个接口的多个实现类之间，可以通过唯一的key区分。
- singleton：是否为单例。如果是单例，则使用ServiceLoader.getService不会重复创建实例。
- defaultImpl：是否设置为默认实现类。如果是默认实现类，则在获取该实现类实例时可以不指定key

```java

//注册
@RouterService(interfaces = Func2.class, key = "/method/add", singleton = true)
public class AddMethod implements Func2<Integer, Integer, Integer> {

//获取，第一个参数为接口的class，第二个为注册时填的key
Router.getService(IAccountService.class, "key_name");

// 可以通过接口拿到所有注册的对象
Router.getAllServiceClasses(IService.class);

// 可以传入一个工厂，如果没有拿到对象，则可以通过工厂构造一个
IFactoryService service4 = Router.getService(IFactoryService.class, "/factory", new IFactory() {
    @NonNull
    @Override
    public <T> T create(@NonNull Class<T> clazz) throws Exception {
        return clazz.getConstructor(String.class).newInstance("CreateByCustomFactory");
    }
});
```

### getService流程

**流程：**

1. ServiceLoader的SERVICES如果有对应的对象，则直接返回；
2. 没有则创建一个ServiceLoader，将class传进入；
3. 调用ServiceLoader的get方法：
    1. 如果用单例修饰，则从SingletonPool中拿
    2. 不是则判断是否有用RouterProvider修饰来返回对象
    3. 不是则通过反射创建对象

### ServiceAnnotationProcessor

ServiceAnnotationProcessor用来解析RouterService注解


```java

@Override
public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment env) {
    //最后一轮的时候，生成ServiceInit文件
    if (env.processingOver()) {
        generateInitClass();
    } else {
        // 处理相应注解
        processAnnotations(env);
    }
    return true;
}


```


## 参考

- []()
- [WMrouter源码拆解](https://cctomorrow.github.io/2020/11/28/WMrouter_Source/)


