export const findMenuRecursive = (subMenuItems, menuItemCode) => {
  if (menuItemCode.toLowerCase() === "dashboard") {
    return dashboardMenuItem();
  }
  if (subMenuItems) {
    for (var i = 0; i < subMenuItems.length; i++) {
      if (subMenuItems[i].code.toLowerCase() === menuItemCode.toLowerCase()) {
        return subMenuItems[i];
      }
      var found = findMenuRecursive(subMenuItems[i].children, menuItemCode);
      if (found) return found;
    }
  }
};

export const dashboardMenuItem = () => {
  return {
    code: "DASHBOARD",
    folder: false,
    label: "Dashboard",
  };
};
