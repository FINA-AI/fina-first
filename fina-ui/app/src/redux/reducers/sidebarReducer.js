import { SET_OPEN_SIDEBAR } from "../constants/sidebarConstants";
import {
  getLocalStorageValueBoolean,
  setLocalStorageValue,
} from "../../api/ui/localStorageHelper";

const key = "sideBarOpened";

const initialState = {
  isOpen: getLocalStorageValueBoolean(key, false),
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_OPEN_SIDEBAR:
      setLocalStorageValue(key, action.payload);
      return {
        ...state,
        isOpen: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
