import { atom, selector } from "recoil";

export const Component = atom({
  key: "Component",
  default: 0,
});

export const phNumber = atom({
  key: "phNumber",
  default: "",
});

export const otp = selector({
  key: "otp",
  get: ({ get }) => {
    const no = get(phNumber);
    let otpNum = "";
    for (let i = 0; i < 4; i++) {
      otpNum = otpNum + Math.round(Math.random() * 9);
    }
    console.log(otpNum);
    return otpNum;
  },
});
