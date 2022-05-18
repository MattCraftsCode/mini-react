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

/**
 * 更新组件
 * @param {*} classInstance
 * @param {*} nextProps 新属性
 * @param {*} nextState 新状态
 */
function shouldUpdate(classInstance, nextProps, nextState) {
  let willUpdate = true; // 是否要更新，默认值是 true

  // 不更新
  if (
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(nextProps, nextState)
  ) {
    willUpdate = false;
  }

  if (willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate(nextProps, nextState);
  }

  // 不管要不要更新，props 和 state 都要更新
  // nextProps 可能没有，state 一定有
  if (nextProps) {
    classInstance.props = nextProps;
  }

  // 实现 static getDerivedStateFromProps 生命周期函数
  // 类的 static 成员，要通过 constructor 去调用
  // 作用，接收 新的属性（nextProps）和 老的状态(state)，由调用者决定是否需要用新的 props 修改当前组件的 state
  if (classInstance.constructor.getDerivedStateFromProps) {
    let newState = classInstance.constructor.getDerivedStateFromProps(
      nextProps, // 新的属性
      classInstance.state // 老的状态
    );
    if (newState) {
      classInstance.state = newState;
    }
  } else {
    classInstance.state = nextState; //永远指向最新的状态
  }

  // static getDerivedStateFromProps 必须在给组件实例赋值前调用
  // classInstance.state = nextState;

  if (willUpdate) {
    classInstance.forceUpdate();
  }
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

    // 处理 getSnapshotBeforeUpdate
    // https://zh-hans.reactjs.org/docs/react-component.html#getsnapshotbeforeupdate
    // TODO 问题，为什么要在 compareTwoVDOM 之前？

    let extraArgs;
    if (this.getSnapshotBeforeUpdate) {
      extraArgs = this.getSnapshotBeforeUpdate();
    }

    compareTwoVDOM(oldDom.parentNode, oldRenderVDOM, newRenderVDOM);

    this.oldRenderVDOM = newRenderVDOM;

    // 调用更新完成生命周期函数
    if (this.componentDidUpdate) {
      // 传入最新的 props state
      this.componentDidUpdate(this.props, this.state, extraArgs);
    }
  }
}
