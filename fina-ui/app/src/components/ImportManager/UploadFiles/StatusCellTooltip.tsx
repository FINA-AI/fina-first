import { Grid, Tooltip } from "@mui/material";
import { blue, green, red } from "@mui/material/colors";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { i18nReasonText } from "./Util/UploadFileStatusUtil";
import { UploadFileType } from "../../../types/uploadFile.type";
import { styled } from "@mui/system";

interface StatusCellTooltipProps {
  row: UploadFileType;
  children: any;
}

interface StatusItemProps {
  text: string | JSX.Element;
  iconFunction?: () => JSX.Element;
  showIcon?: boolean;
  hidden?: () => boolean;
}

const StyledTooltip = styled(Tooltip)(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: theme.palette.mode === "dark" ? "#1D2631" : "white",
    color: theme.palette.textColor,
    maxWidth: 350,
    width: 250,
    border: theme.palette.borderColor,
  },
  [`& .MuiTooltip-arrow`]: {
    "&:before": {
      border: theme.palette.borderColor,
    },
    color: theme.palette.mode === "dark" ? "#1D2631" : "white",
  },
}));

const StatusCellTooltip: FC<StatusCellTooltipProps> = ({ row, children }) => {
  const { t } = useTranslation();

  const StatusItem: FC<StatusItemProps> = ({
    text,
    iconFunction,
    showIcon = true,
    hidden = false,
  }) => {
    let hiddenRow = false;
    if (hidden && typeof hidden === "function") {
      hiddenRow = hidden();
    } else if (hidden) {
      hiddenRow = hidden;
    }
    if (hiddenRow) {
      return <></>;
    }

    let Icon = iconFunction ? iconFunction() : null;

    return (
      <Grid
        container
        direction={"row"}
        justifyContent={"center"}
        style={{
          marginTop: "5px",
        }}
      >
        <Grid item xs={11}>
          {text}
        </Grid>
        <Grid item xs={1}>
          {showIcon ? Icon : ""}
        </Grid>
      </Grid>
    );
  };

  const ErrorLabel: FC<{ label: string }> = ({ label }) => {
    return (
      <div>
        {t("error")}
        <span style={{ color: "red" }}>{" : " + label}</span>
      </div>
    );
  };

  const RexonaIcon = () => {
    return <CheckIcon fontSize={"small"} style={{ color: green[500] }} />;
  };

  const ErrorIcon = () => {
    return <CloseIcon fontSize={"small"} style={{ color: red[600] }} />;
  };

  const QuestionIcon = () => {
    return <NotListedLocationIcon style={{ color: blue[300] }} />;
  };

  const StatusIcon: FC<{ valid?: boolean }> = ({ valid }) => {
    if (valid === null) {
      return <QuestionIcon />;
    } else {
      return valid ? <RexonaIcon /> : <ErrorIcon />;
    }
  };

  return (
    <StyledTooltip
      disableInteractive
      arrow
      placement="left"
      title={
        <Grid container direction={"column"}>
          {/* file name Row */}
          <StatusItem
            text={t("fileNameValidation")}
            iconFunction={() => {
              return <StatusIcon valid={row.nameValid} />;
            }}
          />
          {/* Protection Validation Row */}
          <StatusItem
            text={t("protectionValidation")}
            iconFunction={() => {
              let protectionInfo = row.protectioninfo;
              if (!protectionInfo) {
                return <QuestionIcon />;
              }
              if (!protectionInfo || protectionInfo === "[]") {
                return <RexonaIcon />;
              }

              return <ErrorIcon />;
            }}
          />
          {/* Fi Validation Row */}
          <StatusItem
            text={t("fiOrAccessViolation")}
            iconFunction={() => {
              return <StatusIcon valid={row.hasUserBank} />;
            }}
          />
          {/* Matrix Validation Row */}
          <StatusItem
            text={t("matrixValidation")}
            iconFunction={() => {
              if (row.status == "16") {
                return <StatusIcon valid={false} />;
              }
              return <StatusIcon valid={row.matrixValid} />;
            }}
            hidden={() => {
              let fileType = row.fileName.substring(
                row.fileName.lastIndexOf(".")
              );

              if (
                row.matrixValid === false &&
                (fileType.toUpperCase() === ".XLSM" ||
                  fileType.toUpperCase() === ".XLS" ||
                  fileType.toUpperCase() === ".XLSX")
              ) {
                return row.matrixValid;
              }
              return true;
            }}
          />
          {/* Status Validation Row */}
          {row.status != "23" ? (
            <StatusItem
              text={t("status")}
              iconFunction={() => {
                return <StatusIcon valid={row.status == "18"} />;
              }}
            />
          ) : (
            <></>
          )}
          {/* Error Validation Row */}
          {row.reason && row.reason.trim().length > 0 ? (
            <StatusItem
              text={<ErrorLabel label={i18nReasonText(row.reason, t)} />}
              showIcon={false}
            />
          ) : (
            <></>
          )}
        </Grid>
      }
    >
      {children}
    </StyledTooltip>
  );
};

export default StatusCellTooltip;
