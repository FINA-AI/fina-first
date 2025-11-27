import React, { useEffect } from "react";
import { Cartesian, Container } from "@sencha/ext-react-modern";
import {
  BASE_REST_URL,
  yearlyCoefficient,
  getSafeFloatValue,
} from "../../../AppUtil";
import PropTypes from "prop-types";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const ProfitabilityMarginSpreedDashlet = ({
  periodType,
  chartRef,
  chartLoadRef,
  paidPercentageMdtCode,
  totalLoanMdtCode,
  netPercentageIncomeMdtCode,
  loansFiMdtCodeMdtCode,
  physLegPersonLoanMdtCode,
  securitiesMdtCode,
  loansSubordinatedMdtCode,
  assetMdtCode,
  isChartLabelVisible,
  paidPercentageMarginMdtCode
}) => {
  const { t } = useTranslation();

  const store = Ext.create("Ext.data.Store", {
    fields: ["quarter", "margin", "spreed"],
  });

  const loadData = async () => {
    if (chartRef.current) {
      chartRef.current.cmp.mask(t("pleaseWait"));
    }
    try {
      const header = {
        headers: {
          Authorization: "Basic ZmluYTpmaW5hMmRlbW8=",
        },
      };
      const nodeDataRes = await axios.get(
        `${BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=${paidPercentageMdtCode},${netPercentageIncomeMdtCode},${loansSubordinatedMdtCode},${paidPercentageMarginMdtCode},&periodType=M`,
        header
      );
      const twelveMontAverageRes = await axios.get(
        `${BASE_REST_URL}/dashboard/twelveMonthAverage?nodeCodes=${totalLoanMdtCode},${loansFiMdtCodeMdtCode},${physLegPersonLoanMdtCode},${securitiesMdtCode},${loansSubordinatedMdtCode},${assetMdtCode}`,
        header
      );

      const nodeData = nodeDataRes.data;
      const twelveMontAverage = twelveMontAverageRes.data;

      const availablePeriods = twelveMontAverage.map((d) => d.quarter);

      const resultArray = nodeData
        .filter((d) => availablePeriods.includes(d.quarter))
        .map((d, i) => {
          const date = new Date(
            d.quarter.split("-")[1],
            d.quarter.split("-")[0],
            0
          );

          const x =
            (getSafeFloatValue(d[paidPercentageMdtCode]) * yearlyCoefficient(date) ) /
            getSafeFloatValue(twelveMontAverage[i][totalLoanMdtCode]);

          const y =
              (getSafeFloatValue(d[netPercentageIncomeMdtCode]) * yearlyCoefficient(date)) /
            (getSafeFloatValue(twelveMontAverage[i][loansFiMdtCodeMdtCode]) +
              getSafeFloatValue(twelveMontAverage[i][physLegPersonLoanMdtCode]) +
              getSafeFloatValue(twelveMontAverage[i][securitiesMdtCode]) +
              getSafeFloatValue(twelveMontAverage[i][loansSubordinatedMdtCode]));

          const spreed = (x - y) * 100;
          const margin =
            ((d[paidPercentageMarginMdtCode] * yearlyCoefficient(date)) / twelveMontAverage[i][assetMdtCode]) * 100;

          return { quarter: d.quarter, spreed: spreed, margin: margin };
        });


      console.log("resultArray")
      console.log(resultArray)

      store.loadData(resultArray);
      if (chartRef.current) {
        chartRef.current.cmp.unmask();
      }
    } catch (e) {
      console.log(e);
      if (chartRef.current) {
        chartRef.current.cmp.unmask();
      }
    }
  };

  chartLoadRef.current = loadData;

  useEffect(() => {
    loadData();
  }, [isChartLabelVisible, periodType]);

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
            position: "left",
            fields: ["margin", "spreed"],
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
            ...style.lineChartConf,
            yField: "margin",
            title: [t("margin")],
            label: {
              hidden: !isChartLabelVisible,
              field: "margin",
              display: "over",
              renderer: function (value) {
                return Ext.util.Format.number(parseFloat(value), "0,000.0%");
              },
            },
          },
          {
            ...style.lineChartConf,
            yField: "spreed",
            title: [t("spreed")],
            label: {
              hidden: !isChartLabelVisible,
              field: "spreed",
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

const chartConfig = {
  insetPadding: "20 20 30 20",
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
      renderer: (tooltip, record, item) =>
        tooltip.setHtml(
          '<div style="text-align: center; font-weight: bold">' +
            Ext.util.Format.number(record.get(item.field), "0,000.0%") +
            "</div>"
        ),
    },
  },
};

ProfitabilityMarginSpreedDashlet.propTypes = {
  chartRef: PropTypes.any,
  chartLoadRef: PropTypes.any,
  paidPercentageMdtCode: PropTypes.string,
  totalLoanMdtCode: PropTypes.string,
  netPercentageIncomeMdtCode: PropTypes.string,
  loansFiMdtCodeMdtCode: PropTypes.string,
  physLegPersonLoanMdtCode: PropTypes.string,
  securitiesMdtCode: PropTypes.string,
  loansSubordinatedMdtCode: PropTypes.string,
  assetMdtCode: PropTypes.string,
  isChartLabelVisible: PropTypes.bool,
};

export default ProfitabilityMarginSpreedDashlet;
