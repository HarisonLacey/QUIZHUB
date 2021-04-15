import styled, { keyframes } from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sizes from "./Sizes";

// header component

// head styling
const Head = styled.div.attrs(({ border }) => ({
  bord: border ? "solid 5px" : "none",
}))`
  height: 100px;
  background-color: ${({ theme }) => theme.colors.primary};
  @media only screen and (max-width: ${Sizes.md}px) {
    text-align: center;
  }
  padding: 1em 0 0 1em;
  outline: ${({ bord }) => bord};
  font-family: ${({ theme }) => theme.fonts.secondary};
`;

// header animation
const line = keyframes`
0% {margin-left: 0%; margin-right: 100%}
50% {margin-left: 90%; margin-right: 0%}
100% {margin-left: 0%; margin-right: 100%}
`;

const HR = styled.hr`
  animation: ${line} 2s linear infinite;
  border: solid 5px whitesmoke;
  width: 10%;
`;

export default function Header() {
  const [border, setBorder] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (router.pathname === "/") setBorder(true);
  }, []);
  return (
    <Head border={border}>
      <div style={{ display: "inline-block" }}>
        <h2>QUIZHUB</h2>

        <HR></HR>
      </div>
    </Head>
  );
}
