import ReactDOM from "./react-dom";
import React from "./react";

const { useState, useReducer } = React;

if (true) {
  function App() {
    const [number, setNumber] = useState(0);

    return (
      <div>
        <button onClick={() => setNumber(number + 1)}>{number}</button>
      </div>
    );
  }

  ReactDOM.render(<App></App>, document.getElementById("root"));
}

// useReducer
if (false) {
  function App() {
    const [data, dispatch] = useReducer(
      (state, action) => {
        switch (action.type) {
          case "+":
            return { ...state, count: state.count + action.diff };
          case "-":
            return { ...state, count: state.count - action.diff };
          default:
            return state;
        }
      },
      { count: 0 }
    );

    // useReducer
    return (
      <div>
        <button onClick={() => dispatch({ type: "+", diff: 10 })}>
          {data.count}
        </button>
      </div>
    );
  }

  ReactDOM.render(<App></App>, document.getElementById("root"));
}
