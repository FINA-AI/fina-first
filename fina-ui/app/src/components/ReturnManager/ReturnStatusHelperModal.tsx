import ClosableModal from "../common/Modal/ClosableModal";
import { Box } from "@mui/system";
import GridTable from "../common/Grid/GridTable";
import { useTranslation } from "react-i18next";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import React, { ReactElement } from "react";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { styled } from "@mui/material/styles";

interface ReturnStatusHelperModalProps {
  open: boolean;
  onClose: VoidFunction;
}

interface Row {
  [key: string]: string | boolean | ReactElement;
}

const StyledInput = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
  marginLeft: 12,
});

const ReturnStatusHelperModal: React.FC<ReturnStatusHelperModalProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation();

  const columns = [
    {
      field: "status",
      headerName: t("status"),
      hideCopy: true,
      hideSort: true,
    },
    {
      field: "accept",
      headerName: t("accept"),
      hideCopy: true,
      hideSort: true,
    },
    {
      field: "reset",
      headerName: t("reset"),
      hideCopy: true,
      hideSort: true,
    },
    {
      field: "reject",
      headerName: t("reject"),
      hideCopy: true,
      hideSort: true,
    },
    {
      field: "processed",
      headerName: t("processed"),
      hideCopy: true,
      hideSort: true,
    },
    {
      field: "amended",
      headerName: t("STATUS_AMENDED"),
      hideCopy: true,
      hideSort: true,
    },
    {
      field: "deleted",
      headerName: t("deleted"),
      hideCopy: true,
      hideSort: true,
    },
  ];

  const rows: Row[] = [
    {
      status: `${t("STATUS_CREATED")}`,
      amended: true,
      deleted: true,
    },
    {
      status: `${t("STATUS_AMENDED")}`,
      reject: true,
      processed: true,
      amended: true,
      deleted: true,
    },
    {
      status: `${t("STATUS_PROCESSED")}`,
      accept: true,
      reject: true,
      processed: true,
      amended: true,
      deleted: true,
    },
    {
      status: `${t("STATUS_RESETED")}`,
      amended: true,
      deleted: true,
    },
    {
      status: `${t("STATUS_ACCEPTED")}`,
      reset: true,
    },
    {
      status: `${t("STATUS_REJECTED")}`,
      reset: true,
      amended: true,
      deleted: true,
    },
    {
      status: `${t("STATUS_ERROR")}`,
      amended: true,
      deleted: true,
    },
  ];

  const rowsWithModifiedField = rows.map((row) => {
    const modifiedRow: Row = { ...row };

    Object.keys(columns).forEach((key: any) => {
      const columnName = columns[key].field;

      if (row[columnName] === undefined || row[columnName] === false) {
        modifiedRow[columnName] = (
          <StyledInput>
            <RemoveCircleOutlineIcon
              style={{
                color: "#ff0600",
                opacity: 0.8,
                width: "22px",
                height: "22px",
              }}
            />
          </StyledInput>
        );
      } else if (row[columnName] === true) {
        modifiedRow[columnName] = (
          <StyledInput>
            <CheckCircleOutlineIcon
              style={{ color: "#289E20", width: "22px", height: "22px" }}
            />
          </StyledInput>
        );
      }
    });
    return modifiedRow;
  });

  return (
    <ClosableModal
      title={t("processstatuschange")}
      onClose={onClose}
      open={open}
      width={950}
      height={430}
    >
      <GridTable
        columns={columns}
        rows={rowsWithModifiedField}
        loading={false}
        disableRowSelection
      />
    </ClosableModal>
  );
};

export default ReturnStatusHelperModal;
