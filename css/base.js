import css from "styled-jsx/css";

const style = css.global`
  @font-face {
    font-family: "VCR OSD Mono";
    src: url("/static/fonts/vcr.woff2") format("woff2"),
      url("/static/fonts/vcr.woff") format("woff");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  :root {
    --blue-1: #0062ff;
    --blue-2: #0af;
    --red: rgb(231, 29, 54);
    --green-1: #05ca21;
    --green-2: #02d16a;
  }

  /*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */
  html,
  body {
    overflow-x: hidden;
    min-width: 100%;
  }
  html {
    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
    width: 100%;
    font-family: "VCR OSD Mono";
  }
  body {
    margin: 0;    
    background: #e0c1ff !important;
  }
  .p {
    padding: 0.875rem;
  }
  main {
    display: block;
  }
  h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }
  hr {
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    height: 0;
    overflow: visible;
  }
  pre {
    font-family: monospace, monospace;
    font-size: 1em;
  }
  a {
    background-color: transparent;
  }
  abbr[title] {
    border-bottom: none;
    text-decoration: underline;
    -webkit-text-decoration: underline dotted;
    -moz-text-decoration: underline dotted;
    text-decoration: underline dotted;
  }
  b,
  strong {
    font-weight: bolder;
  }
  code,
  kbd,
  samp {
    font-family: monospace, monospace;
    font-size: 1em;
  }
  small {
    font-size: 80%;
  }
  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sub {
    bottom: -0.25em;
  }
  sup {
    top: -0.5em;
  }
  img {
    border-style: none;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }
  button,
  input {
    overflow: visible;
  }
  button,
  select {
    text-transform: none;
  }
  [type="button"],
  [type="reset"],
  [type="submit"],
  button {
    -webkit-appearance: button;
  }
  [type="button"]::-moz-focus-inner,
  [type="reset"]::-moz-focus-inner,
  [type="submit"]::-moz-focus-inner,
  button::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }
  [type="button"]:-moz-focusring,
  [type="reset"]:-moz-focusring,
  [type="submit"]:-moz-focusring,
  button:-moz-focusring {
    outline: 1px dotted ButtonText;
  }
  fieldset {
    padding: 0.35em 0.75em 0.625em;
  }
  legend {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    color: inherit;
    display: table;
    max-width: 100%;
    padding: 0;
    white-space: normal;
  }
  progress {
    vertical-align: baseline;
  }
  textarea {
    overflow: auto;
  }
  [type="checkbox"],
  [type="radio"] {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0;
  }
  [type="number"]::-webkit-inner-spin-button,
  [type="number"]::-webkit-outer-spin-button {
    height: auto;
  }
  [type="search"] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
  }
  [type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
  }
  details {
    display: block;
  }
  summary {
    display: list-item;
  }
  template {
    display: none;
  }
  [hidden] {
    display: none;
  }
  *,
  body,
  html {
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    scroll-behavior: smooth;
  }
  body {
    font-size: 18px;
    line-height: 1.375em;
    font-weight: 400;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #fff;
    -webkit-text-size-adjust: auto;
    -moz-text-size-adjust: auto;
    -ms-text-size-adjust: auto;
    text-size-adjust: auto;
    font-family: "VCR OSD Mono"
    color: #212121;
  }
  header {
    background: #E0C1FF;
  }
  @media (max-width: 767px) {
    body {
      font-size: 16px;
      line-height: 28px;
    }
  }
  img,
  video {
    max-width: 100%;
    vertical-align: middle;
  }
  input[type="email"]:focus,
  input[type="email"]:hover,
  input[type="text"]:focus,
  input[type="text"]:hover,
  textarea:focus,
  textarea:hover {
    outline: 0;
  }
  a {
    color: #000;
    text-decoration: none;
  }
  a:hover,
  a:visited,
  a:focus {
    color: #000;
  }
  h3 {
    margin-bottom: 5px;
  }
  p {
    margin-bottom: 23px;
    line-height: 27px;
    color: #000;
  }
  p,
  label,
  input,
  textarea,
  select,
  option {
    font-size: 16px;
  }
  @media (max-width: 767px) {
    p {
      font-size: 16px;
      line-height: 28px;
    }
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: "VCR OSD Mono"
  }
  h1 {
    font-size: 55px;
    line-height: 70px;
  }
  h2 {
    font-size: 42px;
    line-height: 61px;
  }
  h4,
  h5 {
    font-weight: 500;
  }
  .heading {
    font-size: 42px;
    font-weight: 700;
    letter-spacing: 0.45px;
    line-height: 61px;
    margin-bottom: 20px;
    font-weight: 700;
  }
  .heading span {
    background-color: rgba(0, 186, 99, 0.08);
    color: #00ba63;
    padding: 4px;
    display: inline-block;
    line-height: 52px;
  }
  @media (max-width: 767px) {
    .heading {
      font-size: 30px;
      line-height: 40px;
    }
    .heading span {
      line-height: 36px;
    }
  }
  .flex-row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -15px;
  }
  @media (max-width: 767px) {
    .flex-row {
      margin: 0;
    }
  }
  .align-items-center {
    align-items: center;
  }
  .text-center {
    text-align: center;
  }
  @media (max-width: 767px) {
    .hidden-mobile {
      display: none !important;
    }
  }
  @media (min-width: 767px) {
    .hidden-desktop {
      display: none !important;
    }
  }
  .container {
    max-width: 1140px;
    margin: 0 auto;
  }
  .clear {
    clear: both;
  }
  .lowercase {
    text-transform: lowercase;
  }
  .bold {
    font-weight: 700;
  }
  .normal {
    font-weight: 400;
  }
  .center {
    text-align: center;
  }
  .d-flex {
    display: flex;
  }
  .justify-content-center {
    justify-content: center;
  }
  .align-items-center {
    align-items: center;
  }
  @media (max-width: 767px) {
    .hero h1 {
      font-size: 36px;
      line-height: 50px;
    }
  }
  input {
    border: 1px solid rgb(196, 207, 214);
    background: #fff;
    border-radius: 6px;
    padding: 8px 10px;
  }
  input:focus {
    outline: none;
  }
  textarea {
    border: 1px solid #d7dbdf;
    background: #fff;
    font-weight: 500;
    border-radius: 6px;
    padding: 8px 10px;
    width: 100%;
  }
  /* end general site */
  /* buttons */
  .btn {
    font-size: 16px;
    line-height: 25px;
    border: 1px solid rgb(196, 207, 214);
    background: #5625A4;
    font-weight: 500;
    border-radius: 6px;
    text-decoration: none;
    padding: 6px 12px;
    transition: all 0.2s ease;
    color: #fff;
  }
  .btn.small {
    font-size: 14px;
    padding: 3px 6px;
  }
  .small {
    font-size: 80%;
  }
  .btn.shadow:hover {
    box-shadow: 0 0 30px 1px #999;
  }
  .btn:hover {
    border-color: #000;
    text-decoration: none;
    cursor: pointer;
  }
  .btn.outline {
    border-color: #000;
    box-shadow: 0 0 30px 1px rgba(0, 0, 0, 0.25);
  }
  .btn.green {
    color: #fff;
    background: var(--green-1) !important;
    border: 1px solid var(--green-2) !important;
  }
  .btn.green:hover {
    background: var(--green-2) !important;
  }
  .btn.green.shadow:hover {
    box-shadow: 0 0 30px 1px var(--green-1);
  }
  .btn.green.shadowon {
    box-shadow: 0 0 30px 1px var(--green-1);
  }
  .btn.red {
    border-color: var(--red);
    color: var(--red);
  }
  .nostyle {
    background: none;
    padding: 0;
    border: none;
  }
  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
       -khtml-user-select: none; /* Konqueror HTML */
         -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome, Edge, Opera and Firefox */
  }
  .btn.disabled {
    background: #171717;
    color: #fff;
    border-color: #000;
  }
  .btn.disabled:hover {
    background: #171717;
    border-color: #000;
    color: #fff !important;
    cursor: not-allowed;
  }
  .pt {
    padding-top: 60px;
  }
  .pts {
    padding-top: 0.5rem;
  }
  .pb {
    padding-bottom: 60px;
  }
  .pbs {
    padding-bottom: 0.5rem;
  }
  .content {
    max-width: 590px;
  }
  .content h2 {
    text-align: center;
  }
  select {
    border: 1px solid rgb(196, 207, 214);
    background: #fff;
    border-radius: 6px;
    padding: 8px 10px;
  }
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  .page-inner {
    padding-right: 0.875rem;
  }
  @media (max-width: 767px) {
    .page-inner {
      padding-right: 0;
    }
  }
  * {
    font-family: "VCR OSD Mono"
  }
  body:hover {
    cursor: url("/static/img/cursor.png"), move !important;
  }
  body:active {
    cursor: url("/static/img/cursor-active.png"), move !important;
  }
`;

export default style;
