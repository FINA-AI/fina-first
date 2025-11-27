import {
  OPEN_TABLE_CUSTOMIZATION,
  UPDATE_STATE,
} from "../constants/stateConstraints";

export const updateState = (state) => {
  return {
    type: UPDATE_STATE,
    payload: state,
  };
};

export const openTableCustomization = (state) => {
  return {
    type: OPEN_TABLE_CUSTOMIZATION,
    payload: state,
  };
};
