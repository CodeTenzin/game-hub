/*

GIT: Fetch the games

Get API key from Rawg.
install axios:
npm i axios

Create 'servives' folder and 'api-client.ts'
Created 'component' -> 'GameGrid.tsx'

Added GameGrid.tsx to App.tsx
*/

import React from "react";
import { Grid, GridItem, Show, Text } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import GameGrid from "./components/GameGrid";

const App = () => {
  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "aside main"`,
      }}
    >
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <Show above="lg">
        {/* <GridItem area="aside" bg="gold"> */}
        {/* below after making ColorModeSwitch. */}
        <GridItem area="aside">Aside</GridItem>
      </Show>

      {/* <GridItem area="main" bg="dodgerblue"> */}
      {/* below after making ColorModeSwitch. */}
      {/* <GridItem area="main">Main</GridItem> */}
      {/* below, after creating GameGrid.tsx */}
      <GameGrid />
    </Grid>
  );
};

export default App;
