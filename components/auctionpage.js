import Layout from "./layout/home.js";
import Link from "next/link";
import Auction from "../components/auction/auction";
import Web3 from "./web3";
import Feature from "./brand/feature.js";
import Marquee from "./marquee/marquee.js";

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
      <div className="row m">
        <Feature text={"Say hello to the"} />
        <div className="container-md section typo">
          <h2>High council of the Metaverse</h2>
          <p>
            The Wizards work tirelessly to spread their magic across the
            metaverse. You can find us congregating in our castle on sandbox,
            smoking on the porch in webb land, and chilling in Discord.
          </p>
          <Link href="/vision">
            <a>Our Vision →</a>
          </Link>
        </div>
      </div>
      <div className="container"></div>
      <style jsx>{`
        .m {
          margin: 4rem 0;
        }
        .p {
          padding: 0 15px;
        }
        .section {
          margin-top: 1.2rem;
          padding: 2rem;
          border-radius: 6px;
          background: rgb(24, 10, 87);
          max-width: 630px;
        }

        .typo h2 {
          max-width: 770px;
          line-height: 48px;
          margin: 0 auto;
        }
        .typo p,
        .typo a {
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
          .section {
            background: transparent;
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
