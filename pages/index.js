import dbConnect from "../util/mongodb";
import Items from "../model/items";
import Scores from "../model/score";
import Images from "../model/images";
import Link from "next/link";
import styled, { keyframes, css } from "styled-components";
import Layout from "../components/Layout";
import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect, useCallback, useRef } from "react";
import { Capital, UnCapital } from "../components/Capital";
import Sizes from "../components/Sizes";

// quiz homepage

// button
const Button = styled.button`
  display: block;
  cursor: pointer;
  width: 90%;
  background-image: ${({ image }) => `url(${image})`};
  background-size: cover;
  background-position: center;
  margin-bottom: 20px;
  height: 4em;
  border-radius: 5px;
  border: solid 1px black;
  font-size: 1.6em;
  font-family: ${({ theme }) => theme.fonts.secondary};
  @media only screen and (max-width: ${Sizes.md}px) {
    font-size: 1.3em;
  }
  transition: 0.5s;
  :hover {
    box-shadow: 5px 10px black;
    background-color: ${({ theme }) => theme.colors.thirdly};
    background-image: none;
  }
`;

// score button animation
const stretch = keyframes`
0% {width: 90%;}
50% {width: 95%;}
100% {width: 90%;}
`;

// score button
const ScoreButton = styled(Button)`
  height: 2em;
  border: none;
  font-family: ${({ theme }) => theme.fonts.primary};
  background-image: none;
  color: black;
  background-size: none;
  background-color: ${({ theme }) => theme.colors.thirdly};
  margin: 0 auto;
  animation: ${({ show }) => {
    if (!show)
      return css`
        ${stretch} 1s linear infinite
      `;
  }};
  :hover {
    box-shadow: none;
  }
`;

// panel showing score categories
const Panel = styled.div.attrs(({ show, scroll }) => ({
  height: show ? `${scroll}px` : "0",
  op: show ? "100%" : "0",
  cursor: show ? "pointer" : "context-menu",
}))`
  height: ${({ height }) => height};
  opacity: ${({ op }) => op};
  background-color: grey;
  width: 90%;
  margin: 0 auto;
  transition: 0.3s height, 0.2s opacity;
  text-align: center;
  padding-top: 2%;
  color: white;
  font-size: 1.2em;
  border-radius: 0 0 5px 5px;
  p {
    cursor: ${({ cursor }) => cursor};
    :hover {
      text-decoration: underline 4px black;
    }
  }
`;

// div showing scores
const Score = styled.div.attrs(({ scoreShow }) => ({
  display: !scoreShow ? "hidden" : "visible",
}))`
  visibility: ${({ display }) => display};
  top: 0;
  position: absolute;
  margin: 0 auto;
  left: 0;
  right: 0;
  z-index: 3;
  width: 100%;
  background-color: rgb(0, 0, 0, 0.5);
  height: ${({ height }) => `${height}px`};
  div {
    width: 40%;
    background-color: ${({ theme }) => theme.colors.primary};
    margin: 2em auto;
    padding: 1%;
    border-radius: 5px;
    box-shadow: 5px 10px;
    p:first-child {
      display: inline-block;
      padding: 0 1%;
      border-radius: inherit;
      cursor: pointer;
      background-color: ${({ theme }) => theme.colors.secondary};
      :hover {
        background-color: ${({ theme }) => theme.colors.thirdly};
      }
    }
  }
`;

// styled column
const Column = styled(Col)`
  overflow-y: scroll;
  height: 350px;
  @media only screen and (min-width: ${Sizes.xl}px) {
    height: 500px;
  }
  padding: 3%;
`;

export default function Home({ category, score, images }) {
  const [show, setShow] = useState(false);
  const [scoreShow, setScoreShow] = useState(false);
  const [option, setOption] = useState([]);
  const [height, setHeight] = useState("");
  const [scroll, setScroll] = useState("");
  const panel = useRef();
  // get top 10 scores
  const Option = useCallback(
    (e) => {
      if (show) {
        let cat = UnCapital(e.target.innerHTML);
        let array = [];
        score.forEach((e) => {
          if (e.category === cat) {
            array.push(e);
          }
        });
        array.splice(10);
        setOption(array);
        setScoreShow(true);
      }
    },
    [show]
  );
  // use callback incase we want to remove listener -> saves 1st instance of function
  let windowHeight = useCallback(() => {
    setHeight(document.documentElement.clientHeight);
  }, []);
  // use callback incase we want to remove listener -> saves 1st instance of function
  let panelHeight = useCallback(() => {
    setScroll(panel.current.scrollHeight);
  }, []);
  // modal and panel height
  useEffect(() => {
    panelHeight();
    windowHeight();
    window.addEventListener("resize", windowHeight);
    window.addEventListener("resize", panelHeight);
  }, [category]);
  return (
    <Layout title="QUIZHUB">
      <Container style={{ position: "relative" }} fluid>
        <Score scoreShow={scoreShow} height={height}>
          <div>
            <p onClick={() => setScoreShow(false)}>close</p>
            {option.map((e) => (
              <p key={e.id} key={e}>
                {e.name}: {e.score}%
              </p>
            ))}
          </div>
        </Score>
        <Row style={{ paddingTop: "20px" }} noGutters>
          <Column xs={6}>
            <Row noGutters>
              {category.map((e) => (
                <Col key={e} xs={6} lg={4}>
                  <Link href={`/${encodeURIComponent(e)}`}>
                    <a style={{ textDecoration: "none" }}>
                      <Button image={images[category.indexOf(e)].url}>
                        {Capital(e)}
                      </Button>
                    </a>
                  </Link>
                </Col>
              ))}
            </Row>
          </Column>
          <Col xs={6}>
            <Row noGutters>
              <Col xs={12}>
                <ScoreButton
                  show={show}
                  onClick={() => {
                    if (show) setShow(false);
                    else setShow(true);
                  }}
                >
                  Scores
                </ScoreButton>
                <Panel show={show} scroll={scroll} ref={panel}>
                  {category.map((e) => (
                    <p key={e} onClick={Option}>
                      {Capital(e)}
                    </p>
                  ))}
                </Panel>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

// get categories to create buttons
export async function getStaticProps() {
  dbConnect();
  try {
    const resultOne = await Items.find({}),
      resultTwo = await Scores.find({}),
      resultThree = await Images.find({});
    let category = [];
    JSON.parse(JSON.stringify(resultOne)).forEach((e) => {
      if (!category.includes(e.category)) category.push(e.category);
    });
    const sortScores = resultTwo.sort(function (a, b) {
      return b.score - a.score;
    });
    return {
      props: {
        category: category,
        score: JSON.parse(JSON.stringify(sortScores)),
        images: JSON.parse(JSON.stringify(resultThree)),
      },
      revalidate: 1,
    };
  } catch (err) {
    console.log(err.message);
  }
}
