// GIT: Highlight the selected genre
// Using App.tsx AND GenreList.tsx

// Highlight selected genre for UX.

//App.tsx
import React, { useState } from "react";
import { Grid, GridItem, Show, Text } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import GameGrid from "./components/GameGrid";
import GenreList from "./components/GenreList";
import { Genre } from "./hooks/useGenres";

const App = () => {
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

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
          {/* <GenreList onSelectGenre={(genre) => setSelectedGenre(genre)} /> */}
          {/* added new props. */}
          <GenreList
            selectedGenre={selectedGenre}
            onSelectGenre={(genre) => setSelectedGenre(genre)}
          />
        </GridItem>
      </Show>

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

interface Props {
  onSelectGenre: (genre: Genre) => void;
  // for highlightning selected genre
  selectedGenre: Genre | null;
}

// const GenreList = ({ onSelectGenre }: Props) => {
// below after setting selectedGenre in Props
const GenreList = ({ onSelectGenre, selectedGenre }: Props) => {
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
              {/* when rendering the button when selecting, we will render the font weight dynamically. */}
              <Button
                onClick={() => {
                  onSelectGenre(genre);
                }}
                fontSize="lg"
                // Added fontWeight
                // selectedGenre? since it can be null.
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
