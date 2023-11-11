// GIT: Add emojis
// CREATED: Emoji.tsx
// USED: useGames.ts AND GameCards.tsx
// Adding Emojis to game cards.

// Emoji.tsx
import React from "react";
// import the images
import bullsEye from "../assets/bulls-eye.webp";
import thumbsUp from "../assets/thumbs-up.webp";
import meh from "../assets/meh.webp";
import { Image, ImageProps } from "@chakra-ui/react";

// Render different emojis based on the rating.

// should receive the rating of the game as a prop
interface Prop {
  rating: number;
}

const Emoji = ({ rating }: Prop) => {
  if (rating < 3) {
    return null;
  }
  // instead of using a bunch of if statements, use a map.
  //in this objects, our keys are numbers the represents the rating of the game.
  // we map the rating with a couple of properties.
  // const emojiMap = {
  // annotated with object of any number of keys of type number
  // this called Index Signature. { [key: number] }.
  // using this we can tell the Typescript compiler that this object can any number
  // of keys and the keys are number.
  // we also map each key to an ImageProps defined in Chakra. { [key: number]: ImageProps }.
  // This type defines the props available on the Image compoennt below.
  const emojiMap: { [key: number]: ImageProps } = {
    // going to use these values on images to imporve accessibility.
    // Added boxSize since some emojis appear larger than others.
    // play around to find the reasonable sizes.
    3: { src: meh, alt: "meh", boxSize: "25px" },
    4: { src: thumbsUp, alt: "recommended", boxSize: "25px" },
    5: { src: bullsEye, alt: "exceptional", boxSize: "35px" },
  };

  return (
    <>
      {/* in Imagge we can use src and alt but we can also render the value 
    associated with nthe given key */}
      {/* <Image {...emojiMap[rating]} /> */}
      {/* above gives an error so we annotate the emojiMap */}
      {/* use Image from Chakra. */}
      {/* marginTop={1}: emoji clsoe to game name. */}
      <Image {...emojiMap[rating]} marginTop={1} />
      {/* because we are spreading this object, all this property will be
      added to our image component.
      much better than setting individual props. */}
    </>
  );
};

export default Emoji;

// GameCards.tsx
import React from "react";
import { Game } from "../hooks/useGames";
import { Card, CardBody, HStack, Heading, Image, Text } from "@chakra-ui/react";
import PlatformIconList from "./PlatformIconList";
import CriticScore from "./CriticScore";
import getCroppedImageUrl from "../services/image-url";
import Emoji from "./Emoji";

interface Props {
  game: Game;
}

const GameCards = ({ game }: Props) => {
  return (
    <Card>
      <Image src={getCroppedImageUrl(game.background_image)} />
      <CardBody>
        <HStack justifyContent="space-between" marginBottom={3}>
          <PlatformIconList
            platforms={game.parent_platforms.map((p) => p.platform)}
          />
          <CriticScore score={game.metacritic} />
        </HStack>
        {/* <Heading fontSize="2xl">{game.name}</Heading> */}
        {/* Note31: adding the Emoji component */}
        <Heading fontSize="2xl">
          {game.name}
          <Emoji rating={game.rating_top} />
        </Heading>
      </CardBody>
    </Card>
  );
};
export default GameCards;

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
