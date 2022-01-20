import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { useState } from "react";

const bidRow = ({ e, account }) => {
  const shortAddress = [e.sender.substr(0, 4), e.sender.substr(38, 4)].join(
    "..."
  );

  const ensName = shortAddress;
  // const [ensName, setEnsName] = useState(shortAddress);
  // TODO :- prevent excessive calls before making ens lookup
  // useEffect(() => {
  //   const fn = async () => {
  //     const name = await ethers.getDefaultProvider().lookupAddress(e.sender);
  //     if (name) {
  //       setEnsName(name);
  //     }
  //   };

  //   fn();
  // });

  return (
    <>
      <li className="br">
        <div className="bi">
          {ensName}
          {(() => {
            if (e.sender == account) {
              return <div className="pill">Your bid</div>;
            }
          })()}
        </div>
        <div className="bi-cost">
          <span style={{ fontFamily: "sans-serif" }}>{"Ξ "}</span>
          {new BigNumber(ethers.utils.formatEther(e.value)).toFixed(2)}
        </div>
      </li>
      <style jsx>{`
        .bi {
          display: flex;
          align-items: center;
          font-weight: 500;
        }
        .bi-cost {
          font-weight: 500;
        }
        .br {
          align-items: center;
          background-color: hsla(0, 0%, 100%, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 5px;
          border-bottom: 1px solid hsla(0, 0%, 82.7%, 0.322);
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          font-weight: 600;
          justify-content: space-between;
        }
        .pill {
          background: #f9b42b;
          padding: 0px 10px;
          border-radius: 1rem;
          margin-left: 15px;
          font-size: 11px;
        }
      `}</style>
    </>
  );
};

export default bidRow;
