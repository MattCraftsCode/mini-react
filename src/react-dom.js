import {
  REACT_CONTEXT,
  REACT_FORWARD_REF_TYPE,
  REACT_MEMO,
  REACT_PROVIDER,
  REACT_TEXT,
} from "./constants";
import { addEvent } from "./event";

const hookState = [];
let hookIndex = 0;
let scheduleUpdate;

/**
 * 把虚拟 DOM 转成 DOM 并插入到文档中
 * @param {} vdom
 * @param {*} container
 */
function render(vdom, container) {
  mount(vdom, container);

  scheduleUpdate = () => {
    hookIndex = 0;
    console.log("开始更新", hookState, hookIndex);
    compareTwoVDOM(container, vdom, vdom);
  };
}

function mount(vdom, container) {
  // 将 vdom 转成 dom
  let newDOM = createDOM(vdom);

  // 将 dom 插入到 container 中
  container.appendChild(newDOM);

  // 组件初始化完成，插入到 container 后调用 componentDidMount
  if (newDOM.componentDidMount) {
    newDOM.componentDidMount();
  }
}

export function useReducer(reducer, initialState) {
  hookState[hookIndex] = hookState[hookIndex] || initialState;

  let currentIndex = hookIndex;
  function dispatch(action) {
    hookState[currentIndex] = reducer
      ? reducer(hookState[currentIndex], action)
      : action;
    scheduleUpdate();
  }
  return [hookState[hookIndex++], dispatch];
}

// 实现二: useState 是 useReducer 的语法糖
export function useState(initialState) {
  return useReducer(null, initialState);
}

// 实现一
// export function useState(initialState) {
//   hookState[hookIndex] = hookState[hookIndex] || initialState;

//   let currentIndex = hookIndex;
//   function setState(newState) {
//     hookState[currentIndex] = newState;
//     scheduleUpdate();
//   }
//   return [hookState[hookIndex++], setState];
// }

export function useMemo(factory, deps) {
  // 判断是否该值已经设置过了
  // 为什么这里可以使用全局的 hookIndex？因为更新组件之前，已经重置了 hookIndex = 0
  if (hookState[hookIndex]) {
    // 发现前面已经设置过
    let [lastMemo, lastDeps] = hookState[hookIndex];
    // 是否每一项都相等（逐项比较新的 deps 和上一次的 lastDeps）
    let everySome = deps.every((item, index) => item === lastDeps[index]);
    if (everySome) {
      hookIndex++;
      return lastMemo;
    }
  }

  // 通过调用 callback，获取到真正要存储的值
  let newMemo = factory();
  // 将最新的值，和依赖的数组保存到 hookState
  hookState[hookIndex++] = [newMemo, deps];
  return newMemo;
}

export function useCallback(callback, deps) {
  // 判断是否该值已经设置过了
  // 为什么这里可以使用全局的 hookIndex？因为更新组件之前，已经重置了 hookIndex = 0
  if (hookState[hookIndex]) {
    // 发现前面已经设置过
    let [lastMemo, lastDeps] = hookState[hookIndex];
    // 是否每一项都相等（逐项比较新的 deps 和上一次的 lastDeps）
    let everySome = deps.every((item, index) => item === lastDeps[index]);
    if (everySome) {
      hookIndex++;
      return lastMemo;
    }
  }

  // 将最新的值，和依赖的数组保存到 hookState
  hookState[hookIndex++] = [callback, deps];
  return callback;
}

/**
 * 把虚拟 DOM 转成 DOM
 * @param {*} vdom
 * @returns
 */
