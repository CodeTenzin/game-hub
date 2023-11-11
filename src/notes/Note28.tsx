// GIT: Add a dynamic page heading
// CREATED: GameHeading.tsx
// USED: App.tsx

// Adding a Dynamic heading
// heading in GameGrid depending on what button you click - side button or the dropdown's.

// GameHeading.tsx
import { Heading } from "@chakra-ui/react";
import React from "react";
import { GameQuery } from "../App";

// to receive a game query object
interface Prop {
  gameQuery: GameQuery;
}

const GameHeading = ({ gameQuery }: Prop) => {
  // To render the heading dynamically it should receive a
  // game query object as Prop in this component.

  // Initially should render "Games" but change depending on what we select including
  // side button and the list selection.
  // If the user selects both platform and games, then heading should begin with that order.

  // gameQuery.platform?.name || null - if we have a platform, render the name.
  // otherwise render '' empty string instead of 'undefined'
  const heading = `${gameQuery.platform?.name || ""} 
                   ${gameQuery.genre?.name || ""} 
                   Games`;

  return (
    // can use <h1> or chakra's <Heading>
    // marginY={5} header close to the list.
    <Heading as="h1" marginY={5} fontSize="5xl">
      {heading}
    </Heading>
  );
};

export default GameHeading;

// App.tsx
import React, { useState } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Show,
  Text,
} from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import GameGrid from "./components/GameGrid";
import GenreList from "./components/GenreList";
import { Genre } from "./hooks/useGenres";
import PlatformSelector from "./components/PlatformSelector";
import { Platform } from "./hooks/useGames";
import SortSelector from "./components/SortSelector";
import GameHeading from "./components/GameHeading";

export interface GameQuery {
  genre: Genre | null;
  platform: Platform | null;
  sortOrder: string;
  searchText: string;
}

const App = () => {
  const [gameQuery, setGameQuery] = useState<GameQuery>({} as GameQuery);

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "aside main"`,
      }}
      templateColumns={{
        base: "1fr",
        lg: "200px 1fr",
      }}
    >
      <GridItem area="nav">
        <NavBar
          onSearch={(searchText) => setGameQuery({ ...gameQuery, searchText })}
        />
      </GridItem>
      <Show above="lg">
        <GridItem area="aside" paddingX={5}>
          <GenreList
            selectedGenre={gameQuery.genre}
            onSelectGenre={(genre) => setGameQuery({ ...gameQuery, genre })}
          />
        </GridItem>
      </Show>
      <GridItem area="main">
        <Box paddingLeft={2}>
          {/* Note28: Added for the selected Headings. */}
          {/* The header is not perfectly aligned straight left side
          with the list and the grid. we can apply the same paddingLeft={2} we applied
          in Flex to the GameHeading. but if we later want to change the padding, we
          need change it in both places. so we wrap both items in a box and apply
          the padding there. */}
          <GameHeading gameQuery={gameQuery} />
          {/* <Flex paddingLeft={2} marginBottom={5}> */}
          <Flex marginBottom={5}>
            <Box marginRight={5}>
              <PlatformSelector
                selectedPlatform={gameQuery.platform}
                onSelectPlatform={(platform) =>
                  setGameQuery({ ...gameQuery, platform })
                }
              />
            </Box>
            <SortSelector
              sortOrder={gameQuery.sortOrder}
              onSelectSortOrder={(sortOrder) => {
                setGameQuery({ ...gameQuery, sortOrder });
              }}
            />
          </Flex>
        </Box>
        <GameGrid gameQuery={gameQuery} />
      </GridItem>
    </Grid>
  );
};

export default App;
