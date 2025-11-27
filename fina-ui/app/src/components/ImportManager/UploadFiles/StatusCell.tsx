import Chip from "@mui/material/Chip";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { FC } from "react";
import StatusCellTooltip from "./StatusCellTooltip";
import { Box, darken, styled } from "@mui/system";
import i18n from "i18next";
import { UploadFileType } from "../../../types/uploadFile.type";
import { useTheme } from "@mui/material/styles";

interface StatusCellProps {
  row: UploadFileType;
  onClick: (event: any, selectedItem: UploadFileType) => void;
}

const StatusCell: FC<StatusCellProps> = ({ row, onClick }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";

  const isStatusWithIcon = (id: string) => {
    return ["16", "0", "12", "9", "11", "13", "17", "22", "24"].includes(id);
  };

  const getDataAndStyles = () => {
    switch (row.status) {
      case "-1":
        return {
          label: i18n.t("notUploaded"),
          color: "#fdfdfd",
          backgroundColor: darken("rgb(222,171,31)", 0.5),
        };
      case "0":
        return {
          label: i18n.t("uploaded"),
          color: "#e88409",
          backgroundColor: "rgb(250,197,7,0.2)",
        };
      case "1":
        return {
          label: i18n.t("converted"),
          color: "#e88409",
          backgroundColor: "rgb(250,197,7,0.2)",
        };
      case "2":
        return {
          label: i18n.t("rejected"),
          color: !darkMode ? "rgb(143 12 43)" : "rgb(225 133 154)",
          backgroundColor: "rgb(224,22,22,0.6)",
        };
      case "9":
        return {
          label: i18n.t("wrongFileName"),
          color: "#F83562",
          backgroundColor: "rgb(31,31,31,0.6)",
        };
      case "10":
        return {
          label: i18n.t("wrongFileType"),
          color: "#F83562",
          backgroundColor: "rgb(31,31,31,0.6)",
        };
      case "11":
        return {
          label: i18n.t("wrongFi"),
          color: "#ced5d4",
          backgroundColor: "rgb(31,31,31,0.6)",
        };
      case "12":
        return {
          label: i18n.t("wrongFileContent"),
          color: "#ced5d4",
          backgroundColor: "rgb(31,31,31,0.6)",
        };
      case "13":
        return {
          label: i18n.t("invalidSignature"),
          color: "#ced5d4",
          backgroundColor: "rgb(31,31,31,0.6)",
        };
      case "14":
        return {
          label: i18n.t("invalidStructure"),

          color: "#ced5d4",
          backgroundColor: "rgb(31,31,31,0.6)",
        };
      case "15":
        return {
          label: i18n.t("uploadError"),
          color: "#F83562",
          backgroundColor: "rgb(248,64,106,0.2)",
        };
      case "16":
        return {
          label: i18n.t("matrixError"),
          color: "#F83562",
          backgroundColor: "rgb(248,64,106,0.2)",
        };
      case "17":
        return {
          label: i18n.t("invalidVersion"),
          color: "#F83562",
          backgroundColor: "rgba(35,205,172, 0.2)",
        };
      case "18":
        return {
          label: i18n.t("imported"),
          color: "#1ECCAB",
          backgroundColor: "rgba(35,205,172, 0.2)",
        };
      case "19":
        return {
          label: i18n.t("alreadySubmitted"),
          color: "#2e3433",
          backgroundColor: "rgba(63,66,65,0.2)",
        };
      case "20":
        return {
          label: i18n.t("fileNotUnique"),
          color: "#F83562",
          backgroundColor: "rgb(248,64,106,0.2)",
        };
      case "21":
        return {
          label: i18n.t("error"),

          color: "#F83562",
          backgroundColor: "rgb(248,64,106,0.2)",
        };
      case "22":
        return {
          label: i18n.t("invalidOstVersion"),
          color: "#F83562",
          backgroundColor: "rgb(248,64,106,0.2)",
        };
      case "23":
        return {
          label: i18n.t("deleted"),
          color: darkMode ? "#FFFFFF" : "#2e3433",
          backgroundColor: "rgba(63,66,65,0.2)",
        };
      case "24":
        return {
          label: i18n.t("inProgress"),
          color: "#7e8d8d",
          backgroundColor: "rgba(93,102,102,0.2)",
        };

      default:
        return {
          label: i18n.t("error"),
          color: "#F83562",
          backgroundColor: "rgb(248,64,106,0.2)",
        };
    }
  };

  const StyledChip = styled(Chip)(() => ({
    "&:hover": {
      backgroundColor: getDataAndStyles().backgroundColor,
    },
    "& .MuiChip-deleteIcon": {
      position: "absolute",
      right: 0,
      height: "15px",
      display: isStatusWithIcon(row.status) ? "none" : "inherit",
    },
    "&:active": {
      backgroundColor: `${getDataAndStyles().backgroundColor} !important`,
      color: `${getDataAndStyles().color} !important`,
    },
  }));

  return (
    <Box
      key={row.id}
      style={{
        display: "table-cell",
        width: 200,
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        fontSize: "12px",
        lineHeight: "20px",
        border: "none",
      }}
    >
      <StatusCellTooltip row={row}>
        <StyledChip
          label={getDataAndStyles().label}
          style={{
            borderRadius: "5px",
            color: getDataAndStyles().color,
            backgroundColor: getDataAndStyles().backgroundColor,
            border: "unset",
            width: "100%",
            height: "25px",
            fontWeight: "400",
            fontSize: "10px",
            lineHeight: "20px",
          }}
          deleteIcon={<ArrowForwardIosIcon />}
          onClick={(event: any) => {
            if (onClick) {
              onClick(event, row);
            }
          }}
          onDelete={(event: any) => {
            if (onClick) {
              onClick(event, row);
            }
          }}
          data-testid={"status-chip"}
        />
      </StatusCellTooltip>
    </Box>
  );
};

export default StatusCell;
