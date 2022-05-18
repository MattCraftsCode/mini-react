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
  const instance = new type(props);

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
  let oldDOM = findDOM(oldVDOM);
  let newDOM = createDOM(newVDOM);

  parentDOM.replaceChild(newDOM, oldDOM);
}

const ReactDOM = {
  render,
};

export default ReactDOM;
