const Section = (props) => {
  return (
    <div className="container">
      <div className="row m">
        {(() => {
          if (props.reverse) {
            return (
              <>
                <div className="col-md-6">
                  <div className="col-sm-12">{props.children}</div>
                </div>
                <div className="col-md-6 flex align-center justify-center">
                  <div className="col-sm-12 flex align-center justify-center">
                    <img src={props.img} />
                  </div>
                </div>
              </>
            );
          }

          return (
            <>
              <div className="col-md-6 flex align-center justify-center">
                <div className="col-sm-12 flex align-center justify-center">
                  <img src={props.img} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="col-sm-12">{props.children}</div>
              </div>
            </>
          );
        })()}
      </div>
      <style jsx>{`
        .flex {
          display: flex;
        }
        .align-center {
          align-items: center;
        }
        .justify-center {
          justify-content: center;
        }
        .m {
          margin: 3.9rem 0;
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
        img {
          max-width: 300px;
        }
      `}</style>
    </div>
  );
};

export default Section;
