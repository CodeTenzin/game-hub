import React from "react";
import {
  Button,
  ButtonGroup,
  Grid,
  GridItem,
  Show,
  Text,
} from "@chakra-ui/react";
import NavBar from "./components/NavBar";

// AT GIT: Built a nav bar

const App = () => {
  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "aside main"`,
      }}
    >
      {/* <GridItem area="nav" bg="coral"> */}
      {/* removed color after adding items to the nav. */}
      <GridItem area="nav">
        {/* Nav */}
        <NavBar />
      </GridItem>
      <Show above="lg">
        <GridItem area="aside" bg="gold">
          Aside
        </GridItem>
      </Show>
      <GridItem area="main" bg="dodgerblue">
        Main
      </GridItem>
    </Grid>
  );
};

export default App;
