import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { Container, Cartesian } from "@sencha/ext-react-modern";

import { BASE_REST_URL, getSafeFloatValue } from "../../../AppUtil";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const OthersLoanPortfolioDashlet = ({
  chartRef,
  periodType,
  totalLoanMdtCode,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const store = Ext.create("Ext.data.Store", {
    fields: ["quarter", totalLoanMdtCode],
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
    store.getProxy().url = `${BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=${totalLoanMdtCode}&periodType=${periodType}`;
    store.load();
  }, [periodType, isChartLabelVisible]);

  return (
    <Container layout="fit">
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
            title: t("million"),
            fields: [totalLoanMdtCode],
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
            type: "bar3d",
            stacked: false,
            xField: "quarter",
            yField: [totalLoanMdtCode],
            title: [t("creditPortfolio")],
            highlight: true,
            label: {
              hidden: !isChartLabelVisible,
              display: "insideEnd",
              orientation: "vertical",
              field: [totalLoanMdtCode],
              renderer: function (value) {
                if (value && value > 0) {
                  return Ext.util.Format.number(value / 1000000, "0,000.0");
                }
                return value;
              },
            },
            tooltip: {
              trackMouse: true,
              renderer: (tooltip, record, item) =>
                tooltip.setHtml(
                  `<div style="text-align: center; font-weight: bold">` +
                    Ext.util.Format.number(
                      getSafeFloatValue(record.get(item.field)) / 1000000,
                      "0,000.0"
                    ) +
                    `</div>`
                ),
            },
          },
        ]}
      />
    </Container>
  );
};

OthersLoanPortfolioDashlet.propTypes = {
  chartRef: PropTypes.any,
  periodType: PropTypes.string,
  totalLoanMdtCode: PropTypes.string,
};

export default OthersLoanPortfolioDashlet;
