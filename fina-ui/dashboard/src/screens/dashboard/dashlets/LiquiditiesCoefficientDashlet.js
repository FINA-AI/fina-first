import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { Cartesian, Container } from "@sencha/ext-react-modern";
import { BASE_REST_URL, getSafeFloatValue } from "../../../AppUtil";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const LiquiditiesCoefficientDashlet = ({
  chartRef,
  periodType,
  liquidAssetsMdtCode,
  totalBalanceLiabilitiesMdtCode,
  limit,
  filterNodeCode,
  filterNodeValue,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const liquidityCoefficientRateFieldName = "liquidityCoefficientRate",
    liquidityCoefficientLimitFieldName = "liquiditryCoefficientLimit",
    liquidityCoefficientDecimalFieldName = "coefficientRateRoundedDecimal";

  const storeTransformData = {
    fn: (data) => {
      for (var d in data) {
        let liqCoefficientRate =
          getSafeFloatValue(data[d][liquidAssetsMdtCode]) /
          getSafeFloatValue(data[d][totalBalanceLiabilitiesMdtCode]);

        if (
          !liqCoefficientRate ||
          isNaN(liqCoefficientRate) ||
          !isFinite(liqCoefficientRate)
        ) {
          liqCoefficientRate = 0;
        }

        data[d][liquidityCoefficientRateFieldName] = Math.round(
          liqCoefficientRate * 100
        );
        data[d][liquidityCoefficientDecimalFieldName] =
          Math.round(liqCoefficientRate * 1000) / 10;
        data[d][liquidityCoefficientLimitFieldName] = limit;
      }

      return data;
    },
  };

  const store = Ext.create("Ext.data.Store", {
    fields: [
      "quarter",
      { liquidityCoefficientRateFieldName },
      liquidityCoefficientLimitFieldName,
      liquidityCoefficientDecimalFieldName,
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
    store.getProxy().url = `${BASE_REST_URL}/dashboard/aggregatedDataFromFilteredReturns?nodeCodes=${liquidAssetsMdtCode},${totalBalanceLiabilitiesMdtCode}&periodType=${periodType}&periodQuarterType=N`;
    store.load();
  }, [isChartLabelVisible, periodType]);

  const chartConfig = {
    insetPadding: "20 20 0 20",
    innerPadding: "10 3 0 0",
    theme: "Default",
    interactions: "itemhighlight",
    percentFormat: "0,000.0%",
  };

  const onTooltipRender = (tooltip, record, item) => {
    const fieldName =
      item.field === liquidityCoefficientRateFieldName
        ? liquidityCoefficientDecimalFieldName
        : liquidityCoefficientLimitFieldName;

    tooltip.setHtml(
      getBoldTooltipValue(record.get(fieldName), chartConfig.percentFormat)
    );
  };

  const getBoldTooltipValue = (numericValue, format) => {
    return (
      '<div style="text-align: center; font-weight: bold">' +
      Ext.util.Format.number(numericValue, format) +
      "</div>"
    );
  };

  const onAxisLabelRender = (axis, label) => {
    return label.toFixed(label < 10 ? 1 : 0) + "%";
  };

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
            fields: [
              liquidityCoefficientRateFieldName,
              liquidityCoefficientLimitFieldName,
            ],
            grid: true,
            minimum: 0,
            adjustMaximumByMajorUnit: true,
            renderer: onAxisLabelRender,
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
            title: t("liquiditiesCoefficient"),
            xField: "quarter",
            yField: [liquidityCoefficientRateFieldName],
            highlight: true,
            renderer: (sprite, record, attr, index) =>
              store.getAt(index).get(liquidityCoefficientRateFieldName) < limit
                ? { ...attr, fill: "#b83047" }
                : attr,
            label: {
              hidden: !isChartLabelVisible,
              display: "insideEnd",
              orientation: "vertical",
              field: liquidityCoefficientRateFieldName,
              renderer: function (value) {
                return Ext.util.Format.number(parseFloat(value), "0,000.0");
              },
            },
            tooltip: {
              trackMouse: true,
              renderer: onTooltipRender,
            },
          },
          {
            type: "line",
            title: t("limit") + ` (${limit}%)`,
            xField: "quarter",
            yField: liquidityCoefficientLimitFieldName,
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
            highlightCfg: {
              scaling: 2,
              rotationRads: Math.PI / 4,
            },
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

LiquiditiesCoefficientDashlet.propTypes = {
  liquidAssetsMdtCode: PropTypes.string,
  totalBalanceLiabilitiesMdtCode: PropTypes.string,
  chartRef: PropTypes.any,
  limit: PropTypes.number,
  periodType: PropTypes.string,
  isChartLabelVisible: PropTypes.bool,
};

export default LiquiditiesCoefficientDashlet;
