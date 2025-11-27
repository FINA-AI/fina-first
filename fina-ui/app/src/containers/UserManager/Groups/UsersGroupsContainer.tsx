import UsersGroups from "../../../components/UserManagement/Users/Groups/UsersGroups";
import {
  loadGroups,
  loadUserGroups,
} from "../../../api/services/userManagerService";
import React, { memo, useEffect, useState } from "react";
import { UserRouteName } from "../../../components/UserManagement/Users/Common/UserRoutes";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { UserType, UserTypeWithUIProps } from "../../../types/user.type";
import { Group } from "../../../types/group.type";

interface UsersGroupsContainerProps {
  editMode: boolean;
  currUser: Partial<UserTypeWithUIProps>;
  tabName?: string;
  setUserData(object: Partial<UserType>): void;
}

const UsersGroupsContainer: React.FC<UsersGroupsContainerProps> = ({
  editMode,
  currUser,
  setUserData,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [groups, setGroups] = useState<Group[]>([]);
  const [currUserGroups, setCurrUserGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAllGroups = () => {
    setLoading(true);
    loadGroups()
      .then((resp) => {
        setGroups(resp.data);
      })
      .catch((e) => {
        openErrorWindow(e, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAllGroups();
  }, []);

  useEffect(() => {
    loadCurrUserGroups();
  }, [currUser]);

  const loadCurrUserGroups = () => {
    if (currUser.id) {
      setLoading(true);
      loadUserGroups(currUser.id)
        .then((resp) => {
          setUserData({ groupIds: resp.data.map((group: Group) => group.id) });
          setCurrUserGroups(resp.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const onSingleCheck = (group: Group) => {
    let newArray = [];
    if (isPermitted(group)) {
      newArray = currUserGroups.filter((g) => g.id !== group.id);
    } else {
      newArray = [...currUserGroups, group];
    }

    setCurrUserGroups(newArray);
    setUserData({
      groupIds: newArray.map((g) => g.id),
    });
  };

  const isPermitted = (group: Group) => {
    return !!currUserGroups.find((item) => item.id === group.id);
  };

  const selectAll = (checked: boolean) => {
    if (!checked) {
      setCurrUserGroups(groups);
      setUserData({
        groupIds: groups.map((g) => g.id),
      });
    } else {
      setCurrUserGroups([]);
      setUserData({
        groupIds: [],
      });
    }
  };

  return (
    <UsersGroups
      groups={groups}
      editMode={editMode}
      isPermitted={isPermitted}
      selectAll={selectAll}
      onSingleCheck={onSingleCheck}
      loading={loading}
    />
  );
};

export default memo(UsersGroupsContainer, (prevProps, nextProps) => {
  if (nextProps.tabName === UserRouteName.GROUPS) {
    if (prevProps.currUser.groupIds !== nextProps.currUser.groupIds) {
      return false;
    }

    return (
      prevProps.currUser.id === nextProps.currUser.id &&
      prevProps.editMode === nextProps.editMode
    );
  }
  return true;
});
