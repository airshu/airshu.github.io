---
title: Mockito
toc: true
tags: Flutter 单元测试
---


## 描述

用于模拟数据的Flutter测试库。为了使用模拟类，需要在pubspec.yaml中添加build_runner依赖。

## 基本用法

### 1. pubspec.yaml添加依赖

```yaml
dev_dependencies:
    flutter_test:
        sdk: flutter
    mockito:
    build_runner:
```

### 2. mock类

```dart
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

// 标注创建cat.mocks.dart文件和MockCat类
@GenerateNiceMocks([MockSpec<Cat>()])
import 'cat.mocks.dart';

// 真实的类
class Cat {
  String sound() => "Meow";
  bool eatFood(String food, {bool? hungry}) => true;
  Future<void> chew() async => print("Chewing...");
  int walk(List<String> places) => 7;
  void sleep() {}
  void hunt(String place, String prey) {}
  int lives = 9;
}

void main() {
  // 创建mock对象
  object.var cat = MockCat();
}
```

### 3. 生成文件

```shell
flutter pub run build_runner build

# OR
dart run build_runner build
```

### 4. 验证

```dart
// 在交互前插桩一个mock方法
when(cat.sound()).thenReturn("Purr");
expect(cat.sound(), "Purr");

// 可以再次调用
expect(cat.sound(), "Purr");

// 改变一下插桩
when(cat.sound()).thenReturn("Meow");
expect(cat.sound(), "Meow");

// You can stub getters.
when(cat.lives).thenReturn(9);
expect(cat.lives, 9);

// 抛出一个异常 
when(cat.lives).thenThrow(RangeError('Boo'));
expect(() => cat.lives, throwsRangeError);

// We can calculate a response at call time.
var responses = ["Purr", "Meow"];
when(cat.sound()).thenAnswer((_) => responses.removeAt(0));
expect(cat.sound(), "Purr");
expect(cat.sound(), "Meow");

// We can stub a method with multiple calls that happened in a particular order.
when(cat.sound()).thenReturnInOrder(["Purr", "Meow"]);
expect(cat.sound(), "Purr");
expect(cat.sound(), "Meow");
expect(() => cat.sound(), throwsA(isA<StateError>()));
```

## 主要功能

- 可通过标注或Fake的方式来生成mock类
- 可通过when().thenReturn()来模拟方法的返回值
  - thenReturn会返回Future或Stream，可能抛出ArgumentError
  - thenAnswer只会返回Future或Stream
- 可通过argThat()来模拟方法的参数
- reset重置
- 可通过verify()来验证方法的调用
  - verifyInOrder可校验顺序
  - 可通过verifyNoMoreInteractions()来验证没有更多的调用
  - 可通过reset()来重置mock
  - 可通过verifyZeroInteractions()来验证没有调用
  - 可通过verifyNever()来验证没有调用
  - 可通过verifyInOrder()来验证顺序
  - 可通过verifyStream()来验证Stream
  - 可通过verifyStreamEvent()来验证Stream的事件
- called能校验调用次数
- captured存储调用时的参数

## 参数匹配器

```dart
// You can use plain arguments themselves
when(cat.eatFood("fish")).thenReturn(true);

// ... including collection
swhen(cat.walk(["roof","tree"])).thenReturn(2);

// ... or matchers
//如果参数以dry开头，调用eatFood时返回结果为false
when(cat.eatFood(argThat(startsWith("dry")))).thenReturn(false);
when(cat.eatFood(any)).thenReturn(false);

// ... or mix arguments with matchers
when(cat.eatFood(argThat(startsWith("dry")), hungry: true)).thenReturn(true);
expect(cat.eatFood("fish"), isTrue);
expect(cat.walk(["roof","tree"]), equals(2));
expect(cat.eatFood("dry food"), isFalse);
expect(cat.eatFood("dry food", hungry: true), isTrue);

// You can also verify using an argument matcher.
verify(cat.eatFood("fish"));
verify(cat.walk(["roof","tree"]));
//参数包含food
verify(cat.eatFood(argThat(contains("food"))));


// You can verify setters.
cat.lives = 9;
verify(cat.lives=9);
如果一个参数不是 ArgMatcher， （如 any、 anyNamed、 argThat、 captureThat、等) 传递给 mock 方法的参数，那么 equals 匹配器用于参数匹配。 如果需要更严格的匹配，考虑下使用 argThat(identical(arg))。
尽管这样，注意 null 不能用作 ArgMatcher 参数相邻的参数，或传递一个未包装的值作为命名参数。例如：
verify(cat.hunt("backyard", null)); // OK：没有参数匹配器
verify(cat.hunt(argThat(contains("yard")), null)); // BAD: 相邻参数为 null
verify(cat.hunt(argThat(contains("yard")), argThat(isNull))); // OK: 使用参数匹配器包装
verify(cat.eatFood("Milk", hungry: null)); // BAD: 使用 null 作为命名参数
verify(cat.eatFood("Milk", hungry: argThat(isNull))); // BAD: 使用 null 作为命名参数```

