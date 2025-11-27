import GroupsItemPage from "../../components/UserManagement/Groups/GroupsItemPage";
import {
  deleteGroupService,
  getGroup,
  loadGroups,
  postGroup,
  updateGroup,
} from "../../api/services/userManagerService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { groupsBaseRoute } from "../../components/UserManagement/Groups/Common/GroupRoutes";
import LogoutModal from "../../components/Sidebar/LogoutModal";
import { Group } from "../../types/group.type";
import { sortByKey } from "../../util/appUtil";

interface UserManagerGroupsItemContainerProps {
  tabName?: string;
  groupId: string;
  groups: Group[];

  setGroups(data: Group[]): void;
}

const UserManagerGroupsItemContainer: React.FC<
  UserManagerGroupsItemContainerProps
> = ({ groupId, tabName, setGroups, groups }) => {
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const history = useHistory();

  const [editMode, setEditMode] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Partial<Group>>();
  const [loading, setLoading] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const currentGroupDataRef = useRef<Partial<Group>>({});

  useEffect(() => {
    if (Number(groupId) !== 0) {
      loadCurrentGroup();
    } else {
      setCurrentGroup({ id: 0 });
      setEditMode(true);
    }
  }, [groupId]);

  useEffect(() => {
    loadAllGroups();
  }, []);

  const onChangeGroupData = (object: Partial<Group>) => {
    currentGroupDataRef.current = { ...currentGroupDataRef.current, ...object };
  };
  const loadAllGroups = () => {
    loadGroups()
      .then((res) => {
        const sorted = sortByKey(res.data, "code");
        setGroups(sorted);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const validateGroupData = () => {
    if (currentGroupDataRef.current) {
      const group = currentGroupDataRef.current;
      return group.code;
    }
  };
  const addGroup = () => {
    if (!validateGroupData()) {
      enqueueSnackbar(t("requiredFieldsAreEmpty"), { variant: "warning" });
      return;
    }
    setLoading(true);

    postGroup(currentGroupDataRef.current)
      .then((res) => {
        currentGroupDataRef.current = res.data;
        if (Number(groupId) === 0) {
          history.push(`${groupsBaseRoute}/${res.data.id}/${tabName}`);
        }
        setCurrentGroup(res.data);
        setEditMode(false);
        if (groups?.length > 0) {
          setGroups([res.data, ...groups]);
        } else {
          setGroups([res.data]);
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadCurrentGroup = () => {
    if (Number(groupId) !== 0) {
      getGroup(groupId)
        .then((resp) => {
          let data = resp.data;
          if (data) {
            setCurrentGroup(data);
            currentGroupDataRef.current = data;
          }
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    } else {
      currentGroupDataRef.current = {};
      setCurrentGroup({});
    }
  };

  const updateGroupFunction = () => {
    if (!validateGroupData()) {
      enqueueSnackbar(t("requiredFieldsAreEmpty"), { variant: "warning" });
      return;
    }
    setLoading(true);

    const users = currentGroupDataRef?.current?.users;
    const payload = {
      ...currentGroupDataRef.current,
      users: users
        ? users.map((user) => ({
            id: user.id,
          }))
        : null,
    };

    updateGroup(groupId, payload)
      .then((resp) => {
        let data = resp.data;
        if (data) {
          setCurrentGroup({
            ...data,
            users: currentGroupDataRef?.current?.users,
          });
          setEditMode(false);
          currentGroupDataRef.current = data;
          setShowLogoutModal(data.mustReLogin);
        }
        const updatedGroups = groups.map((g) => (g.id === data.id ? data : g));
        setGroups(updatedGroups);

        enqueueSnackbar(t("success"), { variant: "success" });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteGroupHandler = () => {
    deleteGroupService(groupId)
      .then(() => {
        const updatedGroupsData = groups.filter(
          (group) => group.id !== Number(groupId)
        );
        setGroups(updatedGroupsData);
        enqueueSnackbar(t("deleted"), { variant: "success" });
        history.push(`/usermanager/groups`);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  return (
    <>
      <GroupsItemPage
        addGroup={addGroup}
        currentGroup={currentGroup}
        loading={loading}
        onChangeGroupData={onChangeGroupData}
        updateGroupFunction={updateGroupFunction}
        currentGroupDataRef={currentGroupDataRef}
        groupsData={groups}
        setGroupsData={setGroups}
        deleteGroupHandler={deleteGroupHandler}
        editMode={editMode}
        setEditMode={setEditMode}
        groupId={groupId}
        tabName={tabName}
      />

      {showLogoutModal && (
        <LogoutModal
          modalContent={"permissionchangedlogoutconfirm"}
          openLogoutModal={showLogoutModal}
          setOpenLogoutModal={setShowLogoutModal}
        />
      )}
    </>
  );
};

export default UserManagerGroupsItemContainer;
