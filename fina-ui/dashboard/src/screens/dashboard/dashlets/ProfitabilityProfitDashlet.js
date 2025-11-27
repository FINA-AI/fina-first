import React, { useEffect } from "react";

import { Cartesian, Container } from "@sencha/ext-react-modern";

import { BASE_REST_URL, getSafeFloatValue } from "../../../AppUtil";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const ProfitabilityProfitDashlet = ({
  chartRef,
  periodType,
  pureProfitBeforeReservingNodeCode,
  receivedDividendsNodeCode,
  profitOrLossFromSecuritiesNodeCode,
  profitOrLossFromForeignExchangeFundsReevaluationNodeCode,
  profitOrLossFromPropertySalesNodeCode,
  lossAccordingToPossibleLoanLossesNodeCode,
  pureProfitNodeCode,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const dataTransformFn = (data) => {
    if (!data || data.length < 1) {
      return [];
    }

    return data.map((d) => ({
      quarter: d.quarter,
      operationalProfit:
        getSafeFloatValue(d[pureProfitBeforeReservingNodeCode]) -
        getSafeFloatValue(d[receivedDividendsNodeCode]) -
        getSafeFloatValue(d[profitOrLossFromSecuritiesNodeCode]) -
        getSafeFloatValue(
          d[profitOrLossFromForeignExchangeFundsReevaluationNodeCode]
        ) -
        getSafeFloatValue(d[profitOrLossFromPropertySalesNodeCode]),
      reserveExpence: getSafeFloatValue(
        d[lossAccordingToPossibleLoanLossesNodeCode]
      ),
      pureProfit: getSafeFloatValue(d[pureProfitNodeCode]),
    }));
  };

  const store = Ext.create("Ext.data.Store", {
    fields: ["quarter", "operationalProfit", "reserveExpence", "pureProfit"],
    proxy: {
      type: "ajax",
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

  useEffect(() => {
    store.getProxy().url =
      `${BASE_REST_URL}/dashboard/loadAggregatedNodesDataMonthMinusPreviousMonth?` +
      `nodeCodes=${pureProfitBeforeReservingNodeCode},${receivedDividendsNodeCode},${profitOrLossFromSecuritiesNodeCode},${profitOrLossFromForeignExchangeFundsReevaluationNodeCode},${profitOrLossFromPropertySalesNodeCode},${lossAccordingToPossibleLoanLossesNodeCode},${pureProfitNodeCode}` +
      `&periodType=${periodType}`;
    store.load();
  }, [periodType, isChartLabelVisible]);

  return (
    <Container layout="vbox">
      <Cartesian
        shadow
        flex={2}
        store={store}
        theme={chartConfig.theme}
        ref={chartRef}
        innerPadding={chartConfig.innerPadding}
        insetPadding={chartConfig.insetPadding}
        interactions={chartConfig.interactions}
        animation={{ duration: 200 }}
        legend={{ type: "sprite" }}
        axes={[
          {
            type: "numeric3d",
            title: t("million"),
            position: "left",
            id: "vertical-axis",
            fields: ["operationalProfit", "reserveExpence", "pureProfit"],
            adjustByMajorUnit: true,
            // minimum: -100,
            grid: true,
            renderer: (axis, label, layoutContext) =>
              Ext.util.Format.number(
                layoutContext.renderer(label) / 1000000,
                chartConfig.numberFormat
              ),
          },
          {
            type: "category3d",
            position: "bottom",
            fields: "quarter",
            grid: false,
            floating: {
              value: 0,
              alongAxis: "vertical-axis",
            },
            label: {
              rotate: {
                degrees: -60,
              },
            },
          },
        ]}
        series={[
          {
            ...style.lineChartConf,
            yField: "operationalProfit",
            title: [t("operatingProfit")],
            label: {
              hidden: !isChartLabelVisible,
              field: "operationalProfit",
              display: "over",
              renderer: function (value) {
                if (value) {
                  return Ext.util.Format.number(
                    value / 1000000,
                    chartConfig.numberFormat
                  );
                }
                return value;
              },
            },
          },
          {
            ...style.lineChartConf,
            yField: "reserveExpence",
            title: [t("reserveCost")],
            label: {
              hidden: !isChartLabelVisible,
              field: "reserveExpence",
              display: "over",
              renderer: function (value) {
                if (value) {
                  return Ext.util.Format.number(
                    value / 1000000,
                    chartConfig.numberFormat
                  );
                }
                return value;
              },
            },
          },
          {
            ...style.lineChartConf,
            yField: "pureProfit",
            title: [t("netIncome")],
            label: {
              hidden: !isChartLabelVisible,
              field: "pureProfit",
              display: "over",
              renderer: function (value) {
                if (value) {
                  return Ext.util.Format.number(
                    value / 1000000,
                    chartConfig.numberFormat
                  );
                }
                return value;
              },
            },
          },
        ]}
      />
    </Container>
  );
};

const chartConfig = {
  insetPadding: "20 20 60 20",
  innerPadding: "25 25 0 25",
  theme: "Default",
  interactions: "itemhighlight",
  numberFormat: "0,000.0",
};

const style = {
  lineChartConf: {
    type: "line",
    xField: "quarter",
    style: {
      lineWidth: 3,
      opacity: 0.8,
    },
    showMarkers: false,
    tooltip: {
      trackMouse: true,
      renderer: (tooltip, record, item) => {
        const tooltipText = Ext.util.Format.number(
          record.get(item.field) / 1000000,
          chartConfig.numberFormat
        );
        tooltip.setHtml(`<b>${tooltipText}</b>`);
      },
    },
  },
};

export default ProfitabilityProfitDashlet;
