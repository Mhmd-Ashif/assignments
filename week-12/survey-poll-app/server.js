const express = require("express");
const app = express();
const routerApp = require("../survey-poll-app/router/routes.js");
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    msg: "Root folder",
  });
});

app.use("/api/users/v1", routerApp);

app.listen(3000, () => {
  console.log("your app is running in port 3000");
});
