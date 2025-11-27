import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { Cartesian, Container } from "@sencha/ext-react-modern";
import { BASE_REST_URL, getSafeFloatValue } from "../../../AppUtil";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const AssetsPortfolioNplDashlet = ({
  chartRef,
  periodType,
  totalLoansMdtCode,
  standardLoansMdtCode,
  remarkableLoansMdtCode,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const nplFieldName = "npl",
    nplPercentFieldName = "nplPercent",
    nplFieldRoundedDecimalName = "nplRoundedDecimal",
    creditPortfolioRoundedDecimalFieldName = "creditPortfolioRoundedDecimal";

  const storeTransformData = {
    fn: (data) => {
      const dataDivider = 1000000;
      for (var d in data) {
        const creditPortfolio =
          getSafeFloatValue(data[d][totalLoansMdtCode]) / dataDivider;
        data[d][creditPortfolioRoundedDecimalFieldName] =
          Math.round(creditPortfolio * 10) / 10;

        const totalLoans =
            getSafeFloatValue(data[d][totalLoansMdtCode]) / dataDivider,
          standardLoans =
            getSafeFloatValue(data[d][standardLoansMdtCode]) / dataDivider,
          remarkableLoans =
            getSafeFloatValue(data[d][remarkableLoansMdtCode]) / dataDivider,
          npl = totalLoans - standardLoans - remarkableLoans,
          nplPercentValue = Math.round((npl / totalLoans) * 100 * 10) / 10;

        data[d][nplPercentFieldName] = Number.isFinite(nplPercentValue)
          ? nplPercentValue
          : 0;

        data[d][totalLoansMdtCode] = Math.round(creditPortfolio);
        data[d][nplFieldName] = Math.round(npl);
        data[d][nplFieldRoundedDecimalName] = Math.round(npl * 10) / 10;
      }

      return data;
    },
  };

  const store = Ext.create("Ext.data.Store", {
    fields: [
      "quarter",
      { totalLoansMdtCode },
      nplFieldName,
      nplPercentFieldName,
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
    store.getProxy().url = `${BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=${totalLoansMdtCode},${standardLoansMdtCode},${remarkableLoansMdtCode}&periodType=${periodType}&periodQuarterType=N`;
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
        ? nplFieldRoundedDecimalName
        : creditPortfolioRoundedDecimalFieldName;

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
            fields: [totalLoansMdtCode, nplFieldName],
            grid: true,
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
            fields: [nplPercentFieldName],
            adjustMaximumByMajorUnit: false,
            minimum: 0,
            majorTickSteps: 4,
          },
        ]}
        series={[
          {
            type: "bar3d",
            stacked: false,
            title: [t("creditPortfolio"), "NPL"],
            xField: "quarter",
            yField: [totalLoansMdtCode, nplFieldName],
            highlight: true,
            label: {
              hidden: !isChartLabelVisible,
              display: "insideEnd",
              orientation: "vertical",
              field: [totalLoansMdtCode, nplFieldName],
              renderer: (value) =>
                formatFloatNumber(value, chartConfig.numberFormatAxis),
            },
            tooltip: {
              trackMouse: true,
              renderer: onTooltipRender,
            },
          },
          {
            type: "line",
            title: "NPL%",
            xField: "quarter",
            yField: nplPercentFieldName,
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
              field: nplPercentFieldName,
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

AssetsPortfolioNplDashlet.propTypes = {
  totalLoansMdtCode: PropTypes.string,
  standardLoansMdtCode: PropTypes.string,
  remarkableLoansMdtCode: PropTypes.string,
  chartRef: PropTypes.any,
  periodType: PropTypes.string,
  isChartLabelVisible: PropTypes.bool,
};

export default AssetsPortfolioNplDashlet;
