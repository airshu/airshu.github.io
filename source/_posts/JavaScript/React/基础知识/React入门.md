---
title: React入门
tags: React
---

React时一个用于构建用户界面的库，使用JSX（JavaScript和XML）的HTML-in-JavaScript语法。该语法能提升编码效率，浏览器是无法直接解析JSX的，通过Babel或Parcel之类的工具进行编译，生成浏览器能解析的JS代码。

React依赖Node.js。Node包含npm（Node程序包管理器）和npx（Node程序包运行器）

创建React项目

```shell
#默认使用yarn
npx create-react-app moz-todo-react --use-npm
cd moz-todo-react
npm start
```

## 项目文件结构

```xml
moz-todo-react
├── README.md
├── node_modules
├── package.json
├── package-lock.json
├── .gitignore
├── public
│   ├── favicon.ico
│   ├── index.html #React将src的代码嵌入到这个文件
│   └── manifest.json
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    └── serviceWorker.js
```


- [React示例-代办列表]()