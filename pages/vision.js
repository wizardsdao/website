import Layout from "../components/layout/home.js";
import { useState } from "react";
import Link from "next/link";
import Web3 from "../components/web3";
import { Twitter, Discord } from "../components/brand/thirdparty.js";

const Vision = ({ web3React, onWalletConnectClick, onWalletDisconnect }) => {
  return (
    <Layout
      title={`WizardsDAO - Our Vision`}
      white
      web3Connected={web3React.active}
      walletConnectClick={onWalletConnectClick}
      walletDisconnectClick={onWalletDisconnect}
    >
      <div className="container">
        <div className="row row-f m">
          <div className="title">
            <span className="lift">OUR</span>
            <h1>VISION</h1>
          </div>
          <p>
            Together we're building a community of professional degenerates.
          </p>
          <p>
            Our goals are to have fun, make homies, and proliferate the Wizards
            brand.
          </p>
          <p>
            We envision a collection of 2000 legendary, on-chain NFTs that unite
            the WizardsDAO community and allow people to be themselves without
            censorship.
          </p>
          <p>
            <Link href="/">
              <a
                style={{
                  margin: "2.6rem 0",
                }}
                className="btn purp"
              >
                Join us ↬
              </a>
            </Link>
          </p>
        </div>
        <div className="row m rt">
          <div className="title">
            <span className="lift">CREATED BY</span>
            <h1>WIZARDS</h1>
          </div>
          <p>
            WizardsDAO is a decentralized community of builders, artists,
            memers, and crypto enthusiasts. The Wizards create the future of the
            Wizards brand. Everything is up to them.
          </p>
          <img
            src="/static/img/faded.png"
            style={{ maxWidth: "830px", marginTop: "2rem" }}
          />
        </div>
        <div className="row m rt">
          <div className="title">
            <span className="lift">PONDER THE</span>
            <h1>VIBES</h1>
          </div>
          <p>
            Want to learn about Wizards while getting lit? Join one of our
            Twitter Spaces for a smoke sesh.
          </p>
          <p>
            Want to help push the WizardsDAO brand? Throw a Wizard hat on your
            PFP, we're CC0!
          </p>
          <p>
            Want to talk to the current Wizards? Hop on Discord and say what's
            up!
          </p>
          <ul className="actions">
            <li>
              <Link href="/#how-it-works">
                <a>How it works?</a>
              </Link>
            </li>
            <li>
              <Link href="https://twitter.com/WizardsDAO">
                <a target="_blank">
                  Twitter
                  <Twitter
                    style={{
                      maxWidth: "30px",
                      fill: "#fff",
                      marginLeft: "1rem",
                    }}
                  />
                </a>
              </Link>
            </li>
            <li>
              <Link href="http://discord.gg/wizardsdao">
                <a target="_blank">
                  Discord{" "}
                  <Discord
                    style={{
                      maxWidth: "30px",
                      fill: "#fff",
                      marginLeft: "1rem",
                    }}
                  />
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="col-sm-12" style={{ position: "relative" }}>
              <img
                className="fixed-img"
                src="/static/img/barrel_man.svg"
                style={{ float: "right" }}
                height="600"
              />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .actions {
          margin: 0;
          width: 100%;
          max-width: 640px;
          list-style: none;
          margin-top: 1rem;
        }
        .actions li {
          width: 100%;
          background: rgb(44 29 122);
          color: white;
          border-radius: 6px;
          margin: 1rem 0;
          text-align: center;
        }
        .actions li a {
          display: flex;
          padding: 1.3rem 1rem;
          align-items: center;
          justify-content: center;
        }
        .small {
          font-size: 1rem;
        }
        .mute {
          opacity: 0.75;
        }
        .fixed-img {
          position: fixed;
          bottom: 0;
          left: 40%;
          transform: translateX(90%);
        }
        .container {
          max-width: 900px;
        }
        .bg-img {
          position: absolute;
          right: 0;
          bottom: -30px;
          width: auto;
        }
        .section-btn {
          display: inline-flex;
          gap: 10px;
          font-size: 1.16rem !important;
          background: rgb(56, 115, 246);
          color: #fff;
          border: 1px solid rgb(56, 148, 246);
          padding: 6px 24px;
        }
        .purp {
          background: #7000ff !important;
          border-color: #8f38ff !important;
          color: #fff;
          box-shadow: 0 0 20px 1px rgb(107 0 250);
          max-width: 300px;
        }

        @media (max-width: 568px) {
          .purp {
            width: 100%;
            max-width: 100%;
          }
        }

        .sbs {
          display: flex;
          margin: 2rem 0;
          align-items: center;
          justify-content: start;
          gap: 20px;
        }
        .lift {
          font-family: "VCR OSD Mono", monospace;
          font-size: 38px;
          font-weight: 500;
        }
        .title h1 {
          margin: 0;
        }
        p,
        a,
        span {
          color: #fff;
        }
        p {
          margin: 1rem 0;
          font-size: 1.32rem;
          line-height: 32px;
          max-width: 640px;
          margin-bottom: 0;
        }
        a {
          display: block;
          font-size: 1.32rem;
          line-height: 32px;
          max-width: 640px;
          margin-bottom: 0;
        }
        .m {
          margin: 4rem 0;
        }
        .sbs p {
          margin-top: 0;
        }
        .rt {
          margin-top: 8rem !important;
        }
        .row-f {
          position: relative;
          min-height: 400px;
          display: block;
          margin-bottom: 0 !important;
        }
      `}</style>
    </Layout>
  );
};

export default () => (
  <Web3>
    <Vision />
  </Web3>
);
