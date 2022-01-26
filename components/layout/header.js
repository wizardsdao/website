import { useEffect, useState, memo } from "react";
import { ethers } from "ethers";
import Logo from "../brand/logo";
import { TailSpin } from "../loader";

let gotBalance = false;
const Header = (props) => {
  const [tBalance, setBalance] = useState("");
  useEffect(() => {
    const fn = async () => {
      const p = ethers.getDefaultProvider();
      const balance = await p.getBalance(
        "0xfd4617981Dfdf01A8A098Bf2906d4B55Af801d20" // the money address
      );
      gotBalance = true;
      setBalance(ethers.utils.formatUnits(balance || 0, "ether"));
    };

    if (!gotBalance) {
      fn();
    }
  }, [props.title]);

  return (
    <>
      {(() => {
        if (props.isWhitelist) {
          return (
            <div className="wlday">
              <marquee>
                <span className="wli">Today is a whitelist day 🥳</span>
                <span className="wli">Today is a whitelist day 🥳</span>
                <span className="wli">Today is a whitelist day 🥳</span>
                <span className="wli">Today is a whitelist day 🥳</span>
                <span className="wli">Today is a whitelist day 🥳</span>
                <span className="wli">Today is a whitelist day 🥳</span>
                <span className="wli">Today is a whitelist day 🥳</span>
              </marquee>
            </div>
          );
        }
      })()}
      <header className="top">
        <div className="start">
          <div className="logo">
            <Logo href="/" />
          </div>
        </div>
        <nav className="end">
          <ul
            className="small"
            style={{ display: "flex", alignItems: "center" }}
          >
            <li className="hidden-mobile">
              <a
                className="nav-link"
                href="https://etherscan.io/address/0xfd4617981Dfdf01A8A098Bf2906d4B55Af801d20"
              >
                The Money{" "}
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
              </a>
            </li>
            <li className="hidden-mobile">
              <a className="nav-link" href="https://snapshot.org/#/wizdao.eth">
                The DAO
              </a>
            </li>
            {(() => {
              if (!props.web3Connected) {
                return (
                  <li>
                    <button
                      type="button"
                      className="nav-link btn wc"
                      onClick={props.walletConnectClick}
                    >
                      Connect wallet
                    </button>
                  </li>
                );
              }

              return (
                <li>
                  <button
                    type="button"
                    className="nav-link btn wc"
                    onClick={props.walletDisconnectClick}
                  >
                    Disconnect wallet
                  </button>
                </li>
              );
            })()}
          </ul>
        </nav>
      </header>
      <style jsx>{`
        .wli {
          margin: 0 30px;
        }
        .wlday {
          color: #fff;
          background: #5625a4;
          padding: 2px 0px;
        }
        .wlday marquee {
          margin: 0;
          position: relative;
          top: 2px;
        }
        li.btn {
          padding: 0.5rem 2rem;
          display: inline-block;
        }

        header {
          width: 100%;
          padding: 10px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .start {
          width: auto;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        .end {
          display: flex;
          align-items: center;
          flex-direction: row;
          justify-content: flex-end;
        }
        .logo {
          padding: 0 0.66rem;
        }
        ul {
          padding: 0;
        }
        ul li {
          display: inline-block;
          padding: 0 0.66rem;
          font-weight: 400;
        }
        ul li:last-child {
          padding-right: 0;
        }
        ul li:first-child {
          padding-left: 0;
        }
        .nav-link {
          font-size: 14px;
          font-weight: 500;
          display: block;
          color: black;
        }
        .nav-link:hover {
          border-bottom: 1px solid #000;
        }
        .btn.nav-link:hover {
          text-decoration: none;
        }
        .btn {
          color: #fff !important;
          border: 1px solid #5625a4;
        }
      `}</style>
    </>
  );
};

export default Header;
