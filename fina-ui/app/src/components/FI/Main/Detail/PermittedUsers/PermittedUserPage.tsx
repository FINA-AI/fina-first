import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import PermissionUser from "./PermissionUser";
import ResponsibleUser from "./ResponsibleUser";
import React from "react";
import { styled } from "@mui/material/styles";
import {
  columnFilterConfigType,
  TreeGridColumnType,
} from "../../../../../types/common.type";
import { GroupAndUsersDataType } from "../../../../../types/fi.type";
import { UserAndGroup, UserType } from "../../../../../types/user.type";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  height: "100%",
  borderRadius: "8px",
  background: theme.palette.paperBackground,
}));

interface PermittedUserPageProps {
  groupAndUsers: GroupAndUsersDataType[];
  users: any[];
  permittedUsers: GroupAndUsersDataType[];
  setPermittedUsers: React.Dispatch<
    React.SetStateAction<GroupAndUsersDataType[]>
  >;
  columns: (isPermitted: boolean) => TreeGridColumnType[];
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  responsibleUsers: UserAndGroup[];
  setResponsibleUsers: React.Dispatch<React.SetStateAction<UserAndGroup[]>>;
  onCancelClick: () => void;
  onSaveClick: () => void;
  loading: boolean;
  groups: GroupAndUsersDataType[];
  checkedPermissionUsers: UserType[];
  setCheckedPermissionUsers: React.Dispatch<
    React.SetStateAction<GroupAndUsersDataType[]>
  >;
  columnFilterConfig: columnFilterConfigType[];
}

const PermittedUserPage: React.FC<PermittedUserPageProps> = ({
  groupAndUsers,
  users,
  permittedUsers,
  setPermittedUsers,
  columns,
  editMode,
  setEditMode,
  responsibleUsers,
  setResponsibleUsers,
  onCancelClick,
  onSaveClick,
  loading,
  groups,
  checkedPermissionUsers,
  setCheckedPermissionUsers,
  columnFilterConfig,
}) => {
  const onPermissionCheckboxChange = (data: string[]) => {
    const usersArrIds = data
      .filter((f) => f.includes("user"))
      .map((m) => Number(m.split("_")[1]));
    const usersArr = users
      .map((user) => (usersArrIds.includes(user.id) ? user : null))
      .filter((user): user is GroupAndUsersDataType => user !== null);

    const newCheckedPermissionUsers = usersArr.map((row) => ({
      ...row,
      leaf: true,
      level: 0,
    }));

    setCheckedPermissionUsers(newCheckedPermissionUsers);
    setResponsibleUsers([
      ...responsibleUsers.filter((user) =>
        newCheckedPermissionUsers.some(
          (checkedUser) => checkedUser.id === user.id
        )
      ),
    ]);

    const groupAndUserArr: GroupAndUsersDataType[] = [];

    for (const group of groups) {
      const children = usersArr.filter(
        (user) => (user as any).parentId === group.id
      );
      if (children.length > 0) {
        groupAndUserArr.push({
          ...group,
          children: children,
        });
      }
    }

    for (const user of usersArr) {
      if ((user as any).parentId === 0) {
        groupAndUserArr.push(user);
      }
    }

    setPermittedUsers([...groupAndUserArr] as GroupAndUsersDataType[]);
  };

  const onResponsibleCheckboxChange = (data: string[]) => {
    const usersArrIds = data
      .filter((f) => f.includes("user") && f.split("_").length === 2)
      .map((m) => Number(m.split("_")[1]));

    const usersArr = users.filter((user) => usersArrIds.includes(user.id));
    setResponsibleUsers([...usersArr]);
  };

  return (
    <StyledRoot>
      <Grid container height="100%">
        <Grid item xs={6} height="100%">
          <Box
            width="100%"
            height="100%"
            data-testid={"permitted-users-container"}
          >
            <PermissionUser
              data={groupAndUsers}
              permittedUsers={permittedUsers}
              columns={columns}
              columnFilterConfig={columnFilterConfig}
              editMode={editMode}
              onPermissionCheckboxChange={onPermissionCheckboxChange}
              loading={loading}
            />
          </Box>
        </Grid>
        <Grid item xs={6} height="100%">
          <Box
            width="100%"
            height="100%"
            data-testid={"responsible-users-container"}
          >
            <ResponsibleUser
              editMode={editMode}
              setEditMode={setEditMode}
              columns={columns}
              data={checkedPermissionUsers}
              onCancelClick={onCancelClick}
              onSaveClick={onSaveClick}
              onResponsibleCheckboxChange={onResponsibleCheckboxChange}
              responsibleUsers={responsibleUsers}
              loading={loading}
            />
          </Box>
        </Grid>
      </Grid>
    </StyledRoot>
  );
};

export default PermittedUserPage;
