import { useEffect, useState } from "react";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { TailSpin } from "../loader";

const TREASURY_ADDR = "0xfd4617981Dfdf01A8A098Bf2906d4B55Af801d20";
let gotBalance = false;

const TreasuryBalance = () => {
  const [tBalance, setBalance] = useState("...");

  useEffect(() => {
    const fn = async () => {
      const p = ethers.getDefaultProvider();
      const balance = await p.getBalance(TREASURY_ADDR);

      gotBalance = true;
      setBalance(
        new BigNumber(ethers.utils.formatUnits(balance || 0, "ether")).toFixed(
          2
        )
      );
    };

    if (!gotBalance) {
      fn();
    }
  });

  return (
    <div className="treasury">
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
        .treasury {
          border: 1px solid rgba(0, 0, 0, 0.3);
          padding: 3px 6px;
          border-radius: 6px;
          transition: all 300ms ease;
        }

        .treasury:hover {
          border-color: #5625a4;
        }

        .t-label {
          opacity: 0.5;
          position: relative;
          top: -0.5px;
          margin-right: 3px;
          transition: all 300ms ease;
        }

        .treasury:hover .t-label {
          color: #5625a4;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default TreasuryBalance;
