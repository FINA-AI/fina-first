import {
  LOAD_FI_BENEFICIARY_TYPE,
  CHANGE_FI_BENEFICIARY_PAGING_LIMIT,
  CHANGE_FI_BENEFICIARY_PAGING_PAGE,
} from "../constants/fiBeneficiaryConstants";

import { NumOfRowsPerPage } from "../../util/appUtil";

const initialState = {
  fiBeneficiaryType: {},
  pagingPage: 1,
  pagingLimit: NumOfRowsPerPage.INITIAL_ROWS_PER_PAGE,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_FI_BENEFICIARY_TYPE:
      return {
        ...state,
        fiBeneficiaryType: action.payload,
      };
    case CHANGE_FI_BENEFICIARY_PAGING_LIMIT:
      return {
        ...state,
        pagingLimit: action.payload,
      };
    case CHANGE_FI_BENEFICIARY_PAGING_PAGE:
      return {
        ...state,
        pagingPage: action.payload,
      };
    default:
      return state;
  }
}
