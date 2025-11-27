import lightPalette from "../../api/palette/lightPalette";
import darkPalette from "../../api/palette/darkPalette";

export interface PalettePropsType {
  primary: {
    light: string;
    main: string;
    dark: string;
    contrastText: string;
  };
  secondary: {
    light: string;
    main: string;
    dark: string;
    contrastText: string;
  };
  select: string;
  lightColor: string;
  darkerLightColor: string;
  lightBackgroundColor: string;
  bodyBackgroundColor: string;
  defaultBackgroundColor: string;
  buttons: {
    primary: {
      backgroundColor?: string;
      hover?: string;
    };
    secondary: {
      backgroundColor: string;
      hover?: string;
    };
  };
}

export interface Palette {
  palette: PalettePropsType;
}

export type ThemePaletteColorType =
  | keyof typeof lightPalette
  | keyof typeof darkPalette;
