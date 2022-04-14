import { useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Logo from "../brand/logo";
import { Twitter, Instagram, Discord, OpenSea } from "../brand/thirdparty";
import TreasuryBalance from "../treasury/balance";

const Header = (props) => {
  const router = useRouter();
  const mobileMenu = useRef(null);

  // get active path to render current page indicator
  let activePath = router.asPath.split("/");
  activePath.shift();
  activePath = activePath[0].toLowerCase();

  const mobileToggle = (e) => {
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
      <header className={props.white ? "top white" : "top"}>
        <div className="start">
          <div className="logo">
            <Logo href="/" />
          </div>
        </div>
        <nav className="end">
          <ul
            className="small hidden-mobile"
            style={{ display: "flex", alignItems: "center" }}
          >
            <li>
              <a
                className="nav-link balance"
                href="https://etherscan.io/address/0xfd4617981Dfdf01A8A098Bf2906d4B55Af801d20"
                target="_blank"
              >
                <TreasuryBalance pill white={props.white} />
              </a>
            </li>
            <li>
              <Link href="/">
                <a
                  className={
                    activePath == "" || activePath == "auction"
                      ? "active nav-link"
                      : "nav-link"
                  }
                >
                  Auction
                </a>
              </Link>
            </li>
            <li>
              <Link href="/vision">
                <a
                  className={
                    activePath == "vision"
                      ? "active white nav-link"
                      : "nav-link"
                  }
                >
                  Vision
                </a>
              </Link>
            </li>
            <li>
              <a
                className="nav-link"
                href="https://discord.gg/wizardsdao"
                target="_blank"
              >
                Discord
              </a>
            </li>
            <li>
              <a
                className="nav-link"
                href="https://wizardsdao.notion.site/Wiz-Hub-7f264436ed0245809111d60450adda97"
                target="_blank"
              >
                Hub
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
          <button
            className="ham hidden-desktop"
            type="button"
            onClick={mobileToggle}
          >
            <div id="pencet">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </nav>
        <div className="mobile-menu hidden" ref={mobileMenu}>
          <div className="mm-header">
            <Logo href="#" />
            <button className="ham" type="button" onClick={mobileToggle}>
              <div id="pencet" className="Diam">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
          <nav className="mm">
            <ul onClick={mobileToggle}>
              <li>
                <Link href="/vision">
                  <a className="nav-link">Vision</a>
                </Link>
              </li>
              <li>
                <a
                  className="nav-link"
                  href="https://etherscan.io/address/0xfd4617981Dfdf01A8A098Bf2906d4B55Af801d20"
                  target="_blank"
                >
                  <TreasuryBalance />
                </a>
              </li>
              <li>
                <a
                  className="nav-link"
                  href="https://wizardsdao.notion.site/Wiz-Hub-7f264436ed0245809111d60450adda97"
                  target="_blank"
                >
                  Hub
                </a>
              </li>
              <li>
                <a
                  className="nav-link"
                  href="https://github.com/wizardsdao"
                  target="_blank"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  className="nav-link"
                  href="https://etherscan.io/address/0x418CbB82f7472B321c2C5Ccf76b8d9b6dF47Daba"
                  target="_blank"
                >
                  Etherscan
                </a>
              </li>
              <li>
                <a
                  className="nav-link flex"
                  href="https://twitter.com/WizardsDAO"
                  target="_blank"
                >
                  <div>Twitter</div>
                  <Twitter
                    style={{ height: 20, alignSelf: "center", fill: "#fff" }}
                  />
                </a>
              </li>
              <li>
                <a
                  className="nav-link flex"
                  href="http://discord.gg/wizardsdao"
                  target="_blank"
                >
                  <div>Discord</div>
                  <Discord
                    style={{ height: 20, alignSelf: "center", fill: "#fff" }}
                  />
                </a>
              </li>
              <li>
                <a
                  className="nav-link flex"
                  href="https://opensea.io/collection/wizardsdao"
                  target="_blank"
                >
                  <div>OpenSea</div>
                  <OpenSea
                    style={{ height: 20, alignSelf: "center", fill: "#fff" }}
                  />
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
                    style={{ color: "#fff" }}
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
                  style={{ color: "#fff" }}
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
          background: #c5a3e2;
        }
        header.white {
          background: #12004c !important;
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
          color: #fff !important;
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
          align-items: center;
          height: 60px;
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
          bottom: 1.25rem;
          padding: 0 15px;
          width: 100%;
        }
        .nav-link.balance:hover {
          border-bottom: none;
        }

        .active {
          border-bottom: 2px solid #12004c;
        }
        .active.white {
          border-color: #fff;
        }

        .white .nav-link {
          color: #fff;
        }

        .action {
          box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.2);
          background: rgba(107, 0, 250, 1) !important;
          border-color: rgba(143, 56, 255, 0.4);
          width: 100%;
          padding: 1rem 1rem;
          font-size: 1.16rem;
        }

        #pencet span {
          background-color: ghostwhite;
          width: 2em;
          height: 0.2em;
          margin: 0.4em 0;
          display: block;
          transition: all 0.4s ease;
          transform-origin: 0 0;
        }

        .Diam {
          position: relative;
          transform: scale(0.9);
          right: -3px;
        }

        .Diam span:nth-child(1) {
          transform: rotate(45deg) translate(1px, -1px);
        }

        .Diam span:nth-child(2) {
          transform: scaleX(0);
        }

        .Diam span:nth-child(3) {
          transform: rotate(-45deg) translate(1px, 0);
          top: 4px;
          right: 1px;
          position: relative;
        }

        .ham {
          background: none;
          outline: none;
          border: none;
        }

        .white .wc {
          background: #fff;
          color: #000 !important;
        }
      `}</style>
    </>
  );
};

export default Header;
