// import ReactDOM from "react-dom";
// import React from "react";

import ReactDOM from "./react-dom";
import React from "./react";

class Counter extends React.Component {
  componentWillMount() {
    console.log("子组件: componentWillMount");
  }

  render() {
    return <div>Counter</div>;
  }

  componentDidMount() {
    console.log("子组件: componentDidMount");
  }

  componentWillUnmount() {
    console.log("子组件: componentWillUnmount");
  }

  componentWillReceiveProps() {
    console.log("子组件: componentWillReceiveProps");
  }
}

class App extends React.Component {
  state = { number: 1 };
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log("componentWillMount");
  }

  componentWillUpdate() {
    console.log("componentWillUpdate");
  }

  componentDidUpdate() {
    console.log("componentDidUpdate");
  }

  handleClick = () => {
    this.setState({
      number: this.state.number + 1,
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>{this.state.number}</button>
        <Counter></Counter>
      </div>
    );
  }

  componentDidMount() {
    console.log("componentDidMount");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate", nextState);
    // return nextState.number % 2 === 1;
    return true;
  }
}

ReactDOM.render(<App></App>, document.getElementById("root"));
