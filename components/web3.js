import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import React from "react";

const wcCfg = {
  rpc: {
    1: process.env.NEXT_PUBLIC_MAINNET_RPC_URI, // mainnet (use infura rpc endpoint)
    4: process.env.NEXT_PUBLIC_RINKEBY_RPC_URI, // rinkeby
    31337: process.env.NEXT_PUBLIC_LOCAL_RPC_URI, // local hardhat node
  },
};

let injected = new InjectedConnector({ supportedChainIds: [1, 31337, 4] });
let wcConnector = new WalletConnectConnector(wcCfg);

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  return library;
}

const Web3Context = ({ children }) => {
  const web3React = useWeb3React();

  const onWalletDisconnect = () => {
    web3React.deactivate();
  };

  const onWalletConnectClick = () => {
    const fn = async () => {
      try {
        if (window.ethereum) {
          if (!web3React.active && !web3React.error) {
            await web3React.activate(injected);
          }

          // if user accidently closes metamask we need to reload page, there is an outstanding fix for this
          // in the develop branch https://github.com/MetaMask/metamask-extension/issues/10085
          if (web3React.error) {
            if (
              web3React.error.message ==
              "Already processing eth_requestAccounts. Please wait."
            ) {
              injected = new InjectedConnector({
                supportedChainIds: [1, 31337, 4],
              });
              await web3React.activate(injected);
            }

            // if user rejects or cancels page try again
            if (web3React.error.message === "The user rejected the request.") {
              injected = new InjectedConnector({
                supportedChainIds: [1, 31337, 4],
              });
              await web3React.activate(injected);
            }
          }
        } else {
          if (!web3React.active && !web3React.error) {
            await web3React.activate(
              wcConnector,
              (ex) => {
                if (ex.message === "The user rejected the request.") {
                  // reset connector so it is not in a disabled state
                  wcConnector = new WalletConnectConnector(wcCfg);
                }
              },
              false
            );
          }
        }
      } catch (ex) {
        console.error(ex);
      }
    };

    fn();
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onWalletConnectClick,
        onWalletDisconnect,
        web3React,
      });
    }
    return child;
  });

  return <div>{childrenWithProps}</div>;
};

export default function AddWeb3Context({ children }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3Context>{children}</Web3Context>
    </Web3ReactProvider>
  );
}
