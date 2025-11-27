import { Collapse, Grid, Link, TableCell } from "@mui/material";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import format from "date-fns/format";
import i18n from "i18next";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { BASE_REST_URL, getDefaultTimeFormat } from "../../../util/appUtil";
import { i18nReasonText } from "./Util/UploadFileStatusUtil";
import { UploadFileStatusType } from "../../../types/uploadFile.type";
import { styled, useTheme } from "@mui/material/styles";

interface UploadFileErrorGridProps {
  data: UploadFileStatusType[];
}

const StyledTableContainer = styled(Paper)(({ theme }: any) => ({
  borderLeft: theme.palette.borderColor,
  borderRadius: 0,
  boxShadow: "none",
  overflow: "auto",
}));

const StyledHeaderCell = styled(TableCell)(({ theme }: any) => ({
  borderBottom: theme.palette.borderColor,
  position: "sticky",
  top: 0,
  zIndex: 998,
}));

const StyledTableRow = styled(TableRow)(({ theme }: any) => ({
  height: "38px",
  border: "none",
  "&.rootOdd": {
    "& .MuiTableCell-root": {
      background: theme.palette.mode === "dark" ? "#2d3747" : "#FFFFFF",
    },
  },
  "&.rootEven": {
    "& .MuiTableCell-root": {
      background: theme.palette.mode === "dark" ? "#333f51" : "#F6F6F6",
    },
  },
}));

const StyledTableCell = styled(TableCell)({
  paddingTop: 0,
  paddingBottom: 0,
  border: "none",
});

const UploadFileErrorGrid: FC<UploadFileErrorGridProps> = ({ data }) => {
  const theme = useTheme();

  const getDateFormat = () => {
    return getDefaultTimeFormat();
  };
  const { t } = useTranslation();

  const getStatusCell = (row: UploadFileStatusType) => {
    let label = "";
    let color = "grey";
    let bgColor = "grey";
    switch (row.status) {
      case "UPLOADED":
        label = i18n.t("uploaded");
        color = "#e88409";
        bgColor = "rgba(194,193,192,0.2)";
        break;
      case "IN_PROGRESS":
        label = i18n.t("inProgress");
        color = "#7e8d8d";
        bgColor = "rgba(93,102,102,0.2)";
        break;
      case "QUEUED":
        label = "Queued";
        color = "#F83562";
        bgColor = "rgb(248,64,106,0.2)";
        break;
      case "REJECTED":
        label = i18n.t("rejected");
        color = "#F83562";
        bgColor = "rgb(224,22,22,0.6)";
        break;
      case "IMPORTED":
        label = i18n.t("imported");
        color = "#1ECCAB";
        bgColor = "rgba(35,205,172, 0.2)";
        break;
      case "DECLINED":
        label = i18n.t("declined");
        color =
          theme.palette.mode === "light" ? "rgb(124, 69, 0)" : "rgb(232,132,0)";
        bgColor =
          theme.palette.mode === "light"
            ? "rgba(250, 197, 7, 0.2)"
            : "rgba(255,173,3,0.29)";
        break;
      case "ERRORS":
        label = i18n.t("error");
        color = "#F83562";
        bgColor = "rgb(248,64,106,0.2)";
        break;
      default:
        color = "#F83562";
        bgColor = "rgb(248,64,106,0.2)";
        label = "------";
        break;
    }
    return (
      <Chip
        label={label}
        style={{
          borderRadius: "5px",
          color: color,
          backgroundColor: bgColor,
          width: "100%",
          height: "25px",
          fontWeight: "400",
          fontSize: "10px",
          lineHeight: "20px",
        }}
      />
    );
  };

  let rowColorStyle: any = {};
  let lastRowStyle: any = null;

  const Row: FC<{ row: UploadFileStatusType; index: number }> = ({
    row,
    index,
  }) => {
    const [open, setOpen] = useState(false);
    const rowStatus = row.status;
    const keyId: any = ["row_" + row.id];
    const [processStatus, setProcessStatus] = useState(null);
    console.log(setProcessStatus);

    if (!rowColorStyle[keyId]) {
      if (index === 0) {
        lastRowStyle = "even";
      } else {
        lastRowStyle = lastRowStyle === "even" ? "odd" : "even";
      }

      rowColorStyle[keyId] = lastRowStyle === "even" ? "rootEven" : "rootOdd";
    }

    return (
      <React.Fragment key={row.id}>
        <StyledTableRow
          className={rowColorStyle[keyId]}
          data-testid={"row-" + index}
        >
          <StyledTableCell width={10}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() =>
                // !processStatus ? getCurrentReturnStatus() : setOpen(!open)
                !processStatus && setOpen(!open)
              }
              data-testid={"expand-button"}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </StyledTableCell>
          <StyledTableCell align="left" data-testid={"code"}>
            {row.code}
          </StyledTableCell>
          <StyledTableCell align="left" data-testid={"version"}>
            {row.version}
          </StyledTableCell>
          <StyledTableCell align="left" data-testid={"date"}>
            {row.importEnd
              ? format(
                  new Date(row.importEnd),
                  getDateFormat(),
                  new Date() as any
                )
              : ""}
          </StyledTableCell>
          <StyledTableCell align="left" data-testid={"status"}>
            {getStatusCell(row)}
          </StyledTableCell>
        </StyledTableRow>
        <TableRow
          sx={{ border: "none" }}
          data-testid={"row-" + index + "-info"}
        >
          <StyledTableCell style={{ padding: 0 }} colSpan={12}>
            <Collapse in={open} timeout="auto" unmountOnExit id={"collapse"}>
              <Box
                display={"flex"}
                flex={1}
                sx={(theme) => ({
                  backgroundColor:
                    rowStatus === "ERRORS" || rowStatus === "DECLINED"
                      ? theme.palette.mode === "light"
                        ? "#FFF1F4"
                        : "#445669"
                      : "inherit",
                  padding: "20px",
                })}
              >
                <Grid container direction={"row"} spacing={1}>
                  <Grid item xs={12}>
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <div style={{ fontWeight: 800 }}>{t("information")}</div>
                      {row.status !== "IMPORTED" && (
                        <Link
                          href={`${BASE_REST_URL}/uploadFile/error/${row.id}/${row.code}`}
                          target={"_blank"}
                          underline="hover"
                          data-testid={"download-link"}
                        >
                          {t("download")}
                        </Link>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <div
                      style={{ whiteSpace: "pre-wrap", marginBottom: "5px" }}
                      data-testid={"message"}
                    >
                      {i18nReasonText(row.message, t)}
                    </div>
                    {processStatus && (
                      <div data-testid={"process-status"}>
                        {t("returnProcessStatus")}:&nbsp;
                        {processStatus}
                      </div>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </StyledTableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  return (
    <StyledTableContainer data-testid={"upload-files-error-grid"}>
      <Table aria-label="collapsible table" sx={{ margin: 0 }}>
        <TableHead
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 5,
          }}
          data-testid={"header"}
        >
          <TableRow>
            <StyledHeaderCell />
            <StyledHeaderCell data-testid={"code-cell"}>
              {t("code")}
            </StyledHeaderCell>
            <StyledHeaderCell align="left" data-testid={"version-cell"}>
              {t("version")}
            </StyledHeaderCell>
            <StyledHeaderCell align="left" data-testid={"date-cell"}>
              {t("date")}
            </StyledHeaderCell>
            <StyledHeaderCell align="left" data-testid={"status-cell"}>
              {t("status")}
            </StyledHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody data-testid={"body"}>
          {data.map((row: UploadFileStatusType, index) => (
            <Row row={row} index={index} />
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default UploadFileErrorGrid;
