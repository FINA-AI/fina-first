import { Box } from "@mui/system";
import Select from "../../common/Field/Select";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import { CircularProgress, Typography } from "@mui/material";
import GridTable from "../../common/Grid/GridTable";
import CustomPieChart from "../../common/Chart/CustomPieChart";
import CustomBarChart from "../../common/Chart/CustomBarChart";
import CustomSimpleAreaChart from "../../common/Chart/CustomSimpleAreaChart";
import CustomSimpleBarChart from "../../common/Chart/CustomSimpleBarChart";
import CustomSimpleLineChart from "../../common/Chart/CustomSimpleLineChart";
import CustomStackedAreaChart from "../../common/Chart/CustomStackedAreaChart";
import CustomStackedBarChart from "../../common/Chart/CustomStackedBarChart";
import CustomRadarChart from "../../common/Chart/CustomRadarChart";
import {
  DashletDataType,
  DashletStyleType,
  DashletType,
} from "../../../types/dashboard.type";
import { GridColumnType } from "../../../types/common.type";
import { styled } from "@mui/material/styles";

interface DashletSelectionProps {
  generateColumns: () => GridColumnType[];
  previewData: DashletDataType[];
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedChart: string;
  setSelectedChart: (value: string) => void;
  dashletData: DashletType;
  chartColors: DashletStyleType;
  loading: boolean;
  setPreviewData: (data: DashletDataType[]) => void;
}

const StyledPreviewWrapper = styled(Box)(({ theme }: any) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#2B3748" : "#F9F9F9",
  padding: "8px 24px",
}));

const StyledPreviewContentWrapper = styled(Box)(({ theme }: any) => ({
  border: `1px solid ${
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.32)" : "#EAEBF0"
  }`,
  backgroundColor: theme.palette.paperBackground,
  borderRadius: 4,
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const StyledPreviewText = styled(Typography)({
  fontSize: 11,
  fontWeight: 500,
  marginLeft: "12px",
  marginBottom: "4px",
  lineHeight: "12px",
  opacity: 0.6,
});

const StyledText = styled(Typography)({
  lineBreak: "anywhere",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontWeight: 600,
  fontSize: 11,
  lineHeight: "16px",
});

const StyledCircularProgressBox = styled(Box)({
  display: "flex",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
});

const DashletSelection: React.FC<DashletSelectionProps> = ({
  generateColumns,
  previewData,
  selectedType,
  setSelectedType,
  selectedChart,
  setSelectedChart,
  dashletData,
  chartColors,
  loading,
  setPreviewData,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    getChart();
  }, [previewData]);

  const GetPieChart = ({
    previewData,
    style,
  }: {
    previewData: DashletDataType[];
    style?: DashletStyleType;
  }) => {
    return <CustomPieChart data={previewData} style={style} />;
  };

  const getChart = () => {
    if (selectedType === "TABLE" && previewData?.length > 0) {
      return (
        <Box width={"100%"}>
          <GridTable
            columns={generateColumns()}
            rows={previewData}
            setRows={setPreviewData}
            selectedRows={[]}
            size={"small"}
            loading={false}
          />
        </Box>
      );
    } else if (selectedType === "CHART") {
      switch (selectedChart) {
        case "SIMPLEAREACHART":
          return (
            <CustomSimpleAreaChart data={previewData} style={chartColors} />
          );
        case "SIMPLEBARCHART":
          return (
            <CustomSimpleBarChart data={previewData} style={chartColors} />
          );
        case "SIMPLELINECHART":
          return (
            <CustomSimpleLineChart data={previewData} style={chartColors} />
          );
        case "STACKEDAREACHART":
          return (
            <CustomStackedAreaChart data={previewData} style={chartColors} />
          );
        case "STACKEDBARCHART":
          return (
            <CustomStackedBarChart data={previewData} style={chartColors} />
          );
        case "PIECHART":
          return <GetPieChart previewData={previewData} />;
        case "BARCHART":
          return <CustomBarChart data={previewData} />;
        case "COLUMN":
          return <CustomBarChart columnChart={true} data={previewData} />;
        case "RADAR":
          return <CustomRadarChart data={previewData} style={chartColors} />;
        default:
          return <GetPieChart previewData={previewData} style={chartColors} />;
      }
    }
  };

  return (
    <Box display={"flex"} height={"100%"} overflow={"auto"}>
      {loading ? (
        <StyledCircularProgressBox>
          <CircularProgress />
        </StyledCircularProgressBox>
      ) : (
        <Box
          display={"flex"}
          height={"100%"}
          flexDirection={"column"}
          width={"100%"}
        >
          <Box padding={"14px 12px 8px 12px"}>
            <Select
              value={selectedType}
              data={[
                { label: t("table"), value: "TABLE" },
                { label: t("chart"), value: "CHART" },
              ]}
              onChange={(val) => {
                setSelectedType(val);
              }}
              data-testid={"type-select"}
            />
            <Box marginTop={"16px"}>
              {selectedType === "CHART" && (
                <Select
                  value={selectedChart ? selectedChart : "PIECHART"}
                  onChange={(val) => {
                    setSelectedChart(val);
                  }}
                  data={[
                    { label: t("pieChart"), value: "PIECHART" },
                    { label: t("barChart"), value: "BARCHART" },
                    { label: t("column"), value: "COLUMN" },
                    { label: t("simpleareachart"), value: "SIMPLEAREACHART" },
                    { label: t("simplebarchart"), value: "SIMPLEBARCHART" },
                    { label: t("simplelinechart"), value: "SIMPLELINECHART" },
                    { label: t("stackedareachart"), value: "STACKEDAREACHART" },
                    { label: t("stackedbarchart"), value: "STACKEDBARCHART" },
                    { label: t("radar"), value: "RADAR" },
                  ]}
                />
              )}
            </Box>
          </Box>
          <StyledPreviewWrapper
            display={"flex"}
            height={"100%"}
            flexDirection={"column"}
          >
            <StyledPreviewText>{t("preview")}</StyledPreviewText>
            <StyledPreviewContentWrapper display={"flex"}>
              <Box
                borderBottom={
                  selectedType !== "TABLE" ? "1px solid #EAEBF0" : ""
                }
                display={"flex"}
                padding={"8px 12px"}
              >
                <StyledText>{dashletData.name}</StyledText>
              </Box>
              <Box display={"flex"} height={"100%"}>
                {getChart()}
              </Box>
            </StyledPreviewContentWrapper>
          </StyledPreviewWrapper>
        </Box>
      )}
    </Box>
  );
};

export default DashletSelection;
