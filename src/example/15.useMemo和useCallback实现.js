import ReactDOM from "./react-dom";
import React from "./react";

const { useState, memo, useMemo, useCallback } = React;

// 使用 React.memo 可以浅层比较阻止更新
if (false) {
  function Son() {
    console.log("Son 更新");
    return <div>Son</div>;
  }

  const SonWithMemo = memo(Son);

  function App() {
    const [number, setNumber] = useState(0);

    const change = () => {
      setNumber(number + 1);
    };

    return (
      <div>
        <button onClick={change}>按钮:{number}</button>
        <SonWithMemo></SonWithMemo>
      </div>
    );
  }

  ReactDOM.render(<App></App>, document.getElementById("root"));
}

// 使用 React.memo，当 fn 重新创建后视为不同的对象，也会更新（浅层比较）
if (false) {
  function Son() {
    console.log("Son 更新");
    return <div>Son</div>;
  }

  const SonWithMemo = memo(Son);

  function App() {
    const [number, setNumber] = useState(0);

    const change = () => {
      setNumber(number + 1);
    };

    const data = {
      name: "hsw",
    };

    const fn = () => {
      console.log("fn");
    };

    return (
      <div>
        <button onClick={change}>按钮:{number}</button>
        <SonWithMemo fn={fn}></SonWithMemo>
      </div>
    );
  }

  ReactDOM.render(<App></App>, document.getElementById("root"));
}

if (true) {
  function Son() {
    console.log("Son 更新");
    return <div>Son</div>;
  }

  const SonWithMemo = memo(Son);

  function App() {
    const [number, setNumber] = useState(0);

    const change = () => {
      setNumber(number + 1);
    };

    // const data = useMemo(
    //   () => ({
    //     number: 1,
    //   }),
    //   [this]
    // );

    // fn 永远不会更新
    // const fn = useCallback(() => {
    //   console.log("useCallback", number);
    // }, []);

    // 当 number 发生变化，fn 更新
    const fn = useCallback(() => {
      console.log("useCallback", number);
    }, [number]);

    return (
      <div>
        <button onClick={change}>按钮:{number}</button>
        <SonWithMemo fn={fn}></SonWithMemo>
      </div>
    );
  }

  ReactDOM.render(<App></App>, document.getElementById("root"));
}

// hooks 不能在类组件中使用，在编译时期就报错
if (false) {
  class App extends React.Component {
    render() {
      const [number, setNumber] = React.useState(0);
      return <div onClick={() => setNumber(number + 1)}>App:{number}</div>;
    }
  }

  ReactDOM.render(<App></App>, document.getElementById("root"));
}
