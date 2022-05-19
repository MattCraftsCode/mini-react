import { updateQueue } from "./component";

/**
 * 实现事件委托，把所有的事件都绑定到 document 上
 */
export function addEvent(dom, eventType, handler) {
  if (!document.store) {
    document.store = {};
  }

  // TODO: 这里有 bug，不同 element 的同一个事件会相互覆盖
  document.store[eventType] = handler;
  if (!document[eventType]) {
    document[eventType] = dispatchEvent;
  }
}

function dispatchEvent(event) {
  let { target, type } = event;
  let eventType = `on${type}`;
  // 切换为批量更新模式
  updateQueue.isBatchingUpdate = true;
  let syntheticEvent = createSyntheticEvent(event);

  //
  while (target) {
    let { store } = target;
    let handler = store && store[eventType];
    handler && handler.call(target, syntheticEvent);
    target = target.parentNode;
  }

  updateQueue.isBatchingUpdate = false;

  // 正式批量更新
  updateQueue.batchUpdate();
}

function createSyntheticEvent(event) {
  let syntheticEvent = {};
  for (let key in event) {
    syntheticEvent[key] = event[key];
  }

  return syntheticEvent;
}
