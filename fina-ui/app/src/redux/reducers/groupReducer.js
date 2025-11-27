import { NumOfRowsPerPage } from "../../util/appUtil";
import {
  CHANGE_GROUP_FILTER,
  CHANGE_GROUP_PAGING_LIMIT,
  CHANGE_GROUP_PAGING_PAGE,
} from "../constants/groupConstants";

const initialState = {
  pagingPage: 1,
  pagingLimit: NumOfRowsPerPage.INITIAL_ROWS_PER_PAGE,
  filterValue: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE_GROUP_PAGING_LIMIT:
      return {
        ...state,
        pagingLimit: action.payload,
      };
    case CHANGE_GROUP_PAGING_PAGE:
      return {
        ...state,
        pagingPage: action.payload,
      };
    case CHANGE_GROUP_FILTER:
      return {
        ...state,
        filterValue: action.payload,
      };
    default:
      return state;
  }
}
