---
title: Mixin
toc: true
tags: Dart
---


## 抽象类

Dart中，extends只能继承一个类。没有interface关键字，可以把抽象类当成接口使用。

使用abstract修饰类名，抽象函数不需要使用abstract修饰。抽象类不能实例化。

```dart
/// 抽象类
abstract class Animal{
  late String name;  //数据
  void display(){  //普通函数
    print("名字是:${name}");
  }
  /// 可以不用abstract修饰
  void eat(); //抽象函数
}

class Dog extends Animal{
  /// 实现抽象方法
  @override
  void eat() { //实现抽象函数
    print("eat");
  }
}
```

## 函数重写

```dart
class Animal {
    late String name;
    void run() {
        print('run');
    }
}

class Tiger extends Animal {
    @Override
    void run() {
        print('Tiger run');
    }
}
```

使用Override修饰符，函数名字相同。


## Mixin

字面意思理解成混合，它可以混合多个类，达到多继承的效果。

```dart
mixin A {
  test() {
    print('A');
  }
}
mixin B {
  test() {
    print('B');
  }
}

class C {
  test() {
    print('C');
  }
}
/// 使用with关键字，后跟一个或多个mixin或者普通类
class D extends C with A, B {}

class E extends C with B, A {}


main() {
  D d = D();
  d.test();

  E e = E();
  e.test();
}

output:
B
A


class D extends C with A, B {}
可以理解成：
class CA = C with A;
class CAB = CA with B;
class D extends CAS {}
所以输出结果为B

class E extends C with B, A {}
class CB = C with B;
class CBA = CB with A;
class E extends CBA;
所以输出结果为A


```

### on

on关键字用来限制mixin的使用，指定所需的超类或者mixin

```dart
abstract class Base {
  a() {
    print("base a()");
  }

  b() {
    print("base b()");
  }

  c() {
    print("base c()");
  }
}

mixin A on Base {
  a() {
    print("A.a()");
    //super.a();
  }

  b() {
    print("A.b()");
    super.b();
  }
}

mixin A2 on Base {
  a() {
    print("A2.a()");
    super.a();
  }
}

class B extends Base {
  a() {
    print("B.a()");
    super.a();
  }

  b() {
    print("B.b()");
    super.b();
  }

  c() {
    print("B.c()");
    super.c();
  }
}

class G extends B with A, A2 {

}


testMixins() {
  G t = new G();
  t.a();
  t.b();
  t.c();
}

output：
A2.a()
A.a()
A.b()
B.b()
base b()
B.c()
base c()

```




## 参考

- [Dart 类的继承与混入(Mixin) extends 、 implements 、 with的用法与区别](https://blog.csdn.net/rd_w_csdn/article/details/103731273)
