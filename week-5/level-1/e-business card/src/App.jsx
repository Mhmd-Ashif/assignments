import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { CardComponent } from "./CardComponent";

function App() {
  const [detail, setDetail] = useState({
    name: "Ashif",
    description: "passionated about the MERN",
    intrest: ["movies", "coding", "bgmi"],
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    other: "https://othersocialmedia links",
  });

  return (
    <div className="card">
      <h1>Card Component</h1>
      <CardComponent detail={detail} />
    </div>
  );
}

export default App;
