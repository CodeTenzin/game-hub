//FROM MAIN.TSX
/*
  USING: 'theme.ts' in src folder.
  IMPORT 'Theme.ts' in main.tsx.
*/

import React from "react";
import ReactDOM from "react-dom/client";
// Placement: import React, third party libraries and then our own imports.
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
// import 'theme.tsx' to be used in 2 places here.
import theme from "./theme";

import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* changed here. */}
    {/* added theme.ts in ChakraProvider and ColorModeScript*/}
    {/* No changes in color yet. Chakra stores the selected mode and 
    local storage so it can remember in the future. */}
    {/* Chrome Dev Tool -> Application Tab -> Storage -> Local Storage */}
    {/* Delete that key and value for 'light' */}
    {/* The page now turns to dark mode when refreshed. */}
    {/* Check the same storage again, the 'dark' key has been saved
    so that it remember in future sessions. */}
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
