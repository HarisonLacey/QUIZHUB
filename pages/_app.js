import { createGlobalStyle, ThemeProvider } from "styled-components";
import { ContextWrapper } from "../components/Context";

// global styling
const GlobalStyle = createGlobalStyle`
html {
  overflow: hidden;
}
body {
  font-family: 'Fredoka One', cursive;
}
`;

// styling themes
const theme = {
  colors: {
    primary: "wheat",
    secondary: "whitesmoke",
    thirdly: "#fcd1d1",
  },
  fonts: {
    primary: "'Fredoka One', cursive",
    secondary: "'Zilla Slab Highlight', cursive",
  },
};

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      {/* context wrapper to pass data down */}
      <ContextWrapper data={"let's get quizzing!"}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </ContextWrapper>
    </>
  );
}

export default MyApp;
