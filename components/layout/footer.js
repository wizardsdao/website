import React from "react";
import { useEffect, useState, memo } from "react";
import { ethers } from "ethers";

let gotBalance = false;
const Footer = () => {
  const [tBalance, setBalance] = useState("...");
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
  });

  return (
    <>
      <footer className="p">
        <ul>
          <li>
            <a href="https://etherscan.io/address/0xfd4617981Dfdf01A8A098Bf2906d4B55Af801d20">
              The Money <span style={{ fontFamily: "sans-serif" }}>{"Ξ "}</span>
              {tBalance}
            </a>
          </li>
          <li>
            <a href="https://twitter.com/wizardsdao">Twitter</a>
          </li>
          <li>
            <a href="https://etherscan.io/address/0xC23b12EBA3af92dc3Ec94744c0c260caD0EeD0e5">
              Etherscan
            </a>
          </li>
        </ul>
      </footer>
      <style jsx>{`
        ul li {
          list-style: none;
          gap: 1rem;
        }
        ul {
          margin: 0;
          padding: 0;
          display: inline-flex;
          gap: 30px;
        }
        .a {
          text-align: center;
          display: block !important;
          margin-bottom: 10px;
        }
        .a:hover {
          text-decoration: none;
        }
        nav {
          width: 100%;
        }
        footer * {
          margin: 0;
        }
        footer {
          text-align: center;
          display: flex;
          flex-direction: row;
          justify-content: center;
          color: #fff;
          height: auto;
          position: relative;
          padding: 0.875rem;
          whitespace: no-wrap;
          overflow: auto;
        }
        @media (max-width: 767px) {
          .footer {
            justify-content: start;
            padding-left: 0;
          }
        }
        .t {
          white-space: nowrap;
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          text-decoration: none;
          padding: 0px 3.125%;
        }
        .copy {
          opacity: 0.37;
        }
        p,
        a {
          font-size: 16px;
          font-weight: 500;
        }
        a,
        a:hover,
        a:visited,
        a:focus {
          color: #000;
        }
        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
};

export default memo(Footer);