function createDOM(vdom) {
  let { type, props, ref } = vdom;
  let dom;
  if (type && type.$$typeof === REACT_MEMO) {
    return mountMemoComponent(vdom);
  } else if (type && type.$$typeof === REACT_CONTEXT) {
    // 处理 context.consumer
    return mountContextComponent(vdom);
  } else if (type && type.$$typeof === REACT_PROVIDER) {
    // 处理 context.provider
    return mountProviderComponent(vdom);
  } else if (type && type.$$typeof === REACT_FORWARD_REF_TYPE) {
    // 处理 forward 组件
    return mountForwardComponent(vdom);
  } else if (type === REACT_TEXT) {
    // console.log("type", type);
    // 如果是文本类型，则创建文本节点
    dom = document.createTextNode(props.content);
  } else if (typeof type === "function") {
    if (type.isReactComponent) {
      // 挂载类组件
      return mountClassComponent(vdom); // 已经给 ref 赋值了
    } else {
      // 挂载函数组件
      return mountFunctionComponent(vdom);
    }
  } else {
    // 否则创建成元素节点
    dom = document.createElement(vdom.type);
  }

  if (props) {
    // 解析属性
    updateProps(dom, {}, props);
    if (typeof props.children === "object" && props.children.type) {
      // 递归解析
      render(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
  }

  // 让 vdom 的 dom 属性指向真实 dom
  vdom.dom = dom;

  if (ref) {
    ref.current = dom;
  }

  return dom;
}

// 处理 memo
function mountMemoComponent(vdom) {
  let { type, props } = vdom;
  let renderVDOM = type.type(props);
  vdom.prevProps = props; // 记录一下老的属性对象，在更新的时候会用到
  vdom.oldRenderVDOM = renderVDOM;
  return createDOM(renderVDOM);
}

// 处理 context.consumer
function mountContextComponent(vdom) {
  let { type, props } = vdom;
  let renderVDOM = props.children(type._context._currentValue);
  vdom.oldRenderVDOM = renderVDOM;
  return createDOM(renderVDOM);
}

// 处理 context.provider
function mountProviderComponent(vdom) {
  let { type, props } = vdom;
  // 最重要的一步: 在渲染 provider 时，将 value 塞给 _currentValue
  type._context._currentValue = props.value;
  let renderVDOM = props.children;
  vdom.oldRenderVDOM = renderVDOM;
  return createDOM(renderVDOM);
}

function mountForwardComponent(vdom) {
  const { type, props, ref } = vdom;
  const renderVDOM = type.render(props, ref);
  vdom.oldRenderVDOM = renderVDOM;
  return createDOM(renderVDOM);
}

function mountClassComponent(vdom) {
  const { type, props, ref } = vdom;

  // 类组件的 defaultProps
  let defaultProps = type.defaultProps || {};

  const instance = new type({ ...defaultProps, ...props });

  // 实现 context
  if (type.contextType) {
    // _value 就是 createContext() 返回的 _value，保存了全局的数据
    instance.context = type.contextType._currentValue;
  }

  // 把类的实例挂载到 vdom（dom-diff 会用到）
  // 组件的类的实例必须挂载到 vdom 上，方便后续使用
  vdom.classInstance = instance;

  if (instance.componentWillMount) {
    instance.componentWillMount();
  }

  const renderVDOM = instance.render();

  // render 后只是生成了 vdom，还未将 vdom 更新到文档，因此在这里执行不合而是
  // if (instance.componentDidMount) {
  //   instance.componentDidMount();
  // }

  // 每次更新时，把老的 vdom 挂在到类实例上
  instance.oldRenderVDOM = renderVDOM;
  // 类组件本身是没有 dom 的，需要手动挂载
  vdom.oldRenderVDOM = renderVDOM;

  // 处理类的 ref
  if (ref) {
    ref.current = instance;
  }

  const dom = createDOM(renderVDOM);

  // createDOM，将 didMount 绑定到 dom，等待 diff 的时候真正挂载后执行
  if (instance.componentDidMount) {
    // this ???? 此处有疑问(已经解决，猜测正确)
    dom.componentDidMount = instance.componentDidMount.bind(instance);
  }

  return dom;
}

function mountFunctionComponent(vdom) {
  const { type, props } = vdom;
  const renderVDOM = type(props);

  // 函数组件本身是没有 dom 的，需要手动挂载
  vdom.oldRenderVDOM = renderVDOM;

  return createDOM(renderVDOM);
}

function reconcileChildren(children, parentDOM) {
  for (const child of children) {
    // TODO 增加判断: undefined 或 null 的节点，应该不渲染
    render(child, parentDOM);
  }
}

function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    if (key === "children") {
      continue;
    } else if (key === "style") {
      Object.assign(dom.style, newProps[key]);
    } else if (key.startsWith("on")) {
      // 绑定事件
      // dom[key.toLocaleLowerCase()] = newProps[key];
      // 合成事件
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
    } else {
      if (newProps[key]) {
        dom[key] = newProps[key];
      }
    }
  }
}

