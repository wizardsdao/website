import BidRow from "./bidRow";

const BidHistory = ({ wizard, web3React }) => {
  return (
    <div className="bid-history">
      <div className="bid-history-inner">
        <ul>
          {(() => {
            let ret = [];
            for (
              let i = wizard.bids.length - 1;
              i > wizard.bids.length - 4;
              i--
            ) {
              if (wizard.bids[i]) {
                ret.push(
                  <BidRow
                    className="br"
                    key={wizard.bids[i].value.toString()}
                    e={wizard.bids[i]}
                    account={web3React.account}
                    wizardId={wizard.wizardId}
                  />
                );
              }
            }

            if (!ret.length) {
              return null;
            }

            return [
              <h4 className="title" key="recent">
                Recent bids
              </h4>,
              ...ret,
            ];
          })()}
        </ul>
      </div>
      <style jsx>{`
        .title {
          margin: 1rem 0 0.6rem 0;
          opacity: 0.65;
        }
        .br {
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
};

export default BidHistory;
