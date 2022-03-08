const Feature = ({ text }) => (
  <div className="feature-wrap">
    <h3 className="ft">{text}</h3>

    <div className="feature">
      <img className="s" alt="wizardsdao" src="/static/img/logo_white.svg" />
    </div>
    <style jsx>{`
      .feature-wrap {
        width: 100%;
        display: flex;
        justify-content: space-around;
        position: relative;
        margin: 0;
      }
      .s {
        height: 18px;
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
      }
      .feature {
        padding: 1.6rem 5rem;
        border-radius: 6px;
        border: 1px solid #fff;
        width: 92.5%;
        max-width: 333px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ft {
        position: absolute;
        text-align: center;
        top: -13.5px;
        background: #12004c;
        z-index: 10;
        padding: 0 0.5rem;
        font-weight: normal;
      }
      @media (max-width: 568px) {
        .feature {
          max-width: 100%;
        }
      }
    `}</style>
  </div>
);

export default Feature;
