import Component from "./component";
import { wrapToVDom } from "./utils";

const React = {
  createElement,
  Component,
};

export function createElement(type, config, children) {
  if (config) {
    delete config.__source;
    delete config.__self;
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
  };
}

export default React;
