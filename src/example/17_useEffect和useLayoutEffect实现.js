import ReactDOM from "./react-dom";
import React from "./react";

const { useEffect, useState, useLayoutEffect } = React;

// useEffect
if (false) {
  function App() {
    const [number, setNumber] = useState(0);
    useEffect(() => {
      let timer = setTimeout(() => {
        setNumber(number + 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }, [number]);

    return <div>{number}</div>;
  }

  ReactDOM.render(<App></App>, document.getElementById("root"));
}

// useLayoutEffect
if (true) {
  function App() {
    const [number, setNumber] = useState(0);
    useLayoutEffect(() => {
      let timer = setTimeout(() => {
        setNumber(number + 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }, [number]);

    return <div>{number}</div>;
  }

  ReactDOM.render(<App></App>, document.getElementById("root"));
}
