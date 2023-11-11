// GIT: Ship genres with the app
// CREATED: data FOLDER -> genres.ts
// USED: useGenres.ts, GenreList.tsx

// Shipping Static Data
/*
in current implementation we show a spinner and skeleton when fetching the
genre and the game.
dynamically loading 2 different parts of the page and showing loading indicators.
Not necessarily a bad thing but over using it can impact UX.

We can ship the list of genres in our application since it rarely changes,
we can treat is as static data.
that way we wont need to make an extra request to the back end and the data
will be available right away and skip the spinner.

Network -> Fetch/XHR --> results -> Preview and check the Names AND COPY THE RESULTS FROM THE NAME THAT SAYS "GENRE"!!!!!!!!.
*/

// END NOTE: we can also statically get the data for the Dropdown list.

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

// GenreList.tsx
import React from "react";
import userGenres, { Genre } from "../hooks/useGenres";
import useGenres from "../hooks/useGenres";
import {
  Button,
  HStack,
  Heading,
  Image,
  List,
  ListItem,
  Spinner,
  Text,
} from "@chakra-ui/react";
import getCroppedImageUrl from "../services/image-url";

interface Props {
  onSelectGenre: (genre: Genre) => void;
  selectedGenre: Genre | null;
}

const GenreList = ({ onSelectGenre, selectedGenre }: Props) => {
  // Note32: GenreList is the consumer of the useGenres hook.
  // it expects to get an object with 3 properties.
  // we dont want to changes that we applied to this hook to affect
  // this component and other component thar use this hook.
  // that is why we retuned an object with the exact properties in the hook.
  // const { data, isLoading, error } = useGenres();
  // we need to set the data property to the genres we have stored in
  // the folder we created in the 'genres.ts' module in 'data' folder
  const { data, isLoading, error } = useGenres();

  // Note32: dont need the if statements anymore.
  // but keeping it incase we want to take genre from the server again.
  if (error) return null;
  if (isLoading) return <Spinner />;

  return (
    <>
      <Heading fontSize="2xl" marginBottom={3}>
        Genres
      </Heading>
      <List>
        {data.map((genre) => (
          <ListItem key={genre.id} paddingY="5px">
            <HStack>
              <Image
                boxSize="32px"
                borderRadius={8}
                src={getCroppedImageUrl(genre.image_background)}
              />
              <Button
                whiteSpace="normal"
                textAlign="left"
                objectFit="cover"
                onClick={() => {
                  onSelectGenre(genre);
                }}
                fontSize="lg"
                fontWeight={genre.id === selectedGenre?.id ? "bold" : "normal"}
                variant="link"
              >
                {genre.name}
              </Button>
            </HStack>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default GenreList;
