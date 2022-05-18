import ReactDOM from "./react-dom";
import React from "./react";

// 普通 DOM 的 ref
if (false) {
  class App extends React.Component {
    constructor(props) {
      super(props);

      this.myRef = React.createRef();
    }
    render() {
      return (
        <div ref={this.myRef}>
          App <button onClick={this.handleClick}>按钮</button>
        </div>
      );
    }

    handleClick = () => {
      console.log(this.myRef);
    };
  }
  ReactDOM.render(<App></App>, document.getElementById("root"));
}

// 类组件的 ref
if (false) {
  class Child extends React.Component {
    constructor(props) {
      super(props);

      this.inputRef = React.createRef();
    }

    myFunc = () => {
      this.inputRef.current.focus();
    };

    render() {
      return <input type="text" ref={this.inputRef} />;
    }
  }
  class App extends React.Component {
    constructor(props) {
      super(props);

      this.myRef = React.createRef();
    }
    render() {
      return (
        <>
          <button onClick={this.handleClick}>按钮</button>
          <Child ref={this.myRef}></Child>
        </>
      );
    }

    handleClick = () => {
      this.myRef.current.myFunc();
    };
  }
  ReactDOM.render(<App></App>, document.getElementById("root"));
}

// 函数组件的 ref
if (true) {
  function FunctionComponent(props, ref) {
    return <input type="text" ref={ref} />;
  }
  const WrappedFunctionComponent = React.forwardRef(FunctionComponent);
  class App extends React.Component {
    constructor(props) {
      super(props);

      this.myRef = React.createRef();
    }
    render() {
      return (
        <>
          <WrappedFunctionComponent ref={this.myRef}></WrappedFunctionComponent>
          <button onClick={this.handleClick}>按钮</button>
        </>
      );
    }

    handleClick = () => {
      console.log(this.myRef.current);
    };
  }
  ReactDOM.render(<App></App>, document.getElementById("root"));
}
