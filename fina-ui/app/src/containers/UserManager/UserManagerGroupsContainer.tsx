import GroupsPage from "../../components/UserManagement/Groups/GroupsPage";
import React, { memo, useEffect, useState } from "react";
import { loadGroups } from "../../api/services/userManagerService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { Group } from "../../types/group.type";
import { sortByKey } from "../../util/appUtil";

interface UserManagerGroupsContainerProps {
  groups: Group[];

  setGroups(data: Group[]): void;
}

const UserManagerGroupsContainer: React.FC<UserManagerGroupsContainerProps> = ({
  setGroups,
  groups,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllGroups();
  }, []);

  const loadAllGroups = async () => {
    setLoading(true);
    loadGroups()
      .then((resp) => {
        const sorted = sortByKey(resp.data, "code");
        setGroups(sorted);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  return <GroupsPage groups={groups} loading={loading} />;
};

export default memo(UserManagerGroupsContainer);
