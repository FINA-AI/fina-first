import React, { memo, useEffect, useState } from "react";
import UserPermittedMatrixPage from "../../../components/UserManagement/Users/Matrix/UserPermittedMatrixPage";
import { UserRouteName } from "../../../components/UserManagement/Users/Common/UserRoutes";
import {
  loadRolePermittedMatrixList,
  loadUserPermittedMatrixList,
} from "../../../api/services/userManagerService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { MainMatrixDataType } from "../../../types/matrix.type";
import { loadMainMatrixData } from "../../../api/services/matrixService";
import { Group } from "../../../types/group.type";
import { UserTypeWithUIProps } from "../../../types/user.type";

interface UserMatrixContainerProps {
  editMode: boolean;
  setData: (object: Partial<Group>) => void;
  currData: Partial<UserTypeWithUIProps> | Partial<Group>;
  tabName?: string;
  groupMode?: boolean;
}

const UserMatrixContainer: React.FC<UserMatrixContainerProps> = ({
  editMode,
  setData,
  currData,
  groupMode = false,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();

  const [matrixData, setMatrixData] = useState<MainMatrixDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [permittedGroupIds, setPermittedGroupIds] = useState<number[]>([]);

  useEffect(() => {
    loadMatrixList();
  }, []);

  useEffect(() => {
    getUserPermittedMatrixData();
  }, [currData]);

  const loadMatrixList = async () => {
    try {
      const res = await loadMainMatrixData();
      setMatrixData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUserPermittedMatrixData = async () => {
    if (groupMode) {
      try {
        const res = await loadRolePermittedMatrixList(currData.id);
        setPermittedGroupIds(
          res.data.map((item: MainMatrixDataType) => item.id)
        );
      } catch (err) {
        openErrorWindow(err, t("error"), true);
      }
    } else {
      try {
        const res = await loadUserPermittedMatrixList(currData.id);
        setPermittedGroupIds(
          res.data.map((item: MainMatrixDataType) => item.id)
        );
      } catch (err) {
        openErrorWindow(err, t("error"), true);
      }
    }
  };

  const dataSortFunction = () => {
    return matrixData.sort((a, b) => {
      if (editMode) {
        return 0;
      }
      const permittedA = isPermitted(a.id);
      const permittedB = isPermitted(b.id);

      if (permittedA && !permittedB) {
        return -1;
      } else if (!permittedA && permittedB) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  const isPermitted = (fileGroupId?: number) => {
    return Boolean(permittedGroupIds.find((id) => id === fileGroupId));
  };

  const onSingleCheck = (fileGroupId?: number) => {
    let newIds: number[] = [];

    if (fileGroupId !== undefined) {
      if (isPermitted(fileGroupId)) {
        newIds = permittedGroupIds.filter((id) => id !== fileGroupId);
      } else {
        newIds = [...permittedGroupIds, fileGroupId];
      }
    }

    setPermittedGroupIds(newIds);
    setData({
      permittedMatrixIds: newIds.filter((id) => id !== undefined) as number[],
    });
  };

  return (
    <UserPermittedMatrixPage
      editMode={editMode}
      data={matrixData}
      dataSortFunction={dataSortFunction}
      loading={loading}
      isPermitted={isPermitted}
      onSingleCheck={onSingleCheck}
    />
  );
};

export default memo(UserMatrixContainer, (prevProps, nextProps) => {
  if (nextProps.tabName === UserRouteName.MATRIX) {
    return (
      prevProps.currData.id === nextProps.currData.id &&
      prevProps.editMode === nextProps.editMode
    );
  }
  return true;
});
