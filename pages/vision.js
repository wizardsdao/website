import Layout from "../components/layout/home.js";
import Web3 from "../components/web3";

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
            WizardsDAO is a collective of Professional Degenerates who want to
            execute their crazy ideas. Lorem ipsum dolor sit amet consector ilit
            demet.
          </p>
          <p>Ut anim en da lorem ipsum dolor.</p>
          <div className="sbs">
            <p>Let's get freaky.</p>
            <a href="#" className="section-btn btn purp">
              Degens ↓
            </a>
          </div>
          <img
            className="bg-img"
            src="/static/img/vision_tall_boy.svg"
            height="400"
          />
        </div>
        <div className="row m rt">
          <div className="title">
            <span className="lift">CREATED BY</span>
            <h1>WIZARDS</h1>
          </div>
          <p>
            WizardsDAO is a collective of Professional Degenerates who want to
            execute their crazy ideas. Lorem ipsum dolor sit amet consector ilit
            demet.
          </p>
        </div>
        <div className="row m rt">
          <div className="title">
            <span className="lift">PONDER THE</span>
            <h1>VIBES</h1>
          </div>
          <p>
            WizardsDAO is a collective of Professional Degenerates who want to
            execute their crazy ideas. Lorem ipsum dolor sit amet consector ilit
            demet.
          </p>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="col-sm-12">
              <p>
                WizardsDAO is a collective of Professional Degenerates who want
                to execute their crazy ideas. Lorem ipsum dolor sit amet
                consector ilit demet.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="col-sm-12">
              <img
                src="/static/img/vision_tall_boy.svg"
                style={{ float: "right" }}
                height="400"
              />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .container {
          max-width: 900px;
        }
        .row-f {
          position: relative;
          min-height: 400px;
          display: block;
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
          margin-top: 12rem !important;
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
