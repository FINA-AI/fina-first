import * as types from "../constants/userConstants";

export const changeUserPagingPageAction = (page) => ({
  type: types.CHANGE_USER_PAGING_PAGE,
  payload: page,
});

export const changeUserPagingLimitAction = (limit) => ({
  type: types.CHANGE_USER_PAGING_LIMIT,
  payload: limit,
});

export const changeUserFilter = (filterValue) => ({
  type: types.CHANGE_USER_FILTER,
  payload: filterValue,
});

export const changeEditMode = (value) => ({
  type: types.CHANGE_EDIT_MODE,
  payload: value,
});

export const updateUser = (user) => ({
  type: types.UPDATE_USER,
  payload: user,
});
