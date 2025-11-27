import React, { memo, useEffect, useState } from "react";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import UserFi from "../../../../components/UserManagement/Users/Fi/UserFi";
import { GroupRouteName } from "../../../../components/UserManagement/Groups/Common/GroupRoutes";
import { Group } from "../../../../types/group.type";
import { UserFiData, UserFiType } from "../../../../types/user.type";
import { loadGroupFis } from "../../../../api/services/userManagerService";

interface GroupFIContainerProps {
  editMode: boolean;
  setGroupData: (object: Partial<Group>) => void;
  currentGroupData: Partial<Group>;
  groupId: string;
  tabName?: string;
}

const GroupFIContainer: React.FC<GroupFIContainerProps> = ({
  editMode,
  setGroupData,
  currentGroupData,
  groupId,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();
  const [selectedFIData, setSelectedFIData] = useState<number[]>([]);
  const [fiTypes, setFiTypes] = useState<UserFiData[]>([]);
  const [originalFiTypes, setOriginalFiTypes] = useState([]);
  const [selectedFIType, setSelectedFIType] = useState<UserFiType>();
  const [loading, setLoading] = useState(true);
  const [selectedFisId, setSelectedFisId] = useState<number[]>([]);

  useEffect(() => {
    initFITypes();
  }, [currentGroupData]);

  useEffect(() => {
    if (!editMode && fiTypes.length > 0) {
      getSelectedFiIds(fiTypes);
    }
  }, [editMode, fiTypes]);

  const initFITypes = async () => {
    setLoading(true);
    loadGroupFis(groupId)
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
    data.forEach((fiType) => {
      let fiIds = fiType["fis"]
        .filter((f) => f["roleFi"])
        .map((m) => {
          return m.id;
        });
      selectedFiItemsId = [...selectedFiItemsId, ...fiIds];
    });
    setGroupData({ fiIds: selectedFiItemsId });
    setSelectedFisId([...selectedFiItemsId]);
    setSelectedFIData([...selectedFiItemsId]);
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
      setData={setGroupData}
      mainData={selectedFIData}
      selectedFisId={selectedFisId}
      setSelectedFisId={setSelectedFisId}
      setSelectedFIData={setSelectedFIData}
      onFilterClear={onFilterClear}
      isGroup={true}
    />
  );
};

export default memo(GroupFIContainer, (prevProps, nextProps) => {
  if (nextProps.tabName === GroupRouteName.FI) {
    return (
      prevProps.currentGroupData.id === nextProps.currentGroupData.id &&
      prevProps.editMode === nextProps.editMode
    );
  }
  return true;
});
