import ReactDOM from "./react-dom";
import React from "./react";

// 基础的 provider 和 consumer 使用
if (false) {
  const ThemeContext = React.createContext();

  // 类组件使用 static contextType
  class Header extends React.Component {
    static contextType = ThemeContext;

    render() {
      return (
        <header style={{ color: this.context.color }}>
          Header:
          <span
            onMouseDown={(e) => {
              console.log("紫色", e.target.textContent);
              this.context.changeColor("purple");
            }}
          >
            改成紫色
          </span>
        </header>
      );
    }
  }

  // class Footer extends React.Component {
  //   static contextType = ThemeContext;

  //   render() {
  //     return (
  //       <ThemeContext.Consumer>
  //         {(value) => {
  //           return <footer>Footer:{value.color}</footer>;
  //         }}
  //       </ThemeContext.Consumer>
  //     );
  //   }
  // }

  // 函数组件使用 Consumer
  function Footer() {
    return (
      <ThemeContext.Consumer>
        {(value) => {
          return <footer>Footer:{value.color}</footer>;
        }}
      </ThemeContext.Consumer>
    );
  }

  class App extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        color: "red",
      };
    }

    changeColor = (newColor) => {
      console.log(newColor);
      this.setState({ ...this.state, color: newColor });
    };

    render() {
      // 注意: ThemeContext.Provider 必须只有一个子元素，否则 执行 Provider() 返回的 renderVDOM 是一个数组，会导致渲染失败
      const value = {
        color: this.state.color,
        changeColor: this.changeColor,
      };

      return (
        <ThemeContext.Provider value={value}>
          <div>
            <Header></Header>
            <Footer></Footer>
          </div>
        </ThemeContext.Provider>
      );
    }
  }

  ReactDOM.render(<App></App>, document.getElementById("root"));
}

// 获取多个父组件的 context 内容
// 1. 使用 consumer 嵌套
// 2. 会造成回调地狱，一般项目中只会定义一个 context，不建议定义多个
if (false) {
  const GrandFatherContext = React.createContext();
  const FatherContext = React.createContext();

  console.log(GrandFatherContext.Consumer, FatherContext.Consumer);

  function Son() {
    return (
      <GrandFatherContext.Consumer>
        {(grandFatherValue) => {
          return (
            <FatherContext.Consumer>
              {(fatherValue) => {
                return (
                  <div>
                    {grandFatherValue.name} - {fatherValue.name}
                  </div>
                );
              }}
            </FatherContext.Consumer>
          );
        }}
      </GrandFatherContext.Consumer>
    );
  }

  class Father extends React.Component {
    render() {
      const value = {
        name: "Father",
      };
      return (
        <FatherContext.Provider value={value}>
          <Son></Son>
        </FatherContext.Provider>
      );
    }
  }

  class GrandFather extends React.Component {
    render() {
      const value = {
        name: "GrandFather",
      };
      return (
        <GrandFatherContext.Provider value={value}>
          <Father></Father>
        </GrandFatherContext.Provider>
      );
    }
  }

  ReactDOM.render(<GrandFather></GrandFather>, document.getElementById("root"));
}

// 存在问题: 事件相互覆盖
if (true) {
  const ThemeContext = React.createContext();

  // 类组件使用 static contextType
  class Header extends React.Component {
    static contextType = ThemeContext;

    render() {
      return (
        <header style={{ color: this.context.color }}>
          Header:
          <button
            onClick={(e) => {
              this.context.changeColor("purple");
            }}
          >
            改成紫色
          </button>
        </header>
      );
    }
  }

  class Footer extends React.Component {
    static contextType = ThemeContext;

    render() {
      return (
        <footer style={{ color: this.context.color }}>
          Footer:
          <button
            onClick={(e) => {
              this.context.changeColor("blue");
            }}
          >
            改成蓝色
          </button>
        </footer>
      );
    }
  }

  class App extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        color: "red",
      };
    }

    changeColor = (newColor) => {
      console.log(newColor);
      this.setState({ ...this.state, color: newColor });
    };

    render() {
      // 注意: ThemeContext.Provider 必须只有一个子元素，否则 执行 Provider() 返回的 renderVDOM 是一个数组，会导致渲染失败
      const value = {
        color: this.state.color,
        changeColor: this.changeColor,
      };

      return (
        <ThemeContext.Provider value={value}>
          <div>
            <Header></Header>
            <Footer></Footer>
          </div>
        </ThemeContext.Provider>
      );
    }
  }

  ReactDOM.render(<App></App>, document.getElementById("root"));
}
