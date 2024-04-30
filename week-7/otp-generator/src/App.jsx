import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  useSetRecoilState,
  RecoilRoot,
  useRecoilValue,
  useRecoilState,
} from "recoil";
import { Component, otp, phNumber } from "./atoms/otp.jsx";

function App() {
  return (
    <>
      <RecoilRoot>
        <h1>Otp Generator</h1>
        <AppComp />
      </RecoilRoot>
    </>
  );
}

function AppComp() {
  const arr = [<Number />, <Otp />];
  const Comp = useRecoilValue(Component);

  return (
    <>
      <div>{Comp == 0 ? arr[0] : arr[1]}</div>
    </>
  );
}

function Number() {
  const setComponent = useSetRecoilState(Component);
  const [number, setNumber] = useRecoilState(phNumber);
  return (
    <>
      <input
        type="number"
        placeholder="Enter Number"
        onChange={(e) => setNumber(e.target.value)}
      ></input>
      <br></br>
      <br></br>
      <button
        onClick={() => {
          if (number.length >= 10) {
            setComponent(1);
          } else {
            alert("Plz enter Valid Number");
          }
        }}
      >
        Generate Otp
      </button>
    </>
  );
}

function Otp() {
  const getOtp = useRecoilValue(otp);
  return (
    <>
      <input type="number" min={1} max={9}></input>
      <input type="number" min={1} max={9}></input>
      <input type="number" min={1} max={9}></input>
      <input type="number" min={1} max={9}></input>
      <br></br>
      <br></br>
      <button>Login</button>
    </>
  );
}

export default App;
