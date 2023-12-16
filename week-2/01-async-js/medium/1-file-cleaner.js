const fs = require("fs");

function readingWriting() {
  fs.readFile("cleaner.txt", "utf-8", function (err, data) {
    fs.writeFile("cleaner.txt", spaceRemoverLogic(data), function (err) {
      console.log("content changed");
    });
  });
}

function spaceRemoverLogic(data) {
  let output = data
    .split(" ")
    .filter((word) => word != "")
    .join(" ");
  return output;
}

readingWriting();
