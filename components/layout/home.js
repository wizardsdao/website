import Head from "./head";
import Header from "./header";
import Footer from "./footer";
import base from "../../css/base";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useStore from "../../hooks/store";

const Layout = (props) => {
  const router = useRouter();

  // reset auction house subscriber poll state on route changes
  // (so we can get all recent data)
  useEffect(() => {
    useStore.setState({ polled: false });
  }, [router.asPath]);

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
