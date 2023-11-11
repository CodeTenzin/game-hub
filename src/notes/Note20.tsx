// GIT: Filter games by platform
// USED: App.tsx, GameGrid.tsx, useGame.ts AND PlatformSelector.tsx

// implementing filtering the platform.

// END NOTE: check the network tab -> Fetch/XHR -> Name tab -> payload tab.
// to check that the passed params: genre and platform

// App.tsx
import React, { useState } from "react";
import { Grid, GridItem, Show, Text } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import GameGrid from "./components/GameGrid";
import GenreList from "./components/GenreList";
import { Genre } from "./hooks/useGenres";
import PlatformSelector from "./components/PlatformSelector";
import { Platform } from "./hooks/useGames";

const App = () => {
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  // state to keep track of the selected platform.
  // the selected choice will then be sent to the GameGrid.
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null
  );

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
      <GridItem area="main">
        {/* <PlatformSelector /> */}
        {/* After setting an interface and onClick */}
        {/* Check Dev tools -> Components -> App. its state will show the passed state. */}
        {/* <PlatformSelector
          onSelectPlatform={(platform) => setSelectedPlatform(platform)}
        /> */}
        {/* below, we want to dynamically change the drop down list
        heading when platform is selected. */}
        {/* Add the selectedPlatform prop in PlatformSelector */}
        <PlatformSelector
          selectedPlatform={selectedPlatform}
          onSelectPlatform={(platform) => setSelectedPlatform(platform)}
        />
        {/* <GameGrid selectedGenre={selectedGenre} /> */}
        {/* After setting the PlatformSelector, 
        pass the selected platform into the GameGrid. */}
        {/* Added selectedPlatform to the GameGrid interface. */}
        <GameGrid
          selectedPlatform={selectedPlatform}
          selectedGenre={selectedGenre}
        />
      </GridItem>
    </Grid>
  );
};

export default App;

