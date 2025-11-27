import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { Cartesian, Container } from "@sencha/ext-react-modern";
import { BASE_REST_URL, getSafeFloatValue } from "../../../AppUtil";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const AssetsPortfolioReserveDashlet = ({
  chartRef,
  periodType,
  totalLoansMdtCode,
  reserveMdtCode,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const reservePercentFieldName = "reservePercent",
    totalLoansRoundedDecimalFieldName = "creditPortfolioRoundedDecimal",
    reserveRoundedDecimalFieldName = "reserveRoundedDecimal";

  const storeTransformData = {
    fn: (data) => {
      const dataDivider = 1000000;
      for (var d in data) {
        const creditPortfolio = getSafeFloatValue(data[d][totalLoansMdtCode]),
          reserve = getSafeFloatValue(data[d][reserveMdtCode]) * -1;

        data[d][totalLoansMdtCode] = Math.round(creditPortfolio / dataDivider);
        data[d][totalLoansRoundedDecimalFieldName] =
          Math.round((creditPortfolio / dataDivider) * 10) / 10;

        data[d][reserveMdtCode] = Math.round(reserve / dataDivider);
        data[d][reserveRoundedDecimalFieldName] =
          Math.round((reserve / dataDivider) * 10) / 10;

        const reservePercentValue =
          Math.round(((reserve * 100) / creditPortfolio) * 10) / 10;
        data[d][reservePercentFieldName] = Number.isFinite(reservePercentValue)
          ? reservePercentValue
          : 0;
      }

      return data;
    },
  };

  const store = Ext.create("Ext.data.Store", {
    fields: [
      "quarter",
      { totalLoansMdtCode },
      { reserveMdtCode },
      reservePercentFieldName,
    ],
    autoLoad: false,
    proxy: {
      type: "ajax",
      headers: {
        Authorization: "Basic ZmluYTpmaW5hMmRlbW8=",
      },
      reader: {
        type: "json",
        transform: storeTransformData,
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

  useEffect(() => {
    store.getProxy().url = `${BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=${totalLoansMdtCode},${reserveMdtCode}&periodType=${periodType}&periodQuarterType=N`;
    store.load();
  }, [periodType, isChartLabelVisible]);

  const chartConfig = {
    insetPadding: "20 20 0 20",
    innerPadding: "25 3 0 0",
    theme: "Default",
    interactions: "itemhighlight",
    numberFormat: "0,000.0",
    percentFormat: "0,000.0%",
    numberFormatAxis: "0,000",
  };

  const onTooltipRender = (tooltip, record, item) => {
    const fieldName =
      item.field !== totalLoansMdtCode
        ? reserveRoundedDecimalFieldName
        : totalLoansRoundedDecimalFieldName;

    tooltip.setHtml(
      getBoldTooltipValue(record.get(fieldName), chartConfig.numberFormat)
    );
  };

  const onLineSeriesTooltipRender = (tooltip, record, item) => {
    tooltip.setHtml(
      getBoldTooltipValue(record.get(item.field), chartConfig.percentFormat)
    );
  };

  const getBoldTooltipValue = (numericValue, format) => {
    return (
      '<div style="text-align: center; font-weight: bold">' +
      Ext.util.Format.number(numericValue, format) +
      "</div>"
    );
  };

  const renderIntegerAxes = (axis, label, layoutContext) =>
    label.toString().indexOf(".") >= 0
      ? " "
      : formatFloatNumber(label, chartConfig.numberFormatAxis);

  const formatFloatNumber = (value, format) =>
    Ext.util.Format.number(parseFloat(value), format);

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
            title: t("million"),
            fields: [totalLoansMdtCode, reserveMdtCode],
            grid: true,
            minimum: 0,
            adjustMaximumByMajorUnit: true,
            renderer: renderIntegerAxes,
          },
          {
            type: "category3d",
            position: "bottom",
            fields: "quarter",
            grid: false,
            label: {
              rotate: {
                degrees: -60,
              },
            },
          },
          {
            type: "numeric",
            position: "right",
            fields: [reservePercentFieldName],
            adjustMaximumByMajorUnit: false,
            minimum: 0,
            majorTickSteps: 4,
            renderer: (axis, label, layoutContext) =>
              formatFloatNumber(label, chartConfig.percentFormat),
          },
        ]}
        series={[
          {
            type: "bar3d",
            stacked: false,
            title: [t("creditPortfolio"), t("reserve")],
            xField: "quarter",
            yField: [totalLoansMdtCode, reserveMdtCode],
            highlight: true,
            label: {
              hidden: !isChartLabelVisible,
              display: "insideEnd",
              orientation: "vertical",
              field: [totalLoansMdtCode, reserveMdtCode],
              renderer: function (value) {
                return Ext.util.Format.number(parseFloat(value), "0,000");
              },
            },
            tooltip: {
              trackMouse: true,
              renderer: onTooltipRender,
            },
          },
          {
            type: "line",
            title: t("reserve") + " %",
            xField: "quarter",
            yField: reservePercentFieldName,
            style: {
              lineWidth: 3,
              opacity: 0.8,
            },
            showMarkers: false,
            marker: {
              type: "line",
              animation: {
                duration: 200,
              },
            },
            highlightCfg: {
              scaling: 2,
              rotationRads: Math.PI / 4,
            },
            label: {
              hidden: !isChartLabelVisible,
              field: reservePercentFieldName,
              display: "over",
              renderer: function (value) {
                return Ext.util.Format.number(parseFloat(value), "0,000.0%");
              },
            },
            tooltip: {
              trackMouse: true,
              renderer: onLineSeriesTooltipRender,
            },
          },
        ]}
      />
    </Container>
  );
};

AssetsPortfolioReserveDashlet.propTypes = {
  totalLoansMdtCode: PropTypes.string,
  reserveMdtCode: PropTypes.string,
  chartRef: PropTypes.any,
  periodType: PropTypes.string,
};

export default AssetsPortfolioReserveDashlet;
