import {
  OPEN_TABLE_CUSTOMIZATION,
  UPDATE_STATE,
} from "../constants/stateConstraints";
import {
  getStateFromLocalStorage,
  setStateToLocalStorage,
} from "../../api/ui/localStorageHelper";

const initialState = {
  ...getStateFromLocalStorage(),
  openedTableKey: "",
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_STATE:
      let { key, updatedState } = action.payload;
      setStateToLocalStorage(key, updatedState);
      return { ...state, [key]: updatedState };
    case OPEN_TABLE_CUSTOMIZATION:
      return { ...state, openedTableKey: action.payload };
    default:
      return state;
  }
}
