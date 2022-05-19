import ReactDOM from "./react-dom";
import React from "./react";

// HOC 和 renderProps 实现鼠标位置的案例
// HOC 和 renderProps 可以互相转换

// renderProps
if (false) {
  class Mouse extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        x: 0,
        y: 0,
      };
    }
    move = (e) => {
      this.setState({
        x: e.clientX,
        y: e.clientY,
      });
    };
    render() {
      return <div onMouseOver={this.move}>{this.props.render(this.state)}</div>;
    }
  }

  class App extends React.Component {
    render() {
      return (
        <Mouse
          render={({ x, y }) => {
            return (
              <div>
                x:{x},y:{y}
              </div>
            );
          }}
        ></Mouse>
      );
    }
  }

  ReactDOM.render(<App></App>, document.getElementById("root"));
}

// HOC
if (true) {
  function withMouse(Component) {
    return class extends React.Component {
      constructor(props) {
        super(props);

        this.state = {
          x: 0,
          y: 0,
        };
      }
      move = (e) => {
        this.setState({
          x: e.clientX,
          y: e.clientY,
        });
      };
      render() {
        return (
          <div onMouseOver={this.move}>
            <Component {...this.state}></Component>
          </div>
        );
      }
    };
  }

  class Hello extends React.Component {
    render() {
      const { x, y } = this.props;
      return (
        <div>
          你好
          {x}, {y}
        </div>
      );
    }
  }

  const HelloWithMouse = withMouse(Hello);

  ReactDOM.render(
    <HelloWithMouse></HelloWithMouse>,
    document.getElementById("root")
  );
}
