// GIT: Sort the games
// USED: App.tsx, useGames.ts, SortSelector.tsx AND image-url.ts

// Sorting Games.
/* Taking the same approahc as filter.
when the user chooses the filter,
the SortSelector component notifies the app component which pass the new
sort order to the game grid.
SortSelector -- (notify) --> App -- (pass sort order) --> GameGrid.

For Sorting
RAWG API -> get a list of games --> look for query param 'ordering'.
we can set it to one of these orderes like name, release etc.

END NOTE: choosing a sort gets an error, since some of the games dont have an image.
need to handle the null url's, with temporary fix and return empty string ''.

Check Network to check if its sending the right data to the RAWG api.
Network -> Fetch/XHR -> click the last request -> payload tab -> see 'ordering: -released' set.
Go back to page, select Platform and Sort Order
Network -> Fetch/XHR -> click the last request -> payload tab -> see 'ordering: -released' set.
*/

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
  // below after adding an array and props interface in SortSelector.
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
        <HStack spacing={5} paddingLeft={2} marginBottom={5}>
          <PlatformSelector
            selectedPlatform={gameQuery.platform}
            onSelectPlatform={(platform) =>
              setGameQuery({ ...gameQuery, platform })
            }
          />
          {/* <SortSelector /> */}
          {/* after adding an array and props interface in SortSelector. */}
          {/* to render the current sort order on the drop down list, sortOrder={..} */}
          <SortSelector
            sortOrder={gameQuery.sortOrder}
            onSelectSortOrder={(sortOrder) => {
              // we pass a new object in setGameQuery.
              setGameQuery({ ...gameQuery, sortOrder });
            }}
          />
        </HStack>
        {/* then pass the new game query to the GameGrid. no change in code.*/}
        <GameGrid gameQuery={gameQuery} />
      </GridItem>
    </Grid>
  );
};

export default App;

// useGames.ts
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

// SortSelector.tsx
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { BsChevronDown } from "react-icons/bs";

// to be used by the App or the consumer consumer component.
interface Props {
  onSelectSortOrder: (sortOrder: string) => void;
  // below passed from App to render the sort order name on drop down list.
  sortOrder: string;
}

// const SortSelector = () => {
const SortSelector = ({ onSelectSortOrder, sortOrder }: Props) => {
  const sortOrders = [
    // Relevance is the default order, so we dont have to change anything in value.
    { value: "", label: "Relevance" },
    // -added based on api, shows newest game on top. reverses the sort.
    { value: "-added", label: "Date added" },
    { value: "name", label: "Name" },
    // -released reverse the sort with newest date on top.
    { value: "-released", label: "Release date" },
    { value: "metacritic", label: "Popularity" },
    { value: "-rating", label: "Average rating" },
  ];

  // find the sort order that matches the one passed from the App.
  const currentSortOrder = sortOrders.find((order) => order.value == sortOrder);

  return (
    <>
      <Menu>
        <MenuButton as={Button} rightIcon={<BsChevronDown />}>
          {/* Order by: relevance */}
          {/* dynamically loads the heading on the dropdown list.
            If we find the currentSortOrder object then redner its label otherwise render
            the default 'Relevance'.  */}
          Order by: {currentSortOrder?.label || "Relevance"}
        </MenuButton>
        <MenuList>
          {/* each MenuItem  needs an onClick and handle. repetitive. */}
          {/* instead store all sort order in an array and map it to a MenuItem. */}
          {/* <MenuItem>Relevance</MenuItem>
          <MenuItem>Data added</MenuItem>
          <MenuItem>Name</MenuItem>
          <MenuItem>Release date</MenuItem>
          <MenuItem>Popularity</MenuItem>
          <MenuItem>Average rating</MenuItem> */}
          {/* Below after the array has been set, we can map each array to MenuItem. */}
          {sortOrders.map((order) => (
            // onClick={} notifies the App component or the consumer component.
            // for that we define a Prop.
            <MenuItem
              onClick={() => onSelectSortOrder(order.value)}
              key={order.value}
              value={order.value}
            >
              {order.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
};

export default SortSelector;

// image-url.ts

// function takes a url as a string
const getCroppedImageUrl = (url: string) => {
  // Note23: temporary fix to return empty string to handle null values
  // where some games dont have images.
  if (!url) {
    return "";
  }

  const target = "media/";
  // find the index or position of the "/media".
  // gives the start index of media/
  // added target.length to get the position after the media.
  const index = url.indexOf(target) + target.length;
  // index represents the beginning of the url till the
  // media param including that media.
  // url.slice(index) gets all the remaining characters.
  return url.slice(0, index) + "crop/600/400/" + url.slice(index);
};

export default getCroppedImageUrl;
