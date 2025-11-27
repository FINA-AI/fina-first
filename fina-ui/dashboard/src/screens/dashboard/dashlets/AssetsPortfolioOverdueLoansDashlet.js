import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { Cartesian, Container } from "@sencha/ext-react-modern";
import { BASE_REST_URL, getSafeFloatValue } from "../../../AppUtil";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const AssetsPortfolioOverdueLoansDashlet = ({
  chartRef,
  periodType,
  creditPortfolioMdtCode,
  loansOverdue31_60MdtCode,
  loansOverdue61_90MdtCode,
  loansOverdue91_120MdtCode,
  loansOverdue121_150MdtCode,
  loansOverdue151_180MdtCode,
  loansOverdue180_PlusMdtCode,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const overdueLoansFieldName = "overdueLoans",
    overdueLoansPercentFieldName = "overdueLoansPercent",
    overdueLoansRoundedDecimalFieldName = "overdueLoansRoundedDecimal",
    creditPortfolioRoundedDecimalFieldName = "creditPortfolioRoundedDecimal";

  //  overdue > 30 days
  const getTotalOverdueLoans = (dataItem) => {
    return (
      getSafeFloatValue(dataItem[loansOverdue31_60MdtCode]) +
      getSafeFloatValue(dataItem[loansOverdue61_90MdtCode]) +
      getSafeFloatValue(dataItem[loansOverdue91_120MdtCode]) +
      getSafeFloatValue(dataItem[loansOverdue121_150MdtCode]) +
      getSafeFloatValue(dataItem[loansOverdue151_180MdtCode]) +
      getSafeFloatValue(dataItem[loansOverdue180_PlusMdtCode])
    );
  };

  const storeTransformData = {
    fn: (data) => {
      const dataDivider = 1000000;
      for (var d in data) {
        const creditPortfolio = getSafeFloatValue(
            data[d][creditPortfolioMdtCode]
          ),
          totalOverdueLoans = getTotalOverdueLoans(data[d]);

        data[d][creditPortfolioMdtCode] = Math.round(
          creditPortfolio / dataDivider
        );
        data[d][creditPortfolioRoundedDecimalFieldName] =
          Math.round((creditPortfolio / dataDivider) * 10) / 10;

        data[d][overdueLoansFieldName] = Math.round(
          totalOverdueLoans / dataDivider
        );
        data[d][overdueLoansRoundedDecimalFieldName] =
          Math.round((totalOverdueLoans / dataDivider) * 10) / 10;

        const overdueLoansPercenValue =
          Math.round(((totalOverdueLoans * 100) / creditPortfolio) * 10) / 10;
        data[d][overdueLoansPercentFieldName] = Number.isFinite(
          overdueLoansPercenValue
        )
          ? overdueLoansPercenValue
          : 0;
      }

      return data;
    },
  };

  const store = Ext.create("Ext.data.Store", {
    fields: [
      "quarter",
      { creditPortfolioMdtCode },
      overdueLoansFieldName,
      overdueLoansPercentFieldName,
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
    store.getProxy().url = `${BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=${creditPortfolioMdtCode},${loansOverdue31_60MdtCode},${loansOverdue61_90MdtCode},${loansOverdue91_120MdtCode},${loansOverdue121_150MdtCode},${loansOverdue151_180MdtCode},${loansOverdue180_PlusMdtCode}&periodType=${periodType}&periodQuarterType=N`;
    store.load();
  }, [isChartLabelVisible, periodType]);

  const onTooltipRender = (tooltip, record, item) => {
    const fieldName =
      item.field !== creditPortfolioMdtCode
        ? overdueLoansRoundedDecimalFieldName
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

  const chartConfig = {
    insetPadding: "20 20 0 20",
    innerPadding: "25 3 0 0",
    theme: "Default",
    interactions: "itemhighlight",
    numberFormat: "0,000.0",
    percentFormat: "0,000.0%",
    numberFormatAxis: "0,000",
  };

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
            fields: [creditPortfolioMdtCode, overdueLoansFieldName],
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
            fields: [overdueLoansPercentFieldName],
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
            title: [t("creditPortfolio"), t("AssetsPortfolioOverdueLoansDashletLegendLiabilities") + " (>30)"],
            xField: "quarter",
            yField: [creditPortfolioMdtCode, overdueLoansFieldName],
            highlight: true,
            label: {
              hidden: !isChartLabelVisible,
              display: "insideEnd",
              orientation: "vertical",
              field: [creditPortfolioMdtCode, overdueLoansFieldName],
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
            title: t("AssetsPortfolioOverdueLoansDashletLegendLiabilities") + " (>30) %",
            xField: "quarter",
            yField: overdueLoansPercentFieldName,
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
              field: overdueLoansPercentFieldName,
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

AssetsPortfolioOverdueLoansDashlet.propTypes = {
  creditPortfolioMdtCode: PropTypes.string,
  loansOverdue31_60MdtCode: PropTypes.string,
  loansOverdue61_90MdtCode: PropTypes.string,
  loansOverdue91_120MdtCode: PropTypes.string,
  loansOverdue121_150MdtCode: PropTypes.string,
  loansOverdue151_180MdtCode: PropTypes.string,
  loansOverdue180_PlusMdtCode: PropTypes.string,
  chartRef: PropTypes.any,
  periodType: PropTypes.string,
  isChartLabelVisible: PropTypes.bool,
};

export default AssetsPortfolioOverdueLoansDashlet;
