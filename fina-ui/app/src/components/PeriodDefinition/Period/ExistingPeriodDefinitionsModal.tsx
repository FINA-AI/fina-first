import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import GridTable from "../../common/Grid/GridTable";
import ClosableModal from "../../common/Modal/ClosableModal";
import { useTranslation } from "react-i18next";
import { getFormattedDateValue } from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import React, { useEffect, useState } from "react";
import { PeriodSubmitDataType } from "../../../types/period.type";
import { GridColumnType } from "../../../types/common.type";
import { styled } from "@mui/material/styles";

interface ExistingPeriodDefinitionsModalProps {
  data: PeriodSubmitDataType[];
  open: boolean;
  handleClose: () => void;
  setData: (data: PeriodSubmitDataType[]) => void;
}

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#EAEBF0" : "#596c87",
}));

const StyledExistingPerDefText = styled(Typography)({
  padding: "8px",
  width: "100%",
  fontSize: "13px",
  lineHeight: "20px",
});

const StyledRoot = styled(Box)({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

const ExistingPeriodDefinitionsModal: React.FC<
  ExistingPeriodDefinitionsModalProps
> = ({ data, setData, open, handleClose }) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  useEffect(() => {
    setColumns(columnsHeader);
  }, [t]);

  const columnsHeader: GridColumnType[] = [
    {
      field: "fromDate",
      headerName: t("fromDate"),
      hideCopy: true,
      flex: 1,
      renderCell: (value: number) => {
        return (
          <span style={{ color: "red" }}>
            {getFormattedDateValue(value, getDateFormat(true))}
          </span>
        );
      },
    },
    {
      field: "toDate",
      headerName: t("toDate"),
      hideCopy: true,
      flex: 1,
      renderCell: (value: number) => {
        return (
          <span style={{ color: "red" }}>
            {getFormattedDateValue(value, getDateFormat(true))}
          </span>
        );
      },
    },
    {
      field: "periodType",
      headerName: t("type"),
      flex: 1,
      renderCell: (value: string, row: PeriodSubmitDataType) => {
        return <span style={{ color: "red" }}>{t(row.periodType?.name)}</span>;
      },
    },
    {
      field: "periodNumber",
      headerName: t("number"),
      flex: 1,
      renderCell: (value) => {
        return <span style={{ color: "red" }}>{value}</span>;
      },
    },
  ];

  const [columns, setColumns] = useState<GridColumnType[]>(columnsHeader);

  return (
    <ClosableModal
      onClose={handleClose}
      open={open}
      width={650}
      height={550}
      disableBackdropClick={true}
      padding={0}
      includeHeader={true}
      title={t("info")}
      titleFontWeight={"600"}
    >
      <StyledRoot>
        <StyledDivider />
        <StyledExistingPerDefText>
          {t("existingperoddefinitions")}
        </StyledExistingPerDefText>
        <GridTable columns={columns} rows={data} setRows={setData} />
      </StyledRoot>
    </ClosableModal>
  );
};

export default ExistingPeriodDefinitionsModal;
