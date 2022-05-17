import ReactDOM from "../react-dom";
import React from "../react";

function Welcome(props) {
  return <div>Welcome, {props.name}</div>;
}

function Bar() {
  return <div>Bar</div>;
}

function Foo(props) {
  return (
    <p>
      我是P标签 <Bar></Bar>
    </p>
  );
}

const element = (
  <Welcome name="hsw">
    你好<Foo></Foo>
    <div>fs</div>
  </Welcome>
);

console.log(element);
console.log(React.createElement(Welcome, { name: "hsw" }));
ReactDOM.render(element, document.getElementById("root"));
