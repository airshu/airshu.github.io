---
title: Flutter代码规范
toc: true
tags: Flutter
---



好的代码有一个非常重要的特点就是拥有好的风格。一致的命名、一致的顺序、以及一致的格式让代码看起来是一样的。



## Dart代码规范


### 标识符



在 Dart 中标识符有三种类型。

- UpperCamelCase 每个单词的首字母都大写，包含第一个单词。
- lowerCamelCase 除了第一个字母始终是小写（即使是缩略词），每个单词的首字母都大写。
- lowercase_with_underscores 只是用小写字母单词，即使是缩略词，并且单词之间使用 _ 连接


#### UpperCamelCase使用场景

1. Classes（类名）、 enums（枚举类型）、 typedefs（类型定义）、以及 type parameters（类型参数）应该把每个单词的首字母都大写（包含第一个单词），不使用分隔符。

2. 扩展

```dart
class SliderMenu { ... }

class HttpRequest { ... }

typedef Predicate<T> = bool Function(T value);

extension MyFancyList<T> on List<T> { ... }

extension SmartIterable<T> on Iterable<T> { ... }

```


#### lowercase_with_underscores使用场景

1. 库的名字、package的名字、文件夹名字、文件名、源文件名

```dart

import 'dart:math' as math;
import 'package:angular_components/angular_components.dart' as angular_components;
import 'package:js/js.dart' as js;

//
my_package
└─ lib
   └─ file_system.dart
   └─ slider_menu.dart


```



#### lowerCamelCase使用场景

1. 类成员、顶级定义、变量、参数以及命名参数等 除了第一个单词，每个单词首字母都应大写，并且不使用分隔符。

2. 常量


```dart

var count = 3;

HttpRequest httpRequest;

void align(bool clearItems) {
  // ...
}


const pi = 3.14;
const defaultTimeout = 1000;
final urlScheme = RegExp('^([a-z]+):');

class Dice {
  static final numberGenerator = Random();
}

```





### 不要使用前缀字母

在编译器无法帮助你了解自己代码的时， 匈牙利命名法 和其他方案出现在了 BCPL ，但是因为 Dart 可以提示你声明的类型，范围，可变性和其他属性，所以没有理由在标识符名称中对这些属性进行编码。

```dart
// good
defaultTimeout

// bad
kDefaultTimeout
```


### 顺序

为了使文件前面部分保持整洁，我们规定了关键字出现顺序的规则。每个“部分”应该使用空行分割。


1. 要把"dart:"导入语句放到其他导入语句之前
2. 要把"package:"导入语句放到项目相关导入语句之前
3. 要把导出（export）语句作为一个单独的部分放到所有导入语句之后
4. 按照字母顺序排序


```dart
import 'dart:async';
import 'dart:html';

import 'package:bar/bar.dart';
import 'package:foo/foo.dart';

import 'util.dart';

export 'src/error.dart';

```

### 代码格式化

格式化要严格要求，不然不同的提交会产生不必要的冲突。可以通过IDE的插件配置提交前格式化，平时写完代码也可手动格式化


### 单行宽度

以前由于屏幕小，一般要求宽度不能超过80.这里只要团队内统一一个值，大家根据实际情况调整即可。建议设置成140


### 流控制结构使用花括号

统一规范，if后面必须使用花括号。


### 不推荐使用new


### 在不需要的时候不要使用this




## 项目中配置代码规范

参考 [Flutter静态代码检测](./未分类/Flutter静态代码检测)





## 参考


- [https://dart.cn/guides/language/effective-dart/style](https://dart.cn/guides/language/effective-dart/style)
- []()
- []()
- []()
- []()