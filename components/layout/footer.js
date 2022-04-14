import React from "react";
import Feature from "../brand/feature";
import TreasuryBalance from "../treasury/balance";

const Footer = () => {
  return (
    <>
      <footer>
        <ul className="hidden-mobile">
          <li className="p">
            <a
              href="https://etherscan.io/address/0xfd4617981Dfdf01A8A098Bf2906d4B55Af801d20"
              target="_blank"
            >
              <TreasuryBalance />
            </a>
          </li>
          <li className="p">
            <a href="https://snapshot.org/#/wizdao.eth" target="_blank">
              Proposals
            </a>
          </li>
          <li className="p">
            <a href="https://opensea.io/collection/wizardsdao" target="_blank">
              OpenSea
            </a>
          </li>
          <li className="p">
            <a
              href="https://etherscan.io/address/0x418CbB82f7472B321c2C5Ccf76b8d9b6dF47Daba"
              target="_blank"
            >
              Etherscan
            </a>
          </li>
        </ul>
        <div className="hidden-desktop mob">
          <ul>
            <li className="p">
              <a
                href="https://etherscan.io/address/0xfd4617981Dfdf01A8A098Bf2906d4B55Af801d20"
                target="_blank"
              >
                <TreasuryBalance />
              </a>
            </li>
            <li className="p">
              <a href="https://snapshot.org/#/wizdao.eth" target="_blank">
                The DAO
              </a>
            </li>
            <li className="p">
              <a
                href="https://opensea.io/collection/wizardsdao"
                target="_blank"
              >
                OpenSea
              </a>
            </li>
            <li className="p">
              <a
                href="https://etherscan.io/address/0x418CbB82f7472B321c2C5Ccf76b8d9b6dF47Daba"
                target="_blank"
              >
                Etherscan
              </a>
            </li>
          </ul>
        </div>
        <div className="f">
          <Feature />
        </div>
      </footer>

      <style jsx>{`
        .f {
          width: 100%;
          display: block;
          margin: 1rem 0 2rem 0 !important;
        }
        .mob {
          width: 100%;
        }
        .mob ul {
          display: block;
          align-items: center;
          width: 100%;
        }
        .mob ul li {
          text-align: left;
          width: 100%;
          padding: 0.6rem 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.4);
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
          color: #fff;
          height: auto;
          position: relative;
          whitespace: no-wrap;
          overflow: auto;
          margin-top: 1.6rem;
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
          color: #f0f0f0;
        }
        a:hover,
        a:focus {
          text-decoration: none;
        }
      `}</style>
    </>
  );
};

export default Footer;
