import * as types from "../constants/fiPhysicalPersonConstants";

export const changefiPhysicalPersonLoadAction = (fiPhysicalPerson) => ({
  type: types.LOAD_FIPHYSYCALPERSON,
  payload: fiPhysicalPerson,
});

export const changefiPhysicalPersonPagingPageAction = (page) => ({
  type: types.CHANGE_FIPHYSYCALPERSON_PAGING_PAGE,
  payload: page,
});

export const changefiPhysicalPersonPagingLimitAction = (limit) => ({
  type: types.CHANGE_FIPHYSYCALPERSON_PAGING_LIMIT,
  payload: limit,
});

export const changefiPhysicalPersonFilter = (filterValue) => ({
  type: types.CHANGE_FIPHYSYCALPERSON_FILTER,
  payload: filterValue,
});

export const changefiPhysicalPersonItemFilter = (filterValue) => ({
  type: types.CHANGE_FIPHYSYCALPERSON_ITEM_FILTER,
  payload: filterValue,
});

export const setFiPersonsLoadingAction = (loading) => ({
  type: types.IS_FI_PHYSICAL_PERSONS_LOADING,
  payload: loading,
});

export const setFiPersonInfoLoadingAction = (loading) => ({
  type: types.IS_FI_PHYSICAL_PERSON_INFO_LOADING,
  payload: loading,
});

export const setFiManagementLoadingAction = (loading) => ({
  type: types.IS_FI_MANAGEMENT_LOADING,
  payload: loading,
});

export const setFiManagementInfoLoadingAction = (loading) => ({
  type: types.IS_FI_MANAGEMENT_INFO_LOADING,
  payload: loading,
});

export const setFiPersonEditChanged = (state, name) => ({
  type: types.IS_FI_PERSON_EDIT_CHANGED,
  payload: { state, name },
});

export const setFiPersonEdit = (state) => ({
  type: types.IS_FI_PERSON_EDIT,
  payload: state,
});
