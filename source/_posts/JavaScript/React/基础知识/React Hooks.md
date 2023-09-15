---
title: React Hooks
tags: React
---



React Hooks产生的原因

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


useState
useEffect
useRef
useReducer


React Hooks组件从v16.8开始
https://legacy.reactjs.org/docs/hooks-intro.html

- [React Hooks 入门教程](https://www.ruanyifeng.com/blog/2019/09/react-hooks.html)

- [](https://segmentfault.com/a/1190000021261588)