// GIT: Customizing the theme to get darker grays
// USED: theme.ts

// Customizing the Chakra Theme.
// prefer to use the same greys used in the RAWG.IO instead of the Chakra's.

// RAWG API
// styled system --> theme --> default theme
/*
check gray color.
gray 50 - gray 900.
we dont want to replace one or 2 of the color,
want to replace the entire gray palate.

We use the tools such as Themera, Smart Swatch, Coolors or Palx (mentioned in doc).
using Smart Swatch.
search bar --> type color value: '#121212' this the bg color used in rawg.
it will give u a new color palate
which we can copy and paste in our VsCode.
*/

// Theme.ts

// search "Color Mode" in Chakra UI
// customizing the default theme that comes with Chakra
// imports below

import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// annotate 'config' to 'ThemeConfig'
// so we can access its properties.
const config: ThemeConfig = {
  initialColorMode: "dark",
};

const theme = extendTheme({
  config,
  // Note33: Adding new color palate via an colors object.
  colors: {
    // gray also an object
    gray: {
      50: "#f9f9f9",
      100: "#ededed",
      200: "#d3d3d3",
      300: "#b3b3b3",
      400: "#a0a0a0",
      500: "#898989",
      600: "#6c6c6c",
      700: "#202020",
      800: "#121212",
      900: "#111",
    },
    // we now get the same darker shade of gray as Rawg.
  },
});

export default theme;
