import create from "zustand";

const useStore = create(() => {
  return {
    polled: false,
  };
});

export default useStore;
