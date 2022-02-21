import Head from "next/head";

const AppHead = (props) => {
  return (
    <Head>
      <meta charSet="utf-8" />
      {(() => {
        if (props.noIndex) {
          return <meta name="robots" content="noindex, nofollow" />;
        }

        return <meta name="robots" content="index, follow" />;
      })()}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@wizardsdao" />
      <meta name="twitter:title" content="WizardsDAO" />
      <meta
        name="twitter:description"
        content="Professional Degenerates. CC0."
      />
      <meta
        name="twitter:image"
        content="https://wizardsdao.com/static/img/ogimg.jpg"
      />
      <meta property="og:title" content="Professional Degenerates. CC0." />
      <meta
        property="og:image"
        content="https://wizardsdao.com/static/img/ogimg.jpg"
      />
      <meta property="og:url" content="https://wizardsdao.com" />
      <meta
        property="og:description"
        content="Professional Degenerates. CC0."
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <link
        rel="apple-touch-icon"
        sizes="57x57"
        href="/static/ico/apple-icon-57x57.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="60x60"
        href="/static/ico/apple-icon-60x60.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="72x72"
        href="/static/ico/apple-icon-72x72.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href="/static/ico/apple-icon-76x76.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href="/static/ico/apple-icon-114x114.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href="/static/ico/apple-icon-120x120.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href="/static/ico/apple-icon-144x144.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/static/ico/apple-icon-152x152.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/static/ico/apple-icon-180x180.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/static/ico/android-icon-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/static/ico/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/static/ico/favicon-96x96.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/static/ico/favicon-16x16.png"
      />
      <link rel="manifest" href="/static/ico/manifest.json" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta
        name="msapplication-TileImage"
        content="/static/ico/ms-icon-144x144.png"
      />
      <meta name="theme-color" content="#ffffff"></meta>
      <title>{props.title}</title>
    </Head>
  );
};

export default AppHead;
