import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { Cartesian, Container } from "@sencha/ext-react-modern";

import {
  BASE_REST_URL,
  getSafeFloatValue,
  yearlyCoefficient,
} from "../../../AppUtil";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const ProfitabilityPercentageCostDashlet = ({
  chartRef,
  periodType,
  percentageCostMdtCode,
  totalLiabilitiesMdtCode,
  otherLiabilitiesMdtCode,
  unpaidPercAndDivMdtCode,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const getDateFromPeriodString = (periodString) => {
    let result, periodParts, year, month;

    if (periodType === "M") {
      periodParts = periodString.split("-");
      month = periodParts[0];
      year = periodParts[1];
    } else {
      periodParts = periodString.split(" ");

      const quarterString = periodParts[0],
        quarterIndex = parseInt(quarterString.replace("Q", ""));

      year = periodParts[1];
      month = quarterIndex * 3;
    }

    result = new Date(year, month, 0);

    return result;
  };

  const store = Ext.create("Ext.data.Store", {
    fields: [
      "quarter",
      {
        name: percentageCostMdtCode,
        calculate: (data) => {
          const periodToDate = getDateFromPeriodString(data["quarter"]),
              yearlyCoefficientNumber = yearlyCoefficient(periodToDate),
              initialValue = getSafeFloatValue(data[percentageCostMdtCode]);
          return initialValue * yearlyCoefficientNumber;
        },
        depends: ['quarter']
      },
      {
        name: "percentageLiabilities",
        calculate: (data) =>
          data[totalLiabilitiesMdtCode] -
          data[otherLiabilitiesMdtCode] -
          data[unpaidPercAndDivMdtCode],
      },
      {
        name: "share",
        calculate: (data) =>
          (data[percentageCostMdtCode] / data["percentageLiabilities"]) * 100,
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
      `${BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=${percentageCostMdtCode},${totalLiabilitiesMdtCode},` +
      `${otherLiabilitiesMdtCode},${unpaidPercAndDivMdtCode}&periodType=${periodType}&periodQuarterType=N`;
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
        insetPadding="20"
        innerPadding="25 3 0 0"
        interactions="itemhighlight"
        animation={{ duration: 200 }}
        legend={{ type: "sprite" }}
        axes={[
          {
            type: "numeric3d",
            position: "left",
            title: t("million"),
            fields: [percentageCostMdtCode, "percentageLiabilities"],
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
            fields: ["share"],
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
            yField: [percentageCostMdtCode, "percentageLiabilities"],
            title: [t("interestExpenses"), t("InterestBearingLiabilities")],
            label: {
              hidden: !isChartLabelVisible,
              display: "insideEnd",
              orientation: "vertical",
              field: [percentageCostMdtCode, "percentageLiabilities"],
              renderer: function (value) {
                if (value && value > 0) {
                  return Ext.util.Format.number(
                    parseFloat(value) / 1000000,
                    "0,000.0"
                  );
                }
                return value;
              },
            },
            highlight: true,
            tooltip: {
              trackMouse: true,
              renderer: (tooltip, record, item) =>
                tooltip.setHtml(
                  `<div style="text-align: center; font-weight: bold">${Ext.util.Format.number(
                    getSafeFloatValue(record.get(item.field)) / 1000000,
                    "0,000.0"
                  )}</div>`
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
                    Math.round(record.get(item.field)) +
                    "%" +
                    "</div>"
                ),
            },
          },
        ]}
      />
    </Container>
  );
};

ProfitabilityPercentageCostDashlet.propTypes = {
  chartRef: PropTypes.any,
  periodType: PropTypes.string,
  percentageCostMdtCode: PropTypes.string,
  totalLiabilitiesMdtCode: PropTypes.string,
  otherLiabilitiesMdtCode: PropTypes.string,
  unpaidPercAndDivMdtCode: PropTypes.string,
};

export default ProfitabilityPercentageCostDashlet;
