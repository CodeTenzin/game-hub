// Clean up's
// Hooks Folder: useData.ts, useGames.ts, useGenres.ts and usePlatform.ts

// useData.ts
import React, { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { AxiosRequestConfig, CanceledError } from "axios";

// copy pasted the code from useGenre.
// replace all refernece of Genre with a generic.

// dont need Genre
// interface Genre {
//     id: number;
//     name: string;
// }

// changed name and made it generic
interface FetchResponse<T> {
  count: number;
  // results: Genre[];
  results: T[];
}

// userGenres to useData
// endpoint will be used below in .get .
// const useData = <T>(endpoint: string) => {
// Note 17: below after changing the useGames hook.
// requestConfig? becomes optional. so dont always have to pass it.
// const useData = <T>(endpoint: string, requestConfig ?: AxiosRequestConfig) => {
// added for the dependency array.
// deps: any[] - at this point, we dont kow the type of dependency.
// deps: any[] - also shows compilation error, since the param before is optional.
// if a param is optional, all following param is optional as well.
const useData = <T,>(
  endpoint: string,
  requestConfig?: AxiosRequestConfig,
  deps?: any[]
) => {
  // genre to data. and <t>
  // const [data, setData] = useState<Genre[]>([]);
  // below to add <T> update to const useData = <T>() above.
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(
    () => {
      const controller = new AbortController();
      setLoading(true);

      apiClient
        // below changed from FetchResponse to FetchResponse<T> since we made it a generic type.
        // so we specify it by adding <T>.
        // .get<FetchResponse<T>>("/genres", { signal: controller.signal })
        // below using endpoint prop instead of '/genres'
        // .get<FetchResponse<T>>(endpoint, { signal: controller.signal })
        // Note 17: used in useGame Hook.
        // { signal: controller.signal } hovered is of type  AxiosRequestConfig.
        // .get<FetchResponse<T>>(endpoint, { signal: controller.signal })
        // below after setting the useGames hook:   useData<Game>("/games", { params: { genres: selectedGenre?.id } });
        // spread ...requestConfig object to add any additional properties here.
        .get<FetchResponse<T>>(endpoint, {
          signal: controller.signal,
          ...requestConfig,
        })
        .then((res) => {
          setData(res.data.results);
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
      // }, []);
      // new request arent sent on genre select, since useEffect only
      // sends a request once.
      // pass an aaray dependecy so when selected genre changes, it
      // sends another request to match the changes.
      // }, [...deps]);
      // [...deps] shows an error, since declared set to ? optional.
      // and it can be undefined, so we cannot spread an undefined object.
      // below, if dependecy truthy spead it other wise return empty array
    },
    deps ? [...deps] : []
  );
  // after our data hook receives the dependency, specify it at useGames.

  // return { genres, error, isLoading };
  return { data, error, isLoading };
};

export default useData;

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
  // Note31: to add emojis
  // in the api, rating_top is whole numbers (1,2,3...) and rating us floating points.
  rating_top: number;
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
        search: gameQuery.searchText,
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

// useGenres.ts
import React, { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";
import useData from "./useData";
import genres from "../data/genres";

// RAWG API -> Genre -> check response properties similar to games.
// Note 14: added export to be used in useData and GenreList.
export interface Genre {
  id: number;
  name: string;
  // Note 15: added for genre icons
  // Network -> Fetch/XHR -> results.
  // each genres has a image_background property.
  image_background: string;
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
// const useGenres = () => useData<Genre>('/genres');
// Note32: using the static data.
// instead of using the data hook to call the server,
// we should return an object with 3 properties.
// const useGenres = () => ({data: null, isLoading: false, error: null });
// reason we an object with these properties is to minimize the impact of this
// change on the consumers of this hook.
// GenreList is our consumer.
// we need to set the data property to the genres we have stored in
// the folder we created in the 'genres.ts' module in 'data' folder
const useGenres = () => ({ data: genres, isLoading: false, error: null });
// we set data to genres.
// import useData from "../hooks/useData";

export default useGenres;

// usePlatforms.ts
import useData from "./useData";

interface Platform {
  id: number;
  name: string;
  slug: string;
}

// To load data dynamicalyl into the drop down list.
// RAWG API --> platform -> select "get a list of parent platforms" -> get the endpoint '/platforms/lists/parents'
const usePlatforms = () => useData<Platform>("/platforms/lists/parents");

export default usePlatforms;
