import * as types from "../constants/languageConstants";
import { getLanguages } from "../../api/services/languagesService";

export const setLanguages = (languages) => {
  return {
    type: types.SET_LANGUAGES,
    payload: languages,
  };
};

export const loadLanguages = async (dispatch) => {
  const languageResponse = await getLanguages();
  dispatch(setLanguages(languageResponse.data));
};
