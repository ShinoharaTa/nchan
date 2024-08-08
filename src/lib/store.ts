import { writable } from "svelte/store";

export const navigation = writable({
  title: {
    name: "",
    imagePath: "",
  },
  prev: {
    name: "",
    func: () => {},
  },
  next: {
    name: "",
    func: () => {},
  },
});
