// GIT: Clean up the genres
// USED: GenreList.tsx

// Cleaning up the genres.
// improving on how the text is rendered.
// Eg: some larger genres on the side overlaps beind the icons.
// since buttons dont wrap the texts.

// Next issue is the aspect ratio of the images is distorted since,
// we are displaying 600 by 400 images in a 32 * 32 boxes.

// GenreList.tsx
import React from "react";
import userGenres, { Genre } from "../hooks/useGenres";
import useData from "../hooks/useData";
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
  const { data, isLoading, error } = useGenres();
  if (error) return null;
  if (isLoading) return <Spinner />;

  return (
    <>
      {/* Note29: adding heading on top of the Aside menu. */}
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
              {/* <Button
                onClick={() => {
                  onSelectGenre(genre);
                }}
                fontSize="lg"
                fontWeight={genre.id === selectedGenre?.id ? "bold" : "normal"}
                variant="link"
              > */}
              {/* Added whitespace="normal". nowrap is the default value. */}
              {/* Added  textAlign="left" since text was now aligned to center. */}
              {/* Next issue is the aspect ratio of the images is distorted since, 
              we are displaying 600 by 400 images in a 32 * 32 boxes. */}
              {/* so added objectFit="cover".  covers while preserving aspect ratio. */}
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
