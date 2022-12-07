import Layout from "./layout/home.js";
import Link from "next/link";
import Auction from "../components/auction/auction";
import Web3 from "./web3";
import Feature from "./brand/feature.js";
import Section from "./landing/section";
import { OpenSea } from "./brand/thirdparty.js";

const AUCTION_COUNT = 1;

const AuctionPage = ({ web3React, onWalletConnectClick, onWalletDisconnect }) => {
  return (
    <Layout
      title={`WizardsDAO - ${AUCTION_COUNT} Wizards every day. 2000 ever.`}
      web3Connected={web3React.active}
      walletConnectClick={onWalletConnectClick}
      walletDisconnectClick={onWalletDisconnect}
    >
      <Auction restart={true} web3React={web3React} walletConnectClick={onWalletConnectClick} />
      <div className="container">
        <div id="how-it-works" className="row m">
          <Feature text={"HOW IT WORKS"} />
          <Section img={"/static/img/home_shards.svg"}>
            <h4 className="section-title">NEW WIZARDS EVERY 24 HOURS</h4>
            <h2>Auctions</h2>
            <p>WizardsDAO auctions wizard NFTs on-chain every 24 hours until a max supply of 2000 is reached.</p>
            <p>
              100% of all auction proceeds are stored in the WizardsDAO treasury, where they are governed by all
              members.
            </p>
            <Link href="https://etherscan.io/address/0xfd4617981Dfdf01A8A098Bf2906d4B55Af801d20">
              <a className="section-btn btn" target="_blank">
                <span>View the treasury</span>{" "}
              </a>
            </Link>
          </Section>
          <Section img={"/static/img/home_barrels.svg"}>
            <h4 className="section-title">DECENTRALIZED GOVERNANCE</h4>
            <h2>The DAO</h2>
            <p>1 WIZ = 1 VOTE. As a member of the WizardsDAO you can vote on how The Treasury is managed.</p>
            <Link href="https://snapshot.org/#/wizdao.eth">
              <a className="section-btn btn" style={{ background: "#7000FF", borderColor: "#8f38ff" }} target="_blank">
                <span>View recent proposals</span>{" "}
              </a>
            </Link>
          </Section>
          <Section img={"/static/img/home_sussy.svg"}>
            <h4 className="section-title">NO RIGHTS RESERVED</h4>
            <h2>On-Chain Art</h2>
            <p>Wizards are stored directly on Ethereum and other networks such as IPFS are not used.</p>
            <p>
              All artwork is <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a>.
            </p>
            <Link href="https://opensea.io/collection/wizardsdao">
              <a className="section-btn btn" target="_blank">
                <span>View on OpenSea</span>{" "}
              </a>
            </Link>
          </Section>
          <div className="container">
            <div className="row m">
              <div className="col-sm-12">
                <div className="col-sm-12 creators">
                  <img src="/static/img/creators.png" style={{ transform: "scale(.9)" }} />
                  <div className="content">
                    <h2>Creator Rewards</h2>
                    <p>
                      After 5 Wizards are auctioned, 1 Wizard is distributed to the creators' wallet for a total of 54
                      Wizards. These don't intefere with the normal cadence of auctions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .section-btn {
          display: inline-flex;
          gap: 10px;
          background: rgb(56, 115, 246);
          color: #fff;
          border: 1px solid rgb(56, 148, 246);
          padding: 6px 12px;
        }
        .creators .content {
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          margin: 2rem auto 0 auto;
          max-width: 440px;
        }

        .creators {
          display: flex;
          justify-content: center;
          flex-direction: column;
          text-align: center;
        }
        .creators img {
          display: block;
          margin: 0 auto;
        }
        .section-title {
          margin-bottom: 0.6rem;
        }
        .m {
          margin: 4rem 0;
        }
        .p {
          padding: 0 15px;
        }
        h2 {
          max-width: 770px;
          line-height: 48px;
          margin: 0 auto;
        }
        p,
        a {
          margin: 1rem 0;
          color: #fff;
          font-size: 1.32rem;
          line-height: 32px;
          max-width: 640px;
          margin-bottom: 0;
        }
        .typo a {
          display: inline-block;
          margin-top: 1rem;
          border-bottom: 1px solid #fff;
        }

        @media (max-width: 568px) {
          .section-title {
            margin-top: 2rem;
          }

          .section-btn {
            margin-top: 2rem !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default () => (
  <Web3>
    <AuctionPage />
  </Web3>
);
