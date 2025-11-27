import React, { memo, useEffect, useRef, useState } from "react";
import UserPermissions from "../../../components/UserManagement/Users/Permissions/UserPermissions";
import {
  loadAllPermissions,
  loadUserPermissions,
} from "../../../api/services/userManagerService";
import { UserRouteName } from "../../../components/UserManagement/Users/Common/UserRoutes";
import {
  UserPermission,
  UserType,
  UserTypeWithUIProps,
} from "../../../types/user.type";

interface UserPermissionsContainerProps {
  currentUser: Partial<UserTypeWithUIProps>;
  editMode: boolean;
  tabName?: string;
  setUserData(object: Partial<UserType>): void;
}

const UserPermissionsContainer: React.FC<UserPermissionsContainerProps> = ({
  currentUser,
  editMode,
  setUserData,
}) => {
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [checkedPermissions, setCheckedPermissions] = useState<
    UserPermission[]
  >([]);
  const [loading, setLoading] = useState(true);
  let permissionIds = useRef<number[]>([]);

  useEffect(() => {
    init();
  }, [currentUser]);

  useEffect(() => {
    setCheckedPermissions([...userPermissions]);
    setPermissionIds(userPermissions);
  }, [editMode]);

  const init = async () => {
    setLoading(true);
    permissionIds.current = [];
    const resp = await loadPermissions();
    setPermissions(resp.data);
    if (currentUser.id) {
      loadUserPermissions(currentUser.id)
        .then((resp) => {
          const perms = resp.data;
          setUserPermissions(perms);
          setCheckedPermissions(perms);
          setPermissionIds(perms);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  const setPermissionIds = (perms: UserPermission[]) => {
    permissionIds.current = perms
      .filter((p) => p.permitted && !p.userRolePermission)
      .map((p) => p.id);
  };

  const loadPermissions = async () => {
    return loadAllPermissions();
  };

  const handleSelectAll = (e: any) => {
    const checked = e.target.checked;
    let checkedPermissions = [];
    checkedPermissions = permissions.map((p) => {
      p.permitted = checked;
      p.userRolePermission = isRolePermission(p);
      return p;
    });

    setPermissions(
      permissions.map((p) => {
        p.permitted = checked;
        p.userRolePermission = isRolePermission(p);
        return p;
      })
    );

    setCheckedPermissions(checkedPermissions);
    permissionIds.current = checkedPermissions
      .filter((p) => !p.userRolePermission && p.permitted)
      .map((p) => p.id);

    setUserCheckedPermissions(permissionIds.current);
  };

  const handleCheckChange = (row: UserPermission, checked: boolean) => {
    row.permitted = checked;
    if (checked) {
      permissionIds.current.push(row.id);
      setUserCheckedPermissions(permissionIds.current);
      checkedPermissions.push(row);
    } else {
      permissionIds.current = permissionIds.current.filter(
        (id) => id !== row.id
      );
      setUserCheckedPermissions(permissionIds.current);
      const index = checkedPermissions.findIndex((item) => item.id === row.id);
      checkedPermissions.splice(index, 1);
    }
  };

  const setUserCheckedPermissions = (permissionIds: number[]) => {
    setUserData({
      permissionIds: permissionIds,
    });
  };

  const isRolePermission = (row: UserPermission) => {
    const foundPermission = userPermissions.find((up) => up.id === row.id);
    return foundPermission ? foundPermission.userRolePermission : false;
  };

  const isRowChecked = (row: UserPermission) => {
    const permission = checkedPermissions.find((p) => p.id === row.id);
    const hasPermission = permission
      ? permission.permitted || permission.userRolePermission
      : false;
    return !!hasPermission;
  };

  return (
    <UserPermissions
      editMode={editMode}
      permissions={permissions}
      handleSelectAll={handleSelectAll}
      handleCheckChange={handleCheckChange}
      disabledFunction={isRolePermission}
      loading={loading}
      isRowChecked={isRowChecked}
    />
  );
};

export default memo(UserPermissionsContainer, (prevProps, nextProps) => {
  if (nextProps.tabName === UserRouteName.PERMISSIONS) {
    if (prevProps.currentUser.groupIds !== nextProps.currentUser.groupIds) {
      return false;
    }
    return (
      prevProps.currentUser.id === nextProps.currentUser.id &&
      prevProps.editMode === nextProps.editMode
    );
  }
  return true;
});
