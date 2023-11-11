// GIT: Filter games by genre

// Used: App.tsx, GenreList.tsx, GameGrid.tsx, useGames.tsx, useData.tsx, PlatformIconList.tsx
// Apply filter to the clicks on genre.

//App.tsx
import React, { useState } from "react";
import { Grid, GridItem, Show, Text } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import GameGrid from "./components/GameGrid";
import GenreList from "./components/GenreList";
import { Genre } from "./hooks/useGenres";

const App = () => {
  // State variable to store the selected genre.
  // sharing selected genre to game grid.
  // state variable can hold Genre object or null.
  // since we initialized it to null, we cannot set it to differnt value
  // other than null, so set a <Genre>
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  // The component that holds the state should be the one to update it,
  // so made a Prop in GenreList.tsx .

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
          {/* <GenreList /> */}
          {/* below after making a useState here and making props in GenreList. */}
          <GenreList onSelectGenre={(genre) => setSelectedGenre(genre)} />
          {/* Click a genre */}
          {/* Check Dev Tools -> Compoments Tab -> App */}
          {/* see the state will hold the selected genre. */}
          {/* This needs to be passed to our GameGrid so it can passed on
          to the back-end while fetching the game.  */}
        </GridItem>
      </Show>
      {/* <GameGrid /> */}
      {/* Pass the selected genre to GameGrid */}
      <GameGrid selectedGenre={selectedGenre} />
    </Grid>
  );
};

export default App;

// GenreList.tsx
import React from "react";
import userGenres, { Genre } from "../hooks/useGenres";
import useData from "../hooks/useData";
import useGenres from "../hooks/useGenres";
import {
  Button,
  HStack,
  Image,
  List,
  ListItem,
  Spinner,
  Text,
} from "@chakra-ui/react";
import getCroppedImageUrl from "../services/image-url";

// Note 17: after making a state in the App.tsx
interface Props {
  onSelectGenre: (genre: Genre) => void;
}

// const GenreList = () => {
// Note 17: after making a state in the App.tsx
const GenreList = ({ onSelectGenre }: Props) => {
  const { data, isLoading, error } = useGenres();
  if (error) return null;
  if (isLoading) return <Spinner />;

  return (
    <>
      <List>
        {data.map((genre) => (
          <ListItem key={genre.id} paddingY="5px">
            <HStack>
              <Image
                boxSize="32px"
                borderRadius={8}
                src={getCroppedImageUrl(genre.image_background)}
              />
              {/* <Text fontSize="lg">{genre.name}</Text> */}
              {/*  Note 17: button to filter. */}
              {/* varaint - change the buttons look. */}
              <Button
                onClick={() => {
                  // show error on GameGrid about key.
                  // console.log(genre.name);
                  // below after making the state in App.tsx and an interface.
                  onSelectGenre(genre);
                }}
                fontSize="lg"
                variant="link"
              >
                {genre.name}
              </Button>
            </HStack>
          </ListItem>
        ))}
        {/* </ul> */}
      </List>
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
import { Genre } from "../hooks/useGenres";

// to gets the selected genre passed from App.
interface Props {
  selectedGenre: Genre | null;
}

// const GameGrid = () => {
const GameGrid = ({ selectedGenre }: Props) => {
  // const { data, error, isLoading } = useGames();
  // below need to modify the useGames hook to accep the arg.
  const { data, error, isLoading } = useGames(selectedGenre);

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
            // <GameCardContainer>
            //   <GameCardSkeleton key={skeleton} />
            // </GameCardContainer>
            // previously we added the key on GameCardSkeleton.
            // but after we wrapped the skateleton with container,
            // we forgot to move the key up to GameCardContainer.
            <GameCardContainer key={skeleton}>
              <GameCardSkeleton />
            </GameCardContainer>
          ))}
        {data.map((game) => (
          // <GameCardContainer>
          //   {" "}
          //   <GameCards key={game.id} game={game} />
          // </GameCardContainer>
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
const useGames = (selectedGenre: Genre | null) =>
  // selectedGenre? - since selectedGenre can be null.
  // useData<Game>("/games", { params: { genres: selectedGenre?.id } });
  // useData hook only takes an endpoint.
  // can make it more flexible by givign it an Axios request config object.
  // below after adding dependency in useData hook
  useData<Game>("/games", { params: { genres: selectedGenre?.id } }, [
    selectedGenre?.id,
  ]);
// want it to be dependent on selectedGenre?.id.

export default useGames;


// useData.tsx

import React, { useEffect, useState } from 'react'
import apiClient from '../services/api-client';
import { AxiosRequestConfig, CanceledError } from 'axios';

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
const useData = <T>(endpoint: string, requestConfig ?: AxiosRequestConfig, deps?: any[]) => {
    // genre to data. and <t>
    // const [data, setData] = useState<Genre[]>([]);
    // below to add <T> update to const useData = <T>() above.
    const [data, setData] = useState<T[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
  
    useEffect(() => {
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
        .get<FetchResponse<T>>(endpoint, { signal: controller.signal, ...requestConfig })
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
  }, deps ? [...deps] : []);
  // after our data hook receives the dependency, specify it at useGames.

    // return { genres, error, isLoading };
    return { data, error, isLoading };


}

export default useData;


//PlatformIconList.tsx
import React from "react";
import { Platform } from "../hooks/useGames";
import { HStack, Icon, Text } from "@chakra-ui/react";
// imports react icons
import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaLinux,
  FaAndroid,
} from "react-icons/fa";
import { MdPhoneIphone } from "react-icons/md";
import { SiNintendo } from "react-icons/si";
import { BsGlobe } from "react-icons/bs";
import { IconType } from "react-icons";

interface Props {
  platforms: Platform[];
}

const PlatformIconList = ({ platforms }: Props) => {
  const iconMap: { [key: string]: IconType } = {
    pc: FaWindows,
    playstation: FaPlaystation,
    xbox: FaXbox,
    nintendo: SiNintendo,
    mac: FaApple,
    linux: FaLinux,
    android: FaAndroid,
    ios: MdPhoneIphone,
    web: BsGlobe,
  };
  return (
    <>
      <HStack marginY={1}>
        {platforms.map((platform) => (
          // <Icon as={iconMap[platform.slug]} color="gray.500" />
          <Icon
            key={platform.id}
            as={iconMap[platform.slug]}
            color="gray.500"
          />
        ))}
      </HStack>
    </>
  );
};

export default PlatformIconList;
