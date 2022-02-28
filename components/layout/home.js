import Head from "./head";
import Header from "./header";
import Footer from "./footer";
import base from "../../css/base";

const Layout = (props) => {
  return (
    <div id="wrapper">
      <style jsx global>
        {base}
      </style>
      <Head {...props} />
      <Header {...props} />
      {props.children}
      <Footer />
      <style jsx>{`
        #wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          max-width: 100vw;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
};

export default Layout;
