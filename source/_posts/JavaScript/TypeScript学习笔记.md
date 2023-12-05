---
title: TypeScript入门
tags: TypeScript JavaScript
---




约定使用 TypeScript 编写的文件以 .ts 为后缀，用 TypeScript 编写 React 时，以 .tsx 为后缀。

```shell
#全局安装typescript
npm install -g typescript
#编译
tsc xxx.ts
#运行
node xxx.js
```

## 基础

### 原始数据类型

JavaScript的类型分为：

- 原始数据类型：布尔值、数值、字符串、null、undeined、Symbol、BigInt
- 对象类型
  - 接口
  - 数组

```typescript

### 接口

// 接口类型
interface Person {
  name: string;
  age?: number; //?表示可选属性
  readonly id: number; //只读属性
  [propName: string]: any; //任意属性
}


let tom: Person = {
  id: 89757,
  name: 'Tom',
  age: 25,
  gender: 'male'
};


```


### 声明文件

声明文件必需以 .d.ts 为后缀。


库的使用场景主要有以下几种：

- 全局变量：通过 <script> 标签引入第三方库，注入全局变量
- npm 包：通过 import foo from 'foo' 导入，符合 ES6 模块规范
- UMD 库：既可以通过 <script> 标签引入，又可以通过 import 导入
- 直接扩展全局变量：通过 <script> 标签引入后，改变一个全局变量的结构
- 在 npm 包或 UMD 库中扩展全局变量：引用 npm 包或 UMD 库后，改变一个全局变量的结构
- 模块插件：通过 <script> 或 import 导入后，改变另一个模块的结构


在 ES6 模块系统中，使用 export default 可以导出一个默认值，使用方可以用 import foo from 'foo' 而不是 import { foo } from 'foo' 来导入这个默认值

注意，只有 function、class 和 interface 可以直接默认导出，其他的变量需要先定义出来，再默认导出

```ts
    declare var 声明全局变量
    declare function 声明全局方法
    declare class 声明全局类
    declare enum 声明全局枚举类型
    declare namespace 声明（含有子属性的）全局对象
    interface 和 type 声明全局类型
    export 导出变量
    export namespace 导出（含有子属性的）对象
    export default ES6 默认导出
    export = commonjs 导出模块
    export as namespace UMD 库声明全局变量
    declare global 扩展全局变量
    declare module 扩展模块
    /// <reference /> 三斜线指令
```




## import中@的作用

路径映射，可以在tsconfig.json中配置

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@nui/*": ["src/*"]
    }
  }
}
```

使用

```JavaScript

import { YYYY } from '@nui/xxx';

```


## 扩展全局变量的类型

```ts
interface String {
    // 这里是扩展，不是覆盖，所以放心使用
    double(): string;
}

String.prototype.double = function () {
    return this + '+' + this;
};
console.log('hello'.double());


```

## 参考




- [官方手册](www.typescriptlang.org/docs/handbook/basic-types.html)

- [阮一峰TypeScript教程](https://wangdoc.com/typescript/)


- [TypeScript 入门教程](https://ts.xcatliu.com/)