import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { Container, Cartesian } from "@sencha/ext-react-modern";
import { BASE_REST_URL, getSafeFloatValue } from "../../../AppUtil";
import { useTranslation } from "react-i18next";

const Ext = window["Ext"];

const OthersReceivedLoansDashlet = ({
  chartRef,
  periodType,
  resident1MdtCode,
  resident2MdtCode,
  nonResident1MdtCode,
  nonResident2MdtCode,
  partnersMdtCode,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  const store = Ext.create("Ext.data.Store", {
    fields: [
      "quarter",
      { partnersMdtCode },
      {
        name: "resident",
        calculate: (data) =>
          getSafeFloatValue(data[resident1MdtCode]) +
          getSafeFloatValue(data[resident2MdtCode]),
      },
      {
        name: "nonResident",
        calculate: (data) =>
          getSafeFloatValue(data[nonResident1MdtCode]) +
          getSafeFloatValue(data[nonResident2MdtCode]),
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
      `${BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=${resident1MdtCode},${resident2MdtCode},` +
      `${nonResident1MdtCode},${nonResident2MdtCode},${partnersMdtCode}&periodType=${periodType}`;
    store.load();
  }, [periodType, isChartLabelVisible]);

  const onTooltipRender = (tooltip, record, item) => {
    const fieldIndex = Ext.Array.indexOf(item.series.getYField(), item.field),
      sector = item.series.getTitle()[fieldIndex];
    tooltip.setHtml(
      '<div style="text-align: center; font-weight: bold">' +
        sector +
        ": " +
        Ext.util.Format.number(
          parseFloat(record.get(item.field)) / 1000000,
          "0,000.0"
        ) +
        "</div>"
    );
  };

  return (
    <Container layout="fit">
      <Cartesian
        shadow
        flex={2}
        store={store}
        ref={chartRef}
        theme="default"
        insetPadding="20"
        innerPadding="0 3 0 0"
        interactions="itemhighlight"
        legend={{ type: "sprite" }}
        axes={[
          {
            type: "numeric3d",
            position: "left",
            title: t("million"),
            adjustMaximumByMajorUnit: true,
            renderer: (axis, label, layoutContext) =>
              Ext.util.Format.number(
                layoutContext.renderer(label) / 1000000,
                "0,000"
              ),
            grid: true,
          },
          {
            type: "category3d",
            position: "bottom",
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
            stacked: true,
            title: [
              t("resident"),
              t("nonResident"),
              t("partners/beneficiaries"),
            ],
            xField: "quarter",
            yField: ["resident", "nonResident", partnersMdtCode],
            highlight: true,
            label: {
              hidden: !isChartLabelVisible,
              display: "insideEnd",
              orientation: "vertical",
              field: ["resident", "nonResident", partnersMdtCode],
              renderer: function (value) {
                if (value && value > 0) {
                  return Ext.util.Format.number(value / 1000000, "0,000.0");
                }
                return value;
              },
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

OthersReceivedLoansDashlet.propTypes = {
  chartRef: PropTypes.any,
  periodType: PropTypes.string,
  resident1MdtCode: PropTypes.string,
  resident2MdtCode: PropTypes.string,
  nonResident1MdtCode: PropTypes.string,
  nonResident2MdtCode: PropTypes.string,
  partnersMdtCode: PropTypes.string,
};

export default OthersReceivedLoansDashlet;
