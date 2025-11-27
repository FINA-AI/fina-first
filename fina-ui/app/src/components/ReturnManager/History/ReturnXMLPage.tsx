import { Box } from "@mui/system";
import { IconButton, Typography } from "@mui/material";
import GridTable from "../../common/Grid/GridTable";
import React, { useEffect, useState } from "react";
import { getImportedXml } from "../../../api/services/returnsService";
import { useTranslation } from "react-i18next";
import { getFormattedDateValue } from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import UnfoldLessRoundedIcon from "@mui/icons-material/UnfoldLessRounded";
import ReturnXMLStatusCell from "./ReturnXMLStatusCell";
import { styled } from "@mui/material/styles";
import { Return } from "../../../types/return.type";
import { ImportedXML } from "../../../types/returnManager.type";

const StyledToolbarWrapper = styled(Box)({
  padding: "12px 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});
const StyledStatusTypography = styled(Typography)({
  fontSize: 11,
  lineHeight: "16px",
  fontWeight: 600,
});

const StyledLessIcon = styled(UnfoldLessRoundedIcon)(
  ({ theme }: { theme: any }) => ({
    transform: "rotate(-40deg)",
    ...theme.smallIcon,
  })
);

const ReturnXMLPage = ({ selectedRows }: { selectedRows: Return[] }) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  const [data, setData] = useState<ImportedXML[]>([]);
  const [selectedHistoryRows, setSelectedHistoryRows] = useState<ImportedXML[]>(
    []
  );

  const columnsHeader = [
    {
      field: "fileName",
      headerName: t("fileName"),
      renderCell: (value: string, row: ImportedXML) => {
        return row.importModel.fileName;
      },
    },
    {
      field: "uploadTime",
      headerName: t("uploadTime"),
      hideCopy: true,
      renderCell: (value: string, row: ImportedXML) => {
        return getFormattedDateValue(
          row.importModel.uploadTime,
          getDateFormat(true)
        );
      },
    },
    {
      field: "importTime",
      headerName: t("importTime"),
      hideCopy: true,
      renderCell: (value: string) => {
        return getFormattedDateValue(value, getDateFormat(true));
      },
    },
    {
      field: "status",
      headerName: t("status"),
      hideCopy: true,
      renderCell: (val: string) => {
        return <ReturnXMLStatusCell value={val} />;
      },
    },
  ];
  const [columns, setColumns] = useState(columnsHeader);

  useEffect(() => {
    if (selectedRows[0].id) {
      initReturnXml();
    }
    setColumns(columnsHeader);
  }, []);

  const initReturnXml = () => {
    getImportedXml(selectedRows[0].id).then((res) => {
      setData(
        res.data.map((item: ImportedXML) => ({
          ...item,
          id: item.importModel.id,
        }))
      );
    });
  };

  const onClick = () => {
    if (selectedHistoryRows && selectedHistoryRows.length === 2) {
      let firstXMLId = selectedHistoryRows[0].id;
      let secondXMLId = selectedHistoryRows[1].id;
      window.open(
        `${window.location.origin}/fina-app/FsopXmlDiff/diff.jsp?lhs=${firstXMLId}&rhs=${secondXMLId}`,
        "_blank"
      );
    }
  };

  return (
    <Box height={"100%"} display={"flex"} flexDirection={"column"}>
      <StyledToolbarWrapper>
        <StyledStatusTypography>{t("importedXML")}</StyledStatusTypography>
        <IconButton
          sx={{ padding: "2px" }}
          disabled={selectedHistoryRows.length !== 2}
        >
          <StyledLessIcon onClick={() => onClick()} />
        </IconButton>
      </StyledToolbarWrapper>
      <GridTable
        columns={columns}
        rows={data}
        setRows={setData}
        onCheckboxClick={(
          currRow: ImportedXML,
          selectedRows: ImportedXML[]
        ) => {
          setSelectedHistoryRows(selectedRows);
        }}
        size={"small"}
        checkboxEnabled={true}
      />
    </Box>
  );
};

export default ReturnXMLPage;
