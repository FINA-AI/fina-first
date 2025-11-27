import React, { useEffect } from "react";
import { Container, Cartesian } from "@sencha/ext-react-modern";
import * as Utils from "../../../../AppUtil";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const BalanceSheetDashlet = ({
  chartRef,
  periodType,
  totalAssetsMdtCode,
  totalLiabilitiesMdtCode,
  totalCapitalMdtCode,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const dataTransformFn = (data) => {
    if (!data || data.length < 1) {
      return [];
    }

    return data.map((item) => ({
      quarter: item["quarter"],
      totalAssets: Utils.getSafeFloatValue(item[totalAssetsMdtCode]),
      totalLiabilities: Utils.getSafeFloatValue(item[totalLiabilitiesMdtCode]),
      totalCapital: Utils.getSafeFloatValue(item[totalCapitalMdtCode]),
    }));
  };

  const store = Ext.create("Ext.data.Store", {
    fields: ["quarter", "totalAssets", "totalLiabilities", "totalCapital"],
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
      `${Utils.BASE_REST_URL}/dashboard/aggregatedNodesData?` +
      `nodeCodes=${totalAssetsMdtCode},${totalLiabilitiesMdtCode},${totalCapitalMdtCode}&periodType=${periodType}&periodQuarterType=N`;
    store.load();
  }, [isChartLabelVisible, periodType]);

  const valueTooltipRenderer = (tooltip, record, item) => {
    const formatString = "0,000.0 ₾",
      value = Ext.util.Format.number(
        record.get(item.field) / 1000000,
        formatString
      );
    tooltip.setHtml(`<b>${value}</b>`);
  };

  const seriesCommonProps = {
    type: "line",
    xField: "quarter",
    highlight: true,
    style: {
      lineWidth: 3,
    },
    showMarkers: false,
    tooltip: {
      trackMouse: true,
      renderer: valueTooltipRenderer,
    },
  };

  return (
    <Container layout="vbox">
      <Cartesian
        shadow
        flex={2}
        store={store}
        theme="Default"
        ref={chartRef}
        innerPadding="25 25 0 25"
        interactions="itemhighlight"
        animation={{ duration: 200 }}
        legend={{ type: "sprite" }}
        axes={[
          {
            type: "numeric3d",
            title: t("million"),
            position: "left",
            fields: ["totalAssets", "totalLiabilities", "totalCapital"],
            grid: true,
            renderer: (axis, label, layoutContext) =>
              Ext.util.Format.number(
                layoutContext.renderer(label) / 1000000,
                "0,000"
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
            ...seriesCommonProps,
            title: t("totalAsset"),
            yField: "totalAssets",
            highlight: true,
            label: {
              hidden: !isChartLabelVisible,
              field: "totalAssets",
              display: "over",
              renderer: function (value) {
                if (value) {
                  return Ext.util.Format.number(value / 1000000, "0,000");
                }
                return value;
              },
            },
          },
          {
            ...seriesCommonProps,
            title: t("totalLiabilities"),
            yField: "totalLiabilities",
            label: {
              hidden: !isChartLabelVisible,
              field: "totalLiabilities",
              display: "over",
              renderer: function (value) {
                if (value) {
                  return Ext.util.Format.number(value / 1000000, "0,000");
                }
                return value;
              },
            },
          },
          {
            ...seriesCommonProps,
            title: t("totalCapital"),
            yField: "totalCapital",
            label: {
              hidden: !isChartLabelVisible,
              field: "totalCapital",
              display: "over",
              renderer: function (value) {
                if (value) {
                  return Ext.util.Format.number(value / 1000000, "0,000");
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

export default BalanceSheetDashlet;
