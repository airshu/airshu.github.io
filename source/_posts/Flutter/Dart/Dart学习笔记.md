---
title: Dart学习笔记
toc: true
tags:
---

变量声明使用var、dynamic，虽然是静态语言，但支持类型推导。

assert只在开发环境有效

Final变量只能被设置一次，Const变量在编译时就已经固定

```java
final name = 'Bob'; // Without a type annotation
final String nickname = 'Bobby';

const bar = 1000000; // 压力单位 (dynes/cm2)
const double atm = 1.01325 * bar; // 标准气压

var foo = const [];
final bar = const [];
const baz = []; // Equivalent to `const []`

```


Dart内建类型


- Number
- String
- Boolean
- List (也被称为 Array)
- Map
- Set
- Rune (用于在字符串中表示 Unicode 字符)
- Symbol

```java

// String -> int
var one = int.parse('1');
assert(one == 1);

// String -> double
var onePointOne = double.parse('1.1');
assert(onePointOne == 1.1);

// int -> String
String oneAsString = 1.toString();
assert(oneAsString == '1');

// double -> String
String piAsString = 3.14159.toStringAsFixed(2);
assert(piAsString == '3.14');

```


=> expr 语法是 { return expr; } 的简写。 => 符号 有时也被称为 箭头 语法。

在箭头 (=>) 和分号 (;) 之间只能使用一个 表达式 ，不能是 语句 。 例如：不能使用 if 语句 ，但是可以是用 条件表达式.


```dart
bool isNoble(int atomicNumber) => _nobleGases[atomicNumber] != null;
```

```dart
//required 表示必须设置
const Scrollbar({Key key, @required Widget child})

//将参数放到 [] 中来标记参数是可选的
String say(String from, String msg, [String device]) {
  var result = '$from says $msg';
  if (device != null) {
    result = '$result with a $device';
  }
  return result;
}

//list 或 map 可以作为默认值传递
void doStuff(
    {List<int> list = const [1, 2, 3],
    Map<String, String> gifts = const {
      'first': 'paper',
      'second': 'cotton',
      'third': 'leather'
    }}) {
  print('list:  $list');
  print('gifts: $gifts');
}


//匿名函数
var list = ['apples', 'bananas', 'oranges'];
list.forEach((item) {
  print('${list.indexOf(item)}: $item');
});
```


花括号内的是变量可见的作用域


语法闭包

```dart

/// 返回一个函数，返回的函数参数与 [addBy] 相加。
Function makeAdder(num addBy) {
  return (num i) => addBy + i;
}

void main() {
  // 创建一个加 2 的函数。
  var add2 = makeAdder(2);

  // 创建一个加 4 的函数。
  var add4 = makeAdder(4);

  assert(add2(3) == 5);
  assert(add4(3) == 7);
}

```



Description |	Operator
--- | ---
unary postfix| 	expr++    expr--    ()    []    .    ?.
unary prefix |	-expr    !expr    ~expr    ++expr    --expr   
multiplicative| 	*    /    %  ~/
additive |	+    -
shift |	<<    >>    >>>
bitwise AND |	&
bitwise XOR |	^
bitwise OR 	|  &#124;
relational and type test| 	>=    >    <=    <    as    is    is!
equality| 	==    !=   
logical AND |	&&
logical OR |	||
if null |	??
conditional |	expr1 ? expr2 : expr3
cascade |	..
assignment |	=    *=    /=   +=   -=   &=   ^=   etc.



```dart
// 将值赋值给变量a
a = value;
// 如果b为空时，将变量赋值给b，否则，b的值保持不变。
b ??= value;
```

级联运算符 (..) 可以实现对同一个对像进行一系列的操作。 除了调用函数， 还可以访问同一对象上的字段属性。 这通常可以节省创建临时变量的步骤， 同时编写出更流畅的代码。

```dart
querySelector('#confirm') // 获取对象。
  ..text = 'Confirm' // 调用成员变量。
  ..classes.add('important')
  ..onClick.listen((e) => window.alert('Confirmed!'));
 
// 等价于
var button = querySelector('#confirm');
button.text = 'Confirm';
button.classes.add('important');
button.onClick.listen((e) => window.alert('Confirmed!'));  
 
```



Mixin 


import 

```dart

import 'package:lib1/lib1.dart';
import 'package:lib2/lib2.dart' as lib2;

// 使用 lib1 中的 Element。
Element element1 = Element();

// 使用 lib2 中的 Element。
lib2.Element element2 = lib2.Element();


// Import only foo.
import 'package:lib1/lib1.dart' show foo;

// Import all names EXCEPT foo.
import 'package:lib2/lib2.dart' hide foo;

// 要延迟加载一个库，需要先使用 deferred as 来导入
import 'package:greetings/hello.dart' deferred as hello;

Future greet() async {
  await hello.loadLibrary();
  hello.printGreeting();
}



```


- 如何组织库的源文件。
- 如何使用 export 命令。
- 何时使用 part 命令。
- 何时使用 library 命令



call


typedefs 


