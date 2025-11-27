import {
  CHANGE_FIMANAGEMENT_FILTER,
  CHANGE_FIMANAGEMENT_ITEM_FILTER,
  CHANGE_FIMANAGEMENT_PAGING_LIMIT,
  CHANGE_FIMANAGEMENT_PAGING_PAGE,
  LOAD_FIMANAGEMENT,
  LOAD_MANAGEMENTTYPE,
} from "../constants/fiManagementConstants";

import { NumOfRowsPerPage } from "../../util/appUtil";

const initialState = {
  fiManagementType: null,
  fiManagement: {},
  pagingPage: 1,
  pagingLimit: NumOfRowsPerPage.INITIAL_ROWS_PER_PAGE,
  filterValue: null,
  itemFilterValue: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_MANAGEMENTTYPE:
      return {
        ...state,
        fiManagementType: action.payload,
      };
    case LOAD_FIMANAGEMENT:
      return {
        ...state,
        fiManagement: action.payload,
      };
    case CHANGE_FIMANAGEMENT_PAGING_LIMIT:
      return {
        ...state,
        pagingLimit: action.payload,
      };
    case CHANGE_FIMANAGEMENT_PAGING_PAGE:
      return {
        ...state,
        pagingPage: action.payload,
      };
    case CHANGE_FIMANAGEMENT_FILTER:
      return {
        ...state,
        filterValue: action.payload,
      };
    case CHANGE_FIMANAGEMENT_ITEM_FILTER:
      return {
        ...state,
        itemFilterValue: action.payload,
      };
    default:
      return state;
  }
}
