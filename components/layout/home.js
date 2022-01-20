import Head from "./head";
import Header from "./header";
import Footer from "./footer";
import base from "../../css/base";
import { memo } from "react";

const Layout = (props) => {
  return (
    <>
      <style jsx global>
        {base}
      </style>
      <Head {...props} />
      <Header {...props} />
      <main>{props.children}</main>
      <Footer />
    </>
  );
};

export default memo(Layout);
