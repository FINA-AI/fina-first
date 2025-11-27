import React, { useEffect } from "react";

import { Cartesian, Container } from "@sencha/ext-react-modern";
import { BASE_REST_URL, getSafeFloatValue } from "../../../AppUtil";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const AssetsCreditShareOfAssetsDashlet = ({
  chartRef,
  periodType,
  assetMdtCode,
  totalLoanMdtCode,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const store = Ext.create("Ext.data.Store", {
    fields: [
      "quarter",
      totalLoanMdtCode,
      assetMdtCode,
      {
        name: "share",
        calculate: (data) =>
          (data[totalLoanMdtCode] / data[assetMdtCode]) * 100,
      },
    ],
    proxy: {
      type: "ajax",
      headers: {
        Authorization: "Basic ZmluYTpmaW5hMmRlbW8=",
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
    store.getProxy().url = `${BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=${assetMdtCode},${totalLoanMdtCode}&periodType=${periodType}&periodQuarterType=N`;
    store.load();
  }, [isChartLabelVisible, periodType]);

  return (
    <Container layout="vbox">
      <Cartesian
        shadow
        flex={2}
        store={store}
        ref={chartRef}
        theme="default"
        insetPadding="20"
        innerPadding="0 3 0 0"
        interactions="itemhighlight"
        animation={{ duration: 200 }}
        legend={{ type: "sprite" }}
        axes={[
          {
            type: "numeric3d",
            position: "left",
            title: t("million"),
            fields: [totalLoanMdtCode, assetMdtCode],
            grid: true,
            renderer: (axis, label, layoutContext) =>
              Ext.util.Format.number(
                layoutContext.renderer(label) / 1000000,
                "0,000"
              ),
          },
          {
            type: "numeric3d",
            position: "right",
            id: "shareAxisId",
            minimum: 0,
            maximum: 100,
            renderer: (axis, label, layoutContext) =>
              layoutContext.renderer(label) + "%",
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
            type: "bar3d",
            stacked: false,
            xField: "quarter",
            yField: [assetMdtCode, totalLoanMdtCode],
            title: [t("assets"), t("creditPortfolio")],
            label: {
              hidden: !isChartLabelVisible,
              display: "insideEnd",
              orientation: "vertical",
              field: [assetMdtCode, totalLoanMdtCode],
              renderer: function (value) {
                if (value && value > 0) {
                  return Ext.util.Format.number(value / 1000000, "0,000.0");
                }
                return value;
              },
            },
            highlight: true,
            tooltip: {
              trackMouse: true,
              renderer: (tooltip, record, item) =>
                tooltip.setHtml(
                  `<b>${Ext.util.Format.number(
                    getSafeFloatValue(record.get(item.field)) / 1000000,
                    "0,000.0"
                  )}</b>`
                ),
            },
          },
          {
            type: "line",
            xField: "quarter",
            yField: "share",
            title: [t("share")],
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
            label: {
              hidden: !isChartLabelVisible,
              field: "share",
              display: "over",
              renderer: function (value) {
                return Ext.util.Format.number(parseFloat(value), "0,000.0%");
              },
            },
            tooltip: {
              trackMouse: true,
              renderer: (tooltip, record, item) =>
                tooltip.setHtml(
                  '<div style="text-align: center; font-weight: bold">' +
                    Ext.util.Format.number(record.get(item.field), "0,000.0%") +
                    "</div>"
                ),
            },
          },
        ]}
      />
    </Container>
  );
};

AssetsCreditShareOfAssetsDashlet.propTypes = {
  assetMdtCode: PropTypes.string,
  totalLoanMdtCode: PropTypes.string,
  chartRef: PropTypes.any,
  periodType: PropTypes.string,
  isChartLabelVisible: PropTypes.bool,
};

export default AssetsCreditShareOfAssetsDashlet;
