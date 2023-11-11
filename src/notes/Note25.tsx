// GIT: Fix the issue with Chakra menus
// Used: App.tsx

// Fixing issue with chakra menus
// When we select an items from the drop down menu we get an error in the console.
// CSS margin cannot be used to apply padding one.
// issue came afer placing items in the HStack in App.

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

export interface GameQuery {
  genre: Genre | null;
  platform: Platform | null;
  sortOrder: string;
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
        <NavBar />
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
        {/* When we select an items from the drop down menu we get an error in the
        console. CSS margin cannot be used to apply padding one. issue came afer
        placing items in the HStack in App. */}
        {/* Solution: we replace HStack with a Flex component */}
        {/* <HStack spacing={5} paddingLeft={2} marginBottom={5}> */}
        {/* Flex has no spacing. removed.
        so how do we add space between the sicking dropdown list. */}
        {/* solution: by wrapping one of the list in a Box and adding a margin. */}
        <Flex paddingLeft={2} marginBottom={5}>
          {/* Box added */}
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
          {/* </HStack> */}
        </Flex>
        <GameGrid gameQuery={gameQuery} />
      </GridItem>
    </Grid>
  );
};

export default App;
