---
title: ES6
tags: JavaScript
---



## Babel 转码器

Babel 是一个广泛使用的 ES6 转码器，可以将 ES6 代码转为 ES5 代码，从而在老版本的浏览器执行。这意味着，你可以用 ES6 的方式编写程序，又不用担心现有环境是否支持。下面是一个例子

```js
// 转码前
input.map(item => item + 1);

// 转码后
input.map(function (item) {
  return item + 1;
});

```


## let 和 const 命令

ES6 新增了let命令，用来声明变量。它的用法类似于var，但是所声明的变量，只在let命令所在的代码块内有效

```js

{
  let a = 10;
  var b = 1;
}

a // ReferenceError: a is not defined.
b // 1

// for循环很适合使用let命令
for (let i = 0; i < 10; i++) {
  // ...
}
console.log(i);
// ReferenceError: i is not defined


```


const声明一个只读的常量。一旦声明，常量的值就不能改变。

```js
const PI = 3.1415;
PI // 3.1415

PI = 3;
// TypeError: Assignment to constant variable.

```

## 顶层对象的属性

顶层对象，在浏览器环境指的是window对象，在 Node 指的是global对象。ES5 之中，顶层对象的属性与全局变量是等价的。

```js
window.a = 1;
a // 1

a = 2;
window.a // 2

```

ES6 为了保持兼容性，var命令和function命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。也就是说，从 ES6 开始，全局变量将逐步与顶层对象的属性脱钩。


```js
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b // undefined


```

## globalThis对象

JavaScript 语言存在一个顶层对象，它提供全局环境（即全局作用域），所有代码都是在这个环境中运行。但是，顶层对象在各种实现里面是不统一的。

- 浏览器里面，顶层对象是window，但 Node 和 Web Worker 没有window。
- 浏览器和 Web Worker 里面，self也指向顶层对象，但是 Node 没有self。
- Node 里面，顶层对象是global，但其他环境都不支持

ES2020 在语言标准的层面，引入globalThis作为顶层对象。也就是说，任何环境下，globalThis都是存在的，都可以从它拿到顶层对象，指向全局环境下的this


## 变量的解构赋值

```js

let a = 1;
let b = 2;
let c = 3;

//ES6 可以这样写，允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。
let [a, b, c] = [1, 2, 3];

let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3

let [ , , third] = ["foo", "bar", "baz"];
third // "baz"

let [x, , y] = [1, 2, 3];
x // 1
y // 3

let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a'];
x // "a"
y // undefined  如果解构不成功，变量的值就等于undefined
z // []


//不完全解构
let [x, y] = [1, 2, 3];
x // 1
y // 2

let [a, [b], d] = [1, [2, 3], 4];
a // 1
b // 2
d // 4


//设置默认值
let [foo = true] = [];
foo // true

let [x, y = 'b'] = ['a']; // x='a', y='b'
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'


//对象的解构赋值，对象的属性没有次序，变量必须与属性同名，才能取到正确的值。
let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
foo // "aaa"
bar // "bbb"

//字符串的解构赋值
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"

let {length : len} = 'hello';
len // 5


// 返回一个数组
function example() {
  return [1, 2, 3];
}
let [a, b, c] = example();

// 返回一个对象
function example() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example();

//提取json数据
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]

```


## 字符串

### 模版字符串

```js



```

### 标签模版




## 函数的扩展

### 函数参数的默认值

```js

function log(x, y = 'World') {
  console.log(x, y);
}

log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello


```


### 与解构赋值默认值结合使用

```js


function foo({x, y = 5}) {
  console.log(x, y);
}

foo({}) // undefined 5
foo({x: 1}) // 1 5
foo({x: 1, y: 2}) // 1 2
foo() // TypeError: Cannot read property 'x' of undefined
```

### 箭头函数

```js

var f = v => v;

// 等同于
var f = function (v) {
  return v;
};



// 普通函数写法
[1,2,3].map(function (x) {
  return x * x;
});

// 箭头函数写法
[1,2,3].map(x => x * x);


```


**注意点**

- 箭头函数没有自己的this对象
- 不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误
- 不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替
- 不可以使用yield命令，因此箭头函数不能用作 Generator 函数




## 数组的扩展

- Array.from()
- Array.of()
- 实例方法：
  - copyWithin()
  - find()
  - findIndex()
  - findLast()
  - findLastIndex()
  - fill()
  - entries()
  - keys()
  - values()
  - includes()
  - flat()
  - flatMap()
  - at()
  - toReversed()
  - toSorted()
  - toSpliced()
  - with()
  - group()
  - groupToMap()

### 扩展运算符

