---
title: sentry_flutter
toc: true
tags: Flutter 
---

Sentry是一款多平台支持的异常信息收集解决方案。sentry_flutter可以在Flutter项目中收集异常信息。

[https://docs.sentry.io/platforms/flutter/](https://docs.sentry.io/platforms/flutter/)可以查阅其Flutter项目的集成文档。

[sentry_dart_plugin](https://pub.dev/packages/sentry_dart_plugin)可以自动上传mapping.txt文件和debug的动态库，方便后续直接在sentry后台查看异常信息。

## 基本用法

1. pubspec.yaml配置，sentry_dart_plugin配置参数参考[https://github.com/getsentry/sentry-dart-plugin/blob/main/README.md](https://github.com/getsentry/sentry-dart-plugin/blob/main/README.md)

```yaml
dependencies:
  sentry_flutter: ^7.16.0

sentry:
  upload_debug_symbols: true
  upload_source_maps: false # flutter_web使用
  upload_sources: false
  project: ...
  org: ...
  auth_token: ...
  url: ...
  wait_for_processing: false
  log_level: error # possible values: trace, debug, info, warn, error
  release: ...
  dist: ...
  web_build_path: ...
  commits: auto
  ignore_missing: true
```

2. 代码中初始化相关配置

```dart
import 'package:flutter/widgets.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

Future<void> main() async {
  // sentry支持面包屑配置，可以在重要的场景添加相关信息
  await SentryFlutter.init(
    (options) {
      options.dsn = 'https://example@sentry.io/add-your-dsn-here';
    },
    // Init your App.
    appRunner: () => runApp(MyApp()),
  );
}

```

3. 打包脚本中配置上传mapping.txt文件和debug的动态库

```shell
flutter packages pub run sentry_dart_plugin 
```

## 性能分析

Sentry可以通过“性能”模块来监控整个页面的加载性能，网络请求监控。监控dio可以参考sentry_dio这个库。


```dart
Dio dio = Dio(options);
dio.interceptors.add(SentryDioInterceptor());
dio.addSentry();

// dio的拦截器，自定义事物
class SentryDioInterceptor extends BaseInterceptor {
  @override
  Future<void> onRequest(
      RequestOptions options,
      RequestInterceptorHandler handler,
      ) async {
    final transaction = Sentry.startTransaction(
      'dio-web-request',
      'request',
      bindToScope: true,
    );
    options.extra['sentryTransaction'] = transaction;
    final span = transaction.startChild(
      'dio-request',
      description: 'Sending request to ${options.uri}',
    );
    options.extra['sentrySpan'] = span;
    super.onRequest(options, handler);
  }

  @override
  Future<void> onResponse(
      Response response,
      ResponseInterceptorHandler handler,
      ) async {
    final span = response.requestOptions.extra['sentrySpan'] as SentrySpan?;
    final transaction =
    response.requestOptions.extra['sentryTransaction'] as ISentrySpan?;
    if (span != null) {
      span.status = const SpanStatus.ok();
      await span.finish();
    }
    if (transaction != null) {
      await transaction.finish();
    }
    super.onResponse(response, handler);
  }

  @override
  Future<void> onError(
      DioException err,
      ErrorInterceptorHandler handler,
      ) async {
    final span = err.requestOptions.extra['sentrySpan'] as SentrySpan?;
    final transaction =
    err.requestOptions.extra['sentryTransaction'] as ISentrySpan?;
    if (span != null) {
      span.throwable = err;
      span.status = const SpanStatus.internalError();
      await span.finish();
    }
    if (transaction != null) {
      await transaction.finish();
    }
    await Sentry.captureException(err);
    super.onError(err, handler);
  }
}

```

注意本地版本与服务端版本的对应关系，否则某些功能可能无法使用。（比如transaction_info: Discarded unknown attribute）

## 参考

- [Sentry Docs: Set Up Tracing](https://docs.sentry.io/platforms/flutter/tracing/)
- [使用 Sentry 做性能监控 - 分析优化篇](https://juejin.cn/post/7151753139052347399)
