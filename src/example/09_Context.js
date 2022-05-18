import ReactDOM from "./react-dom";
import React from "./react";

const ThemeContext = React.createContext();

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

class Footer extends React.Component {
  static contextType = ThemeContext;

  render() {
    return (
      <ThemeContext.Consumer>
        {(value) => {
          return <footer>Footer:{value.color}</footer>;
        }}
      </ThemeContext.Consumer>
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
