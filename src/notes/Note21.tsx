// GIT: Refactor: Extract a query object
// USED: App.tsx, GameGrid.tsx AND useGames.ts

// Refactoring: Extracting a Query Object

// App.tsx
import React, { useState } from "react";
import { Grid, GridItem, Show, Text } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import GameGrid from "./components/GameGrid";
import GenreList from "./components/GenreList";
import { Genre } from "./hooks/useGenres";
import PlatformSelector from "./components/PlatformSelector";
import { Platform } from "./hooks/useGames";

// Query Object Pattern.
// added export, used in GameGrid Props.
export interface GameQuery {
  genre: Genre | null;
  platform: Platform | null;
}

const App = () => {
  // currently have 2 state variable, but will need more as we add
  // features like sort order and search phrases.
  // passing a bunch of variables causes it to clutter and look ugly.
  // we should pack relatied variables inside an object.
  // called Query Object Pattern.
  // Object that contains all the information we need to query the games.
  // with this out Game would be cleaner and easier to understand.
  // Made an interface.
  // const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  // const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
  //   null
  // );
  // Replaced the above 2 state variables with out GameQuery
  // its initiazation will not be null since we will always have a Query Object
  // but the properties of that Object may be not.
  // Typescript wont allows us to assign empty object so add: as GameQuery.
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
            // selectedGenre={selectedGenre}
            // onSelectGenre={(genre) => setSelectedGenre(genre)}
            // using the GameQuery variable now.
            selectedGenre={gameQuery.genre}
            // added the genre to the gameQuery.
            onSelectGenre={(genre) => setGameQuery({ ...gameQuery, genre })}
          />
        </GridItem>
      </Show>
      <GridItem area="main">
        <PlatformSelector
          // selectedPlatform={selectedPlatform}
          // onSelectPlatform={(platform) => setSelectedPlatform(platform)}
          selectedPlatform={gameQuery.platform}
          onSelectPlatform={(platform) =>
            setGameQuery({ ...gameQuery, platform })
          }
        />
        <GameGrid
          // selectedPlatform={selectedPlatform}
          // selectedGenre={selectedGenre}
          // Note21 commented above and below.
          // selectedPlatform={gameQuery.platform}
          // selectedGenre={gameQuery.genre}
          // Note 21: since we changed the props of GameGrid we dont
          // have selectedPlatform and selectedGenre
          gameQuery={gameQuery}
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
import { GameQuery } from "../App";

interface Props {
  // Note21 : Query Object Pattern. More explanation on App.tsx.
  // Added gameQuery
  gameQuery: GameQuery;
  // Then remove below
  // selectedGenre: Genre | null;
  // selectedPlatform: Platform | null;
}

// const GameGrid = ({ selectedGenre, selectedPlatform }: Props) => {
// below, after maakig interface.
const GameGrid = ({ gameQuery }: Props) => {
  // const { data, error, isLoading } = useGames(selectedGenre, selectedPlatform);
  // now instead of passing  multiple arguments, we pass a single object that
  // has everything we need.
  //  useGames(gameQuery) shows an error. modify the useGames Hook.
  const { data, error, isLoading } = useGames(gameQuery);

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
