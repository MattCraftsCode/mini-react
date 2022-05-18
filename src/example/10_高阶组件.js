import ReactDOM from "./react-dom";
import React from "./react";

// 高阶组件
const WithLoading = (Component) => {
  return class extends React.Component {
    show = () => {
      console.log("show");
    };

    hide = () => {
      console.log("hide");
    };
    render() {
      return (
        <Component
          {...this.props}
          show={this.show}
          hide={this.hide}
        ></Component>
      );
    }
  };
};

// 高阶组件实现二（需要 babel 支持，并且开启实验特性）
@WithLoading
class Hello extends React.Component {
  render() {
    return (
      <div>
        <button onClick={this.props.show}>显示</button>
        <button onClick={this.props.hide}>隐藏</button>
      </div>
    );
  }
}

// 高阶组件实现一
// const HelloWidthLoading = WithLoading(Hello);

class App extends React.Component {
  render() {
    return (
      <div>
        <Hello></Hello>
      </div>
    );
  }
}

ReactDOM.render(<App></App>, document.getElementById("root"));
