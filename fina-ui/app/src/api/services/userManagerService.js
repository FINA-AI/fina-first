import axiosInstance from "../axios";

const PREFIX = "/user";

export const changePasswordService = (passwordInfo) => {
  return axiosInstance.post(`${PREFIX}/password`, passwordInfo);
};

export const loadUsersAndGroups = (onlyExternals, excludeDeleted = true) => {
  return axiosInstance.get(`${PREFIX}/usersAndGroups`, {
    params: { onlyExternals, excludeDeleted },
  });
};

export const loadUserReports = (userId, filterValue) => {
  return axiosInstance.get(`${PREFIX}/reports/${userId}`, {
    params: {
      filterValue: filterValue,
    },
  });
};

export const loadUserEcm = (userId) => {
  return axiosInstance.get(`${PREFIX}/ecm/groups/${userId}`);
};

export const updateUserEcm = (data) => {
  return axiosInstance.post(`${PREFIX}/ecm/groups`, data);
};

export const loadUsers = (page, limit, columnFilter) => {
  return axiosInstance.get(`${PREFIX}/all`, {
    params: {
      page: page,
      limit: limit,
      ...columnFilter,
    },
  });
};

export const loadAllUsersSimple = () => {
  return axiosInstance.get(`${PREFIX}/all/simple`);
};

export const deleteUser = (userId) => {
  return axiosInstance.delete(`${PREFIX}/${userId}`);
};

export const deleteUsers = (userIds) => {
  return axiosInstance.delete(`${PREFIX}/delete/multi/`, {
    params: {
      userIds: userIds,
    },
  });
};
export const loadGroups = () => {
  return axiosInstance.get(`${PREFIX}/groups`);
};

export const loadGroupReports = (groupId, filterValue) => {
  return axiosInstance.get(`${PREFIX}/group/reports/${groupId}`, {
    params: {
      filterValue: filterValue,
    },
  });
};

export const loadGroupPermissions = (groupId) => {
  return axiosInstance.get(`${PREFIX}/group/permissions/${groupId}`);
};

export const loadUserGroups = (userId) => {
  return axiosInstance.get(`${PREFIX}/groups/${userId}`);
};

export const loadUser = (userId) => {
  return axiosInstance.get(`${PREFIX}/${userId}`);
};

export const loadUserPermissions = (userId) => {
  return axiosInstance.get(`${PREFIX}/permissions/${userId}`);
};

export const loadAllPermissions = () => {
  return axiosInstance.get(`${PREFIX}/permissions`);
};

export const updateUser = (userId, user, removeRelations) => {
  return axiosInstance.put(`${PREFIX}/${userId}`, user, {
    params: {
      removeUserRelations: removeRelations,
    },
  });
};

export const restoreDeletedUser = (userId) => {
  return axiosInstance.get(`${PREFIX}/activate/${userId}`);
};

export const getUserReturns = (userId) => {
  return axiosInstance.get(`${PREFIX}/returndefinitions/${userId}`);
};

export const getGroup = (groupId) => {
  return axiosInstance.get(`${PREFIX}/group/${groupId}`);
};

export const updateGroup = (groupId, data) => {
  return axiosInstance.put(`${PREFIX}/groups/${groupId}`, data);
};

export const getGroupUsers = (groupId, page, limit, filterAndSort) => {
  return axiosInstance.get(`${PREFIX}/group/users/${groupId}`, {
    params: {
      page,
      limit,
      ...filterAndSort,
    },
  });
};

export const getUserReturnVersions = (userId) => {
  return axiosInstance.get(`${PREFIX}/returnversions/${userId}`);
};

export const loadGroupReturnVersions = (groupId) => {
  return axiosInstance.get(`${PREFIX}/group/returnversions/${groupId}`);
};

export const getGroupReturnDefinitions = (groupId) => {
  return axiosInstance.get(`${PREFIX}/group/returns/${groupId}`);
};

export const loadUserMDT = (userId) => {
  return axiosInstance.get(`mdt/root/${userId}`);
};

export const loadGroupMDT = (groupId) => {
  return axiosInstance.get(`mdt/root/group/${groupId}`);
};

export const postGroup = (data) => {
  return axiosInstance.post(`${PREFIX}/groups`, data);
};

export const deleteGroupService = (groupId) => {
  return axiosInstance.delete(`${PREFIX}/groups/${groupId}`);
};

export const loadLdapUsers = () => {
  return axiosInstance.get(`${PREFIX}/ldap/loadAll`);
};

export const loadTranslations = () => {
  return axiosInstance.get(`${PREFIX}/translations`);
};

export const updateTranslation = (obj) => {
  return axiosInstance.post(`${PREFIX}/translate/permissions`, obj);
};

export const loadUserPermittedMatrixList = (userId) => {
  return axiosInstance.get(`${PREFIX}/matrix/${userId}`);
};

export const loadRolePermittedMatrixList = (groupId) => {
  return axiosInstance.get(`${PREFIX}/group/matrix/${groupId}`);
};

export const loadCurrentUserReturnVersions = () => {
  return axiosInstance.get(`${PREFIX}/current/rVersions`);
};

export const loadUserFis = (userId) => {
  return axiosInstance.get(`${PREFIX}/fi/tree/user/${userId}`);
};

export const loadGroupFis = (groupId) => {
  return axiosInstance.get(`${PREFIX}/fi/tree/group/${groupId}`);
};
