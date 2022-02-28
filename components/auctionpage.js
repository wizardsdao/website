import Layout from "./layout/home.js";
import Auction from "../components/auction/auction";
import Web3 from "./web3";

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
    </Layout>
  );
};

export default () => (
  <Web3>
    <AuctionPage />
  </Web3>
);
