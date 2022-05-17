import { REACT_TEXT } from "./constants";

/**
 * 将一个 element 包裹成 vdom,方便后续的 dom-diff
 * @param {*} element
 * @returns
 */
export function wrapToVDom(element) {
  if (typeof element === "string" || typeof element === "number") {
    return {
      type: REACT_TEXT,
      props: {
        content: element,
      },
    };
  } else {
    return element;
  }
}
