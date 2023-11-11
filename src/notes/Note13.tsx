// GIT: Fetch the genres

// CREATED: 'GenreList.tsx' in Component AND 'userGenres.ts' in Hook.
// Changes in: App.tsx

// Working on Aside panel that displays specific genre on click.
// Fetching the genre.
// Also creating a hook to fetch genre, similar to the one used to fetch the game.

// GenreList.tsx
import React from "react";
import userGenres from "../hooks/useGenres";

const GenreList = () => {
  // using the our custom hook.
  const { genres } = userGenres();

  return (
    <>
      <ul>
        {/* mapping genres to the list. */}
        {genres.map((genre) => (
          <li key={genre.id}>{genre.name}</li>
        ))}
      </ul>
    </>
  );
};

export default GenreList;

// App.tsx
import React from "react";
import { Grid, GridItem, Show, Text } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import GameGrid from "./components/GameGrid";
import GenreList from "./components/GenreList";

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
        {/* <GridItem area="aside">Aside</GridItem> */}
        {/* Created the GenreList Component */}
        {/* This displays the genres on the side. */}
        <GridItem area="aside">
          <GenreList />
        </GridItem>
      </Show>
      <GameGrid />
    </Grid>
  );
};

export default App;
