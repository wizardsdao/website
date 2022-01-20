import Marq from "react-fast-marquee";

const Marquee = ({ imgs }) => {
  return (
    <div style={{ position: "relative" }}>
      <Marq className="wrapper" style={{ top: "65px" }} gradient={false}>
        {imgs.map((i, idx) => {
          return (
            <div key={idx} className="img-container">
              <img src={i} />
            </div>
          );
        })}
      </Marq>
      <style jsx>{`
        .wrapper {
          height: 50px;
        }

        img {
          height: 95px;
        }

        .img-container {
          padding: 1rem;
          border-radius: 6px;
          background: rgba(222, 185, 253, 1);
          margin: 0 0.66rem;
        }
      `}</style>
    </div>
  );
};

export default Marquee;
