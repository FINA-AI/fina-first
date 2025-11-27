import UsersPage from "../../components/UserManagement/Users/UsersPage";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  changeEditMode,
  changeUserPagingLimitAction,
  changeUserPagingPageAction,
} from "../../redux/actions/userActions";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { Box } from "@mui/system";
import { useHistory } from "react-router-dom";
import {
  userBaseRoute,
  UserRouteName,
} from "../../components/UserManagement/Users/Common/UserRoutes";
import {
  deleteUser,
  deleteUsers,
  loadUsers,
} from "../../api/services/userManagerService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import UserIcon from "../../components/UserManagement/Users/Common/UserIcon";
import { BASE_REST_URL, FilterTypes, getLanguage } from "../../util/appUtil";
import { UserState, UserType } from "../../types/user.type";
import {
  columnFilterConfigType,
  FilterType,
  GridColumnType,
  UIEventType,
} from "../../types/common.type";

interface UserManagerContainerProps {
  setPagingPage: (page: number) => void;
  setPagingLimit?: (limit: number) => void;
  pagingPage?: number;
  pagingLimit?: number;
  filterValue?: string;
  setEditMode?: (editMode: boolean) => void;
  state?: any;
  currentUser?: UserState;
}

const UserManagerContainer: React.FC<UserManagerContainerProps> = ({
  setPagingPage,
  setPagingLimit,
  pagingPage,
  pagingLimit,
  setEditMode,
  state,
  currentUser,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const { openErrorWindow } = useErrorWindow();

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLength, setUsersLength] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [sortObject, setSortObject] = useState({});
  const [filterObject, setFilterObject] = useState<FilterType>({
    sortField: "login",
    sortDirection: "asc",
  });

  const columnFilterConfig: columnFilterConfigType[] = [
    {
      field: "login",
      type: FilterTypes.string,
      name: "login",
      value: filterObject?.login,
    },
    {
      field: "description",
      type: FilterTypes.string,
      name: "name",
      value: filterObject?.name,
    },
    {
      field: "titleDescription",
      type: FilterTypes.string,
      name: "title",
      value: filterObject?.title,
    },
    {
      field: "contactPerson",
      type: FilterTypes.string,
      name: "contactPerson",
      value: filterObject?.contactPerson,
    },
    {
      field: "phone",
      type: FilterTypes.string,
      name: "phone",
      value: filterObject?.phone,
    },
    {
      field: "email",
      type: FilterTypes.string,
      name: "mail",
      value: filterObject?.mail,
    },
  ];

  const columnHeader: GridColumnType[] = [
    {
      field: "login",
      headerName: t("login"),
      flex: 1,
      renderCell: (row: UserType, user: UserType) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            <UserIcon user={user} /> <>{row}</>
          </Box>
        );
      },
      filter: columnFilterConfig.find((item) => item.field === "login"),
    },
    {
      field: "description",
      headerName: t("managementFielddescription"),
      flex: 1,
      filter: columnFilterConfig.find((item) => item.field === "description"),
    },
    {
      field: "titleDescription",
      headerName: t("title"),
      hideSort: true,
      flex: 1,
      filter: columnFilterConfig.find(
        (item) => item.field === "titleDescription"
      ),
    },
    {
      field: "contactPerson",
      headerName: t("contactPerson"),
      hideSort: true,
      flex: 1,
      filter: columnFilterConfig.find((item) => item.field === "contactPerson"),
    },
    {
      field: "phone",
      headerName: t("phone"),
      flex: 1,
      filter: columnFilterConfig.find((item) => item.field === "phone"),
    },
    {
      field: "email",
      headerName: t("email"),
      flex: 1,
      filter: columnFilterConfig.find((item) => item.field === "email"),
    },
  ];

  const [columns, setColumns] = useState<GridColumnType[]>();

  useEffect(() => {
    if (state && state.columns.length !== 0) {
      let newCols: GridColumnType[] = [];
      for (let item of state.columns) {
        let headerCell = columnHeader.find((el) => item.field === el.field);
        if (headerCell) {
          headerCell.hidden = item.hidden;
          headerCell.fixed = item.fixed;
          newCols.push(headerCell);
        }
      }
      setColumns(newCols);
    } else {
      setColumns(columnHeader);
    }
  }, [t, state]);

  useEffect(() => {
    if (pagingLimit) {
      initUsers(filterObject);
    }
  }, [pagingLimit, pagingPage, sortObject]);

  useEffect(() => {
    setEditMode?.(false);
  }, []);

  useEffect(() => {
    if (currentUser?.user) {
      let updatedUsers = [];
      if (currentUser?.user.deleted) {
        updatedUsers = users.filter((user) => user.id !== currentUser.user.id);
      } else {
        updatedUsers = users.map((user) =>
          user.id === currentUser.user.id ? currentUser.user : user
        );
      }
      setUsers(updatedUsers);
      setColumns(columnHeader);
    }
  }, [currentUser]);

  const filterChangeFunc = (obj: FilterType) => {
    let result: any = {};
    let currFilters = obj.filter((f: Record<string, any>) => Boolean(f.value));
    for (let item of currFilters) {
      if (typeof item.value === "object") {
        result[item.name] = item.value.id;
      } else {
        result[item.name] = item.value;
      }
    }
    setFilterObject(result);
    if (pagingPage && pagingPage > 1) {
      setPagingPage?.(1);
    } else {
      initUsers(result);
    }
  };

  const initUsers = (columnFilter?: FilterType) => {
    setLoading(true);
    loadUsers(
      pagingPage,
      pagingLimit,
      columnFilter
        ? { ...columnFilter, ...sortObject }
        : { ...filterObject, ...sortObject }
    )
      .then((res) => {
        const data = res.data;
        if (data) {
          setUsersLength(data.totalResults);
          setUsers(data.list);
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage?.(1);
    setPagingLimit?.(limit);
  };

  const deleteUserFunction = (userId: number) => {
    setLoading(true);
    deleteUser(userId)
      .then(() => {
        setUsers(users.filter((userItem) => userItem.id !== userId));
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteUsersFunction = (userIds: number[]) => {
    setLoading(true);

    deleteUsers(userIds)
      .then(() => {
        enqueueSnackbar(t("deleted"), { variant: "success" });
        initUsers();
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), false);
      })
      .finally(() => setLoading(false));
    setSelectedUsers([]);
  };

  const orderRowByHeader = (cellName: string, arrowDirection: string) => {
    let fieldName = cellName === "code" ? "id" : cellName;
    let sortDirection = arrowDirection === "up" ? "asc" : "desc";
    setSortObject({
      sortField: fieldName,
      sortDirection: sortDirection,
    });
  };

  const rowOnClick = (row: UserType) => {
    history.push(`${userBaseRoute}/${row.id}/${UserRouteName.GENERAL}`);
  };

  const onRowEditClick = (row: UserType) => {
    history.push(`${userBaseRoute}/${row.id}/${UserRouteName.GENERAL}`);
    setEditMode?.(true);
  };

  const addNewUser = () => {
    history.push(`${userBaseRoute}/${0}/${UserRouteName.GENERAL}`);
  };

  const usersExportHandler = (event: UIEventType) => {
    event.stopPropagation();

    const locale = getLanguage();
    window.open(
      BASE_REST_URL + `/user/export/users?langCode=${locale}`,
      "_blank"
    );
  };

  return (
    <UsersPage
      loading={loading}
      users={users}
      usersLength={usersLength}
      onPagingLimitChange={onPagingLimitChange}
      pagingLimit={pagingLimit}
      pagingPage={pagingPage}
      setPagingPage={setPagingPage}
      columns={columns}
      setColumns={setColumns}
      columnFilterConfig={columnFilterConfig}
      deleteUserFunction={deleteUserFunction}
      deleteUsersFunction={deleteUsersFunction}
      selectedUsers={selectedUsers}
      setSelectedUsers={setSelectedUsers}
      rowOnClick={rowOnClick}
      addNewUser={addNewUser}
      onRowEditClick={onRowEditClick}
      filterChangeFunc={filterChangeFunc}
      orderRowByHeader={orderRowByHeader}
      usersExportHandler={usersExportHandler}
    />
  );
};

const mapStateToProps = (state: any) => ({
  pagingPage: state.get("user").pagingPage,
  pagingLimit: state.get("user").pagingLimit,
  state: state.getIn(["state", "userManagementTableCustomization"]),
  currentUser: state.get("user"),
});

const dispatchToProps = (dispatch: any) => ({
  setPagingPage: bindActionCreators(changeUserPagingPageAction, dispatch),
  setPagingLimit: bindActionCreators(changeUserPagingLimitAction, dispatch),
  setEditMode: bindActionCreators(changeEditMode, dispatch),
});

export default connect(
  mapStateToProps,
  dispatchToProps
)(memo(UserManagerContainer));
