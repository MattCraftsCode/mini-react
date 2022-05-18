import Component from "./component";
import { wrapToVDom } from "./utils";

const React = {
  createElement,
  Component,
  createRef,
};

export function createRef() {
  return { current: null };
}

export function createElement(type, config, children) {
  let key;
  let ref;
  if (config) {
    delete config.__source;
    delete config.__self;

    // key、ref 两个值非常特殊，不会写到 props 里
    key = config.key;
    ref = config.ref;
    delete config.key;
    delete config.ref;
  }
  let props = { ...config };
  if (arguments.length > 3) {
    // children 是一个数组
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVDom);
  } else {
    // children 是一个对象
    props.children = wrapToVDom(children);
  }

  return {
    type,
    props,
    key,
    ref,
  };
}

export default React;
