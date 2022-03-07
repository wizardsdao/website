const Marquee = ({ text }) => {
  let els = [];
  for (let i = 0; i < 25; i++) {
    els.push(
      <>
        <div key={i} className="m-wrapper">
          <span className="m-text">{text}</span>
          <span>·</span>
        </div>
        <style jsx>{`
          .m-wrapper {
            box-sizing: border-box;
            margin: 0px;
            min-width: 0px;
            -webkit-box-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            align-items: center;
            display: flex;
            position: relative;
            left: 0%;
            animation: scroll 30s linear 0s infinite;
            animation-play-state: normal;
            animation-delay: 0s;
            animation-direction: normal;
          }

          .m-text {
            padding: 5px;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div className="marquee-container">
        <div className="marquee">{els}</div>
        <div className="marquee">{els}</div>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            left: 100%;
          }
          100% {
            left: -100%;
          }
        }

        .marquee-container {
          overflow-x: hidden !important;
          display: flex !important;
          flex-direction: row !important;
          position: relative;
          width: 100%;
        }

        .marquee {
          flex: 0 0 auto !important;
          min-width: 100% !important;
          z-index: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      `}</style>
    </>
  );
};

export default Marquee;
