import Link from "next/link";

const Logo = ({ style, href }) => (
  <>
    <div style={style}>
      <Link href={href || "/"}>
        <a className="logo">
          <img className="s" alt="wizardsdao" src="/static/img/logo.svg" />
        </a>
      </Link>
    </div>
    <style jsx>{`
      .logo {
        margin: 0;
        font-weight: bold;
      }
      .logo-emo {
        position: relative;
        right: -5px;
      }
      a {
        display: flex;
        align-items: center;
      }
      .s {
        width: 130px;
      }
      a,
      a:hover,
      a:focus,
      a:visited {
        color: #000;
      }
      a:hover {
        text-decoration: none;
      }
    `}</style>
  </>
);

export default Logo;
