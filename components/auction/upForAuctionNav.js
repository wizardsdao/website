import Link from "next/link";
import dayjs from "dayjs";

const UpForAuctionNav = ({ query, wizards }) => {
  return (
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

      <style jsx>{`
        .thumb {
          display: flex;
          justify-content: center;
          margin: 0 0.66rem;
        }

        .thumb img {
          border-radius: 6px;
        }

        .up {
          display: flex;
          justify-content: center;
          max-width: 350px;
          margin: 1.6rem auto;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default UpForAuctionNav;
