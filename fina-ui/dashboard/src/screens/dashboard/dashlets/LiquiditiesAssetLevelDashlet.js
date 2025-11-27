import React, { useEffect } from "react";

import { Container, Cartesian } from "@sencha/ext-react-modern";
import { BASE_REST_URL, getSafeFloatValue } from "../../../AppUtil";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const LiquiditiesAssetLevelDashlet = ({
  chartRef,
  liquidAssets,
  periodType,
  totalAssetsMdtCode,
  physicalFundsMdtCode,
  physicalSecuritiesMdtCode,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const store = Ext.create("Ext.data.Store", {
    fields: [
      "quarter",
      {
        name: "liquidAssets",
        calculate: (data) =>
          getSafeFloatValue(data[liquidAssets]),
      },
      {
        name: "assets",
        calculate: (data) =>
          (data["liquidAssets"] / getSafeFloatValue(data[totalAssetsMdtCode])) *
          100,
      },
      {
        name: "physicalFund",
        calculate: (data) =>
          (data["liquidAssets"] /
            (getSafeFloatValue(data[physicalFundsMdtCode]) +
              getSafeFloatValue(data[physicalSecuritiesMdtCode]))) *
          100,
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
    store.getProxy().url =
      `${BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=` +
      `${totalAssetsMdtCode},${physicalFundsMdtCode},${liquidAssets},${physicalSecuritiesMdtCode}&periodType=${periodType}&periodQuarterType=N`;

    store.load();
  }, [isChartLabelVisible, periodType]);

  return (
    <Container layout="fit">
      <Cartesian
        shadow
        flex={2}
        store={store}
        ref={chartRef}
        theme="default"
        innerPadding="25 25 0 25"
        interactions="itemhighlight"
        animation={{ duration: 200 }}
        legend={{ type: "sprite" }}
        axes={[
          {
            type: "numeric3d",
            position: "left",
            id: "shareAxisId",
            minimum: 0,
            fields: ["assets", "physicalFund"],
            grid: true,
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
            ...style.lineChartConf,
            yField: "assets",
            title: t("liquidAssets/totalAssets"),
            label: {
              hidden: !isChartLabelVisible,
              field: "assets",
              display: "over",
              renderer: function (value) {
                return Ext.util.Format.number(parseFloat(value), "0,000.0%");
              },
            },
          },
          {
            ...style.lineChartConf,
            yField: "physicalFund",
            title: t("liquidAssets/individualsFunds"),
            label: {
              hidden: !isChartLabelVisible,
              field: "physicalFund",
              display: "over",
              renderer: function (value) {
                return Ext.util.Format.number(parseFloat(value), "0,000.0%");
              },
            },
          },
        ]}
      />
    </Container>
  );
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
        const tooltipText = Math.round(record.get(item.field)) + "%";
        tooltip.setHtml(`<b>${tooltipText}</b>`);
      },
    },
  },
};

LiquiditiesAssetLevelDashlet.propTypes = {
  chartRef: PropTypes.any,
  periodType: PropTypes.string,
  cacheMdtCode: PropTypes.string,
  cacheInBankMdtCode: PropTypes.string,
  securitiesMdtCode: PropTypes.string,
  totalAssetsMdtCode: PropTypes.string,
  exchangedCacheMdtCode: PropTypes.string,
  bookedDepositMdtCode: PropTypes.string,
  depositMdtCode: PropTypes.string,
  physicalFundsMdtCode: PropTypes.string,
  physicalSecuritiesMdtCode: PropTypes.string,
  isChartLabelVisible: PropTypes.string,
};

export default LiquiditiesAssetLevelDashlet;
