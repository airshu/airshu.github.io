---
title: React Hooks
tags: React
---



## React Hooks产生的原因

Functional（Stateless）Component，功能组件也叫无状态组件，一般只负责渲染。

```JavaScript

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Class（Stateful）Component，类组件也是有状态组件，一般有交互逻辑和业务逻辑。

```JavaScript
class Welcome extends React.Component {
    state = {
        name: ‘tori’,
    }
  componentDidMount() {
        fetch(…);
        …
    }
  render() {
    return (
        <>
            <h1>Hello, {this.state.name}</h1>
            <button onClick={() => this.setState({name: ‘007’})}>改名</button>
        </>
      );
  }
}

```


Presentational Component则是和功能组件类似

```JavaScript
const Hello = (props) => {
  return (
    <div>
      <h1>Hello! {props.name}</h1>
    </div>
  )
}

```

![](./hooks_1.png)

- useState：状态管理，某个状态发生变化，组件重新渲染
- useEffect： 在函数组件中执行副作用操作，方便，且避免不必要的bug
- useRef：
- useReducer：
- useCallback：

React Hooks组件从v16.8开始

- [官方文档Introducing Hooks](https://legacy.reactjs.org/docs/hooks-intro.htm)
- [React Hooks 入门教程](https://www.ruanyifeng.com/blog/2019/09/react-hooks.html)
- [使用 Effect Hook](https://zh-hans.legacy.reactjs.org/docs/hooks-effect.html)
- [](https://segmentfault.com/a/1190000021261588)
- [](https://juejin.cn/post/7118937685653192735)