import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  useSetRecoilState,
  useRecoilValue,
  RecoilRoot,
  useRecoilValueLoadable,
} from "recoil";
import { githubId, render } from "./atoms/github";

function App() {
  return (
    <>
      <RecoilRoot>
        <h1>Github Card</h1>
        <Inputbox />
        <br></br>
        <br></br>
        <Renderer />
      </RecoilRoot>
    </>
  );
}

function Inputbox() {
  const setId = useSetRecoilState(githubId);
  let id;
  return (
    <>
      <input
        type="text"
        placeholder="github-id"
        onChange={(e) => {
          id = e.target.value;
        }}
      ></input>
      <button
        onClick={() => {
          setId(id);
        }}
      >
        Generate
      </button>
    </>
  );
}

function Renderer() {
  const githubDataLoadable = useRecoilValueLoadable(render);

  if (githubDataLoadable.state === "loading") {
    return <div>Loading...</div>;
  }

  if (githubDataLoadable.state === "hasError") {
    return <div>Error: {githubDataLoadable.contents.message}</div>;
  }

  const githubData = githubDataLoadable.contents;

  if (githubData == undefined) {
    return <>Enter user Id...</>;
  } else if (githubData.login) {
    return (
      <>
        <img
          src={githubData.avatar_url}
          style={{ height: 100, width: 100, borderRadius: 50 }}
        />
        <h3>Name : {githubData.login}</h3>
        <p>Followers : {githubData.followers}</p>
        <p>Following : {githubData.following}</p>
      </>
    );
  } else {
    return (
      <>
        <h1>User Didn't Exist</h1>
      </>
    );
  }
}

export default App;
