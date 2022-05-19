import ReactDOM from "./react-dom";
import React from "./react";

const { useState, useRef, forwardRef, useImperativeHandle } = React;

if (false) {
  function App() {
    const [number, setNumber] = useState(0);
    const myRef = useRef();

    // 第一次执行的时候，为 null
    console.log(myRef);

    return (
      <div onClick={() => setNumber(number + 1)} ref={myRef}>
        App:{number}
      </div>
    );
  }

  ReactDOM.render(<App></App>, document.getElementById("root"));
}

if (true) {
  function Son(props, ref) {
    const childRef = useRef();
    useImperativeHandle(ref, () => ({
      changeText: (newText) => {
        childRef.current.innerText = newText;
      },
    }));
    return <div ref={childRef}>Son</div>;
  }

  const SonForward = forwardRef(Son);

  function App() {
    const myRef = useRef();
    const handle = () => {
      console.log("handle", myRef);
      // 不加以限制的 ref 操作，是危险的
      // myRef.current.remove();

      // 通过 useImperativeHandle 加以限制
      myRef.current.changeText("hello world");
    };
    return (
      <div onClick={handle}>
        <SonForward ref={myRef}></SonForward>
      </div>
    );
  }
  ReactDOM.render(<App></App>, document.getElementById("root"));
}
