// import ReactDOM from "react-dom";
// import React from "react";

import ReactDOM from "./react-dom";
import React from "./react";

class App extends React.Component {
  state = { number: 1 };
  constructor(props) {
    super(props);

    console.log("constructor");
  }

  handleClick = () => {
    this.setState({ count: this.state.number + 1 });
  };

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentWillUpdate() {
    console.log("componentWillUpdate");
  }

  componentDidUpdate() {
    console.log("componentDidUpdate");
  }

  render() {
    console.log("render");
    return <div onClick={this.handleClick}>App</div>;
  }

  componentDidMount() {
    console.log("componentDidMount");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate");
    return nextState.number % 2 === 0;
  }
}

ReactDOM.render(<App></App>, document.getElementById("root"));
