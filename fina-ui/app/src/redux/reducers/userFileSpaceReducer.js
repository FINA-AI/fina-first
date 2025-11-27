import {
  CHANGE_USERFILESPACE_PAGING_PAGE,
  CHANGE_USERFILESPACE_PAGING_LIMIT,
} from "../constants/userFileSpaceConstants";

import { NumOfRowsPerPage } from "../../util/appUtil";

const initialState = {
  pagingPage: 1,
  pagingLimit: NumOfRowsPerPage.INITIAL_ROWS_PER_PAGE,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE_USERFILESPACE_PAGING_LIMIT:
      return {
        ...state,
        pagingLimit: action.payload,
      };
    case CHANGE_USERFILESPACE_PAGING_PAGE:
      return {
        ...state,
        pagingPage: action.payload,
      };

    default:
      return state;
  }
}
