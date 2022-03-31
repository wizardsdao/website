import { useEffect, useState } from "react";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { TailSpin } from "../loader";
import { useProvider } from "../../hooks/useProvider";
import { useRouter } from "next/router";

const TREASURY_ADDR = "0xfd4617981Dfdf01A8A098Bf2906d4B55Af801d20";

let cachedBalance = "......";
const TreasuryBalance = ({ pill, white }) => {
  const router = useRouter();
  const p = useProvider();
  const [tBalance, setBalance] = useState(cachedBalance);

  useEffect(() => {
    const fn = async () => {
      if (!p) return;
      const balance = await p.getBalance(TREASURY_ADDR);

      let newBalance = new BigNumber(
        ethers.utils.formatUnits(balance || 0, "ether")
      ).toFixed(2);

      cachedBalance = newBalance;
      setBalance(newBalance);
    };

    if (cachedBalance === "......") {
      fn();
    }
  });

  let cname = pill ? "treasury-pill" : "treasury";

  return (
    <div className={white ? cname + " white" : cname}>
      <span className="t-label">Treasury</span>{" "}
      <span style={{ fontFamily: "sans-serif" }}>{"Ξ "}</span>
      {(() => {
        if (tBalance) {
          return tBalance;
        }

        return (
          <TailSpin
            height={15}
            width={15}
            style={{ position: "relative", top: "1px", left: "5px" }}
          />
        );
      })()}
      <style jsx>{`
        .treasury-pill {
          border: 2px solid #12004c;
          padding: 3px 6px;
          border-radius: 6px;
          transition: all 300ms ease;
        }
        .white {
          background: rgba(107, 0, 250, 0.4);
          border-color: rgba(143, 56, 255, 0.4);
        }
        .treasury-pill:hover {
          background: rgba(255, 255, 255, 0.4);
        }
        .white:hover {
          background: rgba(107, 0, 250, 1) !important;
        }
        .t-label {
          position: relative;
          top: -0.5px;
          margin-right: 3px;
          transition: all 300ms ease;
        }

        .treasury-pill:hover .t-label {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default TreasuryBalance;
