import * as types from "../constants/sidebarConstants";

export const setOpenSidebar = (isOpen) => {
  return {
    type: types.SET_OPEN_SIDEBAR,
    payload: isOpen,
  };
};
