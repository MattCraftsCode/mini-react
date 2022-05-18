import { REACT_TEXT } from "./constants";
import { addEvent } from "./event";

/**
 * 把虚拟 DOM 转成 DOM 并插入到文档中
 * @param {} vdom
 * @param {*} container
 */
function render(vdom, container) {
  // 将 vdom 转成 dom
  let newDOM = createDOM(vdom);

  // 将 dom 插入到 container 中
  container.appendChild(newDOM);
}

/**
 * 把虚拟 DOM 转成 DOM
 * @param {*} vdom
 * @returns
 */
function createDOM(vdom) {
  let { type, props, ref } = vdom;
  let dom;
  if (type === REACT_TEXT) {
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

function mountClassComponent(vdom) {
  const { type, props, ref } = vdom;

  // 类组件的 defaultProps
  let defaultProps = type.defaultProps || {};

  const instance = new type({ ...defaultProps, ...props });

  if (instance.componentWillMount) {
    instance.componentWillMount();
  }

  const renderVDOM = instance.render();

  if (instance.componentDidMount) {
    instance.componentDidMount();
  }

  // 每次更新时，把老的 vdom 挂在到类实例上
  instance.oldRenderVDOM = renderVDOM;
  // 类组件本身是没有 dom 的，需要手动挂载
  vdom.oldRenderVDOM = renderVDOM;

  // 处理类的 ref
  if (ref) {
    ref.current = instance;
  }

  return createDOM(renderVDOM);
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
      dom[key] = newProps[key];
    }
  }
}

/**
 * 根据 vdom 返回真实 dom
 * @param {} vdom
 * @returns
 */
export function findDOM(vdom) {
  let { type } = vdom;
  let dom;
  if (typeof type === "function") {
    // typeof type === 'function'， 可能是函数组件、类组件
    dom = findDOM(vdom.oldRenderVDOM);
  } else {
    dom = vdom.dom;
  }

  return dom;
}

/**
 * 比较新旧 VDOM，找出差异，更新到真实 DOM 上
 * @param {*} parentDOM
 * @param {*} oldVDOM
 * @param {*} newVDOM
 */
export function compareTwoVDOM(parentDOM, oldVDOM, newVDOM) {
  // let oldDOM = findDOM(oldVDOM);
  // let newDOM = createDOM(newVDOM);

  // parentDOM.replaceChild(newDOM, oldDOM);

  if (!oldVDOM && !newVDOM) {
    //  如果老的 vdom 和 新的 vdom 都是 null or undefined
    return null;
  } else if (oldVDOM && !newVDOM) {
    // 老的存在，新的不存在，销毁老组件
    let currentDOM = findDOM(oldVDOM);
    currentDOM.parentNode.removeChild(currentDOM);

    if (oldVDOM.classInstance && oldVDOM.classInstance.componentWillUnmount) {
      oldVDOM.classInstance.componentWillUnmount();
    }
    return null;
  } else if (!oldVDOM && newVDOM) {
    let newDOM = createDOM(newVDOM);
    parentDOM.appendChild(newDOM); // 此处可能是插入到当前位置 insertBefore??
    return newDOM;
  } else if (oldVDOM && newVDOM && oldVDOM.type !== newVDOM.type) {
    // 老的 vdom 和新的 vdom 都存在，但是 type 不同，则全部替换
    let oldDOM = findDOM(oldVDOM);
    let newDOM = createDOM(newVDOM);
    oldDOM.parentNode.replaceChild(newDOM, oldDOM);

    // 销毁老的组件
    if (oldVDOM.classInstance && oldVDOM.classInstance.componentWillUnmount) {
      oldVDOM.classInstance.componentWillUnmount();
    }
    return newDOM;
  } else {
    // 老的存在，新的存在，类型相同，则需要复用老的节点，进行深度比较
    updateElement(oldVDOM, newVDOM);
  }
}

function updateElement(oldVDOM, newVDOM) {
  // 如果老的 oldVDOM 是普通元素组件，如 div
  if (typeof oldVDOM.type === "string") {
    let currentDOM = (newVDOM.dom = findDOM(oldVDOM));
    // 让新的属性更新 DOM的老属性
    updateProps(currentDOM, oldVDOM.props, newVDOM.props);
    updateChildren(currentDOM, oldVDOM.props.children, newVDOM.props.children);
  }
}

function updateChildren(parentDOM, oldVChildren, newVChildren) {
  // 预处理，全部转成数组，方便逐个比较
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren];

  let maxLength = Math.max(oldVChildren.length, newVChildren.length);

  for (let i = 0; i < maxLength; i++) {
    compareTwoVDOM(parentDOM, oldVChildren[i], newVChildren[i]);
  }
}

const ReactDOM = {
  render,
};

export default ReactDOM;
