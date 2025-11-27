import UserVersion from "../../../components/UserManagement/Users/Version/UserVersion";
import React, { memo, useEffect, useState } from "react";
import { getUserReturnVersions } from "../../../api/services/userManagerService";
import { getVersions } from "../../../api/services/versionsService";
import { UserRouteName } from "../../../components/UserManagement/Users/Common/UserRoutes";
import { UserType, UserTypeWithUIProps } from "../../../types/user.type";
import { ReturnVersion } from "../../../types/importManager.type";

interface UserVersionContainerProps {
  editMode: boolean;
  currUser: Partial<UserTypeWithUIProps>;
  tabName?: string;
  setUserData(object: Partial<UserType>): void;
}

const UserVersionContainer: React.FC<UserVersionContainerProps> = ({
  editMode,
  currUser,
  setUserData,
}) => {
  const [versions, setVersions] = useState<ReturnVersion[]>([]);
  const [originalVersions, setOriginalVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!editMode) {
      setVersions(originalVersions);
    }
  }, [editMode]);

  useEffect(() => {
    initVersions();
  }, []);

  useEffect(() => {
    if (versions.length !== 0) {
      initVersions();
    }
  }, [currUser]);

  const initVersions = async () => {
    setLoading(true);
    const res = await getUserReturnVersions(currUser.id);
    initUserVersions(res.data);
    setLoading(false);
  };

  const initUserVersions = async (userVersionData: ReturnVersion[]) => {
    setLoading(true);
    const res = await getVersions();
    let result = res.data.map((version: ReturnVersion) => {
      let newVersion = userVersionData.find((v) => v.id === version.id);
      return newVersion ? newVersion : version;
    });
    setOriginalVersions(result);
    setVersions(result);
    setLoading(false);
  };

  const checkBoxOnChange = (
    type: string,
    checked: boolean,
    versionItem: ReturnVersion
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
      ...versions.map((userVersion) => {
        return userVersion.id === versionItem.id ? version : userVersion;
      }),
    ];
    const newArr = result.filter(
      (item) => item.canUserReview || item.canUserAmend
    );

    setVersions([...result]);
    setUserData({
      returnVersions: newArr.length > 0 ? newArr : [],
    });
  };

  return (
    <UserVersion
      versions={versions}
      checkBoxOnChange={checkBoxOnChange}
      editMode={editMode}
      loading={loading}
    />
  );
};

export default memo(UserVersionContainer, (prevProps, nextProps) => {
  if (nextProps.tabName === UserRouteName.VERSION) {
    if (
      prevProps.currUser.returnVersions !== nextProps.currUser.returnVersions
    ) {
      return false;
    }

    return (
      prevProps.currUser.id === nextProps.currUser.id &&
      prevProps.editMode === nextProps.editMode
    );
  }
  return true;
});
