import React, { memo, useEffect, useState } from "react";
import { loadGroupReturnVersions } from "../../../api/services/userManagerService";
import { getVersions } from "../../../api/services/versionsService";
import UserVersion from "../../../components/UserManagement/Users/Version/UserVersion";
import { GroupRouteName } from "../../../components/UserManagement/Groups/Common/GroupRoutes";
import { Group, GroupVersion } from "../../../types/group.type";

interface GroupVersionContainerProps {
  editMode: boolean;
  currentGroupData: Partial<Group>;
  setGroupData: (object: Partial<Group>) => void;
  tabName?: string;
}

const GroupVersionContainer: React.FC<GroupVersionContainerProps> = ({
  editMode,
  currentGroupData,
  setGroupData,
}) => {
  const [groupVersions, setGroupVersions] = useState<GroupVersion[]>([]);
  const [originalVersions, setOriginalVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!editMode) {
      setGroupVersions(originalVersions);
    }
  }, [editMode]);

  useEffect(() => {
    if (!currentGroupData.id) {
      initRawVersions();
    } else {
      initVersions();
    }
  }, []);

  useEffect(() => {
    if (groupVersions.length !== 0) {
      initVersions();
    }
  }, [currentGroupData]);

  const initVersions = async () => {
    const res = await loadGroupReturnVersions(currentGroupData.id);
    initGroupVersions(res.data);
  };

  const initRawVersions = async () => {
    setLoading(true);
    const res = await getVersions();
    if (!currentGroupData.id) {
      setOriginalVersions(res.data);
      setGroupVersions(res.data);
    }
    setLoading(false);
    return res.data;
  };
  const initGroupVersions = async (userVersionData: Group[]) => {
    setLoading(true);
    const data = await initRawVersions();
    let result = data.map((version: Group) => {
      let newVersion = userVersionData.find((v) => v.id === version.id);
      return newVersion ? newVersion : version;
    });
    setOriginalVersions(result);
    setGroupVersions(result);
    setLoading(false);
  };

  const checkBoxOnChange = (
    type: string,
    checked: boolean,
    versionItem: GroupVersion
  ) => {
    let version = { ...versionItem };

    version["canUserReview"] = checked;
    // version["userReturnVersion"] = checked;

    if (type === "review" && !checked) {
      version["canUserAmend"] = checked;
      version["userReturnVersion"] = checked;
    }

    if (type !== "review") {
      if (!checked) {
        version["canUserReview"] = !checked;
        // version["userReturnVersion"] = !checked;
      }
      version["canUserAmend"] = checked;
    }

    let result = [
      ...groupVersions.map((userVersion) => {
        return userVersion.id === versionItem.id ? version : userVersion;
      }),
    ];

    let newArr: any = [];
    result.map((item) => {
      if (item.canUserReview || item.canUserReview) {
        newArr.push(item);
      }
    });

    setGroupVersions([...result]);
    setGroupData({
      returnVersions: newArr.length > 0 ? newArr : [],
    });
  };

  return (
    <UserVersion
      versions={groupVersions}
      checkBoxOnChange={checkBoxOnChange}
      editMode={editMode}
      loading={loading}
    />
  );
};

export default memo(GroupVersionContainer, (prevProps, nextProps) => {
  if (nextProps.tabName === GroupRouteName.VERSION) {
    return (
      prevProps.currentGroupData.id === nextProps.currentGroupData.id &&
      prevProps.editMode === nextProps.editMode
    );
  }
  return true;
});
