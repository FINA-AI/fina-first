import { Box } from "@mui/system";
import { IconButton, Typography } from "@mui/material";
import GridTable from "../common/Grid/GridTable";
import ClosableModal from "../common/Modal/ClosableModal";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import React, { useState } from "react";
import Tooltip from "../common/Tooltip/Tooltip";
import { useTranslation } from "react-i18next";
import withLoading from "../../hoc/withLoading";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import { styled } from "@mui/material/styles";
import { StoredReportGridData } from "../../types/report.type";
import ActionBtn from "../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import ReportParameterEditModal from "./Edit/ReportParameterEditModal";
import { Parameter } from "../../types/reportGeneration.type";
import { PERMISSIONS } from "../../api/permissions";
import useConfig from "../../hoc/config/useConfig";
import { ReportParameterType } from "./Generate/ParameterTypeNames";

interface ReportDetailsTableProps {
  editable: boolean;
  gridData: StoredReportGridData[];
  setGridData: (data: StoredReportGridData) => void;
  orderRowByHeader(cellName: string, arrowDirection: string): void;
  reportId: number;
  updateParameter: (
    parameter: Parameter,
    paramName: string,
    reportId: number
  ) => boolean;
}

const StyledRoot = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light" ? "#F0F4FF" : theme.palette.primary.light,
}));

const StyledMainHeadline = styled(Typography)(({ theme }: { theme: any }) => ({
  fontSize: 14,
  fontWeight: 600,
  color: theme.palette.textColor,
}));

const StyledTable = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: "0px",
  padding: "10px",
});

const StyledModalContent = styled(Box)(({ theme }: { theme: any }) => ({
  display: "flex",
  flexDirection: "column",
  color: theme.palette.textColor,
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "20px",
  overflow: "auto",
  height: "100%",
}));

const StyledModalFooter = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.modalContent,
  display: "flex",
  justifyContent: "flex-end",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  padding: "12px",
  "& .MuiSvgIcon-root": {
    paddingLeft: "10px",
  },
}));

const StyledValueContent = styled(Typography)(({ theme }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  textDecoration: "underline",
  fontSize: 14,
  color: theme.palette.primary.main,
}));

