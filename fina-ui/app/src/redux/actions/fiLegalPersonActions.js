import * as types from "../constants/fiLegalPersonConstants";

export const changefiLegalPersonLoadAction = (fiLEGALPerson) => ({
  type: types.LOAD_FILEGALPERSON,
  payload: fiLEGALPerson,
});

export const changefiLegalPersonPagingPageAction = (page) => ({
  type: types.CHANGE_FILEGALPERSON_PAGING_PAGE,
  payload: page,
});

export const changefiLegalPersonPagingLimitAction = (limit) => ({
  type: types.CHANGE_FILEGALPERSON_PAGING_LIMIT,
  payload: limit,
});

export const changefiLegalPersonFilter = (filterValue) => ({
  type: types.CHANGE_FILEGALPERSON_FILTER,
  payload: filterValue,
});

export const changefiLegalPersonItemFilter = (filterValue) => ({
  type: types.CHANGE_FILEGALPERSON_ITEM_FILTER,
  payload: filterValue,
});

export const setFILegalPersonLoadingAction = (loading) => ({
  type: types.IS_FI_LEGAL_PERSONS_LOADING,
  payload: loading,
});

export const setFILegalPersonsListLoadingAction = (loading) => ({
  type: types.IS_FI_LEGAL_PERSONS_LIST_LOADING,
  payload: loading,
});
