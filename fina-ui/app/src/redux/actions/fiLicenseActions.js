import * as types from "../constants/fiLicenseConstants";

export const changeFILicensePagingLimitAction = (limit) => ({
  type: types.CHANGE_FI_LICENSE_PAGING_LIMIT,
  payload: limit,
});

export const changeFILicensePagingPageAction = (page) => ({
  type: types.CHANGE_FI_LICENSE_PAGING_PAGE,
  payload: page,
});
