const Section = ({ children, img, reverse }) => {
  return (
    <div className={"container"}>
      <div className="row m">
        {(() => {
          if (reverse) {
            return (
              <>
                <div className="col-md-6">
                  <div className="col-sm-12">{children}</div>
                </div>
                <div className="col-md-6">
                  <div className="col-sm-12">
                    <img src={img} />
                  </div>
                </div>
              </>
            );
          }

          return (
            <>
              <div className="col-md-6">
                <div className="col-sm-12">
                  <img src={img} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="col-sm-12">{children}</div>
              </div>
            </>
          );
        })()}
      </div>
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default Section;
