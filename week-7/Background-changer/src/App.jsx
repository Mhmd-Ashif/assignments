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
import { Color } from "./atoms/color";

function App() {
  return (
    <RecoilRoot>
      <ColorChanger />
    </RecoilRoot>
  );
}

//follows dry principle
function ColorChanger() {
  const color = useRecoilValue(Color);
  document.bgColor = color;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          border: "1px solid",
          padding: 15,
          textAlign: "center",
          position: "absolute",
          bottom: 20,
          background: "grey",
        }}
      >
        <Button color={"red"} />
        <Button color={"blue"} />
        <Button color={"green"} />
        <Button color={"yellow"} />
        <Button color={"purple"} />
        <Button color={"black"} />
      </div>
    </div>
  );
}

function Button(props) {
  const setColor = useSetRecoilState(Color);
  return (
    <>
      <button
        style={{
          height: 40,
          width: 100,
          background: props.color,
          color: "white",
          font: "roboto",
          fontWeight: "bold",
          border: "none",
          borderRadius: 5,
          marginRight: 10,
        }}
        onClick={() => {
          setColor(props.color);
        }}
      >
        {props.color}
      </button>
    </>
  );
}

export default App;
