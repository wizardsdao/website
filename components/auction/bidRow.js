import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { useEns } from "../../hooks/useEns";
import { TailSpin } from "../loader";
import { useEffect } from "react";

const bidRow = ({ e, account, loading }) => {
  const state = useEns(e.sender);

  const shortAddress = [e.sender.substr(0, 4), e.sender.substr(38, 4)].join(
    "..."
  );

  useEffect(() => {}, [e.sender]);

  return (
    <>
      <li className="br">
        <div className="bi">
          {loading ? null : state.data || shortAddress}
          {(() => {
            if (!loading && e.sender == account) {
              return <div className="pill">Your bid</div>;
            }
          })()}
          {(() => {
            if (loading) {
              return;
            }

            if (state.loading) {
              return (
                <TailSpin
                  height={15}
                  width={15}
                  style={{ position: "relative", top: "-0.5px", left: "15px" }}
                />
              );
            }
          })()}
        </div>
        <div className="bi-cost">
          {(() => {
            if (!loading) {
              return (
                <>
                  <span style={{ fontFamily: "sans-serif" }}>{"Ξ "}</span>
                  {new BigNumber(ethers.utils.formatEther(e.value)).toFixed(2)}
                </>
              );
            }

            return null;
          })()}
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
          padding: 0.8rem 1rem;
          border-radius: 5px;
          font-size: 1.16rem;
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
