import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { useNnsEns } from "../../hooks/useNnsEns";
import Davatar from "@davatar/react";
import { TailSpin } from "../loader";
import { useEffect } from "react";
import { useProvider } from "../../hooks/useProvider";

const bidRow = ({ e, account, loading }) => {
  const p = useProvider();
  const state = useNnsEns(e.sender);

  const shortAddress = [e.sender.substr(0, 4), e.sender.substr(38, 4)].join(
    "..."
  );

  useEffect(() => {}, [e.sender]);

  const yourBid = e.sender == account;

  return (
    <>
      <li className="br">
        <div className="bi">
          <div className="avatar">
            <Davatar
              size={24}
              address={e.sender}
              provider={p || ethers.getDefaultProvider()}
            />
          </div>
          <span>{loading ? null : state.data || shortAddress}</span>
          {(() => {
            if (!loading && yourBid) {
              return (
                <div className="pill">
                  <span>Your bid</span>
                </div>
              );
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
        .avatar {
          margin-right: 10px;
        }
        .bi {
          line-height: 15px;
          display: flex;
          align-items: center;
          font-weight: 500;
        }
        .bi-cost {
          font-weight: 500;
          position: relative;
          top: 1px;
        }
        .br {
          align-items: center;
          background: rgba(255, 255, 255, 0.4);
          padding: 0.8rem 1rem;
          border-radius: 5px;
          font-size: 1.16rem;
          font-weight: 600;
          display: flex;
          font-weight: 600;
          justify-content: space-between;
          margin: 10px 0;
        }
        .br:first-child {
          margin: 0;
        }
        .pill {
          background: #f9b42b;
          padding: 5px 10px;
          border-radius: 1rem;
          margin-left: 15px;
          font-size: 11px;
        }
        .pill span {
          position: relative;
          top: 1px;
        }
        .bi span {
          position: relative;
          top: 1px;
        }
        @media (max-width: 568px) {
          .br {
            background: rgba(24, 10, 87);
          }
          .pill {
            color: #000;
          }
        }
      `}</style>
    </>
  );
};

export default bidRow;
