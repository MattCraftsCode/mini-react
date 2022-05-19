import ReactDOM from "./react-dom";
import React from "./react";

const { useContext, createContext } = React;

const ThemeContext = createContext();

function Son() {
  const context = useContext(ThemeContext);
  return <div>Son: {context.color}</div>;
}

function App() {
  const value = { color: "red" };
  return (
    <ThemeContext.Provider value={value}>
      <div>
        <Son></Son>
      </div>
    </ThemeContext.Provider>
  );
}

ReactDOM.render(<App></App>, document.getElementById("root"));
