---
title: JavaScript入门
tags: JavaScript
---


先了解一下JS的历史：[Javascript诞生记](https://www.ruanyifeng.com/blog/2011/06/birth_of_javascript.html)
。基本的语法，从官方文档开始：[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

## 一些知识点


原义字符|等价字符引用
--|--|
`<` |`&lt;`
`>` |`&gt;`
`"` | &quot;
'  | &apos;
&  | &amp;



```html
<p>HTML 中用 <p> 来定义段落元素。</p>

<p>HTML 中用 &lt;p&gt; 来定义段落元素</p>

```

### HTML头

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>我的测试页面</title>
    <link rel="icon" href="favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="my-css-file.css" />
    <script src="my-js-file.js" defer></script>
  </head>
  <body>
    <p>这是我的页面</p>
  </body>
</html>


```

- title：表示页面标题
- meta：元数据
- link：自定义图标
- script：引入需要加载的js文件


## 常见标签

```html
<h1>标题元素标签，数字表示不同大小</h1>
<h2></h2>
<h3></h3>
<h4></h4>
<h5></h5>
<h6></h6>

<!--无序列表 -->
<ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>

<p>
  我创建了一个指向 <a href="https://www.mozilla.org/zh-CN/">Mozilla 主页</a>的链接。
</p>

<!--上标和下标 -->
<p>
  咖啡因的化学方程式是
  C<sub>8</sub>H<sub>10</sub>N<sub>4</sub>O<sub>2</sub>。
</p>
<p>如果 x<sup>2</sup> 的值为 9，那么 x 的值必为 3 或 -3。</p>



<div> </div>

<!-- 可在段落中进行换行  -->
<br/>

<!-- 元素在文档中生成一条水平分割线  -->
<hr/>

<img src="images/dinosaur.jpg"
     alt="一只恐龙头部和躯干的骨架，它有一个巨大的头，长着锋利的牙齿。"
     width="400"
     height="341"
     title="A T-Rex on display in the Manchester University Museum" >


<video controls>
  <source src="rabbit320.mp4" type="video/mp4">
  <source src="rabbit320.webm" type="video/webm">
  <p>你的浏览器不支持 HTML5 视频。可点击<a href="rabbit320.mp4">此链接</a>观看</p>
</video>


<iframe src="https://developer.mozilla.org/zh-CN/docs/Glossary"
        width="100%" height="500" frameborder="0"
        allowfullscreen sandbox>
  <p> <a href="https://developer.mozilla.org/zh-CN/docs/Glossary">
    Fallback link for browsers that don't support iframes
  </a> </p>
</iframe>


<picture>
  <source type="image/svg+xml" srcset="pyramid.svg" />
  <source type="image/webp" srcset="pyramid.webp" />
  <img src="pyramid.png" alt="regular pyramid built from four equilateral triangles" />
</picture>

<table>
  <tr>
    <td>&nbsp;</td>
    <td>Knocky</td>
    <td>Flor</td>
    <td>Ella</td>
    <td>Juan</td>
  </tr>
  <tr>
    <td>Breed</td>
    <td>Jack Russell</td>
    <td>Poodle</td>
    <td>Streetdog</td>
    <td>Cocker Spaniel</td>
  </tr>
  <tr>
    <td>Age</td>
    <td>16</td>
    <td>9</td>
    <td>10</td>
    <td>5</td>
  </tr>
  <tr>
    <td>Owner</td>
    <td>Mother-in-law</td>
    <td>Me</td>
    <td>Me</td>
    <td>Sister-in-law</td>
  </tr>
  <tr>
    <td>Eating Habits</td>
    <td>Eats everyone's leftovers</td>
    <td>Nibbles at food</td>
    <td>Hearty eater</td>
    <td>Will eat till he explodes</td>
  </tr>
</table>


```

## HTML文档的组成部分

- 页眉：<header>  是简介形式的内容。如果它是 <body> 的子元素，那么就是网站的全局页眉。如果它是 <article> 或<section> 的子元素，那么它是这些部分特有的页眉
- 导航栏：<nav> 包含页面主导航功能。其中不应包含二级链接等内容
- 主内容：<main> <main> 存放每个页面独有的内容。每个页面上只能用一次 <main>，且直接位于 <body> 中。最好不要把它嵌套进其他元素
- 侧边栏：<aside> 包含一些间接信息（术语条目、作者简介、相关链接，等等）
- 页脚：<footer>


## CSS

CSS能定义网页中特定元素样式的一组规则

使用CSS的方式

### 改变元素的默认行为

```css
li {
  list-style-type: none;
}
```

### 使用类名

```css
<ul>
  <li>项目一</li>
  <li class="special">项目二</li>
  <li>项目 <em>三</em></li>
</ul>

.special {
  color: orange;
  font-weight: bold;
}

#对类名是special，标签类型是li和span使用样式
li.special,
span.special {
  color: orange;
  font-weight: bold;
}


```

### 根据元素在文档中的位置确定样式

```css
/*选择<li>内部的任何<em>元素*/
li em {
  color: rebeccapurple;
}

```

### 根据状态确定样式

```css
a:link {
  color: pink;
}

a:visited {
  color: green;
}

```


### 同时使用选择器和选择器

```css
/* selects any <span> that is inside a <p>, which is inside an <article>  */
article p span { ... }

/* selects any <p> that comes directly after a <ul>, which comes directly after an <h1>  */
h1 + ul + p { ... }


body h1 + p .special {
  color: yellow;
  background-color: black;
  padding: 5px;
}


```

### 冲突规则

- 层叠：后面的样式会覆盖前面的
- 优先级：类被认为更具体，优先级高于元素选择器

## 主流JavaScript框架

- Ember：Ember 于 2011 年 12 月发布，最初作为 SproutCore 项目的延续而开始。比其新式的替代品（例如 React 和 Vue），作为老框架，它的用户人数要少得多。但因其稳定性、社区支持以及编程原则都非常良好，它仍然享有很高的知名度
- Angular：一种基于组件的框架，使用声明式的 HTML 模板。在应用构建时，框架的编译器将 HTML 模板转换为优化好的 JavaScript 指令，这一过程对开发者是透明的。Angular 使用 TypeScript
- Vue
- React：2013年Facebook发布