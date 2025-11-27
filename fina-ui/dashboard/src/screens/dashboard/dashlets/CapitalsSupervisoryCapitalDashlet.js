import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { Cartesian, Container } from "@sencha/ext-react-modern";
import { BASE_REST_URL, getSafeFloatValue } from "../../../AppUtil";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const CapitalsSupervisoryCapitalDashlet = ({
  chartRef,
  periodType,
  authorizedCapitalMdtCode,
  subordinatedLoansMdtCode,
  retainedEarningsMdtCode,
  emissionCapitalMdtCode,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const authorizedCapitalRoundedDecimalFieldName =
      "authorizedCapitalRoundedDecimal",
    subordinatedLoansRoundedDecimalFieldName =
      "subordinatedLoansRoundedDecimal",
    retainedEarningsRoundedDecimalFieldName = "retainedEarningsRoundedDecimal",
    emissionCapitalRoundedDecimalFieldName = "emissionCapitalRoundedDecimal";

  const storeTransformData = {
    fn: (data) => {
      const dataDivider = 1000000;
      for (var d in data) {
        // authorized capital
        const authorizedCapitalValue =
          getSafeFloatValue(data[d][authorizedCapitalMdtCode]) / dataDivider;
        data[d][authorizedCapitalMdtCode] = Math.round(authorizedCapitalValue);
        data[d][authorizedCapitalRoundedDecimalFieldName] =
          Math.round(authorizedCapitalValue * 10) / 10;

        // subordinated loans
        const subordinatedLoansValue =
          getSafeFloatValue(data[d][subordinatedLoansMdtCode]) / dataDivider;
        data[d][subordinatedLoansMdtCode] = Math.round(subordinatedLoansValue);
        data[d][subordinatedLoansRoundedDecimalFieldName] =
          Math.round(subordinatedLoansValue * 10) / 10;

        // retained earnings
        const retainedEarningsValue =
          getSafeFloatValue(data[d][retainedEarningsMdtCode]) / dataDivider;
        data[d][retainedEarningsMdtCode] = Math.round(retainedEarningsValue);
        data[d][retainedEarningsRoundedDecimalFieldName] =
          Math.round(retainedEarningsValue * 10) / 10;

        // emission Capital
        const emissionCapitalValue =
          getSafeFloatValue(data[d][emissionCapitalMdtCode]) / dataDivider;
        data[d][emissionCapitalMdtCode] = Math.round(emissionCapitalValue);
        data[d][emissionCapitalRoundedDecimalFieldName] =
          Math.round(emissionCapitalValue * 10) / 10;
      }

      return data;
    },
  };

  const store = Ext.create("Ext.data.Store", {
    fields: [
      "quarter",
      { authorizedCapitalMdtCode },
      { subordinatedLoansMdtCode },
      { retainedEarningsMdtCode },
      { emissionCapitalMdtCode },
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
    store.getProxy().url = `${BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=${authorizedCapitalMdtCode},${subordinatedLoansMdtCode},${retainedEarningsMdtCode},${emissionCapitalMdtCode}&periodType=${periodType}&periodQuarterType=N`;
    store.load();
  }, [periodType, isChartLabelVisible]);

  const chartConfig = {
    insetPadding: "20 20 0 20",
    innerPadding: "10 3 0 0",
    theme: "Default",
    interactions: "itemhighlight",
    numberFormat: "0,000.0",
    percentFormat: "0,000.0%",
    numberFormatAxis: "0,000",
  };

  const onTooltipRender = (tooltip, record, item) => {
    const fieldIndex = Ext.Array.indexOf(item.series.getYField(), item.field),
      sector = item.series.getTitle()[fieldIndex];

    let fieldName = null;
    switch (item.field) {
      case authorizedCapitalMdtCode:
        fieldName = authorizedCapitalRoundedDecimalFieldName;
        break;
      case subordinatedLoansMdtCode:
        fieldName = subordinatedLoansRoundedDecimalFieldName;
        break;
      case retainedEarningsMdtCode:
        fieldName = retainedEarningsRoundedDecimalFieldName;
        break;
      case emissionCapitalMdtCode:
        fieldName = emissionCapitalRoundedDecimalFieldName;
      default:
        break;
    }

    if (fieldName) {
      tooltip.setHtml(
        '<div style="text-align: center; font-weight: bold">' +
          sector +
          ": " +
          Ext.util.Format.number(
            parseFloat(record.get(fieldName)),
            chartConfig.numberFormat
          ) +
          "</div>"
      );
    }
  };

  const renderIntegerAxes = (axis, label, layoutContext) =>
    label.toString().indexOf(".") >= 0
      ? " "
      : formatFloatNumber(label, chartConfig.numberFormatAxis);

  const formatFloatNumber = (value, format) =>
    Ext.util.Format.number(parseFloat(value), format);

  return (
    <Container layout="fit">
      <Cartesian
        shadow
        store={store}
        theme={chartConfig.theme}
        ref={chartRef}
        interactions={chartConfig.interactions}
        insetPadding={chartConfig.insetPadding}
        innerPadding={chartConfig.innerPadding}
        legend={{ type: "sprite" }}
        axes={[
          {
            type: "numeric3d",
            position: "left",
            title: t("million"),
            adjustMaximumByMajorUnit: true,
            renderer: renderIntegerAxes,
            grid: true,
          },
          {
            type: "category3d",
            position: "bottom",
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
            stacked: true,
            title: [
              t("ownersEquity"),
              t("subordinatedLoans"),
              t("retainedEarnings"),
              t("emissionCapital"),
            ],
            xField: "quarter",
            yField: [
              authorizedCapitalMdtCode,
              subordinatedLoansMdtCode,
              retainedEarningsMdtCode,
              emissionCapitalMdtCode,
            ],
            label: {
              hidden: !isChartLabelVisible,
              display: "outside",
              orientation: "horizontal",
              field: [
                authorizedCapitalMdtCode,
                subordinatedLoansMdtCode,
                retainedEarningsMdtCode,
                emissionCapitalMdtCode,
              ],
              renderer: function (value) {
                if (value) {
                  return Ext.util.Format.number(
                    parseFloat(value),
                    chartConfig.numberFormat
                  );
                }
                return value;
              },
            },
            highlight: true,
            tooltip: {
              trackMouse: true,
              renderer: onTooltipRender,
            },
          },
        ]}
      />
    </Container>
  );
};

CapitalsSupervisoryCapitalDashlet.propTypes = {
  chartRef: PropTypes.any,
  periodType: PropTypes.string,
  authorizedCapitalMdtCode: PropTypes.string,
  subordinatedLoansMdtCode: PropTypes.string,
  retainedEarningsMdtCode: PropTypes.string,
  emissionCapitalMdtCode: PropTypes.string,
};

export default CapitalsSupervisoryCapitalDashlet;
