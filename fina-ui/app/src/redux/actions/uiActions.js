import * as types from "../constants/uiConstants";

export const changeThemeAction = (payload) => ({
  type: types.CHANGE_THEME,
  payload: { theme: payload.theme, user: payload.user },
});

export const changeModeAction = (payload) => ({
  type: types.CHANGE_MODE,
  payload: { mode: payload.mode, user: payload.user },
});

export const showThemeEditorAction = (isShow) => ({
  type: types.SHOW_THEME_EDITOR,
  isShow,
});
