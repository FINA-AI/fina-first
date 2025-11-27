import { NumOfRowsPerPage } from "../../util/appUtil";
import {
  CHANGE_EDIT_MODE,
  CHANGE_USER_FILTER,
  CHANGE_USER_PAGING_LIMIT,
  CHANGE_USER_PAGING_PAGE,
  UPDATE_USER,
} from "../constants/userConstants";

const initialState = {
  pagingPage: 1,
  pagingLimit: NumOfRowsPerPage.INITIAL_ROWS_PER_PAGE,
  filterValue: null,
  editMode: false,
  userFullName: "",
  userLogin: "",
  user: {},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE_USER_PAGING_LIMIT:
      return {
        ...state,
        pagingLimit: action.payload,
      };
    case CHANGE_USER_PAGING_PAGE:
      return {
        ...state,
        pagingPage: action.payload,
      };
    case CHANGE_USER_FILTER:
      return {
        ...state,
        filterValue: action.payload,
      };
    case CHANGE_EDIT_MODE:
      return {
        ...state,
        editMode: action.payload,
      };
    case UPDATE_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}
