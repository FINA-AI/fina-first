import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { Cartesian, Container } from "@sencha/ext-react-modern";

import { BASE_REST_URL } from "../../../AppUtil";
import { useTranslation } from "react-i18next";
import axios from "axios";

const Ext = window["Ext"];

const ProfitabilityEfficiencyIndicatorsDashlet = ({
  chartRef,
  chartLoadRef,
  periodType,
  netIncomeMdtCode,
  dividendMdtCode,
  securitiesMdtCode,
  currencyBuySellMdtCode,
  totalMdtCode,
  assetsMdtCode,
  personalCostMdtCode,
  operatingIncomeMdtCode,
  totalCostsMdtCode,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const store = Ext.create("Ext.data.Store", {
    fields: [
      "quarter",
      assetsMdtCode,
      {
        name: "operating/asset",
        calculate: (data) => {
          console.log(`(${netIncomeMdtCode} - ${dividendMdtCode} - ${securitiesMdtCode} - ${currencyBuySellMdtCode} -${totalMdtCode}) / ${assetsMdtCode}`)
          console.log(`((${data[netIncomeMdtCode]} - ${data[dividendMdtCode]} - ${data[securitiesMdtCode]} - ${data[currencyBuySellMdtCode]} - ${data[totalMdtCode]}) / ${data[assetsMdtCode]})`)

         return ((data[netIncomeMdtCode] -
              data[dividendMdtCode] -
              data[securitiesMdtCode] -
              data[currencyBuySellMdtCode] -
              data[totalMdtCode]) /
              data[assetsMdtCode]) *
          100;
        }
      },
      {
        name: "personal/opInc",
        calculate: (data) =>
          (data[personalCostMdtCode] / data[operatingIncomeMdtCode]) * 100,
      },
      {
        name: "person/total",
        calculate: (data) =>
          (data[personalCostMdtCode] / data[totalCostsMdtCode]) * 100,
      },
    ],
    proxy: {
      type: "ajax",
      headers: {
        Authorization: "Basic ZmluYTpmaW5hMmRlbW8=",
      },
    },
  });

/*  store.on("beforeload", () => {
    if (chartRef.current) {
      chartRef.current.cmp.mask(t("pleaseWait"));
    }
  });

  store.on("load", () => {
    if (chartRef.current) {
      chartRef.current.cmp.unmask();
    }
  });*/

  const loadData = async () => {
    if (chartRef.current) {
      chartRef.current.cmp.mask(t("pleaseWait"));
    }

    const header = {
      headers: {
        Authorization: "Basic ZmluYTpmaW5hMmRlbW8=",
      },
    };
    try {

      const nodeDataRes = await axios.get(
          `${BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=${assetsMdtCode},${personalCostMdtCode},` +
          `${operatingIncomeMdtCode},${totalCostsMdtCode},&periodType=${periodType}&periodQuarterType=N`,
          header
      );

      const operatingIncomeDataRes = await axios.get(
          `${BASE_REST_URL}/dashboard/aggregatedNodesDataWithYearlyCoefficient?nodeCodes=${netIncomeMdtCode},${dividendMdtCode},`+
          `${securitiesMdtCode},${currencyBuySellMdtCode},${totalMdtCode}&periodType=${periodType}&periodQuarterType=N`,
          header
      )

      let operatingIncomeData = operatingIncomeDataRes.data;
      let resultArray = nodeDataRes.data.map((d, i) => ({...d, ...operatingIncomeData[i]}));

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
  }

  chartLoadRef.current = loadData;


  useEffect(() => {
    loadData();
  }, [periodType, isChartLabelVisible]);

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
            fields: ["personal/opInc", "person/total"],
            renderer: (axis, label, layoutContext) =>
              layoutContext.renderer(label) + "%",
          },
          {
            type: "numeric3d",
            position: "right",
            minimum: 0,
            fields: ["operating/asset"],
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
            yField: "operating/asset",
            title: [t("operating/asset")],
            label: {
              hidden: !isChartLabelVisible,
              field: "operating/asset",
              display: "over",
              renderer: function (value) {
                return Ext.util.Format.number(parseFloat(value), "0,000.0%");
              },
            },
          },
          {
            ...style.lineChartConf,
            yField: "personal/opInc",
            title: [t("personalCosts/OperatingIncome")],
            label: {
              hidden: !isChartLabelVisible,
              field: "personal/opInc",
              display: "over",
              renderer: function (value) {
                return Ext.util.Format.number(parseFloat(value), "0,000.0%");
              },
            },
          },
          {
            ...style.lineChartConf,
            yField: "person/total",
            title: [t("personCosts/totalCosts")],
            label: {
              hidden: !isChartLabelVisible,
              field: "person/total",
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
      renderer: (tooltip, record, item) =>
        tooltip.setHtml(
          '<div style="text-align: center; font-weight: bold">' +
            Ext.util.Format.number(record.get(item.field), "0,000.0%") +
            "</div>"
        ),
    },
  },
};

ProfitabilityEfficiencyIndicatorsDashlet.propTypes = {
  chartRef: PropTypes.any,
  chartLoadRef: PropTypes.any,
  periodType: PropTypes.string,
  netIncomeMdtCode: PropTypes.string,
  dividendMdtCode: PropTypes.string,
  securitiesMdtCode: PropTypes.string,
  currencyBuySellMdtCode: PropTypes.string,
  totalMdtCode: PropTypes.string,
  assetsMdtCode: PropTypes.string,
  personalCostMdtCode: PropTypes.string,
  operatingIncomeMdtCode: PropTypes.string,
  totalCostsMdtCode: PropTypes.string,
  isChartLabelVisible: PropTypes.bool.isRequired,
};

export default ProfitabilityEfficiencyIndicatorsDashlet;
