import React, { useEffect } from "react";
import { Cartesian, Container } from "@sencha/ext-react-modern";
import axios from "axios";

import {
  BASE_REST_URL,
  getSafeFloatValue,
  yearlyCoefficient,
} from "../../../AppUtil";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const ProfitabilityCreditPortfolioAndYieldDashlet = ({
  chartRef,
  chartLoadRef,
  totalLoansNodeCode,
  totalInterestIncomeNodeCode,
  isChartLabelVisible,
  periodType,
}) => {
  const { t } = useTranslation();

  const store = Ext.create("Ext.data.Store", {
    fields: ["quarter", "creditPortfolio", "yield"],
  });

  const calculateYield = (
    totalInterestIncome,
    totalLoansTwelveYearsAverage,
    period
  ) => {
    const date = new Date(period.split("-")[1], period.split("-")[0], 0);

    return (
      (totalInterestIncome * yearlyCoefficient(date)) /
      totalLoansTwelveYearsAverage
    );
  };

  const transformData = (nodesData, totalLoansTwelveMonthsAverageData) => {
    const transformedData = [];

    nodesData.map((d) => {
      const quarter = d["quarter"];
      let dataItem = {
        quarter: quarter,
        creditPortfolio: getSafeFloatValue(d[totalLoansNodeCode]) / 1000000,
      };

      if (totalLoansTwelveMonthsAverageData) {
        totalLoansTwelveMonthsAverageData.map((totalLoansAverageDataItem) => {
          if (totalLoansAverageDataItem["quarter"] === quarter) {
            const totalInterestIncomeValue = getSafeFloatValue(
                d[totalInterestIncomeNodeCode]
              ),
              totalLoansTwelveMonsthsAverageValue = getSafeFloatValue(
                totalLoansAverageDataItem[totalLoansNodeCode]
              );

            dataItem["yield"] =
              100 *
              calculateYield(
                totalInterestIncomeValue,
                totalLoansTwelveMonsthsAverageValue,
                quarter
              );
          }
        });
      }

      transformedData.push(dataItem);
    });

    return transformedData;
  };

  const loadData = async () => {
    const requestConfigs = {
      headers: {
        Authorization: "Basic ZmluYTpmaW5hMmRlbW8=",
      },
    };

    if (chartRef.current) {
      chartRef.current.cmp.mask(t("pleaseWait"));
    }

    try {
      const nodesDataResponse = await axios.get(
        `${BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=${totalLoansNodeCode},${totalInterestIncomeNodeCode}&periodType=M`,
        requestConfigs
      );

      const totalLoansTwelveMonthsAverageResponse = await axios.get(
        `${BASE_REST_URL}/dashboard/twelveMonthAverage?nodeCodes=${totalLoansNodeCode}`,
        requestConfigs
      );

      let nodesData = nodesDataResponse.data,
        totalLoansTwelveMonthsAverageData =
          totalLoansTwelveMonthsAverageResponse.data;

      let transformedData = [];

      if (nodesData) {
        transformedData = transformData(
          nodesData,
          totalLoansTwelveMonthsAverageData
        );
      }

      store.loadData(transformedData);

      if (chartRef.current) {
        chartRef.current.cmp.unmask();
      }
    } catch (error) {
      console.error(error);
      if (chartRef.current) {
        chartRef.current.cmp.unmask();
      }
    }
  };

  chartLoadRef.current = loadData;

  useEffect(() => {
    loadData();
  }, [isChartLabelVisible, periodType]);

  const getFormattedValue = (value, formatString, isBold) => {
    const formattedValue = Ext.util.Format.number(value, formatString);
    return isBold ? `<b>${formattedValue}</b>` : formattedValue;
  };

  const numericTooltipRenderer = (tooltip, record, item) => {
    tooltip.setHtml(
      getFormattedValue(
        record.get(item.field),
        chartConfig.numberFormatAxis,
        true
      )
    );
  };

  const percentageTooltipRenderer = (tooltip, record, item) => {
    tooltip.setHtml(
      getFormattedValue(record.get(item.field), chartConfig.percentFormat, true)
    );
  };

  return (
    <Container layout="vbox">
      <Cartesian
        shadow
        flex={2}
        store={store}
        theme={chartConfig.theme}
        ref={chartRef}
        insetPadding={chartConfig.insetPadding}
        innerPadding={chartConfig.innerPadding}
        interactions={chartConfig.interactions}
        animation={{ duration: 200 }}
        legend={{ type: "sprite" }}
        axes={[
          {
            type: "numeric3d",
            position: "left",
            fields: ["creditPortfolio"],
            title: t("million"),
            grid: true,
            adjustByMajorUnit: true,
          },
          {
            type: "numeric3d",
            position: "right",
            fields: ["yield"],
            minimum: 0,
            renderer: (axis, label, layoutContext) =>
              layoutContext.renderer(label) + "%",
          },
          {
            type: "category3d",
            position: "bottom",
            fields: ["quarter"],
            grid: false,
            label: {
              rotate: {
                degrees: -60,
              },
            },
          },
        ]}
        series={[
          {
            type: "bar3d",
            stacked: false,
            title: t("creditPortfolio"),
            xField: "quarter",
            yField: "creditPortfolio",
            margin: "20 20 20 20",
            highlight: true,
            label: {
              hidden: !isChartLabelVisible,
              display: "insideEnd",
              orientation: "vertical",
              field: "creditPortfolio",
              renderer: function (value) {
                if (value) {
                  return Ext.util.Format.number(
                    value,
                    chartConfig.numberFormatAxis
                  );
                }
                return value;
              },
            },
            tooltip: {
              trackMouse: true,
              renderer: numericTooltipRenderer,
            },
          },
          {
            type: "line",
            title: t("yield"),
            xField: "quarter",
            yField: "yield",
            nullStyle: "origin",
            style: {
              lineWidth: 3,
              opacity: 0.8,
              stroke: "red",
            },
            showMarkers: false,
            marker: {
              type: "line",
              stroke: "red",
              animation: {
                duration: 200,
              },
            },
            label: {
              hidden: !isChartLabelVisible,
              field: "yield",
              display: "over",
              renderer: function (value) {
                return Ext.util.Format.number(parseFloat(value), "0,000.0%");
              },
            },
            highlightCfg: {
              scaling: 2,
              rotationRads: Math.PI / 4,
            },
            tooltip: {
              trackMouse: true,
              renderer: percentageTooltipRenderer,
            },
          },
        ]}
      />
    </Container>
  );
};

const chartConfig = {
  insetPadding: "10 20 0 10",
  innerPadding: "25 10 0 10",
  theme: "Default",
  interactions: "itemhighlight",
  percentFormat: "0,000%",
  numberFormatAxis: "0,000.0",
};

export default ProfitabilityCreditPortfolioAndYieldDashlet;
