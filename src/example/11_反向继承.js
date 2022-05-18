import ReactDOM from "./react-dom";
import React from "./react";

class Hello extends React.Component {
  state = { name: "parent" };
  render() {
    return <div className={this.state.name}>Hello:{this.state.number}</div>;
  }
}

// 反向继承
function Wrap(Component) {
  // 返回一个类组件，继承参数传进来的组件
  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        ...this.state, // 这个 state 访问的是 super 的 state，因为此时 state 还没有被子类覆盖
        number: 0,
      };
    }
    render() {
      const superRender = super.render();

      const cloneRender = React.cloneElement(
        superRender,
        {
          ...superRender.props,
          onClick: () => {
            console.log("click");
          },
        },
        this.state.number
      );

      return cloneRender;
    }
  };
}

const Wrapped = Wrap(Hello);

class App extends React.Component {
  render() {
    return <Wrapped></Wrapped>;
  }
}

ReactDOM.render(<App></App>, document.getElementById("root"));