// GameGrid.tsx
import React, { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { SimpleGrid, Text } from "@chakra-ui/react";
import useGames, { Platform } from "../hooks/useGames";
import GameCards from "./GameCards";
import GameCardSkeleton from "./GameCardSkeleton";
import GameCardContainer from "./GameCardContainer";
import { Genre } from "../hooks/useGenres";

interface Props {
  selectedGenre: Genre | null;
  // Note 20: to receive the selected platform, which we pass
  // it to the useGames hook.
  selectedPlatform: Platform | null;
}

// const GameGrid = ({ selectedGenre }: Props) => {
// below Note 20. destructure the selectedPlatform.
const GameGrid = ({ selectedGenre, selectedPlatform }: Props) => {
  // const { data, error, isLoading } = useGames(selectedGenre);
  // passing the selected platform too to the useGames hook.
  const { data, error, isLoading } = useGames(selectedGenre, selectedPlatform);
  // also add the selectedPlatform param to the useGames hook.

  const skeletons = [1, 2, 3, 4, 5, 6];

  return (
    <>
      {error && <Text>{error}</Text>}
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        spacing={3}
        padding="10px"
      >
        {isLoading &&
          skeletons.map((skeleton) => (
            <GameCardContainer key={skeleton}>
              <GameCardSkeleton />
            </GameCardContainer>
          ))}
        {data.map((game) => (
          <GameCardContainer key={game.id}>
            {" "}
            <GameCards game={game} />
          </GameCardContainer>
        ))}
      </SimpleGrid>
    </>
  );
};

export default GameGrid;

//useGames.tsx
// making custom hook to fetch the game.

import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";
import useData from "./useData";
import { Genre } from "./useGenres";

// made for 'parent_platform' property.
// export added to be used by PlatformIconList.
export interface Platform {
  id: number;
  name: string;
  slug: string;
}

// interfaces moved from 'GameGrid.tsx'
// added export to be used in 'GameCards.tsx'
export interface Game {
  id: number;
  name: string;
  background_image: string;
  // Note 8: added at add icon.
  // an array of objects that has a property of platform of type platform.
  parent_platforms: { platform: Platform }[];
  // Note9: added for the meta scoe.
  metacritic: number;
}

// -------------------------------------------------------
//  NOTE 14: NO LONGER NEEDED AFTER MAKING A GENETIC VERISON.
// interface FetchGamesResponse {
//   count: number;
//   results: Game[];
// }

//--------------------------------------------------------
// NOTE 14: DONT NEED THE WHOLE BODY CODE SINCE WE DEFINED THIS IN A GENETIC MANNER.
/*
const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState("");
  // Note 11: to track laodning state in our hook.
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    // to handle cancellations
    const controller = new AbortController();

    // just before we call the API we set up the loading state.
    // when we are done, we set it back to false.
    setLoading(true);

    apiClient
      // added signal
      .get<FetchGamesResponse>("/games", { signal: controller.signal })
      .then((res) => {
        setGames(res.data.results);
        // preferred method is to use finally.
        // but wont work in StrictMode
        setLoading(false);
      })
      .catch((err) => {
        // added to handle cancellation error.
        if (err instanceof CanceledError) {
          return;
        }
        setError(err.message);
        // if we catch an error, set to false again.
        setLoading(false);
      });
    // clean up function after we get the game.
    return () => controller.abort();
  }, []);
  // return an object with 2 properties, so it can be used by our components.
  // added reutrn isLoading too.
  return { games, error, isLoading };
};
*/

// const useGames = () => useData<Game>("/games");
// NOTE 17: passed selected genre from GenreList to GameGrid using seGames(selectedGenre).
// {params} - passing genre as a query string param, check Rawg API
// {params} - one of the properties of AxiosRequestConfig objetc.
// set params to an object. the object is set to 'genres: selectedGenre.id'
// const useGames = (selectedGenre: Genre | null) =>
// Below Note 20: to receive the selected platform.
const useGames = (
  selectedGenre: Genre | null,
  selectedPlatform: Platform | null
) =>
  // selectedGenre? - since selectedGenre can be null.
  // useData<Game>("/games", { params: { genres: selectedGenre?.id } });
  // useData hook only takes an endpoint.
  // can make it more flexible by givign it an Axios request config object.
  // below after adding dependency in useData hook
  // useData<Game>("/games", { params: { genres: selectedGenre?.id } }, [
  //   selectedGenre?.id,
  // ]);
  // Below Note 20: passing thr selected platform to the API
  // using the param object
  useData<Game>(
    "/games",
    {
      params: {
        genres: selectedGenre?.id,
        platforms: selectedPlatform?.id,
      },
    },
    // [selectedGenre?.id]
    // below Note 20: also adding selectedPlatform so that it changes
    // when a platform gets selected.
    [selectedGenre?.id, selectedPlatform?.id]
  );
// want it to be dependent on selectedGenre?.id.

export default useGames;

//PlatformSelector.tsx
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { BsChevronDown } from "react-icons/bs";
import usePlatforms from "../hooks/usePlatforms";
import { Platform } from "../hooks/useGames";

// Note 20: to filter the selected platform on GameGrid.
interface Props {
  onSelectPlatform: (platform: Platform) => void;
  // added to dynamically change the drop down list heading.
  selectedPlatform: Platform | null;
}

// const PlatformSelector = () => {
// Note 20. to filter the selected platform on GameGrid.
// const PlatformSelector = ({ onSelectPlatform }: Props) => {
const PlatformSelector = ({ onSelectPlatform, selectedPlatform }: Props) => {
  const { data, error } = usePlatforms();

  if (error) {
    return null;
  }

  return (
    <>
      <Menu>
        {/* <MenuButton as={Button} rightIcon={<BsChevronDown />}>
          Platforms
        </MenuButton> */}
        {/* Below intead of just rendering  Platforms heading, dynamically
        change it to the one selected.*/}
        <MenuButton as={Button} rightIcon={<BsChevronDown />}>
          {/* if selectedPlatform is valid platform object, get the name, 
          otherwise put Platforms as heading. */}
          {selectedPlatform?.name || "Platforms"}
        </MenuButton>
        <MenuList>
          {data.map((platform) => (
            // <MenuItem key={platform.id}>{platform.name}</MenuItem>
            // Note 20: to handle the selection
            <MenuItem
              // notifies the App component.
              onClick={() => onSelectPlatform(platform)}
              key={platform.id}
            >
              {platform.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
};

export default PlatformSelector;
