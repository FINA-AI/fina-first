import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { Container, Cartesian } from "@sencha/ext-react-modern";

import { BASE_REST_URL, yearlyCoefficient } from "../../../AppUtil";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const ProfitabilityRoeRoaDashlet = ({
  chartRef,
  chartLoadRef,
  netIncomeMdtCode,
  assetsMdtCode,
  equityMdtCode,
  isChartLabelVisible,
  periodType,
}) => {
  const store = Ext.create("Ext.data.Store", {
    fields: ["quarter", "roe", "roa"],
  });

  const { t } = useTranslation();

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
        `${BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=${netIncomeMdtCode}&periodType=M`,
        header
      );
      const twelveMonthAverageRes = await axios.get(
        `${BASE_REST_URL}/dashboard/twelveMonthAverage?nodeCodes=${assetsMdtCode},${equityMdtCode}`,
        header
      );

      const nodeData = nodeDataRes.data;
      const twelveMonthAverage = twelveMonthAverageRes.data;

      const availablePeriods = twelveMonthAverage.map((d) => d.quarter);

      const resultArray = nodeData
        .filter((d) => availablePeriods.includes(d.quarter))
        .map((d, i) => {
          const date = new Date(
            d.quarter.split("-")[1],
            d.quarter.split("-")[0],
            0
          );

          const roe =
            ((d[netIncomeMdtCode] * yearlyCoefficient(date)) /
                twelveMonthAverage[i][equityMdtCode]) *
            100;
          const roa =
            ((d[netIncomeMdtCode] * yearlyCoefficient(date)) /
                twelveMonthAverage[i][assetsMdtCode]) *
            100;

          return { quarter: d.quarter, roe: roe, roa: roa };
        });

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
        ref={chartRef}
        theme="default"
        innerPadding="10 15 0 5"
        interactions="itemhighlight"
        animation={{ duration: 200 }}
        legend={{ type: "sprite" }}
        axes={[
          {
            type: "numeric3d",
            position: "left",
            id: "vertical-axis",
            fields: ["roe", "roa"],
            grid: true,
            adjustByMajorUnit: true,
            renderer: (axis, label, layoutContext) =>
              layoutContext.renderer(label) + "%",
          },
          {
            type: "category3d",
            position: "bottom",
            fields: ["quarter"],
            grid: false,
            label: {
              rotate: {
                degrees: -20,
              },
            },
            floating: {
              value: 0,
              alongAxis: "vertical-axis",
            },
          },
        ]}
        series={[
          {
            type: "bar3d",
            stacked: false,
            title: ["ROE", "ROA"],
            xField: "quarter",
            yField: ["roe", "roa"],
            margin: "20 20 20 20",
            highlight: true,
            label: {
              hidden: !isChartLabelVisible,
              display: "insideEnd",
              orientation: "vertical",
              field: ["roe", "roa"],
              renderer: function (value) {
                return Ext.util.Format.number(parseFloat(value), "0,000");
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

ProfitabilityRoeRoaDashlet.propTypes = {
  chartRef: PropTypes.any,
  chartLoadRef: PropTypes.any,
  netIncomeMdtCode: PropTypes.string,
  assetsMdtCode: PropTypes.string,
  equityMdtCode: PropTypes.string,
};

export default ProfitabilityRoeRoaDashlet;
