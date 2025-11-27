import React, { memo, useEffect, useState } from "react";
import UsersEcm from "../../../components/UserManagement/Users/Ecm/UsersEcm";
import { loadUserEcm } from "../../../api/services/userManagerService";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { UserRouteName } from "../../../components/UserManagement/Users/Common/UserRoutes";
import { ECMData } from "../../../types/ecm.type";
import { UserType, UserTypeWithUIProps } from "../../../types/user.type";

interface UsersEcmContainerProps {
  editMode: boolean;
  setUserData: (object: Partial<UserType>) => void;
  currUser: Partial<UserTypeWithUIProps>;
  tabName?: string;
}

interface ECMGroup {
  displayName: string;
  id: string;
}

const UsersEcmContainer: React.FC<UsersEcmContainerProps> = ({
  editMode,
  setUserData,
  currUser,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [ecmData, setEcmData] = useState<ECMData[]>([]);
  const [loading, setLoading] = useState(true);
  const [ecmGroups, setEcmGroups] = useState<ECMGroup[]>([]);

  useEffect(() => {
    init();
    return () => {
      setEcmData([]);
      setEcmGroups([]);
    };
  }, [currUser, editMode]);

  const init = async () => {
    setLoading(true);
    await loadUserEcm(currUser.id)
      .then((resp) => {
        setEcmData(resp.data);
        let newEcmGroups: ECMGroup[] = resp.data.filter(
          (item: ECMData) => item.checked
        );
        setEcmGroups(
          newEcmGroups.map((row) => ({
            displayName: row.displayName,
            id: row.id,
          }))
        );
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  const handleCheckChange = (row: ECMData) => {
    let isAlreadyInArray = !!ecmGroups.find((item) => item.id === row.id);
    if (isAlreadyInArray) {
      let newArray = [...ecmGroups.filter((item) => item.id !== row.id)];
      setEcmGroups(newArray);
      setEcmNodes(newArray);
    } else {
      let newArray = [
        ...ecmGroups,
        { displayName: row.displayName, id: row.id },
      ];
      setEcmGroups(newArray);
      setEcmNodes(newArray);
    }
  };

  const setEcmNodes = (data: ECMGroup[]) => {
    setUserData({
      ecmGroups: [...data],
    });
  };

  return (
    <UsersEcm
      handleCheckChange={handleCheckChange}
      editMode={editMode}
      loading={loading}
      ecmData={ecmData}
      setEcmData={setEcmData}
      setUserData={setUserData}
      currUser={currUser}
    />
  );
};

export default memo(UsersEcmContainer, (prevProps, nextProps) => {
  if (nextProps.tabName === UserRouteName.ECM) {
    if (prevProps.currUser.ecmGroups !== nextProps.currUser.ecmGroups) {
      return false;
    }

    return (
      prevProps.currUser.id === nextProps.currUser.id &&
      prevProps.editMode === nextProps.editMode
    );
  }
  return true;
});
