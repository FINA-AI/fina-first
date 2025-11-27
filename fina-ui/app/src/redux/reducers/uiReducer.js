import { fromJS, List } from "immutable";
import {
  CHANGE_MODE,
  CHANGE_THEME,
  SHOW_THEME_EDITOR,
} from "../constants/uiConstants";
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "../../api/ui/localStorageHelper";

const initialState = {
  /* Settings for Themes and layout */
  theme: getLocalStorageValue("finaThemeColor", "blueTheme"),
  type: getLocalStorageValue("finaThemeType", "light"), // light or dark
  palette: List([
    { name: "Red", value: "redTheme" },
    { name: "Green", value: "greenTheme" },
    { name: "Blue", value: "blueTheme" },
    { name: "Pastel", value: "pastelTheme" },
    { name: "Orange", value: "orangeTheme" },
    { name: "Grey", value: "greyTheme" },
    { name: "Green Light", value: "lightGreenTheme" },
    { name: "Blue Light", value: "lightBlueTheme" },
    { name: "Brown", value: "brownTheme" },
  ]),
  pageLoaded: false,
  subMenuOpen: [],
  menuOpen: {},
  isThemeEditorVisible: false,
};

const initialImmutableState = fromJS(initialState);

export default function reducer(state = initialImmutableState, action = {}) {
  switch (action.type) {
    case CHANGE_THEME:
      return state.withMutations((mutableState) => {
        setLocalStorageValue("finaThemeColor", action.payload.theme);
        mutableState.set("theme", action.payload.theme);
      });
    case CHANGE_MODE:
      return state.withMutations((mutableState) => {
        setLocalStorageValue("finaThemeType", action.payload.mode);

        document.documentElement.style.setProperty(
          `--scrollbar-color-background`,
          action.payload.mode === "dark" ? "#2D3747" : "#f6f6f8"
        );
        document.documentElement.style.setProperty(
          `--scrollbar-color-thumb`,
          action.payload.mode === "dark" ? "#53B1FD" : "#2F80ED"
        );

        mutableState.set("type", action.payload.mode);
      });
    case SHOW_THEME_EDITOR:
      return state.withMutations((mutableState) => {
        mutableState.set("isThemeEditorVisible", action.isShow);
      });
    default:
      return state;
  }
}
