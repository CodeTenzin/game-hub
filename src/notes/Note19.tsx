// GIT: Build platform selector
// CREATED: PlatformSelector.tsx component AND usePlatforms.ts Hook
// USED: APP.tsx
// buidling platform selector. a drop down list of platforms.
// focus here will be on rendering the list and not filter for now.

// To load data dynamicalyl into the drop down list.
// RAWG API --> platform -> select "get a list of parent platforms" -> get the endpoint '/platforms/lists/parents'

//PlatformSelector.tsx
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { BsChevronDown } from "react-icons/bs";
import usePlatforms from "../hooks/usePlatforms";

const PlatformSelector = () => {
  // After creating the usePlatforms hook
  const { data, error } = usePlatforms();

  // if an error occurs, would prefer not to render the component
  // instead of thowing an error. dropdown list wont show.
  if (error) {
    return null;
  }
  // to simulate the error, go to usePlatforms and manipiulate the end point.

  return (
    <>
      {/* Menu from Chakra for a drop down list. */}
      <Menu>
        {/* as={Button}, want to render it as a regular button. */}
        {/* BsChevronDown - bootstrap chevron arrow pointing down icon */}
        <MenuButton as={Button} rightIcon={<BsChevronDown />}>
          Platforms
        </MenuButton>
        <MenuList>
          {/* <MenuItem>1</MenuItem>
          <MenuItem>2</MenuItem>
          <MenuItem>3</MenuItem> */}
          {data.map((platform) => (
            <MenuItem key={platform.id}>{platform.name}</MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
};

export default PlatformSelector;

// App.tsx
import React, { useState } from "react";
import { Grid, GridItem, Show, Text } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import GameGrid from "./components/GameGrid";
import GenreList from "./components/GenreList";
import { Genre } from "./hooks/useGenres";
import PlatformSelector from "./components/PlatformSelector";

const App = () => {
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

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
            selectedGenre={selectedGenre}
            onSelectGenre={(genre) => setSelectedGenre(genre)}
          />
        </GridItem>
      </Show>
      {/* Added GridItem */}
      <GridItem area="main">
        {/* Added PlatformSelector. */}
        <PlatformSelector />
        <GameGrid selectedGenre={selectedGenre} />
      </GridItem>
    </Grid>
  );
};

export default App;
