import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import GridTable from "../../common/Grid/GridTable";
import ReturnManagerHistoryNote from "./ReturnManagerHistoryNote";
import React, { useEffect, useState } from "react";
import ActionBtn from "../../common/Button/ActionBtn";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import { getReturnStatus } from "../../../api/services/returnsService";
import { useTranslation } from "react-i18next";
import { BASE_REST_URL, getFormattedDateValue } from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { styled } from "@mui/material/styles";
import { Return } from "../../../types/return.type";
import { ReturnStatusType } from "../../../types/returnManager.type";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import FilePrintField from "../../common/Field/FilePrintField";

const StyledStatusTypography = styled(Typography)({
  fontSize: 11,
  lineHeight: "16px",
  fontWeight: 600,
  padding: "12px 16px",
  height: 23,
});
const StyledTableBox = styled(Box)(({ theme }: { theme: any }) => ({
  borderRight: theme.palette.borderColor,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const ReturnStatus = ({ selectedRows }: { selectedRows: Return[] }) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const { openErrorWindow } = useErrorWindow();

  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [data, setData] = useState([]);
  const returnStatusSelectedItemsRef = React.useRef<ReturnStatusType[]>([]);

  const columnsHeader = [
    {
      field: "status",
      headerName: t("status"),
      hideCopy: true,
    },
    {
      field: "statusDate",
      headerName: t("statusDate"),
      hideCopy: true,
      renderCell: (value: string, row: Return) => {
        return getFormattedDateValue(row.statusDate, getDateFormat(false));
      },
    },
    {
      field: "user",
      headerName: t("user"),
      hideCopy: true,
    },
  ];
  const [columns, setColumns] = useState(columnsHeader);
  const [selectedStatus, setSelectedStatus] = useState<ReturnStatusType>();

  useEffect(() => {
    initReturnStatus();
    setColumns(columnsHeader);
  }, []);

  const initReturnStatus = () => {
    getReturnStatus(selectedRows[0].id)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  let actionButtons = (row: ReturnStatusType, index: number) => {
    return (
      <>
        <ActionBtn
          onClick={() => {
            setSelectedStatus(row);
            setIsNoteOpen(true);
          }}
          children={<RemoveRedEyeRoundedIcon />}
          rowIndex={index}
        />
      </>
    );
  };

  const handleReviewVersionedReturn = (selectedOption: string) => {
    if (returnStatusSelectedItemsRef.current.length === 0) {
      return;
    }
    const returnId = selectedRows[0].id;
    const fileType = selectedOption;
    const locale = "en_US";

    let statusIdQueryString = "";

    returnStatusSelectedItemsRef.current.forEach((item) => {
      statusIdQueryString += `statusIds=${item.id}&`;
    });

    window.open(
      BASE_REST_URL +
        `/returns/review/version/${returnId}/${fileType}/${locale}?${statusIdQueryString}`,
      "_blank"
    );
  };

  return (
    <StyledTableBox>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <StyledStatusTypography>Return Status</StyledStatusTypography>
        <FilePrintField
          icon={<LocalPrintshopIcon />}
          handleClick={handleReviewVersionedReturn}
          buttonProps={{
            style: {
              marginRight: "8px",
              color: "#F5F7FA",
            },
          }}
          displayOptions={[
            { type: "HTML", key: "html" },
            { type: "XLSX", key: "xlsx" },
          ]}
        />
      </Box>

      <GridTable
        checkboxEnabled={true}
        columns={columns}
        rows={data}
        setRows={setData}
        selectedRows={[]}
        onCheckboxClick={(
          _currRow: ReturnStatusType,
          checkedRows: ReturnStatusType[]
        ) => {
          returnStatusSelectedItemsRef.current = checkedRows;
        }}
        size={"small"}
        actionButtons={actionButtons}
      />
      {isNoteOpen && (
        <ReturnManagerHistoryNote
          setIsNoteOpen={setIsNoteOpen}
          data={selectedStatus?.note}
        />
      )}
    </StyledTableBox>
  );
};

export default ReturnStatus;
