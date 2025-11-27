import * as types from "../constants/userFileSpaceConstants";

export const changeUserFileSpacePagingPageAction = (page) => ({
  type: types.CHANGE_USERFILESPACE_PAGING_PAGE,
  payload: page,
});

export const changeUserFileSpacePagingLimitAction = (limit) => ({
  type: types.CHANGE_USERFILESPACE_PAGING_LIMIT,
  payload: limit,
});
