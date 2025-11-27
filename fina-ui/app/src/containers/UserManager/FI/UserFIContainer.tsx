import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import UserFi from "../../../components/UserManagement/Users/Fi/UserFi";
import { UserRouteName } from "../../../components/UserManagement/Users/Common/UserRoutes";
import {
  UserFi as UserFiInfo,
  UserFiData,
  UserFiType,
  UserType,
  UserTypeWithUIProps,
} from "../../../types/user.type";
import { loadUserFis } from "../../../api/services/userManagerService";

interface UserFIContainerProps {
  editMode: boolean;
  setUserData: (object: Partial<UserType>) => void;
  currUser: Partial<UserTypeWithUIProps>;
  userId?: number;
  tabName?: string;
}

const UserFIContainer: React.FC<UserFIContainerProps> = ({
  editMode,
  setUserData,
  currUser,
  userId,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();
  const [selectedFIData, setSelectedFIData] = useState<number[]>([]);
  const [fiTypes, setFiTypes] = useState<UserFiData[]>([]);
  const [originalFiTypes, setOriginalFiTypes] = useState<UserFiData[]>([]);
  const [selectedFIType, setSelectedFIType] = useState<UserFiType>();
  const [loading, setLoading] = useState(true);
  const [selectedFisId, setSelectedFisId] = useState<number[]>([]);
  const [inheritedFiIds, setInheritedFiIds] = useState<number[]>([]);
  useEffect(() => {
    initFITypes();
  }, [currUser]);

  useEffect(() => {
    if (fiTypes.length > 0) {
      getSelectedFiIds(fiTypes);
    }
  }, [editMode, fiTypes]);

  const initFITypes = async () => {
    setLoading(true);
    loadUserFis(userId)
      .then((resp) => {
        if (resp.data) {
          const sortedFiTypes = resp.data.sort((a: UserFiData, b: UserFiData) =>
            a.parent.code > b.parent.code ? 1 : -1
          );
          if (!selectedFIType && resp.data.length > 0) {
            setSelectedFIType(sortedFiTypes[0].parent);
          }

          setFiTypes(sortedFiTypes);
          setOriginalFiTypes(resp.data);
        }
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  const getSelectedFiIds = (data: UserFiData[]) => {
    let selectedFiItemsId: number[] = [];
    let inheritedFiItemsIds: number[] = [];

    data.forEach((fiType: UserFiData) => {
      const fiIds = fiType["fis"]
        .filter((f: UserFiInfo) => f["userFi"] || f["roleFi"])
        .map((m: UserFiInfo) => m.id);

      selectedFiItemsId = [...selectedFiItemsId, ...fiIds];

      const inheritedIds = fiType["fis"]
        .filter((f: UserFiInfo) => f["roleFi"])
        .map((m: UserFiInfo) => m.id);

      inheritedFiItemsIds = [...inheritedFiItemsIds, ...inheritedIds];
    });

    setUserData({ fiIds: selectedFiItemsId });
    setSelectedFIData([...selectedFiItemsId]);
    setSelectedFisId([...selectedFiItemsId]);
    setInheritedFiIds([...inheritedFiItemsIds]);
  };

  const onFilterClear = () => {
    initFITypes();
  };

  return (
    <UserFi
      fiTypes={fiTypes}
      originalFiTypes={originalFiTypes}
      setFiTypes={setFiTypes}
      loading={loading}
      selectedFIType={selectedFIType}
      setSelectedFIType={setSelectedFIType}
      editMode={editMode}
      setData={setUserData}
      mainData={selectedFIData}
      setSelectedFIData={setSelectedFIData}
      selectedFisId={selectedFisId}
      setSelectedFisId={setSelectedFisId}
      onFilterClear={onFilterClear}
      isGroup={false}
      inheritedFiIds={inheritedFiIds}
    />
  );
};

export default memo(UserFIContainer, (prevProps, nextProps) => {
  if (nextProps.tabName === UserRouteName.FI) {
    if (prevProps.currUser.fiIds !== nextProps.currUser.fiIds) {
      return false;
    }

    return (
      prevProps.currUser.id === nextProps.currUser.id &&
      prevProps.editMode === nextProps.editMode
    );
  }
  return true;
});
