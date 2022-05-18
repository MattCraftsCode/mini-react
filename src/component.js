import { compareTwoVDOM, findDOM } from "./react-dom";

export const updateQueue = {
  isBatchingUpdate: false,
  updaters: [],
  batchUpdate() {
    for (const updater of updateQueue.updaters) {
      updater.updateComponent();
    }

    updateQueue.isBatchingUpdate = false;
    updateQueue.updaters.length = 0;
  },
};

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    // 保存将要更新的队列
    this.pendingStates = [];
    // 保存将要执行的回调函数
    this.callbacks = [];
  }

  addState(partialState, callback) {
    console.log("setState");
    this.pendingStates.push(partialState);

    if (typeof callback === "function") {
      this.callbacks.push(callback);
    }

    // 触发更新
    this.emitUpdate();
  }

  // 不管状态和属性的变化都会让组件刷新
  emitUpdate(nextProps) {
    this.nextProps = nextProps;

    // 更新组件
    // TODO 需要判断下，批量更新、同步更新
    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.push(this);
    } else {
      this.updateComponent();
    }
  }

  // 更新组件
  updateComponent() {
    let { classInstance, pendingStates, nextProps } = this;
    if (nextProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, nextProps, this.getState());
    }
  }

  getState() {
    let { classInstance, pendingStates, callbacks } = this;
    let { state } = classInstance;

    // 1.同步执行所有的 state
    pendingStates.forEach((nextState) => {
      if (typeof nextState === "function") {
        nextState = nextState(state);
      }
      state = { ...state, ...nextState };
    });

    // 清空等待更新的队列
    pendingStates.length = 0;

    // 2.执行所有的 callback
    callbacks.forEach((callback) => callback(state));

    // 返回新状态
    return state;
  }
}

function shouldUpdate(classInstance, nextProps, newState) {
  classInstance.state = newState;
  classInstance.forceUpdate();
}

export default class Component {
  static isReactComponent = true;

  constructor(props) {
    this.props = props;

    this.updater = new Updater(this);
  }

  setState(partialState, callback) {
    this.updater.addState(partialState, callback);
  }

  forceUpdate() {
    let oldRenderVDOM = this.oldRenderVDOM;
    // 根据老的 vdom 查到老的真实 dom
    let oldDom = findDOM(oldRenderVDOM); // div.hello
    // 拿到新的 state 重新生成的 vdom
    let newRenderVDOM = this.render();

    compareTwoVDOM(oldDom.parentNode, oldRenderVDOM, newRenderVDOM);

    this.oldRenderVDOM = newRenderVDOM;
  }
}
