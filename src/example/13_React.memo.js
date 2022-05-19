import ReactDOM from "./react-dom";
import React from "./react";

function Sub() {
  console.log("Sub render");
  return <div>Sub</div>;
}

const SubWithMemo = React.memo(Sub);

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
        <SubWithMemo count={this.state.count}></SubWithMemo>
      </div>
    );
  }
}

ReactDOM.render(<App></App>, document.getElementById("root"));
