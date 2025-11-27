import UserMDT from "../../../components/UserManagement/Users/MDT/UserMDT";
import { UserRouteName } from "../../../components/UserManagement/Users/Common/UserRoutes";
import React, { memo, useEffect, useState } from "react";
import {
  loadGroupMDT,
  loadUserMDT,
} from "../../../api/services/userManagerService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { loadAllRootNodes } from "../../../api/services/MDTService";
import { UserType, UserTypeWithUIProps } from "../../../types/user.type";
import { MdtNode } from "../../../types/mdt.type";

interface UserMDTContainerProps {
  editMode: boolean;
  currData: Partial<UserTypeWithUIProps>;
  tabName?: string;
  groupMode?: boolean;
  setData(object: Partial<UserType>): void;
}

const UserMDTContainer: React.FC<UserMDTContainerProps> = ({
  editMode,
  currData,
  setData,
  groupMode = false,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();

  const [mdtData, setMDTData] = useState<MdtNode[]>([]);
  const [originalMDT, setOriginalMDT] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currData.id) {
      loadAllMdt();
    } else {
      loadGroupMDTData();
    }
  }, [currData]);

  const setMdtData = () => {
    setMDTData(originalMDT);
  };

  useEffect(() => {
    if (!editMode) {
      setMdtData();
    }
  }, [editMode]);

  const handleRequestResponse = (resp: any) => {
    let newArray = resp.data.map((row: MdtNode) => ({
      ...row,
      canUserAmend: row.permissionType === "AMEND",
      canUserReview: row.permissionType === "REVIEW",
    }));
    setMDTData(newArray);
    setOriginalMDT(newArray);
  };

  const loadGroupMDTData = () => {
    setLoading(true);
    if (groupMode) {
      loadGroupMDT(currData.id)
        .then((resp) => {
          handleRequestResponse(resp);
          setLoading(false);
        })
        .catch((e) => {
          openErrorWindow(e, t("error"), true);
        });
    } else {
      setLoading(true);

      loadUserMDT(currData.id)
        .then((resp) => {
          handleRequestResponse(resp);
          setLoading(false);
        })
        .catch((e) => {
          openErrorWindow(e, t("error"), true);
        });
    }
  };

  const loadAllMdt = async () => {
    setLoading(true);
    try {
      const res = await loadAllRootNodes();
      const data = res.data.map((row: MdtNode) => {
        return {
          ...row,
          canUserAmend: false,
          canUserReview: false,
          permissionType: "NONE",
          fromRole: false,
        };
      });
      setMDTData(data);
      setOriginalMDT(data);
      setLoading(false);
    } catch (e) {
      openErrorWindow(e, t("error"), true);
    }
  };

  return (
    <>
      {mdtData && (
        <UserMDT
          editMode={editMode}
          rows={mdtData}
          setRows={setMDTData}
          setData={setData}
          setMDTData={setMDTData}
          loading={loading}
        />
      )}
    </>
  );
};

export default memo(UserMDTContainer, (prevProps, nextProps) => {
  if (nextProps.tabName === UserRouteName.MDT) {
    if (prevProps.currData.groupIds !== nextProps.currData.groupIds) {
      return false;
    }

    return (
      prevProps.currData.id === nextProps.currData.id &&
      prevProps.editMode === nextProps.editMode
    );
  }
  return true;
});
