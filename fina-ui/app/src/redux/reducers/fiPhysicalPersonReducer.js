import {
  CHANGE_FIPHYSYCALPERSON_FILTER,
  CHANGE_FIPHYSYCALPERSON_ITEM_FILTER,
  CHANGE_FIPHYSYCALPERSON_PAGING_LIMIT,
  CHANGE_FIPHYSYCALPERSON_PAGING_PAGE,
  IS_FI_MANAGEMENT_INFO_LOADING,
  IS_FI_MANAGEMENT_LOADING,
  IS_FI_PHYSICAL_PERSON_INFO_LOADING,
  IS_FI_PHYSICAL_PERSONS_LOADING,
  LOAD_FIPHYSYCALPERSON,
  IS_FI_PERSON_EDIT_CHANGED,
  IS_FI_PERSON_EDIT,
} from "../constants/fiPhysicalPersonConstants";

import { NumOfRowsPerPage } from "../../util/appUtil";
import { FORM_STATE } from "../../components/common/Detail/DetailForm";

const initialState = {
  physicalPerson: {},
  pagingPage: 1,
  pagingLimit: NumOfRowsPerPage.INITIAL_ROWS_PER_PAGE,
  filterValue: null,
  itemFilterValue: null,
  isFiPhysicalPersonsLoading: false,
  ifFiPhysicalPersonInfoLoading: false,
  isFiManagementLoading: false,
  isFiManagementInfoLoading: false,
  isEditValid: {
    education: true,
    share: true,
    main: true,
    position: true,
    criminalRecord: true,
    recommendation: true,
  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_FIPHYSYCALPERSON:
      return {
        ...state,
        physicalPerson: action.payload,
      };
    case CHANGE_FIPHYSYCALPERSON_PAGING_LIMIT:
      return {
        ...state,
        pagingLimit: action.payload,
      };
    case CHANGE_FIPHYSYCALPERSON_PAGING_PAGE:
      return {
        ...state,
        pagingPage: action.payload,
      };
    case CHANGE_FIPHYSYCALPERSON_FILTER:
      return {
        ...state,
        filterValue: action.payload,
      };
    case CHANGE_FIPHYSYCALPERSON_ITEM_FILTER:
      return {
        ...state,
        itemFilterValue: action.payload,
      };
    case IS_FI_PHYSICAL_PERSONS_LOADING:
      return {
        ...state,
        isFiPhysicalPersonsLoading: action.payload,
      };
    case IS_FI_PHYSICAL_PERSON_INFO_LOADING:
      return {
        ...state,
        ifFiPhysicalPersonInfoLoading: action.payload,
      };
    case IS_FI_MANAGEMENT_LOADING:
      return {
        ...state,
        isFiManagementLoading: action.payload,
      };
    case IS_FI_MANAGEMENT_INFO_LOADING:
      return {
        ...state,
        isFiManagementInfoLoading: action.payload,
      };
    case IS_FI_PERSON_EDIT_CHANGED:
      let editValidState = { ...state.isEditValid };
      if (action.payload.name === "main") {
        for (let key in editValidState) {
          if (key === action.payload.name) {
            editValidState[key] = true;
          } else {
            editValidState[key] = !action.payload.state;
          }
        }
      } else {
        for (let key in editValidState) {
          if (key === action.payload.name) {
            editValidState[key] = true;
          } else {
            editValidState[key] = action.payload.state === FORM_STATE.VIEW;
          }
        }
      }

      return {
        ...state,
        isEditValid: editValidState,
      };
    case IS_FI_PERSON_EDIT:
      return {
        ...state,
        isEditValid: action.payload,
      };
    default:
      return state;
  }
}
