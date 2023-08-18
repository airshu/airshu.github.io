---
title: TypeScript入门
tags: TypeScript
---




约定使用 TypeScript 编写的文件以 .ts 为后缀，用 TypeScript 编写 React 时，以 .tsx 为后缀。

```shell
#全局安装typescript
npm install -g typescript
#编译
ts xxx.ts
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


## 参考




- [官方手册](www.typescriptlang.org/docs/handbook/basic-types.html)

- [阮一峰TypeScript教程](https://wangdoc.com/typescript/)


- [TypeScript 入门教程](https://ts.xcatliu.com/)