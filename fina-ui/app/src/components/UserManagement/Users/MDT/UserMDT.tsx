import UserMDTToolbar from "./UserMDTToolbar";
import { Box, styled } from "@mui/system";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import GridTable from "../../../common/Grid/GridTable";
import { Select, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useTheme } from "@mui/material/styles";
import { UserType } from "../../../../types/user.type";
import { MdtNode } from "../../../../types/mdt.type";

interface UserMDTProps {
  editMode: boolean;
  rows: MdtNode[];
  setMDTData: (data: MdtNode[]) => void;
  setData: (object: Partial<UserType>) => void;
  setRows: (data: MdtNode[]) => void;
  loading: boolean;
}

const StyledRootBox = styled(Box)(() => ({
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
}));

const StyledTextWrapperBox = styled(Box)(() => ({
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  float: "left",
  width: "100%",
}));

const StyledStatusBox = styled(Box)(() => ({
  borderRadius: 2,
  minWidth: 80,
  lineBreak: "anywhere",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  padding: "4px 12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledStatusTypography = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: 12,
  lineHeight: "16px",
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  width: 140,
  height: 30,
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
    height: "100%",
  },
  "& .MuiSvgIcon-root": {
    color: theme.palette.mode === "dark" && "#FFFFFF",
  },
  "& .MuiPaper-root": {
    width: "70px",
    boxSizing: "border-box",
    maxHeight: "300px",
  },
}));

const StyledMenuItem = styled(MenuItem)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 20px",
  "&:hover": {
    cursor: "pointer",
  },
  "& .MuiTypography-root": {},
  "& .MuiSvgIcon-root": {
    fontSize: 16,
  },
}));

const StyledMenuItemDiv = styled("div")(() => ({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  paddingTop: 3,
}));

