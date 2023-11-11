//  GIT: Display genres

// Used in order: useGenres.ts, GenreList.tsx, GameCardContainer.tsx, App.tsx AND GameGrid.tsx

// Network -> Fetch/XHR -> results.
// each genres has a image_background property.

//useGenres.ts
import React, { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";
import useData from "./useData";

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
const useGenres = () => useData<Genre>("/genres");

export default useGenres;

//-------------
// GenreList.tsx
import React from "react";
import userGenres, { Genre } from "../hooks/useGenres";
import useData from "../hooks/useData";
import useGenres from "../hooks/useGenres";
import { HStack, Image, List, ListItem, Text } from "@chakra-ui/react";
import getCroppedImageUrl from "../services/image-url";

const GenreList = () => {
  const { data } = useGenres();

  return (
    <>
      {/* replace <ul> with the <List> from chara */}
      {/* Chakras verison dont have bullet points. */}
      {/* <ul> */}
      <List>
        {data.map((genre) => (
          // <li key={genre.id}>{genre.name}</li>
          // <ListItem> Chakra
          // paddingY for each list items too closse.
          <ListItem key={genre.id} paddingY="5px">
            {/* added HStack so the image and the text align */}
            <HStack>
              {/* Image Chakra */}
              <Image
                boxSize="32px"
                borderRadius={8}
                // we dont want the full image size of genre.image_background.
                // so pass it in getCroppedImageUrl.
                src={getCroppedImageUrl(genre.image_background)}
              />
              <Text fontSize="lg">{genre.name}</Text>
            </HStack>
          </ListItem>
        ))}
        {/* </ul> */}
      </List>
    </>
  );
};

export default GenreList;

//----------------------
// GameCardContainer.tsx
import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";

// To pass a GameCard or GameCardSkeleton as a child to this component.
interface Props {
  children: ReactNode;
}

const GameCardContainer = ({ children }: Props) => {
  return (
    <>
      {/* <Box width="300px" borderRadius={10} overflow="hidden"> */}
      {/* Note: 15 and also check App.tsx for the fixed width problem. */}
      {/* now theres too much space between the cards. */}
      {/* Go to GameGrid to reduce the space. */}
      <Box width="100%" borderRadius={10} overflow="hidden">
        {children}
      </Box>
    </>
  );
};

export default GameCardContainer;

//----------------------------------------------
// App.tsx
import React from "react";
import { Grid, GridItem, Show, Text } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import GameGrid from "./components/GameGrid";
import GenreList from "./components/GenreList";

const App = () => {
  return (
    <Grid
      templateAreas={{
        // 2 scenarios.
        // 1st scenario, base with 1 col on small devices.
        // 2nd scenario, lg with 2 cols on large devices.
        base: `"nav" "main"`,
        lg: `"nav nav" "aside main"`,
      }}
      templateColumns={{
        // the 2 scenario applied.
        // base: col stretches and takes all the available space.
        // lg: first col takes 200px, 2nd col takes all the avaialbe space.
        // the problems still comes for the code section of <GridItem area="aside" paddingX={5}>.
        //  Reason: the Cards were of a fixed width 300px.
        // adding the aside 200px and all padding adding to about 1100px.
        // the content window is smaller like 1024.
        // Solution: so we remove the fixed width and let them stretch.
        // go to GameCardContainer.
        base: "1fr",
        lg: "200px 1fr",
      }}
    >
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <Show above="lg">
        {/* The genres are too close the edge. we can apply a horizontal padding.
        but if we later decide to add another aside component, we will
        need to remember the exact same padding for it to line up.  */}
        {/* Result: Game Grid cards stretces and takes the available space. */}
        <GridItem area="aside" paddingX={5}>
          <GenreList />
        </GridItem>
      </Show>
      <GameGrid />
    </Grid>
  );
};

export default App;

// --------------------------------------------------------
// GameGrid.tsx
import React, { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { SimpleGrid, Text } from "@chakra-ui/react";
import useGames from "../hooks/useGames";
import GameCards from "./GameCards";
import GameCardSkeleton from "./GameCardSkeleton";
import GameCardContainer from "./GameCardContainer";

const GameGrid = () => {
  const { data, error, isLoading } = useGames();
  const skeletons = [1, 2, 3, 4, 5, 6];

  return (
    <>
      {error && <Text>{error}</Text>}
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        // spacing={10}
        // Note 15: after alining the Cards size.
        spacing={3}
        padding="10px"
      >
        {isLoading &&
          skeletons.map((skeleton) => (
            <GameCardContainer>
              <GameCardSkeleton key={skeleton} />
            </GameCardContainer>
          ))}
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
