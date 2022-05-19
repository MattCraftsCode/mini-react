import ReactDOM from "./react-dom";
import React from "./react";

class Sub extends React.Component {
  render() {
    console.log("Sub render");
    return <div>Hello</div>;
  }
}

class App extends React.Component {
  state = { count: 0 };

  handleClick = () => {
    this.setState(this.state);
  };

  render() {
    console.log("App render");
    return (
      <div>
        <button onClick={this.handleClick}>按钮</button>
        <Sub count={this.state.count}></Sub>
      </div>
    );
  }
}

ReactDOM.render(<App></App>, document.getElementById("root"));
