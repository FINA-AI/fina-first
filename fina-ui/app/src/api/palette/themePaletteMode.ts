import lightPalette from "./lightPalette";
import darkPalette from "./darkPalette";
import { ThemePaletteColorType } from "../../styles/theme/palette.type";

const loadThemePalette = (color: ThemePaletteColorType, mode: string) => {
  if (mode === "dark") {
    return darkPalette[color];
  }
  return lightPalette[color];
};

export default loadThemePalette;
