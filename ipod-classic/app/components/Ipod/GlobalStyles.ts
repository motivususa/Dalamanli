import { createGlobalStyle } from "styled-components";
import { Screen } from "@/utils/constants";

export const GlobalStyles = createGlobalStyle`
  body {
    height: 100dvh;
    display: grid;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    color: black;
    min-height: 550px;
    overflow: auto;
    background: #FCFCFC;
    transition: background 0.4s ease;

    ${Screen.XS.MediaQuery} {
      min-height: 480px;
    }

    /* Mobile: center the iPod vertically, no dead space */
    @media (max-width: 576px) {
      height: 100dvh;
      min-height: unset;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      overflow: hidden;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }

  @media (prefers-color-scheme: dark) {
    html {
      color-scheme: dark;
    }
    body {
      background: #121212;
    }
  }

  /* Set from DarkSurroundSync: OS dark, night hours, or black device theme */
  html.ipod-dark-surround {
    color-scheme: dark;
  }
  body.ipod-dark-surround {
    background: #121212 !important;
  }
`;
