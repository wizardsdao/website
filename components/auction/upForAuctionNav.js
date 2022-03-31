import Link from "next/link";
import dayjs from "dayjs";

const UpForAuctionNav = ({ query, wizards, nextPage, previousPage }) => {
  return (
    <div className="mid">
      <div className="nav">
        <Link href={`/auction/${previousPage}`}>
          <a className="action">◀</a>
        </Link>
        <div className="up">
          {wizards.map((w, idx) => {
            let active = false;
            // is active if id == 1 and we are on homepage or query.id == id
            if (query.id == w.id || (!("id" in query) && w.id == 1)) {
              active = true;
            }

            let cn = active ? "thumb active" : "thumb";
            const timeLeft = Number(w.endTime) - dayjs().unix();

            // last 5 minutes pulse
            if (timeLeft <= 300 && timeLeft >= 0) {
              cn += " pulse";
            }

            // last 2.5 minutes speed up pulse and update opacity
            if (timeLeft <= 150 && timeLeft >= 0) {
              cn += " pulse-urgent";
            }

            if (timeLeft <= 0) {
              cn += " done";
            }

            return (
              <div className={cn} key={idx}>
                <Link href={`/auction/${w.id}`}>
                  <a>
                    <img
                      alt={w.dataURI?.description}
                      width={"100%"}
                      style={{ maxWidth: "60px" }}
                      src={w.dataURI?.image}
                    />
                  </a>
                </Link>
              </div>
            );
          })}
        </div>
        <Link href={`/auction/${nextPage}`}>
          <a className="action">▶</a>
        </Link>
      </div>
      <style jsx>{`
        .nav {
          display: flex;
          align-items: center;
          gap: 0.66rem;
          margin: 2.4rem auto 0 auto;
        }

        .action {
          border: none;
          outline: none;
          background: none;
          opacity: 0.4;
          padding: 0 3px;
          transition: all 0.2s ease;
        }

        .action:hover {
          opacity: 1;
        }

        .thumb {
          display: flex;
          justify-content: center;
          margin: 0 0.66rem;
          position: relative;
          top: 1px;
          transition: all 0.2s ease;
        }

        .thumb.active {
          transform: scale(1.13);
        }

        .thumb img {
          border-radius: 6px;
          box-shadow: 0 0 15px 1px rgb(100 0 166 / 15%);
        }

        .up {
          display: flex;
          justify-content: center;
          text-align: center;
          padding: 0.6rem 0;
          background: rgba(0, 0, 0, 0.06);
          border-radius: 6px;
          box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.06);
        }

        .mid {
          display: flex;
          justify-content: center;
        }

        .done {
          filter: grayscale(1);
        }

        .pulse {
          border-radius: 6px;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
          }
          70% {
            box-shadow: 0 0 0 7px rgba(255, 82, 82, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
          }
        }

        .pulse-urgent {
          border-radius: 6px;
          animation: pulse-urgent 300ms infinite;
        }

        @keyframes pulse-urgent {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 82, 82, 1);
          }
          70% {
            box-shadow: 0 0 0 7px rgba(255, 82, 82, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default UpForAuctionNav;
