import React from "react";
import { Cartesian, Container } from "@sencha/ext-react-modern";
import { BASE_REST_URL, getSafeFloatValue } from "../../../AppUtil";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const LiquiditiesGapDashlet = ({
  chartRef,
  under1MonthNodeCode,
  oneTo2MonthsNodeCode,
  twoTo3MonthsNodeCode,
  threeTo6MonthsNodeCode,
  sixMonthsTo1YearNodeCode,
  oneTo5YearsNodeCode,
  above5YearsNodeCode,
  returnDefinitionCode,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const chartConfig = {
    insetPadding: "10 20 70 10",
    innerPadding: "10 10 0 10",
    theme: "Default",
    interactions: "itemhighlight",
    percentFormat: "0,000%",
    numberFormatAxis: "0,000.0",
  };

  const periodUnder1MonthName = "1",
    periodName1To3Months = "2",
    periodName3To6Months = "3",
    periodName6To12Months = "4",
    periodNameAbove1Year = "5",
    liquidityGapFieldName = "liquidityGap",
    cumulativeValueFieldName = "cumulativeValue",
    gapPeriodTypeFieldName = "gapPeriodType";

  /**
   * Get field name of the period that corresponds to the node code
   * (Merge months 2 and 3)
   */
  const getPeriodFieldName = (nodeCode) => {
    let res = "";
    if (under1MonthNodeCode === nodeCode) {
      res = periodUnder1MonthName;
    } else if (
      oneTo2MonthsNodeCode === nodeCode ||
      twoTo3MonthsNodeCode === nodeCode
    ) {
      res = periodName1To3Months;
    } else if (threeTo6MonthsNodeCode === nodeCode) {
      res = periodName3To6Months;
    } else if (sixMonthsTo1YearNodeCode === nodeCode) {
      res = periodName6To12Months;
    } else {
      res = periodNameAbove1Year;
    }

    return res;
  };

  const getNumericDataGroupedByPeriod = (dataObject) => {
    let groupedData = {};

    // Sum up some of the values to unite period types
    Object.keys(dataObject).forEach((k) => {
      const periodName = getPeriodFieldName(k);
      if (!groupedData[periodName]) {
        groupedData[periodName] = 0;
      }
      groupedData[periodName] =
        groupedData[periodName] + getSafeFloatValue(dataObject[k] / 1000000);

      return groupedData;
    });

    const groupedDataArray = Object.keys(groupedData).map((k) => ({
      [gapPeriodTypeFieldName]: k,
      [liquidityGapFieldName]: groupedData[k],
    }));

    return groupedDataArray.sort((d1, d2) =>
      d1[gapPeriodTypeFieldName] > d2[gapPeriodTypeFieldName] ? 1 : -1
    );
  };

  const getComputedData = (dataGroupedByPeriod) => {
    let cumulativeValue = 0;

    return dataGroupedByPeriod.map((data) => ({
      ...data,
      [cumulativeValueFieldName]: (cumulativeValue +=
        data[liquidityGapFieldName]),
    }));
  };

  const dataTransformFn = (data) => {
    if (!data || data.length < 1) {
      return [];
    }

    const dataGroupedByGapPeriodType = getNumericDataGroupedByPeriod(
      data[data.length - 1]
    );

    return getComputedData(dataGroupedByGapPeriodType);
  };

  const store = Ext.create("Ext.data.Store", {
    fields: [
      gapPeriodTypeFieldName,
      liquidityGapFieldName,
      cumulativeValueFieldName,
    ],
    autoLoad: true,
    proxy: {
      type: "ajax",
      url: `${BASE_REST_URL}/dashboard/aggregatedDataForFinishedPeriods?nodeCodes=${under1MonthNodeCode},${oneTo2MonthsNodeCode},${twoTo3MonthsNodeCode},${threeTo6MonthsNodeCode},${sixMonthsTo1YearNodeCode},${oneTo5YearsNodeCode},${above5YearsNodeCode}&returnCode=${returnDefinitionCode}&periodType=M`,
      headers: {
        Authorization: "Basic ZmluYTpmaW5hMmRlbW8=",
      },
      reader: {
        type: "json",
        transform: {
          fn: dataTransformFn,
        },
      },
    },
  });

  store.on("beforeload", () => {
    if (chartRef.current) {
      chartRef.current.cmp.mask(t("pleaseWait"));
    }
  });

  store.on("load", () => {
    if (chartRef.current) {
      chartRef.current.cmp.unmask();
    }
  });

  const axisLabelRenderer = (axis, label) =>
    label.toString().indexOf(".") >= 0
      ? " "
      : Ext.util.Format.number(label, chartConfig.numberFormatAxis);

  const getPeriodTitle = (period) => {
    let res = "";
    switch (period) {
      case periodUnder1MonthName:
        res = t("upToOneMonth");
        break;
      case periodName1To3Months:
        res = t("oneToThreeMonth");
        break;
      case periodName3To6Months:
        res = t("threeToSixMonth");
        break;
      case periodName6To12Months:
        res = t("sixToOneYear");
        break;
      case periodNameAbove1Year:
        res = t("moreThenYear");
        break;
      default:
        res = "";
        break;
    }

    return res;
  };

  const gapPeriodLabelRenderer = (axis, label) => getPeriodTitle(label);

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
            id: "vertical-axis",
            fields: [liquidityGapFieldName, cumulativeValueFieldName],
            title: t("million"),
            grid: true,
            adjustByMajorUnit: true,
            renderer: axisLabelRenderer,
          },
          {
            type: "category3d",
            position: "bottom",
            fields: [gapPeriodTypeFieldName],
            grid: false,
            renderer: gapPeriodLabelRenderer,
            label: {
              rotate: {
                degrees: -20,
              },
            },
            floating: {
              value: 0,
              alongAxis: "vertical-axis",
            },
          },
        ]}
        series={[
          {
            type: "bar3d",
            stacked: false,
            title: t("liquiditiesGep"),
            xField: gapPeriodTypeFieldName,
            yField: [liquidityGapFieldName],
            margin: "20 20 20 20",
            highlight: true,
            label: {
              hidden: !isChartLabelVisible,
              display: "insideEnd",
              orientation: "vertical",
              field: liquidityGapFieldName,
              renderer: function (value) {
                return Ext.util.Format.number(parseFloat(value), "0,000.0");
              },
            },
            tooltip: {
              trackMouse: true,
              renderer: numericTooltipRenderer,
            },
          },
          {
            type: "line",
            title: t("cumulativeValue"),
            xField: gapPeriodTypeFieldName,
            yField: cumulativeValueFieldName,
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
              field: cumulativeValueFieldName,
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
              renderer: numericTooltipRenderer,
            },
          },
        ]}
      />
    </Container>
  );
};

export default LiquiditiesGapDashlet;
