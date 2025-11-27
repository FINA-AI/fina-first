import * as types from "../constants/fiConstants";

export const setFI = (fi) => ({
  type: types.SET_FI,
  payload: fi,
});

export const setFiLoading = (fiLoading) => ({
  type: types.IS_FI_INFO_LOADING,
  payload: fiLoading,
});
