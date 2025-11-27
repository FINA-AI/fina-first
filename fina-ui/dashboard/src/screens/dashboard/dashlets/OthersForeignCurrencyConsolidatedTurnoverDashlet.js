import React, { useEffect } from "react";
import { Container, Cartesian } from "@sencha/ext-react-modern";
import axios from "axios";

import { BASE_REST_URL, getSafeFloatValue } from "../../../AppUtil";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const OthersForeignCurrencyConsolidatedTurnoverDashlet = ({
  chartRef,
  chartLoadRef,
  periodType,
  purchaseColumnNodeCode,
  purchaseUsdNodeCode,
  purchaseEurNodeCode,
  saleColumnNodeCode,
  saleUsdNodeCode,
  saleEurNodeCode,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const loadData = async () => {
    if (chartRef.current) {
      chartRef.current.cmp.mask(t("pleaseWait"));
    }

    try {
      const headers = {
        headers: {
          Authorization: "Basic ZmluYTpmaW5hMmRlbW8=",
        },
      };

      const nodesDataResponse = await axios.get(
        `${BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=${purchaseUsdNodeCode},${purchaseEurNodeCode},${saleUsdNodeCode},${saleEurNodeCode}&periodType=${periodType}`,
        headers
      );
      const nodesData = nodesDataResponse.data;

      const summedColumnData = await axios.get(
        `${BASE_REST_URL}/dashboard/summedColumns?columnCodes=${purchaseColumnNodeCode},${saleColumnNodeCode}&periodType=${periodType}`,
        headers
      );
      const columnsData = summedColumnData.data;

      const transformedData = nodesData.map((d) => {
        let sums = columnsData.filter((cd) => cd.quarter === d.quarter);
        sums = sums && sums.length > 0 ? sums[0] : {};
        return {
          quarter: d.quarter,
          purchaseUsd: getSafeFloatValue(d[purchaseUsdNodeCode]),
          purchaseEur: getSafeFloatValue(d[purchaseEurNodeCode]),
          purchaseOther:
            getSafeFloatValue(sums[purchaseColumnNodeCode]) -
            getSafeFloatValue(d[purchaseUsdNodeCode]) -
            getSafeFloatValue(d[purchaseEurNodeCode]),
          saleUsd: getSafeFloatValue(d[saleUsdNodeCode]),
          saleEur: getSafeFloatValue(d[saleEurNodeCode]),
          saleOther:
            getSafeFloatValue(sums[saleColumnNodeCode]) -
            getSafeFloatValue(d[saleUsdNodeCode]) -
            getSafeFloatValue(d[saleEurNodeCode]),
        };
      });

      store.loadData(transformedData);
      if (chartRef.current) {
        chartRef.current.cmp.unmask();
      }
    } catch (error) {
      console.log(error);
      if (chartRef.current) {
        chartRef.current.cmp.unmask();
      }
    }
  };

  chartLoadRef.current = loadData;

  const store = Ext.create("Ext.data.Store", {
    fields: [
      "quarter",
      "purchaseUsd",
      "purchaseEur",
      "purchaseOther",
      "saleUsd",
      "saleEur",
      "saleOther",
    ],
  });

  useEffect(() => {
    loadData();
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
            fields: [
              "purchaseUsd",
              "purchaseEur",
              "purchaseOther",
              "saleUsd",
              "saleEur",
              "saleOther",
            ],
            adjustByMajorUnit: true,
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
            yField: "purchaseUsd",
            title: [t("usdBuy")],
            label: {
              hidden: !isChartLabelVisible,
              field: "purchaseUsd",
              display: "over",
              renderer: function (value) {
                if (value && value > 0) {
                  return Ext.util.Format.number(value / 1000000, "0,000.0");
                }
                return value;
              },
            },
          },
          {
            ...style.lineChartConf,
            yField: "purchaseEur",
            title: [t("euroBuy")],
            label: {
              hidden: !isChartLabelVisible,
              field: "purchaseEur",
              display: "over",
              renderer: function (value) {
                if (value && value > 0) {
                  return Ext.util.Format.number(value / 1000000, "0,000.0");
                }
                return value;
              },
            },
          },
          {
            ...style.lineChartConf,
            yField: "purchaseOther",
            title: [t("otherBuy")],
            label: {
              hidden: !isChartLabelVisible,
              field: "purchaseOther",
              display: "over",
              renderer: function (value) {
                if (value && value > 0) {
                  return Ext.util.Format.number(value / 1000000, "0,000.0");
                }
                return value;
              },
            },
          },
          {
            ...style.lineChartConf,
            yField: "saleUsd",
            title: [t("usdSell")],
            label: {
              hidden: !isChartLabelVisible,
              field: "saleUsd",
              display: "over",
              renderer: function (value) {
                if (value && value > 0) {
                  return Ext.util.Format.number(value / 1000000, "0,000.0");
                }
                return value;
              },
            },
          },
          {
            ...style.lineChartConf,
            yField: "saleEur",
            title: [t("euroSell")],
            label: {
              hidden: !isChartLabelVisible,
              field: "saleEur",
              display: "over",
              renderer: function (value) {
                if (value && value > 0) {
                  return Ext.util.Format.number(value / 1000000, "0,000.0");
                }
                return value;
              },
            },
          },
          {
            ...style.lineChartConf,
            yField: "saleOther",
            title: [t("otherSell")],
            label: {
              hidden: !isChartLabelVisible,
              field: "saleOther",
              display: "over",
              renderer: function (value) {
                if (value && value > 0) {
                  return Ext.util.Format.number(value / 1000000, "0,000.0");
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
  insetPadding: "20 20 0 20",
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

export default OthersForeignCurrencyConsolidatedTurnoverDashlet;
