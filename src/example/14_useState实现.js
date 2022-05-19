import ReactDOM from "./react-dom";
import React from "./react";

const { useState } = React;

function App() {
  const [number, setNumber] = useState(0);
  const handle = () => {
    console.log("click");
    setNumber(number + 1);
  };
  return <div onClick={handle}>{number}</div>;
}

ReactDOM.render(<App></App>, document.getElementById("root"));
