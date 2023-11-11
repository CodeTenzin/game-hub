// GIT: Handle games with no image
// USED: image-url.ts

// to handle games without an image we will use a default place holder.
// download and put no-image place holder image in the asset folder.

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