const UserMDT: React.FC<UserMDTProps> = ({
  editMode,
  rows,
  setRows,
  setMDTData,
  setData,
  loading,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [filteredRows, setFilteredRows] = useState<MdtNode[] | null>(null);

  const getSelectBox = (value: string) => {
    switch (value) {
      case "AMEND":
        return {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgb(125 255 125 / 20%)"
              : "rgba(233, 245, 233, 0.5)",
        };
      case "REVIEW":
        return {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgb(255 192 106 / 20%)"
              : "rgba(255, 244, 229, 0.5)",
        };
      case "NONE":
        return {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgb(69, 87, 112)"
              : "rgba(234, 235, 240, 0.5)",
        };
      default:
        return {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgb(69, 87, 112)"
              : "rgba(234, 235, 240, 0.5)",
        };
    }
  };

  const getSelectIconColor = (value: string) => {
    switch (value) {
      case "AMEND":
        return {
          "& .MuiSelect-icon": {
            color: "#289E20",
            fontSize: 16,
          },
        };
      case "REVIEW":
        return {
          "& .MuiSelect-icon": {
            color: "#FF8D00",
            fontSize: 16,
          },
        };
      case "NONE":
        return {
          "& .MuiSelect-icon": {
            color: "#707C93",
            fontSize: 16,
          },
        };
    }
  };

  const getPermissionEditCell = (
    value: string,
    rowId: number,
    row: MdtNode
  ) => {
    return (
      <StyledSelect
        disabled={row["fromRole"]}
        style={getSelectBox(value)}
        sx={getSelectIconColor(value)}
        defaultValue={"NONE"}
        value={value}
        onChange={(e) => {
          let newValue = e.target.value as string;

          const updateRow = (item: MdtNode) =>
            item.id === rowId
              ? {
                  ...item,
                  permissionType: newValue,
                  canUserAmend: newValue === "AMEND",
                  canUserReview: newValue === "REVIEW",
                }
              : item;

          let updatedOriginalRows = rows.map(updateRow);
          setMDTData(updatedOriginalRows);

          if (filteredRows) {
            setFilteredRows(filteredRows.map(updateRow));
          }

          setData({
            mdtNodes: updatedOriginalRows.filter(
              (row) => row.permissionType !== "NONE" && row.fromRole === false
            ),
          });
        }}
        data-testid={"permission-type-select"}
      >
        <StyledMenuItem value={"AMEND"} data-testid={"amend"}>
          <StyledMenuItemDiv>
            <CheckCircleOutlineIcon
              style={{
                color: "#289E20",
                paddingRight: 5,
                fontSize: 16,
              }}
            />
            <Typography fontSize={12} color={"#289E20"}>
              {t("amend")}
            </Typography>
          </StyledMenuItemDiv>
        </StyledMenuItem>
        <StyledMenuItem value={"REVIEW"} data-testid={"review"}>
          <StyledMenuItemDiv>
            <RemoveRedEyeIcon
              fontSize={"small"}
              style={{
                color: "#FF8D00",
                paddingRight: 5,
                fontSize: 16,
              }}
            />
            <Typography fontSize={12} color={"#FF8D00"}>
              {t("review")}
            </Typography>
          </StyledMenuItemDiv>
        </StyledMenuItem>
        <StyledMenuItem value={"NONE"} data-testid={"none"}>
          <StyledMenuItemDiv>
            <RemoveCircleOutlineIcon
              fontSize={"small"}
              style={{
                color: "#707C93",
                paddingRight: 5,
                fontSize: 16,
              }}
            />
            <Typography fontSize={12} color={"#707C93"}>
              {t("none")}
            </Typography>
          </StyledMenuItemDiv>
        </StyledMenuItem>
      </StyledSelect>
    );
  };

  const getColumnIcons = (value: string) => {
    switch (value) {
      case "AMEND":
        return (
          <StyledStatusBox
            style={{
              backgroundColor:
                theme.palette.mode === "dark" ? "#114a21" : "#E9F5E9",
            }}
          >
            <StyledStatusTypography color={"#289E20"}>
              {t("amend")}
            </StyledStatusTypography>
          </StyledStatusBox>
        );
      case "REVIEW":
        return (
          <StyledStatusBox
            style={{
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgb(255 147 0 / 30%)"
                  : "#FFF4E5",
            }}
          >
            <StyledStatusTypography color={"#FF8D00"}>
              {t("review")}
            </StyledStatusTypography>
          </StyledStatusBox>
        );
      case "NONE":
        return (
          <StyledStatusBox
            style={{
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgb(241 33 0 / 30%)"
                  : "#FFECE9",
            }}
          >
            <StyledStatusTypography color={"#FF4128"}>
              {t("none")}
            </StyledStatusTypography>
          </StyledStatusBox>
        );
      default:
        return (
          <StyledStatusBox
            style={{
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgb(241 33 0 / 30%)"
                  : "#FFECE9",
            }}
          >
            <StyledStatusTypography color={"#FF4128"}>
              {t("none")}
            </StyledStatusTypography>
          </StyledStatusBox>
        );
    }
  };

  const columnHeader = [
    {
      field: "code",
      headerName: t("code"),
      minWidth: 120,
      hideCopy: true,
      renderCell: (value: string, row: MdtNode) => {
        value = row["code"];
        return <StyledTextWrapperBox>{value}</StyledTextWrapperBox>;
      },
    },
    {
      field: "name",
      headerName: t("description"),
      minWidth: 120,
      hideCopy: true,
      renderCell: (value: string, row: MdtNode) => {
        value = row["name"];
        return <StyledTextWrapperBox>{value}</StyledTextWrapperBox>;
      },
    },
    {
      field: "permissionType",
      headerName: t("permission"),
      minWidth: 150,
      hideCopy: true,
      renderCell: (value: string, row: MdtNode) => {
        value = row["permissionType"];
        return editMode
          ? getPermissionEditCell(value, row.id, row)
          : getColumnIcons(value);
      },
    },
  ];

  const onFilterChange = (value: string) => {
    value = value.toLowerCase();
    if (value && value.trim().length > 0) {
      const filtered = rows.filter(
        (r) => r.code?.toLowerCase().includes(value) || r.name?.includes(value)
      );
      setFilteredRows(filtered);
    } else {
      onFilterClear();
    }
  };

  const onFilterClear = () => {
    setFilteredRows(null);
  };

  return (
    <StyledRootBox display={"flex"} flexDirection={"column"}>
      <Box flex={0}>
        <UserMDTToolbar
          onFilterChange={onFilterChange}
          onFilterClear={onFilterClear}
        />
      </Box>
      <Box flex={1} overflow={"auto"}>
        <GridTable
          columns={columnHeader}
          rows={filteredRows ? filteredRows : rows}
          selectedRows={[]}
          setRows={setRows}
          loading={loading}
        />
      </Box>
    </StyledRootBox>
  );
};

export default UserMDT;
