import Head from "./head";
import Header from "./header";
import Footer from "./footer";
import base from "../../css/base";
import { memo } from "react";

const Layout = (props) => {
  return (
    <div id="wrap">
      <style jsx global>
        {base}
      </style>
      <Head {...props} />
      <Header {...props} />
      <main id="main">{props.children}</main>
      <Footer />
    </div>
  );
};

export default memo(Layout);
