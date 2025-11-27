import UsersList from "../../components/UserManagement/Users/UsersList";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  changeUserFilter,
  changeUserPagingPageAction,
} from "../../redux/actions/userActions";
import { loadUsers } from "../../api/services/userManagerService";
import React, { useEffect, useState } from "react";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { UserType } from "../../types/user.type";
import { FilterType } from "../../types/common.type";

interface UsersListContainerProps {
  setPagingPage: (page: number) => void;
  pagingPage: number;
  pagingLimit: number;
  currUser: UserType;
  setCurrUser: (user: UserType) => void;
  userLogin: string;
  userFullName: string;
  onUserSelectChange: (user: UserType) => void;
  usersData: UserType[];
  setUsersData: (users: UserType[]) => void;
  editMode: boolean;
}

const UsersListContainer: React.FC<UsersListContainerProps> = ({
  setPagingPage,
  pagingPage,
  pagingLimit,
  currUser,
  setCurrUser,
  userLogin,
  userFullName,
  onUserSelectChange,
  usersData,
  setUsersData,
  editMode,
}) => {
  const [totalResults, setTotalResults] = useState(usersData?.length);
  const [currUserPagingPage] = useState(pagingPage);
  const [filterValue, setFilterValue] = useState("");
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();
  const { userId }: { userId: string } = useParams();
  const sortingParams = {
    sortField: "login",
    sortDirection: "asc",
  };

  const loadUsersData = (sortingParam?: FilterType) => {
    loadUsers(
      pagingPage,
      pagingLimit,
      sortingParam ? { ...sortingParams, ...sortingParam } : sortingParams
    )
      .then((res) => {
        const data = res.data;

        if (data) {
          if (currUserPagingPage === pagingPage) {
            if (
              !data.list.find((u: UserType) => u.id === currUser.id) &&
              Number(userId) !== 0
            ) {
              setUsersData([currUser, ...res.data.list]);
            } else {
              setUsersData(res.data.list);
            }
          } else {
            setUsersData([
              ...data.list.filter((u: UserType) => u.id !== currUser.id),
            ]);
          }

          setTotalResults(data.totalResults);
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  useEffect(() => {
    if (pagingLimit) {
      loadUsersData();
    }
  }, [pagingLimit, pagingPage]);

  useEffect(() => {
    setUsersData(
      usersData.map((item) => (item.id === currUser.id ? currUser : item))
    );
  }, [currUser]);

  const onFilter = (searchValue: string) => {
    if (searchValue && searchValue === filterValue) {
      return;
    }
    if (searchValue && searchValue !== filterValue) {
      setFilterValue(searchValue);
      const sortingParam = { login: searchValue };
      loadUsersData(sortingParam);
    } else {
      loadUsersData();
    }
  };

  return (
    <UsersList
      data={usersData}
      pagingPage={pagingPage}
      pagingLimit={pagingLimit}
      setPagingPage={setPagingPage}
      user={currUser ? currUser : ({} as UserType)}
      setUser={setCurrUser}
      userLogin={userLogin}
      userFullName={userFullName}
      onUserSelectChange={onUserSelectChange}
      totalResults={totalResults}
      onFilter={onFilter}
      editMode={editMode}
    />
  );
};

const mapStateToProps = (state: any) => ({
  pagingPage: state.get("user").pagingPage,
  pagingLimit: state.get("user").pagingLimit,
  filterValue: state.get("user").filterValue,
});

const dispatchToProps = (dispatch: any) => ({
  setPagingPage: bindActionCreators(changeUserPagingPageAction, dispatch),
  setFilterValue: bindActionCreators(changeUserFilter, dispatch),
});
export default connect(
  mapStateToProps,
  dispatchToProps
)(React.memo(UsersListContainer));
