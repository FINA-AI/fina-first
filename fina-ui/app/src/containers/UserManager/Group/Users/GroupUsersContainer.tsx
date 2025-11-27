import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  getGroupUsers,
  loadUsers,
} from "../../../../api/services/userManagerService";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import GroupUsersPage from "./GroupUsersPage";
import { Box } from "@mui/system";
import UserIcon from "../../../../components/UserManagement/Users/Common/UserIcon";
import { GroupRouteName } from "../../../../components/UserManagement/Groups/Common/GroupRoutes";
import { Group } from "../../../../types/group.type";
import { UserType } from "../../../../types/user.type";
import { FilterType } from "../../../../types/common.type";

interface GroupUsersContainerProps {
  editMode: boolean;
  setGroupData: (object: Partial<Group>) => void;
  groupData: Partial<Group>;
  groupId: string;
  tabName?: string;
}

export enum ViewMode {
  GROUP_USERS,
  ALL_USERS,
}

const GroupUsersContainer: React.FC<GroupUsersContainerProps> = ({
  editMode,
  setGroupData,
  groupData,
  groupId,
}) => {
  const [users, setUsers] = useState([]);
  const [usersLen, setUsersLen] = useState(0);
  const [currentGroupUsersLen, setCurrentGroupUsersLen] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [usersInCurrentGroup, setUsersInCurrentGroup] = useState<UserType[]>(
    []
  );
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [loading, setLoading] = useState(true);
  const [filterAndSort, setFilterAndSort] = useState<FilterType>({});

  const [usersViewMode, setUsersViewMode] = useState(ViewMode.GROUP_USERS);

  const initialSelectionDone = useRef(false);

  useEffect(() => {
    const initialUsers = groupData?.users || usersInCurrentGroup;
    setPagingPage(1);
    setSelectedUsers([...initialUsers]);

    if (groupData) {
      setUsersInCurrentGroup([...initialUsers]);
    }

    setUsersViewMode(ViewMode.GROUP_USERS);
  }, [groupData, editMode]);

  useEffect(() => {
    setUsersInCurrentGroup([]);
    setSelectedUsers([]);
  }, [groupId]);

  useEffect(() => {
    if (usersViewMode === ViewMode.GROUP_USERS) {
      loadCurrentGroupUsers();
    } else {
      loadAllUsers();
    }
  }, [pagingLimit, pagingPage, groupId, filterAndSort, usersViewMode]);

  const headerColumns = [
    {
      field: "login",
      headerName: t("login"),
      minWidth: 160,
      renderCell: (value: string, row: UserType) => {
        return (
          <Box display={"flex"} width={"100%"} height={"100%"}>
            <UserIcon user={row} /> <Box paddingLeft={"10px"}>{value}</Box>
          </Box>
        );
      },
    },
    {
      field: "description",
      headerName: t("fullname"),
      minWidth: 204,
    },
    {
      field: "titleDescription",
      headerName: t("title"),
      minWidth: 204,
      hideSort: true,
    },
    {
      field: "contactPerson",
      headerName: t("contactPerson"),
      minWidth: 204,
      hideSort: true,
    },
    {
      field: "phone",
      headerName: t("phone"),
      minWidth: 204,
    },
  ];

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const loadCurrentGroupUsers = async () => {
    try {
      const resp = await getGroupUsers(
        groupId,
        pagingPage,
        pagingLimit,
        filterAndSort
      );
      const data = resp.data.list || [];
      setUsersInCurrentGroup([...data]);
      setCurrentGroupUsersLen(resp.data.totalResults);
      setLoading(false);

      if (!initialSelectionDone.current) {
        setSelectedUsers([...data]);
        initialSelectionDone.current = true;
      }
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  const loadAllUsers = async () => {
    setLoading(true);

    const { searchValue, ...rest } = filterAndSort || {};
    const filters = {
      ...rest,
      ...(searchValue && { login: searchValue }),
    };

    try {
      const resp = await loadUsers(pagingPage, pagingLimit, filters);
      const data = resp.data;
      if (data) {
        setUsers(data.list);
        setUsersLen(data.totalResults);
      }
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    } finally {
      setLoading(false);
    }
  };

  const changeGroupData = (checkedRows: UserType[]) => {
    setSelectedUsers(checkedRows);
    setGroupData({
      users: checkedRows,
    });
  };

  const orderRowByHeader = (cellName: string, arrowDirection: string) => {
    const sortDirection = arrowDirection === "up" ? "asc" : "desc";
    setFilterAndSort({
      ...filterAndSort,
      sortField: cellName,
      sortDirection: sortDirection,
    });
  };

  const onFilterClear = () => {
    setFilterAndSort({ ...filterAndSort, searchValue: null });
  };

  const onUsersViewModeChange = (viewMode: ViewMode) => {
    setUsersViewMode(viewMode);
    setPagingPage(1);
    setLoading(true);
  };

  const getData = useCallback(() => {
    if (editMode) {
      return usersViewMode === ViewMode.GROUP_USERS
        ? usersInCurrentGroup
        : users;
    } else {
      return usersInCurrentGroup;
    }
  }, [editMode, usersInCurrentGroup, users]);

  const getDataLength = useCallback(() => {
    if (editMode) {
      return usersViewMode === ViewMode.GROUP_USERS
        ? currentGroupUsersLen
        : usersLen;
    } else {
      return currentGroupUsersLen;
    }
  }, [editMode, usersInCurrentGroup, users]);

  return (
    <GroupUsersPage
      columns={headerColumns}
      data={getData()}
      dataLength={getDataLength()}
      pagingPage={pagingPage}
      pagingLimit={pagingLimit}
      setPagingPage={setPagingPage}
      onPagingLimitChange={onPagingLimitChange}
      editMode={editMode}
      selectedUsers={selectedUsers}
      changeGroupData={changeGroupData}
      loading={loading}
      orderRowByHeader={orderRowByHeader}
      setFilterAndSort={setFilterAndSort}
      searchValue={filterAndSort?.searchValue}
      onFilterClear={onFilterClear}
      usersViewMode={usersViewMode}
      onUsersViewModeChange={onUsersViewModeChange}
    />
  );
};

export default memo(GroupUsersContainer, (prevProps, nextProps) => {
  if (nextProps.tabName === GroupRouteName.USERS) {
    return (
      prevProps.groupData.id === nextProps.groupData.id &&
      prevProps.editMode === nextProps.editMode
    );
  }
  return true;
});
