// GIT: Build sort selector
// CREATED: SortSelector.tsx
// USED: App.tsx

// Building Sort Selector.
// For now just building the component and not the sorting logic.

// App.tsx
import React, { useState } from "react";
import { Grid, GridItem, HStack, Show, Text } from "@chakra-ui/react";
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
        {/* HStack added for padding. PlatformSelector and SortSelector sticking side by side. */}
        {/* spacing={5} space between the 2 components. */}
        {/* paddingLeft - The cards and sorters not aligned in a line. */}
        {/* selectors very close to the top of Cards. */}
        <HStack spacing={5} paddingLeft={2} marginBottom={5}>
          <PlatformSelector
            selectedPlatform={gameQuery.platform}
            onSelectPlatform={(platform) =>
              setGameQuery({ ...gameQuery, platform })
            }
          />
          {/* Added the SortSelector. */}
          <SortSelector />
        </HStack>
        <GameGrid gameQuery={gameQuery} />
      </GridItem>
    </Grid>
  );
};

export default App;

// SortSelector.tsx
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { BsChevronDown } from "react-icons/bs";

// Component will be similar to the Platform Selector.
// copy pasted the return statement. MenuButton and MenuList Heading removed.
const SortSelector = () => {
  return (
    <>
      <Menu>
        <MenuButton as={Button} rightIcon={<BsChevronDown />}>
          Order by: relevance
        </MenuButton>
        <MenuList>
          <MenuItem>Relevance</MenuItem>
          <MenuItem>Data added</MenuItem>
          <MenuItem>Name</MenuItem>
          <MenuItem>Release date</MenuItem>
          <MenuItem>Popularity</MenuItem>
          <MenuItem>Average rating</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default SortSelector;
