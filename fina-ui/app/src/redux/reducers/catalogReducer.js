import {
  CHANGE_CATALOG_ITEM_FILTER,
  CHANGE_CATALOG_FILTER,
  CHANGE_CATALOG_PAGING_LIMIT,
  CHANGE_CATALOG_PAGING_PAGE,
  LOAD_CATALOG,
} from "../constants/catalogConstants";

import { NumOfRowsPerPage } from "../../util/appUtil";

const initialState = {
  catalog: {},
  pagingPage: 1,
  pagingLimit: NumOfRowsPerPage.INITIAL_ROWS_PER_PAGE,
  filterValue: null,
  itemFilterValue: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_CATALOG:
      return {
        ...state,
        catalog: action.payload,
      };
    case CHANGE_CATALOG_PAGING_LIMIT:
      return {
        ...state,
        pagingLimit: action.payload,
      };
    case CHANGE_CATALOG_PAGING_PAGE:
      return {
        ...state,
        pagingPage: action.payload,
      };
    case CHANGE_CATALOG_FILTER:
      return {
        ...state,
        filterValue: action.payload,
      };
    case CHANGE_CATALOG_ITEM_FILTER:
      return {
        ...state,
        itemFilterValue: action.payload,
      };
    default:
      return state;
  }
}
