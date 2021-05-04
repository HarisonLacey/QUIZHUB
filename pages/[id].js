import Items from "../model/items";
import Images from "../model/images";
import dbConnect from "../util/mongodb";
import Layout from "../components/Layout";
import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useRouter } from "next/router";
import Link from "next/link";
import { Capital } from "../components/Capital";
import Sizes from "../components/Sizes";
const axios = require("axios");

// quiz page

// styled question
const Question = styled.div.attrs(({ hide }) => ({
  hide: !hide ? "inline-block" : "none",
}))`
  margin: 0 auto;
  display: ${({ hide }) => hide};
  form {
    text-align: center;
  }
  h2 {
    font-size: 1.5em;
    @media only screen and (max-width: ${Sizes.md}px) {
      font-size: 1.3em;
    }
  }
`;

// styled progress bar
const Progress = styled.div.attrs(({ width }) => ({
  width: width,
}))`
  width: ${({ width }) => `${width}%`};
  background-color: black;
  height: 10px;
  transition: width 1s ease;
`;

// modal
const Modal = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: ${({ height }) => `${height}px`};
  z-index: 3;
  @media only screen and (max-width: ${Sizes.md}px) {
    font-size: 0.8em;
  }
  background-color: rgb(0, 0, 0, 0.5);
  text-align: center;
  padding-top: 1.5em;
  @media only screen and (max-width: ${Sizes.md}px) {
    padding-top: 4.7em;
  }
`;

// score form
const ScoreForm = styled.form.attrs(({ visible }) => ({
  show: !visible ? "none" : "inline-block",
}))`
  display: ${({ show }) => show};
`;

// score button
const ScoreButton = styled.button.attrs(({ visible, color, theme }) => ({
  show: visible ? "none" : "inline-block",
  bg: color || theme.colors.thirdly,
}))`
  display: ${({ show }) => show};
  cursor: pointer;
  border: none;
  background-color: ${({ bg }) => bg};
  transition: 0.5s;
  margin-left: 8px;
  border-radius: 5px;
  :hover {
    box-shadow: 5px 5px black;
  }
`;

// score title
const ScoreTitle = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: bold;
`;

const stretch = keyframes`
0% {width: 90%;}
50% {width: 100%;}
100% {width: 90%;}
`;

// view score button
const ViewScore = styled.button`
  display: inline-block;
  cursor: pointer;
  border: none;
  height: 4em;
  background-image: ${({ image }) => `url(${image})`};
  background-size: cover;
  background-position: center;
  font-size: 2em;
  transition: 0.5s;
  border-radius: 5px;
  font-family: ${({ theme }) => theme.fonts.secondary};
  animation: ${stretch} 1s linear infinite;
  :hover {
    box-shadow: 5px 10px black;
    border: solid 1px;
    width: 90%;
    color: black;
    background-image: none;
    background-color: ${({ theme }) => theme.colors.thirdly};
    animation: none;
  }
`;

