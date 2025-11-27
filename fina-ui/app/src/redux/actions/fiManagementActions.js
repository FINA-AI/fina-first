import * as types from "../constants/fiManagementConstants";

export const changeFIManagementTypeLoadAction = (fiManagementType) => ({
  type: types.LOAD_MANAGEMENTTYPE,
  payload: fiManagementType,
});

export const changeFIManagementLoadAction = (fiManagement) => ({
  type: types.LOAD_FIMANAGEMENT,
  payload: fiManagement,
});

export const changeFIManagementPagingPageAction = (page) => ({
  type: types.CHANGE_FIMANAGEMENT_PAGING_PAGE,
  payload: page,
});

export const changeFIManagementPagingLimitAction = (limit) => ({
  type: types.CHANGE_FIMANAGEMENT_PAGING_LIMIT,
  payload: limit,
});

export const changeFIManagementFilter = (filterValue) => ({
  type: types.CHANGE_FIMANAGEMENT_FILTER,
  payload: filterValue,
});

export const changeFIManagementItemFilter = (filterValue) => ({
  type: types.CHANGE_FIMANAGEMENT_ITEM_FILTER,
  payload: filterValue,
});
