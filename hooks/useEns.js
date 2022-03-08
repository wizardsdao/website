import { ethers } from "ethers";
import { useEffect, useRef, useReducer } from "react";
import { useProvider } from "./useProvider";

export const useEns = (address) => {
  const p = useProvider();
  const cache = useRef({});

  const shortAddress = [address.substr(0, 4), address.substr(38, 4)].join(
    "..."
  );

  const initialState = {
    loading: false,
    data: "",
  };

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "FETCHING":
        return { ...initialState, loading: true };
      case "FETCHED":
        return { ...initialState, loading: false, data: action.data };
      default:
        return state;
    }
  }, initialState);

  useEffect(() => {
    let cancelRequest = false;

    const fn = async () => {
      dispatch({ type: "FETCHING" });

      if (cache.current[address]) {
        dispatch({ type: "FETCHED", data: cache.current[address] });
      } else {
        try {
          const name = await (p || ethers.getDefaultProvider()).lookupAddress(
            address
          );
          if (name) {
            cache.current[address] = name;
            if (cancelRequest) return;
            dispatch({ type: "FETCHED", data: name });
            return;
          }

          // cache address that doesn't have ens name
          cache.current[address] = shortAddress;
          dispatch({ type: "FETCHED", data: shortAddress });
        } catch (error) {
          if (cancelRequest) return;
          dispatch({ type: "FETCHED", data: shortAddress });
        }
      }
    };

    fn();

    return function cleanup() {
      cancelRequest = true;
    };
  }, [address]);

  return state;
};
