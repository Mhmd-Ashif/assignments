import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  RecoilRoot,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";

import { createPara, lines } from "./atoms/paragen.jsx";

function App() {
  return (
    <>
      <RecoilRoot>
        <h1>Para generator</h1>
        <ParaEnter />
        <br></br>
        <br></br>
        <br></br>
        <Para />
      </RecoilRoot>
    </>
  );
}

function ParaEnter() {
  console.log("re-render 1");
  const setLines = useSetRecoilState(lines);
  let paras = 0;
  return (
    <>
      <input
        type="number"
        onChange={(e) => {
          paras = e.target.value;
        }}
      ></input>
      <button onClick={() => setLines(paras)}>generate</button>
    </>
  );
}

function Para() {
  console.log("re-render 2");
  const para = useRecoilValue(createPara);
  return (
    <>
      {para.map((single) => {
        if (single != " ") {
          return single;
        } else {
          return (
            <>
              <br></br>
              <br></br>
              <br></br>
            </>
          );
        }
      })}
    </>
  );
}

export default App;