### 命名参数

关于此语法，Mockito 现在有一个尴尬的麻烦：命名参数和参数匹配器需要比想象中更多的配置：必须在参数匹配器中声明参数的名称。这是因为我们无法依赖命名参数的位置，并且语言没有提供一个机制来回答 ”这个元素是在用作命名元素” 吗？

```dart
// GOOD: argument matchers include their names.
when(cat.eatFood(any, hungry: anyNamed('hungry'))).thenReturn(true);
when(cat.eatFood(any, hungry: argThat(isNotNull, named: 'hungry'))).thenReturn(false);
when(cat.eatFood(any, hungry: captureAnyNamed('hungry'))).thenReturn(false);
when(cat.eatFood(any, hungry: captureThat(isNotNull, named: 'hungry'))).thenReturn(true);

// BAD: argument matchers do not include their names.
when(cat.eatFood(any, hungry: any)).thenReturn(true);
when(cat.eatFood(any, hungry: argThat(isNotNull))).thenReturn(false);
when(cat.eatFood(any, hungry: captureAny)).thenReturn(false);
when(cat.eatFood(any, hungry: captureThat(isNotNull))).thenReturn(true);
```

## 校验

### 验证精确的调用次数/至少x次/永不

```dart
cat.sound();
cat.sound();

// Exact number of invocations
verify(cat.sound()).called(2);

// Or using matcher
verify(cat.sound()).called(greaterThan(1));

// Or never called
verifyNever(cat.eatFood(any));
验证顺序
cat.eatFood("Milk");
cat.sound();
cat.eatFood("Fish");
verifyInOrder([
  cat.eatFood("Milk"),
  cat.sound(),
  cat.eatFood("Fish")
]);

为之后的断言捕获参数captured
captured会存储调用参数
// Simple capture
cat.eatFood("Fish");
expect(verify(cat.eatFood(captureAny)).captured.single, "Fish");

// Capture multiple calls
cat.eatFood("Milk");
cat.eatFood("Fish");
expect(verify(cat.eatFood(captureAny)).captured, ["Milk", "Fish"]);

// Conditional capture
cat.eatFood("Milk");
cat.eatFood("Fish");
expect(verify(cat.eatFood(captureThat(startsWith("F")))).captured, ["Fish"]);
```

### Nice mocks vs classic mocks

Mockito有两种生成mocks的API，使用标注@GenerateNiceMocks和@GenerateMocks。推荐使用@GenerateNiceMocks，两者不同点：

- Nice Mocks：Nice Mocks是默认的模拟对象类型。它们在调用未定义的方法时会返回默认值，如0、null或空列表。这使得测试代码更容易编写，因为您不需要为每个未使用的方法定义行为。Nice Mocks适用于大多数情况下，特别是当您只关注被测试对象的部分行为时。
- Classic Mocks：Classic Mocks是严格的模拟对象类型。它们在调用未定义的方法时会抛出异常。Classic Mocks适用于需要精确控制模拟对象行为的情况，特别是当您希望确保被测试对象只调用模拟对象上的特定方法时


### 使用Fake来模拟类

```dart
// 假的类
class FakeCat extends Fake implements Cat {
  @override
  bool eatFood(String food, {bool? hungry}) {
    print('Fake eat $food');
    return true;
  }
}

void main() {
  // 在运行时创建一个新的假 Cat（实例）。
  var cat = FakeCat();

  cat.eatFood("Milk"); // 打印 'Fake eat Milk'。
  cat.sleep(); // 抛出
}


模拟抽象类
@GenerateMocks([Cat, Callbacks])
import 'cat_test.mocks.dart'

abstract class Callbacks {
  Cat findCat(String name);
}

void main() {
  var mockCat = MockCat();
  var findCatCallback = MockCallbacks().findCat;
  when(findCatCallback('Pete')).thenReturn(mockCat);
}
```


## 参考

- [使用Mockito模拟依赖关系](https://flutter.cn/docs/cookbook/testing/unit/mocking)
- [https://pub-web.flutter-io.cn/packages/mockito](https://pub-web.flutter-io.cn/packages/mockito)
- [Readme中文说明文档](https://juejin.cn/post/7060884659508346893)
- [Flutter如何Mock MethodChannel进行单元测试](https://www.duidaima.com/Group/Topic/Flutter/10262)