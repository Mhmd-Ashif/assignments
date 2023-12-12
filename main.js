console.log("main");

const rest = new Map();
rest.set("name", "Asif Briyani"); // .set Method is used to set the values into map
console.log(rest.set(1, "Thanjavur"));
rest.set(2, "Chennai");
console.log(rest);

//chaining is possible
rest
  .set("categories", ["Italian", "Pizzeria", "Vegetarian", "Organic"])
  .set("open", 11)
  .set("close", 23) //This is Called Chaining
  .set(true, "We are Open")
  .set(false, "We are Close");
console.log(rest);

console.log(rest.get("name")); // .get Method use to Retrieve an Value by defining its key Name
console.log(rest.get(true));
//eg;
const time = 8;
console.log(rest.get(time > rest.get("open") && time < rest.get("close")));

//methods
console.log(rest.has("categories")); //it is used to check whether the key is present or not
rest.delete(1); //it is used to delete and key value pairs
console.log(rest);
console.log(rest.size);

//using array as map keys
const arr = [1, 2];
rest.set(arr, "Test");
console.log(rest.get(arr));
//it will not work so use global variable

console.log(rest.set(document.querySelector("h1"), "This is a Heading")); //using html element as an key values

//Iteration
//we can declare an map elements by using array
const question = new Map([
  ["question", "Best Programming Language in The World?"],
  [1, "C"],
  [2, "Java"],
  [3, "JavaScript"],
  [4, "Python"],
  ["correct", 3],
  [true, "Your Are Correct ✌️"],
  [false, "Try Again!!"],
]);
console.log(question);

//Converting Object into Maps
const hourMap = new Map(Object.entries(openingHours));
console.log(hourMap);

//quiz app
console.log(question.get("question"));
for (const [k, v] of question) {
  if (typeof k === "number") console.log(`Answer ${k} : ${v}`);
}
const ans = Number(prompt("Enter Your Answer"));
console.log(ans);
console.log(question.get(ans === question.get("correct")));

//converting Maps into Arrays
console.log([...question]);
console.log([question.entries()]);
console.log([...question.keys()]);
console.log([...question.values()]);
