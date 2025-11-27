import {SET_LANGUAGES } from "../constants/languageConstants";

const initialState = {
  languages: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LANGUAGES:
      return {
        ...state,
        languages: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
