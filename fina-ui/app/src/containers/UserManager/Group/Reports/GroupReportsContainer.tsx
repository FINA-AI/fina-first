import UserManagerReports from "../../../../components/UserManagement/Users/Reports/UserManagerReports";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { loadGroupReports } from "../../../../api/services/userManagerService";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { GroupRouteName } from "../../../../components/UserManagement/Groups/Common/GroupRoutes";
import { Group } from "../../../../types/group.type";
import { Report } from "../../../../types/report.type";

interface GroupReportsContainerProps {
  editMode: boolean;
  setGroupData: (object: Partial<Group>) => void;
  currentGroupData: Partial<Group>;
  groupId: string;
  tabName?: string;
}

const GroupReportsContainer: React.FC<GroupReportsContainerProps> = ({
  editMode,
  setGroupData,
  currentGroupData,
  groupId,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [checkedReports, setCheckedReports] = useState<number[]>([]);

  const initReports = async () => {
    setLoading(true);
    await loadGroupReports(groupId, null)
      .then((resp) => {
        let reports = [];
        for (let report of resp.data) {
          reports.push(report.parent);
          for (let child of report.children) {
            reports.push(child);
          }
        }

        const uniqueIds: number[] = [];
        const originalReports = reports.filter((element) => {
          const isDuplicate = uniqueIds.includes(element.id);

          if (!isDuplicate) {
            uniqueIds.push(element.id);

            return true;
          }

          return false;
        });

        setReports(originalReports);
        setCheckedReports([
          ...originalReports
            .filter((report) => report["userPermission"])
            .map((r) => r.id),
        ]);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        openErrorWindow(error, t("error"), true);
      });
  };

  const fetchDataTree = (node: Report) => {
    return reports
      .filter((r) => r.parentId === node.id)
      .map((r) => {
        r.level = node.level ? node.level + 1 : 1;
        r.leaf = r.type !== 1;
        return r;
      });
  };

  useEffect(() => {
    initReports();
  }, [currentGroupData]);

  useEffect(() => {
    setCheckedReports([
      ...reports.filter((report) => report["userPermission"]).map((r) => r.id),
    ]);
  }, [editMode]);

  useEffect(() => {
    setGroupData({ reportIds: checkedReports });
  }, [checkedReports]);

  return (
    <UserManagerReports
      loading={loading}
      fetchDataTree={fetchDataTree}
      reports={reports}
      checkedReports={checkedReports}
      setCheckedReports={setCheckedReports}
      editMode={editMode}
    />
  );
};

export default memo(GroupReportsContainer, (prevProps, nextProps) => {
  if (nextProps.tabName === GroupRouteName.REPORTS) {
    return (
      prevProps.currentGroupData.id === nextProps.currentGroupData.id &&
      prevProps.editMode === nextProps.editMode
    );
  }
  return true;
});
