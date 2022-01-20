import React from "react";
import base from "../css/base";
import Logo from "../components/brand/logo";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <>
      <style jsx global>
        {base}
      </style>
      <main className="p">
        <div className="logo">
          <Logo href={`/`} />
        </div>
        <p className="top">We had trouble finding that page.</p>
        <p>
          Feel free to{" "}
          <a href="https://twitter.com/WizardsDAO">send us a dm on Twitter</a>{" "}
          with any questions <br /> or{" "}
          <Link href="/">
            <a>Click here</a>
          </Link>{" "}
          to go home.
        </p>
      </main>
      <style jsx>{`
        .logo {
          width: 140px;
          align-self: center;
          position: relative;
          right: 15px;
          margin: 0;
        }
        .logo a:hover {
          text-decoration: none;
        }
        p.top {
          margin-top: 1rem;
        }
        p {
          margin-bottom: 0;
        }
        a {
          text-decoration: underline;
        }
        main {
          z-index: 999;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          display: flex;
          background-size: cover;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          flex-direction: column;
          align-items: center;
          text-align: center;
          justify-content: flex-start;
          transform: translateY(40%);
        }
        @media (max-device-width: 375px) and (max-device-height: 667px) {
          main {
            transform: translateY(35%);
          }
        }
        @media (max-device-width: 320px) and (max-device-height: 568px) {
          main {
            transform: translateY(32%);
          }
        }
      `}</style>
      <style jsx global>{`
        #__next {
          position: relative;
          width: 100vw;
          height: 100vh;
          height: calc(var(--vh, 1vh) * 100);
          overflow: hidden;
        }
        body {
          position: fixed;
          overscroll-behavior-y: none;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default ErrorPage;
