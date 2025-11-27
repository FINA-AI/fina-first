import * as types from "../constants/fiBeneficiaryConstants";

export const changeFIBeneficiaryTypeLoadAction = (fiBeneficiaryType) => ({
  type: types.LOAD_FI_BENEFICIARY_TYPE,
  payload: fiBeneficiaryType,
});

export const changeFIBeneficiaryPagingLimitAction = (limit) => ({
  type: types.CHANGE_FI_BENEFICIARY_PAGING_LIMIT,
  payload: limit,
});

export const changeFIBeneficiaryPagingPageAction = (page) => ({
  type: types.CHANGE_FI_BENEFICIARY_PAGING_PAGE,
  payload: page,
});
