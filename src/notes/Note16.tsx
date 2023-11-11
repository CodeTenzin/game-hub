// GIT: Show a spinner while fetching the genres

// Using: GenreList.tsx

// Adding a circle spinner for the genre, like the skeletons.

import React from "react";
import userGenres, { Genre } from "../hooks/useGenres";
import useData from "../hooks/useData";
import useGenres from "../hooks/useGenres";
import { HStack, Image, List, ListItem, Spinner, Text } from "@chakra-ui/react";
import getCroppedImageUrl from "../services/image-url";

const GenreList = () => {
  // const { data } = useGenres();
  // Note: 16 for the genre spinner
  const { data, isLoading, error } = useGenres();
  // if theres an error, nothing will display.
  // simulate an error, go to useGenre hook and '/genreABCDEF'
  if (error) return null;
  // Spinner from Chakra
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
