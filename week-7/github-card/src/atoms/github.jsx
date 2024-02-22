import { atom, selector } from "recoil";

export const githubId = atom({
  key: "githubId",
  default: "",
});

export const render = selector({
  key: "render",
  get: async ({ get }) => {
    const id = get(githubId);
    if (id == "") {
      return;
    } else {
      const res = await fetch(`https://api.github.com/users/${id}`);
      const data = await res.json();
      console.log(data);
      return data;
    }
  },
});
