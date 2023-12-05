---
title: flutter_test
toc: true
tags: Flutter 单元测试
---


## 描述

基于dart的test库，用于Flutter项目的测试库。

可用于测试：

- 方法、函数
- UI

## 基本用法

### 1. 添加配置

```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
```

### 2. 编写测试用例

```dart
@Skip('跳过当前测试用例')
@Timeout(Duration(seconds: 10)) //设置超时时间
import 'package:flutter_test/flutter_test.dart';

void main() {

//在每个测试用例执行前执行
  setUp(() { 
  });
  
//在每个测试用例执行后执行
  tearDown(() { 
  });

//单个用例
  test('描述测试内容', () async { //支持异步测试
    expect(1+1, 2);
  });

//组用例
  group('描述分组', () {

    test('描述测试内容', () async {

    });

  }, skip: '跳过当前分组',
  timeout: Timeout(Duration(seconds: 10)) //设置超时时间
  );


}
```

## 常用API介绍

### 基本方法

- group：分组，可以把一些相关的测试用例放在一起
- test：单个测试用例
- testWidgets：测试UI
  - pumpWidget()：创建并渲染widget
  - pump(): 触发widget重建，仅重建已更改的 widget
  - pumpAndSettle():在给定期间内不断重复调用 pump() 直到完成所有绘制帧，一般需要等到所有动画全部完成
- setUp：在每个测试用例执行前执行
- tearDown：在每个测试用例执行后执行
- expect：断言，判断是否符合预期

### 交互类API

- enterText(): 模拟输入
- tap(): 模拟点击
- drag(): 模拟拖拽
- longPress():模拟长按
- scrollUntilVisible(): 模拟滚动到可见位置
- scrollIntoView(): 模拟滚动到可见位置
- scroll(): 模拟滚动
- fling(): 模拟拖拽
- flingFrom(): 模拟拖拽
- flingFromEdge(): 模拟拖拽
- flingFromCenter(): 模拟拖拽

### 使用Finder定位Widget

- text(String text): 查找特定文本的Text widget
- byWidget(Widget widget, {bool skipOffstage = true}): 通过widget查找widget
- byWidgetPredicate：根据具体条件进行查找
- byKey(Key key): 通过key查找widget
- byType(Type type): 通过类型查找widget
- byElementType(Type type, { bool skipOffstage = true }):

### matchers

- findsOneWidget：找到一个widget
- findsWidgets：找到一个或多个
- findsNothing：没有找到
- findsNWidgets：找到指定数量的widget
- TestPointer：测试手势，按下、滑动、抬起等
- TestTextInput：测试输入框
- AutomatedTestWidgetsFlutterBinding：会模拟用户操作并控制应用程序的状态。它可以处理异步操作、动画和定时器等，以确保测试代码在正确的上下文中运行。通常与 flutter_driver 或其他自动化测试框架一起使用，用于执行集成测试或端到端测试
- AnimationSheetBuilder：用于测试动画



## UI测试用例

主要是用以下工具进行UI的测试：

- WidgetTester，可在测试环境建立widget并与其交互
- testWidgets()函数，此函数会自动为每个测试创建一个WidgetTester，用来代替普通的test函数
- Finder类，方便在测试环境下查找widgets
- Widget-specific Matcher常量，用于验证

### 1. 创建用于测试的Widget

```dart
class MyWidget extends StatelessWidget {
  const MyWidget({
    super.key,
    required this.title,
    required this.message,
  });

  final String title;
  final String message;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      home: Scaffold(
        appBar: AppBar(
          title: Text(title),
        ),
        body: Center(
          child: Text(message),
        ),
      ),
    );
  }
}
```

### 2. 创建一个testWidgets测试方法

```dart
void main() {
  // Define a test. The TestWidgets function also provides a WidgetTester
  // to work with. The WidgetTester allows you to build and interact
  // with widgets in the test environment.
  testWidgets('MyWidget has a title and message', (tester) async {
  //建立Widget
    await tester.pumpWidget(const MyWidget(title: 'T', message: 'M'));
  });
}
```

### 3. 使用Finder查找widget

```dart
void main() {
  testWidgets('MyWidget has a title and message', (tester) async {
    await tester.pumpWidget(const MyWidget(title: 'T', message: 'M'));

    // Create the Finders.
    final titleFinder = find.text('T');
    final messageFinder = find.text('M');
  });
}
```


### 4. 使用Matcher验证widget是否正常工作

```dart
void main() {
  testWidgets('MyWidget has a title and message', (tester) async {
    await tester.pumpWidget(const MyWidget(title: 'T', message: 'M'));
    final titleFinder = find.text('T');
    final messageFinder = find.text('M');

    // Use the `findsOneWidget` matcher provided by flutter_test to verify
    // that the Text widgets appear exactly once in the widget tree.
    expect(titleFinder, findsOneWidget);
    expect(messageFinder, findsOneWidget);
  });
}
```

## 参考

- [https://api.flutter.dev/flutter/flutter_test/flutter_test-library.html](https://api.flutter.dev/flutter/flutter_test/flutter_test-library.html)
- [https://flutter.cn/docs/cookbook/testing/widget/introduction](https://flutter.cn/docs/cookbook/testing/widget/introduction)
