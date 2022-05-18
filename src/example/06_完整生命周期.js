import ReactDOM from "react-dom";
import React from "react";

// import ReactDOM from "./react-dom";
// import React from "./react";

// 完整的生命周期-初步
if (false) {
  class App extends React.Component {
    state = { number: 1 };
    constructor(props) {
      super(props);

      console.log("constructor");
    }

    handleClick = () => {
      this.setState({ number: this.state.number + 1 });
      console.log(this.state);
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
      return (
        <div>
          <button onClick={this.handleClick}>按钮</button>
          <header>header</header>
          <main>main</main>
          <article>article: {this.state.number}</article>
          <footer>footer</footer>
        </div>
      );
    }

    componentDidMount() {
      console.log("componentDidMount");
    }

    shouldComponentUpdate(nextProps, nextState) {
      console.log("shouldComponentUpdate", nextState);
      // return nextState.number % 2 === 0;
      return true;
    }

    componentWillUnmount() {
      console.log("componentWillUnmount");
    }
  }

  ReactDOM.render(<App></App>, document.getElementById("root"));
}
// 完整的生命周期-完成
if (true) {
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
}
