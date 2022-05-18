import ReactDOM from "react-dom";
import React from "react";

// import ReactDOM from "./react-dom";
// import React from "./react";

function FunctionComponent(props, ref) {
  return <input type="text" ref={ref} />;
}

const WrappedFunctionComponent = React.forwardRef(FunctionComponent);

class App extends React.Component {
  state = { number: 1 };
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
  }

  handleClick = () => {
    console.log(this.myRef.current);
  };

  render() {
    return (
      <div>
        <header>Header</header>
        <footer>
          <button onClick={this.handleClick}>按钮</button>
          <WrappedFunctionComponent ref={this.myRef}></WrappedFunctionComponent>
        </footer>
      </div>
    );
  }
}

ReactDOM.render(<App></App>, document.getElementById("root"));
