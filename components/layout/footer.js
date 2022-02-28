import React from "react";
import TreasuryBalance from "../treasury/balance";

const Footer = () => {
  return (
    <>
      <footer className="p hidden-mobile">
        <ul>
          <li className="p">
            <a href="https://etherscan.io/address/0xfd4617981Dfdf01A8A098Bf2906d4B55Af801d20">
              <TreasuryBalance />
            </a>
          </li>
          <li className="p">
            <a href="https://snapshot.org/#/wizdao.eth">Proposals</a>
          </li>
          <li className="p">
            <a href="https://twitter.com/wizardsdao">Twitter</a>
          </li>
          <li className="p">
            <a href="https://opensea.io/collection/wizardsdao">Opensea</a>
          </li>
          <li className="p">
            <a href="https://etherscan.io/address/0xC23b12EBA3af92dc3Ec94744c0c260caD0EeD0e5">
              Etherscan
            </a>
          </li>
        </ul>
      </footer>
      <footer className="hidden-desktop mob">
        <ul>
          <li className="p">
            <a href="https://etherscan.io/address/0xfd4617981Dfdf01A8A098Bf2906d4B55Af801d20">
              <TreasuryBalance />
            </a>
          </li>
          <li className="p">
            <a href="https://snapshot.org/#/wizdao.eth">The DAO</a>
          </li>
          <li className="p">
            <a href="https://twitter.com/wizardsdao">Twitter</a>
          </li>
          <li className="p">
            <a href="https://opensea.io/collection/wizardsdao">Opensea</a>
          </li>
          <li className="p">
            <a href="https://etherscan.io/address/0xC23b12EBA3af92dc3Ec94744c0c260caD0EeD0e5">
              Etherscan
            </a>
          </li>
        </ul>
      </footer>
      <style jsx>{`
        .mob {
          background: rgb(208, 149, 249);
        }
        .mob ul {
          display: block;
          align-items: center;
          width: 100%;
        }

        .mob ul li {
          text-align: left;
          width: 100%;
          padding: 0.6rem;
          border-bottom: 1px solid rgb(222, 185, 253);
        }
        .mob ul li:last-child {
          border: 0;
        }
        .mob ul li a {
          display: block;
          width: 100%;
        }
        ul li {
          list-style: none;
          gap: 1rem;
        }
        ul {
          margin: 0;
          padding: 0;
          display: inline-flex;
          align-items: center;
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
        footer.mob {
          padding: 0.875rem 0;
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

export default Footer;
