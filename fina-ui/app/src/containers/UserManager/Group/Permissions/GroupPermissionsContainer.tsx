import React, { memo, useEffect, useRef, useState } from "react";
import UserPermissions from "../../../../components/UserManagement/Users/Permissions/UserPermissions";
import {
  loadAllPermissions,
  loadGroupPermissions,
} from "../../../../api/services/userManagerService";
import { GroupRouteName } from "../../../../components/UserManagement/Groups/Common/GroupRoutes";
import { Group, GroupPermission } from "../../../../types/group.type";

interface GroupPermissionsContainerProps {
  editMode: boolean;
  setGroupData: (object: Partial<Group>) => void;
  groupData: Partial<Group>;
  groupId: string;
  tabName?: string;
}

const GroupPermissionsContainer: React.FC<GroupPermissionsContainerProps> = ({
  editMode,
  groupData,
  setGroupData,
  groupId,
}) => {
  const [permissions, setPermissions] = useState<GroupPermission[]>([]);
  const [groupPermissions, setGroupPermissions] = useState<GroupPermission[]>(
    []
  );
  const [checkedPermissions, setCheckedPermissions] = useState<
    GroupPermission[]
  >([]);
  const [loading, setLoading] = useState(true);
  let permissionIds = useRef<number[]>([]);

  useEffect(() => {
    init();
  }, [groupData]);

  useEffect(() => {
    setCheckedPermissions([...groupPermissions]);
    setPermissionIds(groupPermissions);
  }, [editMode]);

  const init = async () => {
    setLoading(true);
    permissionIds.current = [];
    const resp = await loadPermissions();
    setPermissions(resp.data);
    if (Number(groupId) != 0) {
      loadGroupPermissions(groupData.id)
        .then((resp) => {
          const perms: GroupPermission[] = resp.data;
          setGroupPermissions(perms);
          setCheckedPermissions(perms);
          setPermissionIds(perms);
          setGroupCheckedPermissions(perms.map((p) => p.id));
        })
        .finally(() => {
          setLoading(false);
        });
    }
    setLoading(false);
  };

  const setPermissionIds = (perms: GroupPermission[]) => {
    permissionIds.current = perms.map((p) => p.id);
  };

  const loadPermissions = async () => {
    return loadAllPermissions();
  };

  const handleSelectAll = (e: any) => {
    const checked = e.target.checked;
    let checkedPermissions = [];
    checkedPermissions = permissions.map((p) => {
      p.permitted = checked;
      return p;
    });

    setPermissions(
      permissions.map((p) => {
        p.permitted = checked;
        return p;
      })
    );

    setCheckedPermissions(checkedPermissions);
    permissionIds.current = checkedPermissions
      .filter((p) => p.permitted)
      .map((p) => p.id);

    setGroupCheckedPermissions(permissionIds.current);
  };

  const handleCheckChange = (row: GroupPermission, checked: boolean) => {
    row.permitted = checked;
    if (checked) {
      permissionIds.current.push(row.id);
      setGroupCheckedPermissions(permissionIds.current);
      checkedPermissions.push(row);
    } else {
      permissionIds.current = permissionIds.current.filter(
        (id) => id !== row.id
      );
      setGroupCheckedPermissions(permissionIds.current);
      const index = checkedPermissions.findIndex((item) => item.id === row.id);
      checkedPermissions.splice(index, 1);
    }
  };

  const setGroupCheckedPermissions = (permissionIds: number[]) => {
    setGroupData({
      permissionIds: [...permissionIds],
    });
  };

  const isRolePermission = (row: GroupPermission) => {
    return !!groupPermissions.find((up) => up.id === row.id)
      ?.userRolePermission;
  };

  const isRowChecked = (row: GroupPermission) => {
    const permission = checkedPermissions.find((p) => p.id === row.id);
    const hasPermission = permission ? permission.permitted : false;
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

export default memo(GroupPermissionsContainer, (prevProps, nextProps) => {
  if (nextProps.tabName === GroupRouteName.PERMISSIONS) {
    return (
      prevProps.groupData?.id === nextProps.groupData?.id &&
      prevProps.editMode === nextProps.editMode
    );
  }
  return true;
});