export default function Category({ items, image }) {
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");
  const [counter, setCounter] = useState(0);
  const [start, setStart] = useState(true);
  const [end, setEnd] = useState(false);
  const [result, setResult] = useState(false);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [hide, setHide] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [minute, setMinute] = useState(1);
  const [second, setSecond] = useState(30);
  const [minuteGap, setMinuteGap] = useState("");
  const [secondGap, setSecondGap] = useState("");
  const [response, setResponse] = useState("");
  const [height, setHeight] = useState("");
  const [buttonImage, setButtonImage] = useState("");
  // progress bar
  useEffect(() => {
    if (!end) setProgress((100 / items.length) * counter);
    else setProgress(100);
  }, [counter, end]);
  // page title
  useEffect(() => {
    if (start) setTitle("Quiz Start");
    else if (end) setTitle("Quiz End");
    else setTitle(`Question ${items.indexOf(items[counter]) + 1}`);
  }, [start, end, counter]);
  // array of correct answers
  let windowHeight = useCallback(() => {
    setHeight(document.documentElement.clientHeight);
  }, []);
  useEffect(() => {
    // use callback incase we want to remove listener -> saves 1st instance of function
    windowHeight();
    setButtonImage(image[0].url);
    window.addEventListener("resize", windowHeight);
    items.forEach((e) => {
      setCorrectAnswers((correctAnswers) => [
        ...correctAnswers,
        e.answers[e.correct],
      ]);
    });
  }, []);
  // results background color using ref and usecallback
  const scoreColors = useCallback((el, index) => {
    if (el) {
      if (userAnswers[index] === correctAnswers[index])
        el.style.backgroundColor = "#54e346";
      else el.style.backgroundColor = "#ed6663";
    }
  }, [userAnswers, correctAnswers]);
  // results background colour
  /* useEffect(() => {
    let answers = document.getElementsByClassName("scores");
    // alternative loop function 1
    [].forEach.call(answers, (answer, index, array) => {
      console.log(array);
      if (userAnswers[index] === correctAnswers[index])
        answer.style.backgroundColor = "#54e346";
      else answer.style.backgroundColor = "#ed6663";
    });
    // alternative loop function 2
    Array.from(answers).forEach((answer, index) => {
      if (userAnswers[index] === correctAnswers[index])
        answer.style.backgroundColor = "#54e346";
      else answer.style.backgroundColor = "#ed6663";
    });
    // alternative loop function 3
    for (let [index, answer] of [...answers].entries()) {
      if (userAnswers[index] === correctAnswers[index])
        answer.style.backgroundColor = "#54e346";
      else answer.style.backgroundColor = "#ed6663";
    }
  }, [result]); */
  // timer
  useEffect(() => {
    if (!start && !end) {
      if (minute === 0) setMinuteGap(0);
      setTimeout(() => {
        if (second !== 0) {
          setSecond(second - 1);
          if (second <= 10) setSecondGap(0);
        } else {
          setSecond(59);
          setSecondGap("");
          if (minute !== 0) {
            setMinute(minute - 1);
          } else {
            setSecondGap(0);
            setMinuteGap(0);
            setSecond(0);
            setEnd(true);
            setHide(true);
          }
        }
      }, 1000);
    }
  }, [second, minute, start, end]);
  // answer form
  const formHandle = (e) => {
    e.preventDefault();
    if (answer !== "")
      setUserAnswers((userAnswers) => [...userAnswers, answer]);
    if (answer === "") {
      alert("Please supply answer");
    } else {
      if (
        items[counter].answers.indexOf(answer) ===
        parseInt(items[counter].correct)
      )
        setScore(score + 1);
      if (counter + 1 !== items.length) {
        setCounter(counter + 1);
        setAnswer("");
      } else {
        setEnd(true);
        setHide(true);
      }
    }
  };
  // submit score
  const scoreHandle = useCallback(
    async (e) => {
      e.preventDefault();
      setResponse("One moment...");
      try {
        let res = await axios.post("api/score", {
          name: name,
          score: ((score / items.length) * 100).toFixed(1),
          category: items[0].category,
        });
        setResponse(res.data.message);
      } catch (err) {
        console.log(err.message);
        setResponse("Something broke. Please try again!");
      }
    },
    [name, score]
  );

  const router = useRouter();
  return (
    <Layout title={title}>
      {router.isFallback && <div>Loading...</div>}
      {!router.isFallback && (
        <Container style={{ padding: "0", position: "relative" }} fluid>
          <Row noGutters>
            <Col style={{ textAlign: "right" }} xs={12}>
              {!start && (
                <>
                  <Progress width={progress}></Progress>
                  <h3 style={{ fontSize: "2em", margin: "0.5% 1% 0 0" }}>
                    {minuteGap}
                    {minute}:{secondGap}
                    {second}
                  </h3>
                </>
              )}
              {result && (
                <>
                  <Modal result={result} height={height}>
                    <ScoreTitle>
                      Score: {`${((score / items.length) * 100).toFixed(1)}%`}
                    </ScoreTitle>
                    <Row noGutters>
                      <Col xs={4}>Question</Col>
                      <Col xs={4}>Your Answer</Col>
                      <Col xs={4}>Correct Answer</Col>
                      {userAnswers.map((e, index) => (
                        <>
                          <Col
                            ref={(el) => scoreColors(el, index)}
                            className="scores"
                            xs={12}
                            key={e}
                          >
                            <Row>
                              <Col xs={4}>{items[index].question}</Col>
                              <Col xs={4}>{e}</Col>
                              <Col xs={4}>{correctAnswers[index]}</Col>
                            </Row>
                          </Col>
                        </>
                      ))}
                    </Row>
                    <ScoreForm visible={visible} onSubmit={scoreHandle}>
                      <input
                        style={{ marginTop: "10px" }}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="name"
                        required
                      />
                      <input type="submit" />
                    </ScoreForm>
                    <ScoreButton
                      style={{ marginTop: "10px" }}
                      color="whitesmoke"
                      visible={visible}
                      onClick={() => setVisible(true)}
                    >
                      Submit Score
                    </ScoreButton>
                    <p style={{ marginTop: "0.3%" }}>{response}</p>
                    <Link href="/">
                      <a>
                        <ScoreButton color="whitesmoke">Home</ScoreButton>
                      </a>
                    </Link>
                    <ScoreButton color="whitesmoke" onClick={router.reload}>
                      Re-try
                    </ScoreButton>
                  </Modal>
                </>
              )}
              <Row>
                <Col xs={3} lg={4}></Col>
                <Col style={{ textAlign: "center" }} xs={6} lg={4}>
                  {start && !result && (
                    <div>
                      <h2 style={{ margin: "15px 0 20px", fontSize: "2em" }}>
                        {Capital(items[0].category)}
                      </h2>
                      <ViewScore
                        image={buttonImage}
                        onClick={() => setStart(false)}
                      >
                        START!
                      </ViewScore>
                    </div>
                  )}
                </Col>
                <Col xs={3} lg={4}></Col>
              </Row>
              {!start && !result && (
                <Row>
                  <Col xs={3} lg={4}></Col>
                  <Col style={{ textAlign: "center" }} xs={6} lg={4}>
                    <Question hide={hide}>
                      <h2>{items[counter].question}</h2>
                      <form onSubmit={formHandle}>
                        {items[counter].answers.map((e) => (
                          <div key={e}>
                            <input
                              type="radio"
                              id={e}
                              name="answers"
                              value={e}
                              onChange={(e) => setAnswer(e.target.value)}
                            />
                            <label style={{ paddingLeft: "1%" }}>{e}</label>
                          </div>
                        ))}
                        <input type="submit" />
                      </form>
                    </Question>

                    {end && (
                      <ViewScore
                        image={buttonImage}
                        onClick={() => setResult(true)}
                      >
                        VIEW SCORE!
                      </ViewScore>
                    )}
                  </Col>
                  <Col xs={3} lg={4}></Col>
                </Row>
              )}
            </Col>
          </Row>
        </Container>
      )}
    </Layout>
  );
}

// get quiz questions
export async function getStaticProps(context) {
  try {
    await dbConnect();
    const resOne = await Items.find({ category: context.params.id }),
      resTwo = await Images.find({ category: context.params.id });
    return {
      props: {
        items: JSON.parse(JSON.stringify(resOne)),
        image: JSON.parse(JSON.stringify(resTwo)),
      },
      revalidate: 1,
    };
  } catch (err) {
    console.log(err.message);
  }
}

// create quiz category page paths
export async function getStaticPaths() {
  try {
    await dbConnect();
    const res = await Items.find({});
    let categories = [];
    await JSON.parse(JSON.stringify(res)).forEach((e) => {
      if (!categories.includes(e.category)) categories.push(e.category);
    });
    const paths = categories.map((e) => ({
      params: { id: e },
    }));
    return {
      paths,
      fallback: true,
    };
  } catch (err) {
    console.log(err.message);
  }
}