/**
 * 根据vdom返回真实DOM
 * @param {*} vdom
 */
export function findDOM(vdom) {
  let type = vdom.type;
  let dom;
  if (typeof type === "string" || type === REACT_TEXT) {
    //原生的组件
    dom = vdom.dom;
  } else {
    //可能函数组件 类组件 provider context forward
    dom = findDOM(vdom.oldRenderVDOM);
  }
  return dom;
}

/**
 * 比较新旧 VDOM，找出差异，更新到真实 DOM 上
 * @param {*} parentDOM
 * @param {*} oldVDOM
 * @param {*} newVDOM
 */
export function compareTwoVDOM(parentDOM, oldVDOM, newVDOM, nextDOM) {
  // let oldDOM = findDOM(oldVDOM);
  // let newDOM = createDOM(newVDOM);

  // parentDOM.replaceChild(newDOM, oldDOM);

  if (!oldVDOM && !newVDOM) {
    //  如果老的 vdom 和 新的 vdom 都是 null or undefined
    // return null; // 不再需要返回值
  } else if (oldVDOM && !newVDOM) {
    // 老的存在，新的不存在，销毁老组件
    let currentDOM = findDOM(oldVDOM);
    currentDOM.parentNode.removeChild(currentDOM);

    if (oldVDOM.classInstance && oldVDOM.classInstance.componentWillUnmount) {
      oldVDOM.classInstance.componentWillUnmount();
    }
    // return null;
  } else if (!oldVDOM && newVDOM) {
    let newDOM = createDOM(newVDOM);

    if (nextDOM) {
      // 如果插入的位置存在下一个元素，则 insert
      parentDOM.insertBefore(newDOM, nextDOM);
    } else {
      parentDOM.appendChild(newDOM); // 此处可能是插入到当前位置 insertBefore??
    }

    // 有新 DOM 真正挂载，则执行 didMount
    if (newDOM.componentDidMount) {
      newDOM.componentDidMount();
    }

    // return newDOM;
  } else if (oldVDOM && newVDOM && oldVDOM.type !== newVDOM.type) {
    // 老的 vdom 和新的 vdom 都存在，但是 type 不同，则全部替换
    let oldDOM = findDOM(oldVDOM);
    let newDOM = createDOM(newVDOM);
    oldDOM.parentNode.replaceChild(newDOM, oldDOM);

    // 销毁老的组件
    if (oldVDOM.classInstance && oldVDOM.classInstance.componentWillUnmount) {
      oldVDOM.classInstance.componentWillUnmount();
    }

    // 有新 DOM 真正挂载，则执行 didMount
    if (newDOM.componentDidMount) {
      newDOM.componentDidMount();
    }

    // return newDOM;
  } else {
    // 老的存在，新的存在，类型相同，则需要复用老的节点，进行深度比较
    updateElement(oldVDOM, newVDOM);
  }
}

function updateElement(oldVDOM, newVDOM) {
  if (oldVDOM.type && oldVDOM.type.$$typeof === REACT_MEMO) {
    updateMemoComponent(oldVDOM, newVDOM);
  } else if (oldVDOM.type && oldVDOM.type.$$typeof === REACT_PROVIDER) {
    updateProviderComponent(oldVDOM, newVDOM);
  } else if (oldVDOM.type && oldVDOM.type.$$typeof === REACT_CONTEXT) {
    updateContextComponent(oldVDOM, newVDOM);
  } else if (oldVDOM.type === REACT_TEXT && newVDOM.type === REACT_TEXT) {
    // 如果老的 oldVDOM 是普通元素组件，如 div
    // 拿到老的文本节点的真实 DOM
    let currentDOM = (newVDOM.dom = findDOM(oldVDOM));
    // 优化: 新旧文本内容不一致，才允许更新
    if (oldVDOM.props.content !== newVDOM.props.content) {
      // 将新的 vdom 的文本内容更新到老的真实 DOM
      currentDOM.textContent = newVDOM.props.content;
    }
  } else if (typeof oldVDOM.type === "string") {
    let currentDOM = (newVDOM.dom = findDOM(oldVDOM));
    // 让新的属性更新 DOM的老属性
    updateProps(currentDOM, oldVDOM.props, newVDOM.props);
    updateChildren(currentDOM, oldVDOM.props.children, newVDOM.props.children);
  } else if (typeof oldVDOM.type === "function") {
    if (oldVDOM.type.isReactComponent) {
      // 类组件
      updateClassComponent(oldVDOM, newVDOM);
    } else {
      // 函数组件
      updateFunctionComponent(oldVDOM, newVDOM);
    }
  }
}

