import ReactDOM from "./react-dom";
import React from "./react";

class App extends React.Component {
  state = { count: 0 };
  render() {
    return <div onClick={this.handleClick}>App</div>;
  }

  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);
  };
}

ReactDOM.render(<App></App>, document.getElementById("root"));
