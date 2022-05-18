import ReactDOM from "../react-dom";
import React from "../react";

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 1,
    };
  }
  render() {
    return <div className="hello">Counter</div>;
  }

  handleClick = () => {
    this.setState({ count: 2 });
  };
}

function FunctionComponent() {
  return <Counter></Counter>;
}

class App extends React.Component {
  render() {
    setTimeout(() => {
      this.forceUpdate();
    }, 2000);
    return <FunctionComponent></FunctionComponent>;
  }
}

let element = <App></App>;
ReactDOM.render(element, document.getElementById("root"));
