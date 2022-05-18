import ReactDOM from "../react-dom";
import React from "../react";

class App extends React.Component {
  state = { number: 0 };

  getSnapshotBeforeUpdate() {
    return {
      name: "hsw",
    };
  }

  componentWillUpdate(nextProps, nextState) {
    console.log(nextProps, nextState);
  }

  componentDidUpdate(nextProps, nextState, extraArgs) {
    console.log(nextProps, nextState, extraArgs);
  }

  render() {
    return (
      <div>
        <button
          onClick={() => this.setState({ number: this.state.number + 1 })}
        >
          按钮: {this.state.number}
        </button>
      </div>
    );
  }
}

ReactDOM.render(<App></App>, document.getElementById("root"));
