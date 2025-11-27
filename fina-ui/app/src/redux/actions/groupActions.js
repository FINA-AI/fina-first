import * as types from "../constants/groupConstants";

export const changeGroupPagingPageAction = (page) => ({
  type: types.CHANGE_GROUP_PAGING_PAGE,
  payload: page,
});

export const changeGroupPagingLimitAction = (limit) => ({
  type: types.CHANGE_GROUP_PAGING_LIMIT,
  payload: limit,
});

export const changeGroupFilter = (filterValue) => ({
  type: types.CHANGE_GROUP_FILTER,
  payload: filterValue,
});
