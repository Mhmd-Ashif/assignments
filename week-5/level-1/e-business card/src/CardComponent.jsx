import { useState } from "react";

export function CardComponent(props) {
  return (
    <>
      <h2>{props.detail.name}</h2>
      <p>{props.detail.description}</p>
      <h3>Intrests</h3>
      {props.detail.intrest.map((hobby) => {
        return <div>{hobby}</div>;
      })}
      <br></br>
      <a style={{ paddingRight: 10 }} href={props.detail.linkedin}>
        LinkedIn
      </a>
      <a href={props.detail.twitter} style={{ paddingRight: 10 }}>
        Twitter
      </a>
      <a href={props.detail.other} style={{ paddingRight: 10 }}>
        Other Links
      </a>
    </>
  );
}
