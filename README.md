## mini-react [![github](https://img.shields.io/badge/mini-react-brightgreen)](https://github.com/heshiweij/mini-react)

实现核心的 React 模型，用于深入学习 React， 让你更轻松的理解 React 的核心逻辑

- 按最小功能 commit，查看历史提交 + debugger 即可读懂代码
- 准备了大量的 example，通俗易懂，方便初学者入门

其他仓库:

- [mini-react-router](https://github.com/heshiweij/mini-react-router)
- [mini-redux](https://github.com/heshiweij/mini-redux)

## Usage

install

```shell
yarn install
```

copy example

```
copy ./src/examples/xx.js ->  ./src/index.js
```

run it

```shell
yarn start
```

build

```shell
yarn build
```

## Why

当我们需要深入学习 React 时，我们就需要看源码来学习，但是像这种工业级别的库，源码中有很多逻辑是用于处理边缘情况或者是兼容处理逻辑，是不利于我们学习的。

我们应该关注于核心逻辑，而这个库的目的就是把 React 源码中最核心的逻辑剥离出来，只留下核心逻辑，以供大家学习。

## How

基于 React 的功能点，一点一点的拆分出来。

从 0 到 1 实现一个核心的 React 模型，实现了 React 最常用的功能：React、ReactDOM 两个核心模块、类和函数组件渲染、完整的生命周期、hooks

### Support

#### component

- [√] 支持函数组件、类组件渲染
- [√] State 和视图更新逻辑
- [√] 组件 ref
- [√] 常用的生命周期
- [√] Context
- [√] PureComponent
- [√] React.memo

#### hooks

用自己的 hooks 支持现有的 demo 运行

- [√] useReducer
- [√] useEffect & useLayoutEffect
- [√] useRef
- [√] useCallback、useMemo
- [√] React.Children

#### Other

- [√] 高阶组件、Render Props
- [√] 合成事件、state 批量执行

## TODO

- [x] AST 解析 JSX（目前用的 babel）
- [x] mini-cra
