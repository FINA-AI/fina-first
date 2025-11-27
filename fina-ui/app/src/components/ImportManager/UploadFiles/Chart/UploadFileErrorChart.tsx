import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import UploadFileStatPieChart from "./UploadFileStatPieChart";
import CounterWidget from "../Widget/CounterWidget";
import { UploadFileStatusType } from "../../../../types/uploadFile.type";
import { ChartData } from "../../../../types/importManager.type";

export interface UploadFileErrorChartProps {
  data: UploadFileStatusType[];
  wholePage?: boolean;
  validationErrorCount: number;
  setValidationErrorCount: (count: number) => void;
}

const COLORS = new Map([
  ["ERRORS", "#F8A500"],
  ["IMPORTED", "#9C74F1"],
]);

const StyledGridContainer = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "wholePage",
})<{ wholePage: boolean }>(({ theme, wholePage }) => ({
  height: !wholePage ? "300px" : "340px",
  [theme.breakpoints.down("md")]: {
    height: !wholePage ? "238px" : "277px",
  },
}));

const commonStyles = (theme: any, props: any) => ({
  border: theme.general.border,
  borderRadius: theme.general.borderRadius,
  marginTop: props.wholePage ? "10px" : "10px",
  marginLeft: props.wholePage ? "10px" : "10%",
  marginBottom: props.wholePage ? "10px" : "10px",
  height: props.isSm ? "73%" : "100%",
});

const StyledChartContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "props",
})<{ props: any }>(({ theme, props }) => ({
  ...commonStyles(theme, props),
  marginRight: props.wholePage ? "10px" : "inherit",
  [theme.breakpoints.only("xs")]: {
    marginRight: props.wholePage ? "0px" : "inherit",
    marginLeft: props.wholePage ? "10px" : "3%",
  },
}));

const StyledValidationContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "props",
})<{ props: any }>(({ theme, props }) => ({
  ...commonStyles(theme, props),
  marginRight: props.wholePage ? "10px" : "10%",
  marginLeft: props.wholePage ? "10px" : "inherit",
  // height: "100%",
  [theme.breakpoints.only("xs")]: {
    marginRight: props.wholePage ? "10px" : "0",
  },
}));

const StyledStickyChartBox = styled(Box)({
  position: "sticky",
  top: 0,
  zIndex: 998,
  height: "100%",
});

const UploadFileErrorChart: React.FC<UploadFileErrorChartProps> = ({
  data,
  wholePage = false,
  validationErrorCount,
  setValidationErrorCount,
}) => {
  const query = useTheme();
  const isSm = useMediaQuery(query.breakpoints.down("md"));

  const { t } = useTranslation();

  const [percentage, setPercentage] = useState("");
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!data) {
      return;
    }
    const errors = data.filter((d) => d.status === "ERRORS");
    const errorCount = errors.length;
    const importedCount = data.filter((d) => d.status === "IMPORTED").length;
    let validationErrorsCount = 0;

    errors.forEach((d) => {
      if (d.message) {
        validationErrorsCount += d.message.split("|").length;
      }
    });

    setValidationErrorCount(validationErrorsCount);
    const percentage = Math.round((importedCount / data.length) * 100);
    setPercentage(percentage + "%");

    let chartData = [
      {
        name:
          errorCount > 1
            ? `${errorCount} ${t("errors")}`
            : `${errorCount} ${t("error")}`,
        value: errorCount,
        key: "ERRORS",
      },
      {
        name: `${importedCount} ${t("imported")}`,
        value: importedCount,
        key: "IMPORTED",
      },
    ];

    setChartData(chartData);
  }, [data]);

  return (
    <StyledStickyChartBox display={"flex"} flex={1}>
      <StyledGridContainer
        wholePage={wholePage}
        container
        direction={"row"}
        spacing={2}
      >
        <Grid item md={wholePage ? 12 : false} xs={7}>
          <StyledChartContainer props={{ wholePage: wholePage, isSm: isSm }}>
            <UploadFileStatPieChart
              data={chartData}
              COLORS={COLORS}
              chartTitle={""}
              legendTitle={""}
              chartPercentage={percentage}
              centerSubTitle={t("imported")}
              height={wholePage ? 300 : 250}
              legendAlign={{ vAlign: "middle", align: "right" }}
            />
          </StyledChartContainer>
        </Grid>
        <Grid item xs={5} md={wholePage ? 12 : false}>
          <StyledValidationContainer
            props={{ wholePage: wholePage, isSm: isSm }}
          >
            <CounterWidget
              count={validationErrorCount}
              subTitle={validationErrorCount > 1 ? t("errors") : t("error")}
              direction={!wholePage ? "column" : "row"}
            />
          </StyledValidationContainer>
        </Grid>
      </StyledGridContainer>
    </StyledStickyChartBox>
  );
};

export default UploadFileErrorChart;
