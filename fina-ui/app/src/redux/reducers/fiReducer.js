import { SET_FI, IS_FI_INFO_LOADING } from "../constants/fiConstants";

const initialState = {
  fi: null,
  isFiInfoLoading: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_FI:
      return {
        ...state,
        fi: action.payload,
      };
    case IS_FI_INFO_LOADING:
      return {
        ...state,
        isFiInfoLoading: action.payload,
      };
    default:
      return state;
  }
}
