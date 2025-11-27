import PermittedUserPage from "../../../../components/FI/Main/Detail/PermittedUsers/PermittedUserPage";
import React, { useEffect, useState } from "react";
import { loadUsersAndGroups } from "../../../../api/services/userManagerService";
import {
  loadPermittedUsers,
  loadResponsibleUsers,
  updateFiPermittedUsers,
} from "../../../../api/services/fi/fiService";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FilterTypes } from "../../../../util/appUtil";
import useConfig from "../../../../hoc/config/useConfig";
import { useHistory } from "react-router-dom";
import { FiDataType, GroupAndUsersDataType } from "../../../../types/fi.type";
import { UserAndGroup, UserType } from "../../../../types/user.type";
import { ConfigType, TreeGridColumnType } from "../../../../types/common.type";
import PermittedUserIcon from "../../../../components/FI/Main/Detail/PermittedUsers/PermittedUserIcon";

interface PermittedUserContainerProps {
  fi: FiDataType;
  fiId: number;
  clearFiSubLink: () => void;
}

const PermittedUserContainer: React.FC<PermittedUserContainerProps> = ({
  fi,
  fiId,
  clearFiSubLink,
}) => {
  const {
    config,
  }: {
    config: ConfigType;
  } = useConfig();
  const history = useHistory();
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const [groups, setGroups] = useState<GroupAndUsersDataType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [groupAndUsers, setGroupAndUsers] = useState<GroupAndUsersDataType[]>(
    []
  );
  const [permittedUsers, setPermittedUsers] = useState<GroupAndUsersDataType[]>(
    []
  );
  const [permittedUsersOriginalData, setPermittedUsersOriginalData] = useState<
    GroupAndUsersDataType[]
  >([]);
  const [responsibleUsers, setResponsibleUsers] = useState<UserAndGroup[]>([]);
  const [responsibleUsersOriginalData, setResponsibleUsersOriginalData] =
    useState<UserAndGroup[]>([]);
  const [checkedPermissionUsers, setCheckedPermissionUsers] = useState<any[]>(
    []
  );
  const [
    checkedPermissionUsersOriginalData,
    setCheckedPermissionUsersOriginalData,
  ] = useState<UserType[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const theme: any = useTheme();

  const headerColumns = (isPerrmited: boolean): TreeGridColumnType[] => {
    let columns: TreeGridColumnType[] = [
      {
        dataIndex: "login",
        title: t("login"),
        flex: 1,
        renderer: (value: string, row: GroupAndUsersDataType) => {
          return <PermittedUserIcon row={row} isPerrmited={isPerrmited} />;
        },
        filter: columnFilterConfig.find((item) => item.dataIndex === "login"),
      },
      {
        dataIndex: "description",
        title: t("name"),
        flex: 1,
        renderer: (value: string, row: GroupAndUsersDataType) => {
          return (
            <Typography
              lineHeight={20}
              fontSize={12}
              color={
                isPerrmited && row.opened
                  ? theme.palette.primary.main
                  : theme.palette.textColor
              }
              fontWeight={400}
              data-testid={"description-label"}
            >
              {row.description}
            </Typography>
          );
        },
        filter: columnFilterConfig.find(
          (item) => item.dataIndex === "description"
        ),
      },
    ];
    if (isPerrmited) {
      columns.push({
        dataIndex: "users",
        title: t("users"),
        width: 150,
        renderer: (value: any, row: GroupAndUsersDataType) => {
          return (
            <>
              {row.group && (
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  border={
                    row.opened
                      ? `1px solid ${theme.palette.primary.main}`
                      : theme.palette.borderColor
                  }
                  borderRadius={"45px"}
                  style={{
                    background:
                      theme.palette.mode === "light" ? "inherit" : "#344258",
                  }}
                  padding={"3px 12px"}
                  width={"fit-content"}
                  color={
                    row.opened
                      ? theme.palette.primary.main
                      : theme.palette.textColor
                  }
                  data-testid={"users-amount-label"}
                >
                  {`${row?.children?.length} ${t("users")}`}
                </Box>
              )}
            </>
          );
        },
      });
    }

    return columns;
  };

  const columnFilterConfig = [
    {
      dataIndex: "login",
      type: FilterTypes.string,
      name: "login",
    },
    {
      dataIndex: "description",
      type: FilterTypes.string,
      name: "description",
    },
  ];

  const initLoad = () => {
    loadUsersFunction();
  };

  const loadUsersFunction = () => {
    setLoading(true);
    loadUsersAndGroups()
      .then((res) => {
        const data: GroupAndUsersDataType[] = res.data;
        if (data) {
          let groupsArray = [...data.filter((group) => group.group)];
          setGroups(groupsArray);
          let arr = data
            .filter((f) => (f.group && (f.users?.length ?? 0) > 0) || !f.group)
            .map((item) => {
              if (item.group) {
                let children: GroupAndUsersDataType[] = (item.users ?? []).map(
                  (child) => ({
                    ...child,
                    code: (child as any).code ?? child.login ?? "",
                    group: false,
                    level: 1,
                    leaf: true,
                    parentId: item.id,
                  })
                );

                return {
                  ...item,
                  children: children,
                  parentId: 0,
                  leaf: children.length === 0,
                  level: 0,
                };
              } else {
                return { ...item, parentId: 0, leaf: true, level: 0 };
              }
            });
          loadPermittedUsersFunction([...arr]);
          setGroupAndUsers(arr);
          let usersArr: any[] = [];

          for (let item of arr) {
            if (item.group) {
              let children = item.children;
              usersArr = usersArr.concat(children);
            } else {
              usersArr.push(item);
            }
          }
          setUsers(usersArr);
        }
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  };

  const loadPermittedUsersFunction = (
    groupAndUsersArray: GroupAndUsersDataType[]
  ) => {
    loadPermittedUsers(fiId)
      .then((res) => {
        let data: UserType[] = res.data;
        if (data) {
          let checkedPermittedUserData = [
            ...data.map((row) => {
              return { ...row, leaf: true, level: 0 };
            }),
          ];
          setCheckedPermissionUsers([...checkedPermittedUserData]);
          setCheckedPermissionUsersOriginalData([...checkedPermittedUserData]);

          let resIds = [...data.map((r) => r.id)];
          let groups = [...groupAndUsersArray.filter((group) => group.group)];

          let usersArray = [
            ...groupAndUsersArray.filter(
              (f) => !f.group && resIds.includes(f.id)
            ),
          ];

          let groupArray = [];
          for (let group of groups) {
            const foundGroup = groupAndUsersArray.find(
              (f) => f.group && f.id === group.id && f.children
            );
            const childrenIds = foundGroup?.children ?? [];
            groupArray.push({
              ...group,
              children: childrenIds.filter((f) => resIds.includes(f.id)),
            });
          }
          groupArray = groupArray.filter(
            (group) => group.children.length !== 0
          );
          let result = [...groupArray, ...usersArray];

          setPermittedUsersOriginalData([...result]);
          setPermittedUsers([...result]);
          loadResponsibleUsersInit();
        }
      })
      .catch((error) => openErrorWindow(error, t("error"), true));
  };

  const loadResponsibleUsersInit = () => {
    loadResponsibleUsers(fiId)
      .then((res) => {
        let data = res.data;
        if (data) {
          setResponsibleUsers([...data]);
          setResponsibleUsersOriginalData([...data]);
        }
      })
      .catch((error) => openErrorWindow(error, t("error"), true))
      .finally(() => {
        setLoading(false);
      });
  };

  const onCancelClick = () => {
    setPermittedUsers([...permittedUsersOriginalData]);
    setResponsibleUsers([...responsibleUsersOriginalData]);
    setCheckedPermissionUsers([...checkedPermissionUsersOriginalData]);
  };

  const onSaveClick = () => {
    let data = { ...fi };

    data.permittedUserIds = checkedPermissionUsers.map((row) => row.id);
    data.userLoginModels = [
      ...responsibleUsers.map((user) => (user.login ? user.login : user.code)),
    ];
    updateFiPermittedUsers(data)
      .then(() => {
        setPermittedUsersOriginalData([...permittedUsers]);
        setResponsibleUsersOriginalData([...responsibleUsers]);
        setCheckedPermissionUsersOriginalData([...checkedPermissionUsers]);
        enqueueSnackbar(t("saved"), { variant: "success" });
        checkUserPermissionAndRedirect();
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setEditMode(false);
      });
  };

  const checkUserPermissionAndRedirect = () => {
    if (
      !checkedPermissionUsers.some((u) => {
        const user = u.login || u.code;
        return user === config.user;
      })
    ) {
      history.push("/fi?reload=true");
      clearFiSubLink();
    }
  };

  useEffect(() => {
    initLoad();
  }, [fiId]);

  return (
    <PermittedUserPage
      groupAndUsers={groupAndUsers}
      users={users}
      setPermittedUsers={setPermittedUsers}
      permittedUsers={permittedUsers}
      columns={headerColumns}
      columnFilterConfig={columnFilterConfig}
      editMode={editMode}
      setEditMode={setEditMode}
      responsibleUsers={responsibleUsers}
      setResponsibleUsers={setResponsibleUsers}
      onCancelClick={onCancelClick}
      onSaveClick={onSaveClick}
      loading={loading}
      groups={groups}
      checkedPermissionUsers={checkedPermissionUsers}
      setCheckedPermissionUsers={setCheckedPermissionUsers}
    />
  );
};

const reducer = "fi";

const mapStateToProps = (state: any) => ({
  fi: state.getIn([reducer, "fi"]),
});
const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PermittedUserContainer);
