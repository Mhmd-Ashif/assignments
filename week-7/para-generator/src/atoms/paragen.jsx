import { atom, selector } from "recoil";

export const lines = atom({
  key: "lines",
  default: 0,
});

export const createPara = selector({
  key: "createPara",
  get: ({ get }) => {
    const line = get(lines);
    const lor =
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid repellat provident quos officia magnam dolor! Expedita, nihil provident inventore distinctio quibusdam neque consectetur, magnam dolorum repudiandae natus architecto, reiciendis ullam";
    const letters = lor.split(" ");
    let paragraph = "";
    let paraarray = [];
    for (let i = 0; i < line; i++) {
      for (let j = 0; j < Math.round(Math.random() * 13); j++) {
        paragraph = letters.join(" ");
        paraarray.push(paragraph);
      }
      paraarray.push(" ");
    }
    return paraarray;
  },
});
