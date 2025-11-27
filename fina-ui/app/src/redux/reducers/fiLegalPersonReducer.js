import {
  CHANGE_FILEGALPERSON_FILTER,
  CHANGE_FILEGALPERSON_ITEM_FILTER,
  CHANGE_FILEGALPERSON_PAGING_LIMIT,
  CHANGE_FILEGALPERSON_PAGING_PAGE,
  IS_FI_LEGAL_PERSONS_LIST_LOADING,
  IS_FI_LEGAL_PERSONS_LOADING,
  LOAD_FILEGALPERSON,
} from "../constants/fiLegalPersonConstants";

import { NumOfRowsPerPage } from "../../util/appUtil";

const initialState = {
  fiLegalPerson: {},
  pagingPage: 1,
  pagingLimit: NumOfRowsPerPage.INITIAL_ROWS_PER_PAGE,
  filterValue: null,
  itemFilterValue: null,
  isFiLegalPersonsLoading: false,
  isFiLegalPersonsListLoading: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_FILEGALPERSON:
      return {
        ...state,
        fiLegalPerson: action.payload,
      };
    case CHANGE_FILEGALPERSON_PAGING_LIMIT:
      return {
        ...state,
        pagingLimit: action.payload,
      };
    case CHANGE_FILEGALPERSON_PAGING_PAGE:
      return {
        ...state,
        pagingPage: action.payload,
      };
    case CHANGE_FILEGALPERSON_FILTER:
      return {
        ...state,
        filterValue: action.payload,
      };
    case CHANGE_FILEGALPERSON_ITEM_FILTER:
      return {
        ...state,
        itemFilterValue: action.payload,
      };
    case IS_FI_LEGAL_PERSONS_LOADING:
      return {
        ...state,
        isFiLegalPersonsLoading: action.payload,
      };
    case IS_FI_LEGAL_PERSONS_LIST_LOADING:
      return {
        ...state,
        isFiLegalPersonsListLoading: action.payload,
      };
    default:
      return state;
  }
}
