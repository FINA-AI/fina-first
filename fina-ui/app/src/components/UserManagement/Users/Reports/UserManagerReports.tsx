import { Box, Checkbox, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import VirtualTreeGrid from "../../../common/TreeGrid/VirtualTreeGrid";
import ReportCheckbox from "./ReportCheckbox";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MainGridSkeleton from "../../../FI/Skeleton/GridSkeleton/MainGridSkeleton";
import CustomAutoComplete from "../../../common/Field/CustomAutoComplete";
import { styled } from "@mui/system";
import { Report } from "../../../../types/report.type";
import { UserReportWithUIProps } from "../../../../types/user.type";

interface UserManagerReportsProps {
  loading: boolean;
  reports: UserReportWithUIProps[];
  editMode: boolean;
  checkedReports: number[];
  setCheckedReports: (reportIds: number[]) => void;
  isGroup?: boolean;
  fetchDataTree(node: Report): Report[];
}

const StyledHeader = styled(Box)(({ theme }: any) => ({
  paddingLeft: "24px",
  maxHeight: theme.toolbar.height,
  display: "flex",
  alignItems: "center",
  borderBottom: theme.palette.borderColor,
  padding: theme.toolbar.padding,
}));

const UserManagerReports: React.FC<UserManagerReportsProps> = ({
  loading,
  fetchDataTree,
  reports,
  editMode,
  checkedReports,
  setCheckedReports,
  isGroup = false,
}) => {
  const { t } = useTranslation();
  const [rootData, setRootData] = useState<UserReportWithUIProps[]>([]);

  useEffect(() => {
    const d = reports
      .filter((r) => r.parentId === 0)
      .map((rep) => {
        return { ...rep, leaf: rep.type !== 1, level: 0 };
      });
    setRootData(d);
  }, [reports]);

  const handleSelectAll = (e: any) => {
    const checked = e.target.checked;

    if (!checked) {
      if (isGroup) {
        setCheckedReports([]);
      } else {
        const rolePermissionReports = reports.filter(
          (report) => report.rolePermission
        );
        setCheckedReports(rolePermissionReports.map((report) => report.id));
      }
    } else {
      const updatedReports = reports.map((report) => {
        if (!report.rolePermission) {
          return { ...report, userPermission: true };
        }
        return report;
      });
      const checkedReportIds = updatedReports.map((report) => report.id);
      setCheckedReports(checkedReportIds);
    }
  };

  const columnHeader = [
    {
      title: t("code"),
      dataIndex: "code",
      flex: 0.3,
      renderer: (value: string) => {
        return (
          <Box display={"flex"} alignItems={"center"}>
            {value}
          </Box>
        );
      },
    },
    {
      title: t("name"),
      dataIndex: "description",
      flex: 0.6,
    },
    {
      title: t("permission"),
      dataIndex: "userPermission",
      flex: 0.1,
      renderer: (value: string, row: UserReportWithUIProps) => {
        return (
          <ReportCheckbox
            editMode={editMode}
            row={row}
            checkedReports={checkedReports}
            setCheckedReports={setCheckedReports}
            reports={reports}
            isGroup={isGroup}
          />
        );
      },
    },
  ];

  const treeIcons = {
    expandedIcon: () => {
      return (
        <FolderIcon
          style={{
            color: "#2962FF",
          }}
        />
      );
    },
    folder: () => {
      return (
        <FolderOpenIcon
          style={{
            color: "#AEB8CB",
          }}
        />
      );
    },
    leaf: () => {
      return <AssignmentIcon style={{ color: "#1c7483" }} />;
    },
  };

  const getReportPath = (report: UserReportWithUIProps) => {
    const arr: number[] = [report.id];

    const findParentRecursive = (pId: number, arr: number[]) => {
      const p = reports.find((r) => r.id === pId);
      if (p) {
        arr.push(p.id);
        if (p.parentId > 0) {
          findParentRecursive(p.parentId, arr);
        }
      }

      return arr;
    };

    findParentRecursive(report.parentId, arr);
    arr.reverse();
    setReportPath(arr);
    return arr;
  };

  const [reportPath, setReportPath] = useState<number[]>([]);

  return (
    <Box
      height={"100%"}
      display={"flex"}
      width={"100%"}
      flexDirection={"column"}
    >
      <StyledHeader display={"flex"} justifyContent={"space-between"}>
        <Box width={"400px"}>
          <CustomAutoComplete
            data={reports}
            onChange={(v) => {
              if (v) {
                getReportPath(v);
              }
            }}
            valueFieldName={"id"}
            displayFieldFunction={(r) => `${r.code} - ${r.description}`}
            renderOptionFunction={(value: string, option: any) => (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {option.type === 1 ? (
                  <FolderOpenIcon style={{ color: "#AEB8CB" }} />
                ) : (
                  <AssignmentIcon style={{ color: "#1c7483" }} />
                )}
                <span>{value}</span>
              </span>
            )}
          />
        </Box>
        {editMode && (
          <Box display={"flex"} alignItems={"center"}>
            <Checkbox
              style={{ margin: 0 }}
              size={"small"}
              disabled={false}
              onClick={(e) => handleSelectAll(e)}
              indeterminate={
                checkedReports.length < reports.length &&
                checkedReports.length > 0
              }
            />
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              {t("selectAll")}
            </Typography>
          </Box>
        )}
      </StyledHeader>
      {loading ? (
        <MainGridSkeleton columns={columnHeader} checkboxEnabled={true} />
      ) : (
        <Box
          display={"flex"}
          height={"100%"}
          boxSizing={"border-box"}
          width={"100%"}
          flexDirection={"column"}
        >
          <VirtualTreeGrid
            columns={columnHeader}
            data={rootData}
            loadChildrenFunction={fetchDataTree}
            treeIcons={treeIcons}
            expandPath={reportPath}
          />
        </Box>
      )}
    </Box>
  );
};

export default UserManagerReports;
