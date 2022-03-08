import Layout from "./layout/home.js";
import Link from "next/link";
import Auction from "../components/auction/auction";
import Web3 from "./web3";
import Feature from "./brand/feature.js";
import Section from "./landing/section";

const AUCTION_COUNT = 3;
const AuctionPage = ({
  web3React,
  onWalletConnectClick,
  onWalletDisconnect,
}) => {
  return (
    <Layout
      title={`WizardsDAO - ${AUCTION_COUNT} Wizards every day. 2000 ever.`}
      web3Connected={web3React.active}
      walletConnectClick={onWalletConnectClick}
      walletDisconnectClick={onWalletDisconnect}
    >
      <Auction web3React={web3React} />
      <div className="container">
        <div className="row m">
          <Feature text={"HOW IT WORKS"} />
          <Section img={"https://via.placeholder.com/600x400"}>
            <h2>Auctions</h2>
            <p>
              WizardsDAO auctions 3 wizards on-chain every 24 hours until a max
              supply of 2000 is reached.
            </p>
          </Section>
          <Section img={"https://via.placeholder.com/600x400"} reverse>
            <h2>The DAO</h2>
            <p>
              WizardsDAO auctions 3 wizards on-chain every 24 hours until a max
              supply of 2000 is reached.
            </p>
          </Section>
          <Section img={"https://via.placeholder.com/600x400"}>
            <h2>On-Chain Art</h2>
            <p>
              WizardsDAO auctions 3 wizards on-chain every 24 hours until a max
              supply of 2000 is reached.
            </p>
          </Section>
          <Section img={"https://via.placeholder.com/600x400"} reverse>
            <h2>Creator Rewards</h2>
            <p>
              WizardsDAO auctions 3 wizards on-chain every 24 hours until a max
              supply of 2000 is reached.
            </p>
          </Section>
        </div>
      </div>
      <style jsx>{`
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
