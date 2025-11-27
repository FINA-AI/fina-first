import UserManagerReports from "../../../components/UserManagement/Users/Reports/UserManagerReports";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { loadUserReports } from "../../../api/services/userManagerService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { UserRouteName } from "../../../components/UserManagement/Users/Common/UserRoutes";
import {
  UserReportWithUIProps,
  UserType,
  UserTypeWithUIProps,
} from "../../../types/user.type";

interface UserReportsContainerProps {
  editMode: boolean;
  currUser: Partial<UserTypeWithUIProps>;
  tabName?: string;
  setUserData(object: Partial<UserType>): void;
}

const UserReportsContainer: React.FC<UserReportsContainerProps> = ({
  editMode,
  currUser,
  setUserData,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<UserReportWithUIProps[]>([]);
  const [checkedReports, setCheckedReports] = useState<number[]>([]);
  const [inheritedReportIds, setInheritedReportIds] = useState<number[]>([]);

  const initReports = async () => {
    setLoading(true);
    await loadUserReports(currUser.id, null)
      .then((resp) => {
        let reportsArr = [];
        for (let report of resp.data) {
          reportsArr.push(report.parent);
          for (let child of report.children) {
            reportsArr.push(child);
          }
        }

        const uniqueIds: number[] = [];
        const originalReports = reportsArr.filter((element) => {
          const isDuplicate = uniqueIds.includes(element.id);

          if (!isDuplicate) {
            uniqueIds.push(element.id);

            return true;
          }

          return false;
        });

        setReports(originalReports);
        const checkedReportIds = originalReports
          .filter(
            (report) => report["userPermission"] || report["rolePermission"]
          )
          .map((r) => r.id);

        const inheritedReportIds = originalReports
          .filter((report) => report["rolePermission"])
          .map((r) => r.id);

        setCheckedReports(checkedReportIds);
        setInheritedReportIds(inheritedReportIds);

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        openErrorWindow(error, t("error"), true);
      });
  };

  const fetchDataTree = (node: UserReportWithUIProps) => {
    let children = reports
      .filter((r) => r.parentId === node.id)
      .map((r) => {
        r.level = node.level ? node.level + 1 : 1;
        r.leaf = r.type !== 1;
        return r;
      });

    const findNode = reports.find((parent) => parent.id === node.id);

    if (findNode) findNode.children = children;

    return children;
  };

  useEffect(() => {
    initReports();
  }, [currUser]);

  useEffect(() => {
    setCheckedReports([
      ...reports
        .filter(
          (report) => report["userPermission"] || report["rolePermission"]
        )
        .map((r) => r.id),
    ]);
  }, [editMode]);

  useEffect(() => {
    const newArr = checkedReports.filter(
      (reportId) => !inheritedReportIds.includes(reportId)
    );
    setUserData({ reportIds: newArr });
  }, [checkedReports]);

  return (
    <UserManagerReports
      loading={loading}
      fetchDataTree={fetchDataTree}
      reports={reports}
      checkedReports={checkedReports}
      editMode={editMode}
      setCheckedReports={setCheckedReports}
    />
  );
};

export default memo(UserReportsContainer, (prevProps, nextProps) => {
  if (nextProps.tabName === UserRouteName.REPORTS) {
    if (prevProps.currUser.reportIds !== nextProps.currUser.reportIds) {
      return false;
    }

    return (
      prevProps.currUser.id === nextProps.currUser.id &&
      prevProps.editMode === nextProps.editMode
    );
  }
  return true;
});