function updateMemoComponent(oldVdom, newVdom) {
  let { type, prevProps } = oldVdom;

  if (type.compare(prevProps, newVdom.props)) {
    newVdom.oldRenderVDOM = oldVdom.oldRenderVDOM;
    newVdom.prevProps = newVdom.props;
  } else {
    let parentDOM = findDOM(oldVdom).parentNode;
    let { type, props } = newVdom;
    // type.type
    //  第一个 type: jsx 解析后，生成的 createElement 执行后的 vdom 自带的 type，是一个 memo 对象
    //  第二个 type: memo 对象自带的 type，代表传入的函数组件
    // 这里是执行传入的函数组件。并传入最新的 props
    let renderVDOM = type.type(props);
    compareTwoVDOM(parentDOM, oldVdom.oldRenderVDOM, renderVDOM);
    newVdom.prevProps = newVdom.props;
    newVdom.oldRenderVDOM = renderVDOM;
  }
}

function updateProviderComponent(oldVdom, newVdom) {
  let parentDOM = findDOM(oldVdom).parentNode;
  let { type, props } = newVdom;
  type._context._currentValue = props.value;
  let renderVDOM = props.children;
  compareTwoVDOM(parentDOM, oldVdom.oldRenderVDOM, renderVDOM);
  newVdom.oldRenderVDOM = renderVDOM;
}
function updateContextComponent(oldVdom, newVdom) {
  let parentDOM = findDOM(oldVdom).parentNode;
  let { type, props } = newVdom;
  let renderVDOM = props.children(type._context._currentValue);
  compareTwoVDOM(parentDOM, oldVdom.oldRenderVDOM, renderVDOM);
  newVdom.oldRenderVDOM = renderVDOM;
}

// 更新类组件
function updateClassComponent(oldVDOM, newVDOM) {
  // 下次更新，需要用到 newVDOM 来更新，因此需要赋值
  let classInstance = (newVDOM.classInstance = oldVDOM.classInstance);

  newVDOM.oldRenderVDOM = oldVDOM.oldRenderVDOM;

  // 此次更新时由父组件更新引起的，会传递 props，因此需要在正式更新前(emitUpdate)调用 componentWillReceiveProps 生命周期
  if (classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps();
  }

  classInstance.updater.emitUpdate(newVDOM.props);
}

// 更新函数组件
function updateFunctionComponent(oldVDOM, newVDOM) {
  const parentDOM = findDOM(oldVDOM).parentNode;
  const { type, props } = newVDOM;
  const renderVDOM = type(props);

  compareTwoVDOM(parentDOM, oldVDOM.oldRenderVDOM, renderVDOM);

  // 修复 bug: setState 无法执行，应该放到 compareTwoVDOM 之后
  newVDOM.oldRenderVDOM = renderVDOM;
}

function updateChildren(parentDOM, oldVChildren, newVChildren) {
  // 预处理，全部转成数组，方便逐个比较
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren];

  let maxLength = Math.max(oldVChildren.length, newVChildren.length);

  for (let i = 0; i < maxLength; i++) {
    // 找到当前的虚拟 DOM 节点之后的最近的一个真实的 DOM
    let nextVDOM = oldVChildren.find(
      (item, index) => index > i && item && findDOM(item)
    );
    compareTwoVDOM(parentDOM, oldVChildren[i], newVChildren[i], nextVDOM);
  }
}

const ReactDOM = {
  render,
};

export default ReactDOM;
