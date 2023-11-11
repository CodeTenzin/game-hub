// GIT: Create a generic data fetching hook

// Created: useData.ts Hook.
// the useGames and useGenre are almost identical, so we make a Generic Hook.
// Used: useData.ts, GenreList.tsx, useGenre.ts, useGames.ts AND GameGrid.tsx .
// BIG COMMENTED CODE IN useGenre.ts AND useGames.ts

/*
Added export in useGenre
export interface Genre {
    id: number;
    name: string;
}
*/

//useGames.ts
// making custom hook to fetch the game.

import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";
import useData from "./useData";

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

const useGames = () => useData<Game>("/games");

export default useGames;

// useGenres.ts
import React, { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";
import useData from "./useData";

// RAWG API -> Genre -> check response properties similar to games.
// Note 14: added export to be used in useData and GenreList.
export interface Genre {
  id: number;
  name: string;
}

// for api.Client.get(..) below.
// code duplication for now.
// Same interface thats in other component, but for Genre.

//-------------------------------------------------
// NOTE 14: DONT NEED THIS SINCE WE DEFINED THIS IN A GENETIC MANNER.
// interface FetchGenresResponse {
//     count: number;
//     results: Genre[];
// }

//-------------------------------------------------
// NOTE 14: DONT NEED THE WHOLE BODY CODE SINCE WE DEFINED THIS IN A GENETIC MANNER.
/*


// this hook will be similar to the other hook useGames.
// copy pasted the code from useGames. code duplication so far.
const useGenres = () => {


    // form <Game> to <Genre> copy pasted.
    const [genres, setGenres] = useState<Genre[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
  
    useEffect(() => {
      const controller = new AbortController();
      setLoading(true);
  
      apiClient
        // <FetchGenresResponse> interface created here. duplicate for now.
        // from '/games' to '/genres'.
        .get<FetchGenresResponse>("/genres", { signal: controller.signal })
        .then((res) => {
        // setGames to setGenres
          setGenres(res.data.results);
          setLoading(false);
        })
        .catch((err) => {
          if (err instanceof CanceledError) {
            return;
          }
          setError(err.message);
          setLoading(false);
        });
      return () => controller.abort();
    }, []);
    // changed games to genres
    return {  genres, error, isLoading };
}
*/

// Hiding the endpoint details behind the useGenres Hook.
const useGenres = () => useData<Genre>("/genres");

export default useGenres;

// GenreList.tsx
import React from "react";
import userGenres, { Genre } from "../hooks/useGenres";
import useData from "../hooks/useData";
import useGenres from "../hooks/useGenres";

const GenreList = () => {
  //   const { genres } = userGenres();
  // using useData and as a generic type we supply Genre param.
  // we dont have access to <Genre> interface, so we add export in the useGenre module.
  //   const { genres } = useData<Genre>("/genres");
  // no property named genres in the object that we get.
  // so used data which VS code named it.
  //   const { data } = useData<Genre>("/genres");

  // ---------------------------------------------------------
  // NOTE: 14
  // The problem here is that the component knows about our endpoint.
  // our components shouldnt know anything about making HTTP request.
  // useData to useGenres after the code change.
  const { data } = useGenres();

  return (
    <>
      <ul>
        {/* {genres.map((genre) => (
          <li key={genre.id}>{genre.name}</li>
        ))} */}
        {data.map((genre) => (
          <li key={genre.id}>{genre.name}</li>
        ))}
      </ul>
    </>
  );
};

export default GenreList;

// GameGrid.tsx
import React, { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { SimpleGrid, Text } from "@chakra-ui/react";
import useGames from "../hooks/useGames";
import GameCards from "./GameCards";
import GameCardSkeleton from "./GameCardSkeleton";
import GameCardContainer from "./GameCardContainer";

const GameGrid = () => {
  // const { games, error, isLoading } = useGames();
  // games is now undefined.
  // after making a genetic type of useData, we longer have games property.
  const { data, error, isLoading } = useGames();

  const skeletons = [1, 2, 3, 4, 5, 6];

  return (
    <>
      {error && <Text>{error}</Text>}
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        spacing={10}
        padding="10px"
      >
        {isLoading &&
          skeletons.map((skeleton) => (
            <GameCardContainer>
              <GameCardSkeleton key={skeleton} />
            </GameCardContainer>
          ))}
        {/* {games.map((game) => ( */}
        {data.map((game) => (
          <GameCardContainer>
            {" "}
            <GameCards key={game.id} game={game} />
          </GameCardContainer>
        ))}
      </SimpleGrid>
    </>
  );
};

export default GameGrid;
