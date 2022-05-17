import { REACT_TEXT } from "./constants";

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
  let { type, props } = vdom;
  let dom;
  if (type === REACT_TEXT) {
    // console.log("type", type);
    // 如果是文本类型，则创建文本节点
    dom = document.createTextNode(props.content);
  } else if (typeof type === "function") {
    if (type.isReactComponent) {
      // 挂载类组件
      dom = mountClassComponent(vdom);
    } else {
      // 挂载函数组件
      dom = mountFunctionComponent(vdom);
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

  return dom;
}

function mountClassComponent(vdom) {
  const { type, props } = vdom;
  const instance = new type(props);
  const renderVDOM = instance.render();
  return createDOM(renderVDOM);
}

function mountFunctionComponent(vdom) {
  const { type, props } = vdom;
  const renderVDOM = type(props);
  return createDOM(renderVDOM);
}

function reconcileChildren(children, parentDOM) {
  for (const child of children) {
    render(child, parentDOM);
  }
}

function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    if (key === "children") {
      continue;
    } else if (key === "style") {
      Object.assign(dom.style, newProps[key]);
    } else {
      dom[key] = newProps[key];
    }
  }
}

const ReactDOM = {
  render,
};

export default ReactDOM;
