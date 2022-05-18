import ReactDOM from "./react-dom";
import React from "./react";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
  }
  render() {
    return (
      <div ref={this.myRef}>
        App <button onClick={this.handleClick}>按钮</button>
      </div>
    );
  }

  handleClick = () => {
    console.log(this.myRef);
  };
}

ReactDOM.render(<App></App>, document.getElementById("root"));
