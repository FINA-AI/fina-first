import { Box } from "@mui/system";
import ActiveCell from "../../../common/ActiveCell";
import DoneIcon from "@mui/icons-material/Done";
import RemoveIcon from "@mui/icons-material/Remove";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Report } from "../../../../types/report.type";
import { UserReportWithUIProps } from "../../../../types/user.type";

interface ReportCheckboxProps {
  editMode: boolean;
  row: UserReportWithUIProps;
  checkedReports: number[];
  setCheckedReports: (reportIds: number[]) => void;
  reports: Report[];
  isGroup: boolean;
}

const StyledCheckbox = styled(Checkbox)(() => ({
  padding: "2px",
  maxWidth: "22px",
  display: "block !important",
  "& .MuiSvgIcon-root": {
    display: "block !important",
  },
  "& .MuiDivider-root": {
    display: "block !important",
  },
}));

const StyledDoneIcon = styled(DoneIcon)(({ theme }: any) => ({
  ...theme.smallIcon,
}));

const StyledRemoveIcon = styled(RemoveIcon)(({ theme }: any) => ({
  ...theme.smallIcon,
}));

const ReportCheckbox: React.FC<ReportCheckboxProps> = ({
  editMode,
  row,
  checkedReports,
  setCheckedReports,
  reports,
  isGroup,
}) => {
  const theme = useTheme();
  const [checked, setChecked] = useState(false);
  const [isHalfChecked, setIsHalfChecked] = useState(false);

  const getChildrenIds = (report: UserReportWithUIProps) => {
    let array: number[] = [];
    const getIds = (parentId: number) => {
      let child = reports.filter((r) => r.parentId === parentId);
      if (child) {
        array = [...array, ...child.map((m) => m.id)];
        for (let rep of child) {
          if (rep) {
            getIds(rep.id);
          }
        }
      }
    };
    getIds(report.id);
    array.unshift(report.id);
    return array;
  };

  const getParentIds = (report: UserReportWithUIProps) => {
    let array = [];
    const getIds = (reportId: number) => {
      if (reportId !== 0) {
        let pRow = reports.find((f) => f.id === reportId);
        if (pRow) {
          getIds(pRow.parentId);
          array.push(pRow.parentId);
        }
      }
    };
    getIds(report.parentId);
    array.unshift(report.parentId);
    return array;
  };

  const getCheckedRow = (report: UserReportWithUIProps) => {
    let array: number[] = [];
    const getIds = (rep: UserReportWithUIProps) => {
      if (rep) {
        let parentRow = reports.find((r) => r.id === rep.parentId);
        let isAllChecked =
          parentRow && parentRow.children
            ? parentRow.children
                .filter((f) => f.id !== rep.id)
                .every((child) => checkedReports.includes(child.id))
            : false;
        if (parentRow && isAllChecked) {
          array.push(parentRow.id);
          getIds(parentRow);
        }
      }
    };

    getIds(report);
    return array;
  };

  const onCheckBoxClick = (event: any) => {
    event.stopPropagation();
    if (isGroup ? true : !row["rolePermission"]) {
      let isChecked = event.target.checked;
      setChecked(isChecked);
      let checkedReportsArray = [row.id];
      let children = reports.filter(
        (r) => r.parentId === row.id && !r["rolePermission"]
      );

      for (let report of children) {
        checkedReportsArray = [
          ...checkedReportsArray,
          ...getChildrenIds(report),
        ];
      }

      if (isChecked) {
        if (isChecked && row.parentId !== 0) {
          checkedReportsArray = [...checkedReportsArray, ...getCheckedRow(row)];
        }
        setCheckedReports(
          Array.from(new Set([...checkedReports, ...checkedReportsArray]))
        );
      } else {
        if (row.parentId !== 0) {
          checkedReportsArray = [...checkedReportsArray, ...getParentIds(row)];
        }

        setCheckedReports([
          ...checkedReports.filter(
            (report) => !checkedReportsArray.includes(report)
          ),
        ]);
      }
    }
  };

  useEffect(() => {
    let isInCheckedArray = checkedReports.includes(row.id);
    setChecked(isInCheckedArray);

    if (!isInCheckedArray) {
      if (row.parentId === 0 || row.type === 1) {
        let repsArray = getChildrenIds(row);
        let isHalfChecked = false;
        let isAllChecked = true;
        for (let report of repsArray) {
          if (checkedReports.includes(report)) {
            isHalfChecked = true;
          } else {
            isAllChecked = false;
          }
        }
        setIsHalfChecked(isAllChecked ? false : isHalfChecked);
      } else {
        let isHalfChecked = reports
          .filter((f) => f.parentId === row.parentId)
          .some((s) => checkedReports.includes(s.id));

        setIsHalfChecked(isHalfChecked);
      }
    } else {
      setIsHalfChecked(false);
    }
  }, [row, checkedReports]);

  const isRowChecked = () => {
    return isGroup
      ? row["rolePermission"]
      : row["userPermission"] || row["rolePermission"];
  };

  return (
    <>
      {editMode ? (
        <Box paddingLeft={"20px"}>
          <StyledCheckbox
            onClick={(event) => onCheckBoxClick(event)}
            indeterminate={row.type === 1 && isHalfChecked}
            checked={checked}
            disabled={isGroup ? false : row["rolePermission"]}
          />
        </Box>
      ) : (
        <>
          {isRowChecked() ? (
            <Box paddingLeft={"20px"} width={"28px"} height={"28px"}>
              <ActiveCell
                active={true}
                style={{
                  backgroundColor: row["rolePermission"]
                    ? theme.palette.mode === "dark"
                      ? "rgb(130 151 181 / 31%)"
                      : "#DDDEDF"
                    : row["userPermission"]
                    ? ""
                    : "#EAEBF0",
                  color: row["userPermission"] ? "" : "#FF4128",
                }}
              >
                <StyledDoneIcon
                  style={{
                    color: row["rolePermission"]
                      ? theme.palette.mode === "dark"
                        ? "#8695b1"
                        : "rgb(44, 54, 68)"
                      : "",
                  }}
                />
              </ActiveCell>
            </Box>
          ) : (
            <Box paddingLeft={"20px"} width={"28px"} height={"28px"}>
              <ActiveCell
                active={true}
                style={{
                  backgroundColor:
                    row.type === 1 && isHalfChecked
                      ? "rgba(40, 158, 32, 0.1)"
                      : theme.palette.mode === "dark"
                      ? "rgb(255 77 49 / 20%)"
                      : "rgb(255 149 132 / 40%)",
                  color:
                    row.type === 1 && isHalfChecked ? "#289E20" : "#FF4128",
                }}
              >
                <StyledRemoveIcon />
              </ActiveCell>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default ReportCheckbox;
