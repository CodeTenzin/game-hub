// GIT: Implement searching
// USED: App.tsx, NavBar.tsx, index.css, SearchInput.tsx AND useGames.ts
// implementing searching.
// same approach.
/*
when the user types something, it notifies the App compoent which then takes
the search text, saves it in a Query object and passes it to the GameGrid
Search input --(notify) --> App --(save in query object and pass) --> GameGrid.

END NOTE: 
Search a text.
Inspect -> Component tab -> App state --> check its state: {searchText: "your text"}
*/

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
  // after making an interface in the SearchInput
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
        {/* Our SearchInput is not a direct child our App component. */}
        {/* Nav contanins the SearchInput. */}
        {/* so if we want to pass the onSearch to SearchInput then App need to pass 
        it to Nav w.hich then pass to SearchInput's onSearch={...} */}
        {/* this is not ideal. deeply nested. */}
        {/* for now we will do it. */}
        {/* <NavBar /> */}
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
        <Flex paddingLeft={2} marginBottom={5}>
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

// NavBar.tsx
import { HStack, Image, Text } from "@chakra-ui/react";
import logo from "../assets/logo.webp";
import ColorModeSwitch from "./ColorModeSwitch";
import SearchInput from "./SearchInput";

// Search input --(notify) --> App --(save in query object and pass) --> GameGrid.

// Note27: temporary fix. copied from SearchInput.
interface Props {
  onSearch: (searchText: string) => void;
}

// const NavBar = () => {
const NavBar = ({ onSearch }: Props) => {
  return (
    <HStack padding="10px">
      <Image src={logo} boxSize="60px"></Image>
      {/* <SearchInput /> */}
      {/* Note27 */}
      <SearchInput onSearch={onSearch} />

      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;

// index.css
form {
    width: 100%;
}

// SearchInput.tsx
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React, { useRef } from "react";
import { BsSearch } from "react-icons/bs";

// Search input --(notify) --> App --(save in query object and pass) --> GameGrid.

//  to pass the values to our App
interface Props {
  onSearch: (searchText: string) => void;
}

// const SearchInput = () => {
// After setting the interface.
const SearchInput = ({ onSearch }: Props) => {
  // need to get access to the value in the input field.
  // can use the ref hook or maintain state here using the state hook.
  // earier to use a ref hook coz simple form with single input.
  const ref = useRef<HTMLInputElement>(null);
  // now associate this ref object with our input component. Check <Input> below

  return (
    // wrap it in a form element.
    // the navigation items gets resized and all aligned left
    // since it does have a width of 100%
    // <form
    // have 2 options to fill the width. using inline below.
    <form
      style={{ width: "100%" }}
      // generally inline style should be out last resort.
      // other way is to
      // Add a rule to our global style sheet. 'index.css'
      onSubmit={(event) => {
        // prevents form from being posted to the server.
        event.preventDefault();
        // when submitting the form we check that currnet is truthy.
        if (ref.current) {
          // inspect if console recieves it.
          // the value should be passed to our App component.
          // make an interface.
          // console.log(ref.current.value);
          onSearch(ref.current.value);
        }
      }}
    >
      <InputGroup>
        <InputLeftElement children={<BsSearch />} />
        <Input
          // added to ref. associate ref to our input
          ref={ref}
          borderRadius={20}
          placeholder="Search games..."
          variant={"filled"}
        />
      </InputGroup>
    </form>
  );
};

export default SearchInput;


// useGames.tsx
// making custom hook to fetch the game.

import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";
import useData from "./useData";
import { Genre } from "./useGenres";
import { GameQuery } from "../App";

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
  // Note 21: props removed after making a GameQuery Object
  // selectedGenre: Genre | null,
  // selectedPlatform: Platform | null
  // Note 21: Added is it works on GridGame.tsx code:   const { data, error, isLoading } = useGames(gameQuery);
  gameQuery: GameQuery
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
        // genres: selectedGenre?.id,
        // platforms: selectedPlatform?.id,
        // Note21: commented above.
        // this is the only place where we will work with individual values.
        // when calling the server, we should pass the following.
        genres: gameQuery.genre?.id,
        platforms: gameQuery.platform?.id,
        // Note23: when calling the server we add a new query param.
        // benefit of this query object, we dont need to add the sort order as yet
        // another dependency here. 
        // benefit of encapsulating related values inside an object.
        ordering: gameQuery.sortOrder,
        // Note27: backend to receive the pass search input
        search: gameQuery.searchText
      },
    },
    // [selectedGenre?.id]
    // below Note 20: also adding selectedPlatform so that it changes
    // when a platform gets selected.
    // [selectedGenre?.id, selectedPlatform?.id]
    // Note 21: Above comented
    [gameQuery]
    // anytime this object changes, we refresh the data.
    // with this change we make change to the App component again.

  );
// want it to be dependent on selectedGenre?.id.

export default useGames;
