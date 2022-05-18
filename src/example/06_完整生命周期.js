import ReactDOM from "react-dom";
import React from "react";

// import ReactDOM from "./react-dom";
// import React from "./react";

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
