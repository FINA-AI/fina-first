import React, { useEffect } from "react";

import { Cartesian, Container } from "@sencha/ext-react-modern";
import { BASE_REST_URL, getSafeFloatValue } from "../../../AppUtil";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const CapitalsCoefficientDashlet = ({
  chartRef,
  supervisorCapitalMdtCode,
  totalAssetsAfterDepreciationMdtCode,
  limit,
  periodType,
  filterNodeCode,
  filterNodeValue,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const storeTransformData = {
    fn: (data) => {
      for (let d of data) {
        let result =
          getSafeFloatValue(d[supervisorCapitalMdtCode]) /
          getSafeFloatValue(d[totalAssetsAfterDepreciationMdtCode]);
        d["capitalCapitalsCoefficient"] = isFinite(result)
          ? Math.round(result * 1000) / 10
          : isNaN(result)
          ? 0
          : 100;
      }
      return data;
    },
  };

  const store = Ext.create("Ext.data.Store", {
    fields: [
      "quarter",
      "capitalCapitalsCoefficient",
      {
        name: "limit",
        calculate: () => limit,
      },
    ],
    autoLoad: false,
    remoteFilter: true,
    filters: [{
      property: filterNodeCode,
      value: filterNodeValue
    }],
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
    store.getProxy().url = `${BASE_REST_URL}/dashboard/aggregatedDataFromFilteredReturns?nodeCodes=${supervisorCapitalMdtCode},${totalAssetsAfterDepreciationMdtCode}&periodType=${periodType}&periodQuarterType=N`;
    store.load();
  }, [periodType, isChartLabelVisible]);

  return (
    <Container layout="vbox">
      <Cartesian
        shadow
        flex={2}
        store={store}
        ref={chartRef}
        theme="default"
        insetPadding={"10 3 0 0"}
        innerPadding={"20"}
        interactions={"itemhighlight"}
        animation={{ duration: 200 }}
        legend={{ type: "sprite" }}
        axes={[
          {
            type: "numeric3d",
            position: "left",
            fields: ["limit", "capitalCapitalsCoefficient"],
            grid: true,
            minimum: 0,
            adjustMaximumByMajorUnit: false,
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
            title: t("capitalsCoefficient"),
            xField: "quarter",
            yField: "capitalCapitalsCoefficient",
            highlight: true,
            renderer: (sprite, record, attr, index) =>
              store.getAt(index).get("capitalCapitalsCoefficient") < limit
                ? { ...attr, fill: "#b83047" }
                : attr,
            label: {
              hidden: !isChartLabelVisible,
              display: "insideEnd",
              orientation: "vertical",
              field: "capitalCapitalsCoefficient",
              renderer: function (value) {
                if (value) {
                  return Ext.util.Format.number(value, "0,000.0");
                }
                return value;
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
          {
            type: "line",
            title: t("limit") + ` (${limit}%)`,
            xField: "quarter",
            yField: "limit",
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
          },
        ]}
      />
    </Container>
  );
};

CapitalsCoefficientDashlet.propTypes = {
  supervisorCapitalMdtCode: PropTypes.string,
  totalAssetsAfterDepreciationMdtCode: PropTypes.string,
  chartRef: PropTypes.any,
  limit: PropTypes.number,
  periodType: PropTypes.string,
};

export default CapitalsCoefficientDashlet;
