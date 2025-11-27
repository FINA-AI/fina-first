import * as types from "../constants/returnCreationScheduleConstants";

export const changeRCSPagingLimitAction = (limit) => ({
  type: types.CHANGE_RETURNCREATIONSCHEDULE_PAGING_LIMIT,
  payload: limit,
});

export const changeRCSPagingPageAction = (page) => ({
  type: types.CHANGE_RETURNCREATIONSCHEDULE_PAGING_PAGE,
  payload: page,
});
