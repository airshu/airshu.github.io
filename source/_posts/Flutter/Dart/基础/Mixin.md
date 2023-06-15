---
title: Mixin
toc: true
tags: Dart
---



## 定义

字面意思理解成混合，它可以混合多个类，达到多继承的效果。

当继承多个mixin，mixin内重写覆盖了同一个方法，则调用方法时会命中最后with的mixin对应的方法。如果需要链路调用，使用super。

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

on关键字用来限制mixin的使用，这个mixin只能使用在on指定的类或者其子类。


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

output：ß
A2.a()
A.a()
A.b()
B.b()
base b()
B.c()
base c()

```



## 参考

- [彻底理解 Dart mixin 机制](https://juejin.cn/post/6844903858209062920)
- [Dart 类的继承与混入(Mixin) extends 、 implements 、 with的用法与区别](https://blog.csdn.net/rd_w_csdn/article/details/103731273)