const ReportDetailsTable: React.FC<ReportDetailsTableProps> = ({
  editable,
  gridData,
  setGridData,
  orderRowByHeader,
  reportId,
  updateParameter,
}) => {
  const { t } = useTranslation();
  const [valueModalOpen, setValueModalOpen] = useState(false);
  const [viewValues, setViewValues] = useState<{
    row: StoredReportGridData;
    values: string[];
  }>();

  const [parameterEditModalProps, setParameterEditModalProps] = useState<{
    open: boolean;
    selectedItem?: StoredReportGridData;
  }>({ open: false });

  const { hasPermission } = useConfig();

  const hasReportAmendPermission = hasPermission(PERMISSIONS.REPORTS_AMEND);

  const columns = [
    {
      field: "dimensionType",
      hideCopy: true,
      hideSort: true,
      flex: 1,
      renderCell: (row: string) => {
        const imgName = row === "parameter" ? "Parameter" : "Dimension";
        return (
          <img
            src={process.env.PUBLIC_URL + `/images/${imgName}.png`}
            alt="parameter-logo"
          />
        );
      },
    },
    {
      field: "name",
      headerName: t("name"),
      hideCopy: true,
      flex: 3,
    },
    {
      field: "type",
      headerName: t("type"),
      renderCell: (row: number) => {
        return row;
      },
      hideCopy: true,
      flex: 3,
    },
    {
      field: "values",
      headerName: t("value"),
      flex: 3,
      renderCell: (values: string[], row: StoredReportGridData) => {
        const handleClick = () => {
          setValueModalOpen(true);
          setViewValues({ values: values, row: row });
        };
        const formattedValues = values?.join(" , ");

        return row.type === ReportParameterType.VCT ||
          row.type === ReportParameterType.PLAIN_VCT ? (
          <IconButton size={"small"} onClick={handleClick}>
            <PriorityHighRoundedIcon />
          </IconButton>
        ) : (
          <Tooltip title={formattedValues}>
            <StyledValueContent onClick={handleClick}>
              {formattedValues}
            </StyledValueContent>
          </Tooltip>
        );
      },
      hideCopy: true,
    },
  ];

  const displayDimensionParameterValues = (
    dataArray?: string[],
    row?: StoredReportGridData
  ) => {
    if (
      row?.type === ReportParameterType.VCT ||
      row?.type === ReportParameterType.PLAIN_VCT
    ) {
      const vctIteratorInfo = row?.vctIteratorInfo;
      return (
        <div>
          <div>
            <strong>{t("type")}:</strong> {row?.type}
          </div>
          <div>
            <strong>{t("tableName")}:</strong> {vctIteratorInfo?.tableName}
          </div>
          <div>
            <strong>{t("groupedBy")}:</strong>{" "}
            {vctIteratorInfo?.groupByDefinitionCode}
          </div>
          <div>
            <strong>{t("aggregateBy")}:</strong> {vctIteratorInfo?.aggregateBy}
          </div>
          <div>
            <strong>{t("skipRowCondition")}:</strong>{" "}
            {vctIteratorInfo?.skipRowCondition}
          </div>
          <div>
            <strong>{t("returnVersion")}:</strong>{" "}
            {vctIteratorInfo?.versionCode}
          </div>
          <div>
            <strong>{t("periodParameter")}:</strong>{" "}
            {vctIteratorInfo?.periodParameter}
          </div>
          <div>
            <strong>{t("periodParameterValues")}:</strong>
            {vctIteratorInfo?.periodParameterValues?.map(
              (value: string, index: number) => (
                <div key={index}>{value}</div>
              )
            )}
          </div>
          <div>
            <strong>{t("fiParameter")}:</strong>{" "}
            {vctIteratorInfo?.aggregateParameter}
          </div>
          <div>
            <strong>{t("fiParameterValues")}:</strong>
            {vctIteratorInfo?.aggregateValues?.map(
              (value: string, index: number) => (
                <div key={index}>{value}</div>
              )
            )}
          </div>
        </div>
      );
    }

    return dataArray?.map((item: string) => {
      return item;
    });
  };

  //TODO implement OFFSET,VCT and PLAIN VCT edit
  const implementedTypes = (selectedRow: StoredReportGridData) => {
    const type = selectedRow.type;

    switch (type) {
      case ReportParameterType.BANK:
      case ReportParameterType.NODE:
      case ReportParameterType.PERIOD:
      case ReportParameterType.VERSION:
      case ReportParameterType.PEER:
        return true;
      default:
        return false;
    }
  };

  let actionButtons = (row: StoredReportGridData, index: number) => {
    return hasReportAmendPermission && editable && implementedTypes(row) ? (
      <ActionBtn
        onClick={() => {
          setParameterEditModalProps({ open: true, selectedItem: row });
        }}
        children={<EditIcon />}
        rowIndex={index}
      />
    ) : null;
  };

  return (
    <>
      <StyledRoot height={"100%"} width={"100%"}>
        <StyledTable>
          <StyledMainHeadline>Parameter & Dimension</StyledMainHeadline>
          <StyledTable
            pt={"10px"}
            pb={"10px"}
            data-testid={"report-details-table-wrapper"}
          >
            <GridTable
              columns={columns}
              rows={gridData}
              setRows={setGridData}
              orderRowByHeader={orderRowByHeader}
              selectedRows={[]}
              actionButtons={editable && actionButtons}
            />
          </StyledTable>
        </StyledTable>
      </StyledRoot>
      {parameterEditModalProps.open && (
        <ReportParameterEditModal
          open={parameterEditModalProps.open}
          handleClose={() => {
            setParameterEditModalProps({
              open: false,
            });
          }}
          reportId={reportId}
          selectedItem={parameterEditModalProps.selectedItem}
          updateParameter={updateParameter}
        />
      )}
      {valueModalOpen && (
        <ClosableModal
          onClose={() => {
            setValueModalOpen(false);
          }}
          open={valueModalOpen}
          width={530}
          height={400}
          includeHeader={true}
          titleFontWeight={"600"}
          title={
            viewValues?.row.dimensionType === "parameter"
              ? t("parameterValues")
              : t("dimensionValues")
          }
        >
          <Box display={"flex"} flexDirection={"column"} height={"100%"}>
            <StyledModalContent>
              <Box overflow={"auto"} padding={"20px"}>
                {displayDimensionParameterValues(
                  viewValues?.values,
                  viewValues?.row
                )}
              </Box>
            </StyledModalContent>
            <StyledModalFooter>
              <PrimaryBtn
                onClick={() => {
                  setValueModalOpen(false);
                }}
              >
                {t("close")}
              </PrimaryBtn>
            </StyledModalFooter>
          </Box>
        </ClosableModal>
      )}
    </>
  );
};

export default withLoading(ReportDetailsTable);
