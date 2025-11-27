import {
  CHANGE_FI_LICENSE_PAGING_LIMIT,
  CHANGE_FI_LICENSE_PAGING_PAGE,
} from "../constants/fiLicenseConstants";

import { NumOfRowsPerPage } from "../../util/appUtil";

const initialState = {
  pagingPage: 1,
  pagingLimit: NumOfRowsPerPage.INITIAL_ROWS_PER_PAGE,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE_FI_LICENSE_PAGING_LIMIT:
      return {
        ...state,
        pagingLimit: action.payload,
      };
    case CHANGE_FI_LICENSE_PAGING_PAGE:
      return {
        ...state,
        pagingPage: action.payload,
      };
    default:
      return state;
  }
}