```js
function f(v, w, x, y, z) { }
const args = [0, 1];
f(-1, ...args, 2, ...[3]);


const arr = [
  ...(x > 0 ? ['a'] : []),
  'b',
];


//字符串扩展运算符
[...'hello']
// [ "h", "e", "l", "l", "o" ]


```


## 对象的扩展

### 属性的简洁表示法

```js
const foo = 'bar';
const baz = {foo};
baz // {foo: "bar"}
// 等同于
const baz = {foo: foo};




function f(x, y) {
  return {x, y};
}
// 等同于
function f(x, y) {
  return {x: x, y: y};
}
f(1, 2) // Object {x: 1, y: 2}


//方法简写
const o = {
  method() {
    return "Hello!";
  }
};
// 等同于
const o = {
  method: function() {
    return "Hello!";
  }
};

```

### 属性名表达式

```js


let propKey = 'foo';
let obj = {
  [propKey]: true,
  ['a' + 'bc']: 123
};


```


### 属性的遍历

```js

（1）for...in

for...in循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。

（2）Object.keys(obj)

Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。

（3）Object.getOwnPropertyNames(obj)

Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。

（4）Object.getOwnPropertySymbols(obj)

Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有 Symbol 属性的键名。

（5）Reflect.ownKeys(obj)

Reflect.ownKeys返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

```


### super

指向当前对象的原型对象

```js
const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
};

Object.setPrototypeOf(obj, proto);
obj.find() // "hello"

```


上面代码中，对象obj.find()方法之中，通过super.foo引用了原型对象proto的foo属性。

注意，super关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错。



## 对象的新增方法

```js

Object.is() // 比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。

Object.assign() // 用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。

const target = { a: 1, b: 1 };

const source1 = { b: 2, c: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}


Object.getOwnPropertyDescriptors() // 返回指定对象所有自身属性（非继承属性）的描述对象。

__proto__属性（前后各两个下划线），用来读取或设置当前对象的原型对象（prototype）

Object.setPrototypeOf方法的作用与__proto__相同，用来设置一个对象的原型对象（prototype），返回参数对象本身。它是 ES6 正式推荐的设置原型对象的方法

Object.keys() // 返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名。

Object.values() // 返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值。

Object.entries() // 返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组。

Object.fromEntries() // 是Object.entries()的逆操作，用于将一个键值对数组转为对象。

Object.hasOwn() // JavaScript 对象的属性分成两种：自身的属性和继承的属性。对象实例有一个hasOwnProperty()方法，可以判断某个属性是否为原生属性。ES2022 在Object对象上面新增了一个静态方法Object.hasOwn()，也可以判断是否为自身的属性。Object.hasOwn()可以接受两个参数，第一个是所要判断的对象，第二个是属性名。


```


## 运算符的扩展

```js
//指数运算符
2 ** 2 // 4
2 ** 3 // 8

//链判断运算符

const firstName = message?.body?.user?.firstName || 'default';
const fooValue = myForm.querySelector('input[name=foo]')?.value
a?.b
// 等同于
a == null ? undefined : a.b

a?.[x]
// 等同于
a == null ? undefined : a[x]

a?.b()
// 等同于
a == null ? undefined : a.b()

a?.()
// 等同于
a == null ? undefined : a()



//Null 判断运算符
const animationDuration = response.settings?.animationDuration ?? 300;

// 逻辑赋值运算符

// 或赋值运算符
x ||= y
// 等同于
x || (x = y)

// 与赋值运算符
x &&= y
// 等同于
x && (x = y)

// Null 赋值运算符
x ??= y
// 等同于
x ?? (x = y)



```


## Set和Map数据结构

```js

// Set类似于数组，但是成员的值都是唯一的，没有重复的值。

// WeakSet结构与Set类似，也是不重复的值的集合。但是，它与Set有两个区别。
// - WeakSet 的成员只能是对象和 Symbol 值，而不能是其他类型的值
// - WeakSet 中的对象都是弱引用


// Map类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。

const map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2

const m = new Map();

const hello = function() {console.log('hello');};
m.set(hello, 'Hello ES6!') // 键是函数

m.get(hello)  // Hello ES6!

const m = new Map();
m.set(undefined, 'nah');
m.has(undefined)     // true

m.delete(undefined)
m.has(undefined)       // 

let map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
map.clear()
map.size // 0


Map.prototype.keys()：返回键名的遍历器。
Map.prototype.values()：返回键值的遍历器。
Map.prototype.entries()：返回所有成员的遍历器。
Map.prototype.forEach()：遍历 Map 的所有成员。


// WeakMap

// WeakRef 


```


## Proxy








## 参考

- [阮一峰ES6入门教程](https://es6.ruanyifeng.com/#README)