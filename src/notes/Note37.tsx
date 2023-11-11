// Clean up's.
// Services Folder: api-cliet.ts and image-url.ts

// api-cliet.ts
import axios from "axios";

// custom configuration.
export default axios.create({
  // grab the base url from documentation -> games category -> GET ...
  // https://api.rawg.io/api/games : just get the base. not 'games'.
  // /games will be added by the GameGrid.tsx.
  baseURL: "https://api.rawg.io/api",
  // this will be sent to every query string of our HTTP request.
  params: {
    key: "b519e0d0eec44a6da3b277ce7e6a86fd",
  },
});

// image-url.ts
import noImage from "../assets/no-image-placeholder.webp";

// function takes a url as a string
const getCroppedImageUrl = (url: string) => {
  // Note23: temporary fix to return empty string to handle null values
  // where some games dont have images.
  // if(!url) { return ''; }

  // Note24: since the place holder image is a static asset that we will deploy with
  // out applicaiton, we cannot use the paths.
  // if(!url) { return '../asset'; }
  // have to import our image like module.
  if (!url) {
    return noImage;
  }
  // Check Sort order by name to see the result.

  const target = "media/";
  // find the index or position of the "/media".
  // gives the start index of media/
  // added target.length to get the position after the media.
  const index = url.indexOf(target) + target.length;
  // index represents the beginning of the url till the
  // media param including that media.
  // url.slice(index) gets all the remaining characters.
  return url.slice(0, index) + "crop/600/400/" + url.slice(index);
};

export default getCroppedImageUrl;
