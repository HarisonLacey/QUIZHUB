import Head from "next/head";
import Header from "../components/Header";
import styled from "styled-components";
import { UseContextData } from "./Context";

// layout component

// footer styling
const Footer = styled.footer`
  height: 100px;
  background-color: wheat;
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: solid 1px;
`;

export default function Layout({ children, title }) {
  // use data from context wrapper in _app.js
  let { set } = UseContextData();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/brain.png" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
          integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
          crossorigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fredoka+One&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Zilla+Slab+Highlight:wght@700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <Header />
      <main>{children}</main>
      <Footer>
        <p style={{ padding: "1% 0 0 2%" }}>{set}</p>
      </Footer>
    </>
  );
}
