import { useRef } from "react";
import Link from "next/link";
import Logo from "../brand/logo";
import { Twitter, Instagram, Discord, OpenSea } from "../brand/thirdparty";
import TreasuryBalance from "../treasury/balance";

const Header = (props) => {
  const mobileMenu = useRef(null);

  const mobileToggle = (e) => {
    e.preventDefault();
    const container = document.querySelector("html");
    if (container.classList.contains("no-scroll")) {
      container.classList.remove("no-scroll");
      mobileMenu.current.classList.remove("open");
      return;
    }

    container.classList.add("no-scroll");
    mobileMenu.current.classList.add("open");
  };

  return (
    <>
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
                className="nav-link balance"
                href="https://etherscan.io/address/0xfd4617981Dfdf01A8A098Bf2906d4B55Af801d20"
              >
                <TreasuryBalance pill />
              </a>
            </li>
            <li className="hidden-mobile">
              <Link href="/vision">
                <a className="nav-link">Vision</a>
              </Link>
            </li>
            <li className="hidden-mobile">
              <a className="nav-link" href="https://discord.gg/wizardsdao">
                Discord
              </a>
            </li>
            <li className="hidden-mobile">
              <a className="nav-link" href="https://snapshot.org/#/wizdao.eth">
                Proposals
              </a>
            </li>
            <li className="hidden-mobile">
              <a
                className="nav-link"
                href="https://twitter.com/WizardsDAOBot/status/1483146932847476738"
              >
                Previous Auctions
              </a>
            </li>
            <li className="ham hidden-desktop">
              <button type="button" onClick={mobileToggle}>
                X
              </button>
            </li>
            {(() => {
              if (!props.web3Connected) {
                return (
                  <li className="hidden-mobile">
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
                <li className="hidden-mobile">
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
        <div className="mobile-menu hidden" ref={mobileMenu}>
          <div className="mm-header">
            <Logo href="#" />
            <button type="button" onClick={mobileToggle}>
              x
            </button>
          </div>
          <nav className="mm">
            <ul>
              <li>
                <a
                  className="nav-link"
                  href="https://etherscan.io/address/0xfd4617981Dfdf01A8A098Bf2906d4B55Af801d20"
                >
                  <TreasuryBalance />
                </a>
              </li>
              <li>
                <a
                  className="nav-link"
                  href="https://snapshot.org/#/wizdao.eth"
                >
                  Proposals
                </a>
              </li>
              <li>
                <a className="nav-link" href="https://github.com/wizardsdao">
                  GitHub
                </a>
              </li>
              <li>
                <a
                  className="nav-link"
                  href="https://etherscan.io/address/0xC23b12EBA3af92dc3Ec94744c0c260caD0EeD0e5"
                >
                  Etherscan
                </a>
              </li>
              <li>
                <a
                  className="nav-link flex"
                  href="https://twitter.com/WizardsDAO"
                >
                  <div>Twitter</div>
                  <Twitter style={{ height: 20, alignSelf: "center" }} />
                </a>
              </li>
              <li>
                <a
                  className="nav-link flex"
                  href="http://discord.gg/wizardsdao"
                >
                  <div>Discord</div>
                  <Discord style={{ height: 20, alignSelf: "center" }} />
                </a>
              </li>
              <li>
                <a
                  className="nav-link flex"
                  href="https://www.instagram.com/wizardsdao/"
                >
                  <div>Instagram</div>
                  <Instagram style={{ height: 20, alignSelf: "center" }} />
                </a>
              </li>
              <li>
                <a
                  className="nav-link flex"
                  href="https://opensea.io/collection/wizardsdao"
                >
                  <div>OpenSea</div>
                  <OpenSea style={{ height: 20, alignSelf: "center" }} />
                </a>
              </li>
            </ul>
          </nav>
          <div className="pull">
            {(() => {
              if (!props.web3Connected) {
                return (
                  <button
                    type="button"
                    className="nav-link btn wc action"
                    onClick={props.walletConnectClick}
                  >
                    Connect wallet
                  </button>
                );
              }

              return (
                <button
                  type="button"
                  className="nav-link btn wc action"
                  onClick={props.walletDisconnectClick}
                >
                  Disconnect wallet
                </button>
              );
            })()}
          </div>
        </div>
      </header>
      <style jsx global>{`
        .no-scroll {
          overflow-y: hidden;
        }
      `}</style>
      <style jsx>{`
        .logo {
          position: relative;
          top: -1px;
        }
        .addendum p {
          margin: 0;
          padding: 0 15px;
          margin-top: 1rem;
          opacity: 0.6;
        }
        .addendum p:last-child {
          margin-top: 0;
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
          height: 62px;
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
        ul {
          padding: 0;
        }
        ul li {
          display: inline-block;
          padding: 0 0.66rem;
          font-weight: 400;
        }
        @media (max-width: 992px) {
          ul li {
            padding: 0;
          }
        }
        ul li:last-child {
          padding-right: 0;
        }
        ul li:first-child {
          padding-left: 0;
        }
        .nav-link {
          font-size: 16px;
          font-weight: 500;
          display: block;
          color: black;
        }
        .mm .nav-link {
          font-size: 1.16rem;
        }
        .mm .nav-link:focus {
          border: none;
          outline: none;
        }
        .nav-link:hover {
        }
        .btn.nav-link:hover {
          text-decoration: none;
        }
        .btn {
          color: #fff !important;
          border: 1px solid #12004c;
        }
        .mm ul {
          margin: 0;
          margin-top: 1rem;
          width: 100%;
        }
        .mm li {
          width: 100%;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          font-size: 1.16rem;
        }
        .mm li a {
          padding: 10px 15px !important;
          display: inline-block;
          width: 100%;
        }
        .flex {
          display: flex !important;
          justify-content: space-between;
        }
        .mm-header {
          display: flex;
          justify-content: space-between;
          padding: 10px 15px;
        }
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          background: #12004c;
          width: 100%;
          height: 100%;
          z-index: 999;
          transition: all 0.2s ease;
          opacity: 0;
          visibility: hidden;
        }
        .mobile-menu nav {
          padding: 0 15px;
        }
        .open {
          opacity: 1;
          visibility: visible;
        }
        .pull {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          bottom: 2rem;
          width: 100%;
        }
        .action {
          box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.2);
        }
        .nav-link.balance:hover {
          border-bottom: none;
        }
      `}</style>
    </>
  );
};

export default Header;
