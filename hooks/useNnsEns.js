import { ethers, utils, BigNumber } from "ethers";
import { useEffect, useRef, useReducer } from "react";
import { useProvider } from "./useProvider";

export const useNnsEns = (address) => {
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
          const name = await lookupAddress(p || ethers.getDefaultProvider(), address);
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

async function lookupAddress(
  library,
  address
) {
  try {
    const res = await library.call({
      to: "0x5982ce3554b18a5cf02169049e81ec43bfb73961",
      data: "0x55ea6c47000000000000000000000000" + address.substring(2),
    });
    const offset = BigNumber.from(utils.hexDataSlice(res, 0, 32)).toNumber();
    const length = BigNumber.from(
      utils.hexDataSlice(res, offset, offset + 32)
    ).toNumber();
    const data = utils.hexDataSlice(res, offset + 32, offset + 32 + length);
    return utils.toUtf8String(data) || null;
  } catch (e) {
    return null;
  }
}
