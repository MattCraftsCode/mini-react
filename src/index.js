import ReactDOM from "./react-dom";
import React from "./react";

class Welcome extends React.Component {
  render() {
    return <div>类组件, {this.props.name}</div>;
  }
}

const element = <Welcome name="hsw"></Welcome>;

ReactDOM.render(element, document.getElementById("root"));
