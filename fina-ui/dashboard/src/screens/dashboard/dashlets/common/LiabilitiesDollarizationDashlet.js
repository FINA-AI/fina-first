import React, { useEffect, useState } from "react";

import { Cartesian, Container } from "@sencha/ext-react-modern";
import { BASE_REST_URL, getSafeFloatValue } from "../../../../AppUtil";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const LiabilitiesDollarizationDashlet = ({
  chartRef,
  periodType,
  indicator1MdtCode,
  usdIndicator1MdtCode,
  indicator2MdtCode,
  usdIndicator2MdtCode,
  indicator1Name,
  indicator2Name,
  isChartLabelVisible,
}) => {
  const calculateShare = (part, total) =>
    part === 0 ? 0 : (getSafeFloatValue(part) / getSafeFloatValue(total)) * 100;

  const store = Ext.create("Ext.data.Store", {
    fields: [
      "quarter",
      {
        name: "indicator1",
        calculate: (data) =>
          calculateShare(data[usdIndicator1MdtCode], data[indicator1MdtCode]),
      },
      {
        name: "indicator2",
        calculate: (data) =>
          calculateShare(data[usdIndicator2MdtCode], data[indicator2MdtCode]),
      },
    ],
    proxy: {
      type: "ajax",
      headers: {
        Authorization: "Basic ZmluYTpmaW5hMmRlbW8=",
      },
    },
  });

  const { t } = useTranslation();

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
      `${indicator1MdtCode},${usdIndicator1MdtCode},${indicator2MdtCode},${usdIndicator2MdtCode}&periodType=${periodType}&periodQuarterType=N`;
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
            grid: true,
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
            ...style.lineChartConf,
            yField: "indicator1",
            title: [indicator1Name],
            label: {
              hidden: !isChartLabelVisible,
              field: "indicator1",
              display: "over",
              renderer: function (value) {
                return Ext.util.Format.number(parseFloat(value), "0,000.0%");
              },
            },
          },
          {
            ...style.lineChartConf,
            yField: "indicator2",
            title: [indicator2Name],
            label: {
              hidden: !isChartLabelVisible,
              field: "indicator2",
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

LiabilitiesDollarizationDashlet.propTypes = {
  chartRef: PropTypes.any,
  periodType: PropTypes.string,
  indicator1MdtCode: PropTypes.string,
  usdIndicator1MdtCode: PropTypes.string,
  indicator2MdtCode: PropTypes.string,
  usdIndicator2MdtCode: PropTypes.string,
  indicator1Name: PropTypes.string,
  indicator2Name: PropTypes.string,
  isChartLabelVisible: PropTypes.string,
};

export default LiabilitiesDollarizationDashlet;
