import Link from "next/link";

const Logo = ({ style, href }) => (
  <>
    <div style={style}>
      <Link href={href || "/"}>
        <a className="logo">
          <img
            className="s"
            alt="wizardsdao"
            src="/static/img/logo_white.svg"
          />
        </a>
      </Link>
    </div>
    <style jsx>{`
      .logo {
        margin: 0;
        font-weight: bold;
      }
      a {
        display: flex;
        align-items: center;
      }
      .s {
        height: 18px;
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
      }
    `}</style>
  </>
);

export default Logo;
