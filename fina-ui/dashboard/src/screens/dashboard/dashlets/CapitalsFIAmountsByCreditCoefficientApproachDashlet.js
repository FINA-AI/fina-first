import React from "react";

import { Container, Polar } from "@sencha/ext-react-modern";
import * as Utils from "../../../AppUtil";
import { withTranslation } from "react-i18next";

const Ext = window["Ext"];

class CapitalsAmountsByCreditCoefficientApproachDashlet extends React.Component {
  proxyReaderTransform = {
    fn: (data) => {
      if (!data || data.length < 1) {
        return [
          {
            type: this.props.t("noData"),
            value: 0,
            percentage: 0,
          },
        ];
      }

      const latestData = data[data.length - 1];

      const concatenatedData =
        latestData[this.props.drawnFundsToSupervisoryCapitalRatioMdtNodeCode];

      const dataList = concatenatedData
        .split(",")
        .filter((d) => d && d.length > 0);

      let strict = 0,
        light = 0;

      for (let i in dataList) {
        if (dataList[i].trim() === "50%-ზე მეტი") {
          strict++;
        } else if (dataList[i].trim() === "50%-ზე ნაკლები") {
          light++;
        }
      }

      const totalCount = strict + light !== 0 ? strict + light : 1;

      return [
        {
          type: this.props.t("strict"),
          value: strict,
          percentage: (strict / totalCount) * 100,
        },
        {
          type: this.props.t("light"),
          value: light,
          percentage: (light / totalCount) * 100,
        },
      ];
    },
  };

  chartConfigs = {
    percentFormatPattern: "0,000%",
    numberFormatPatter: "0,000",
  };

  labelRendererFn = (value, sprite, config, renderData, index) => {
    const record = renderData.store.getAt(index),
      formatedValue = Ext.util.Format.number(
        record.get(renderData.angleField),
        this.chartConfigs.numberFormatPatter
      );
    return formatedValue;
  };

  tooltipRendererFn = (tooltip, record, item) => {
    const value = Ext.util.Format.number(
      record.get("percentage"),
      this.chartConfigs.percentFormatPattern
    );
    tooltip.setHtml(`<b>${value}</b>`);
  };

  store = Ext.create("Ext.data.Store", {
    fields: ["type", "value", "percentage"],
    autoLoad: true,
    proxy: {
      type: "ajax",
      url: `${Utils.BASE_REST_URL}/dashboard/concatenatedTextNodeData?nodeCode=${this.props.drawnFundsToSupervisoryCapitalRatioMdtNodeCode}&periodType=M`,
      headers: {
        Authorization: "Basic ZmluYTpmaW5hMmRlbW8=",
      },
      reader: {
        type: "json",
        transform: this.proxyReaderTransform,
      },
    },
    listeners: {
      beforeload: () => {
        if (this.props.chartRef.current) {
          this.props.chartRef.current.cmp.mask(this.props.t("pleaseWait"));
        }
      },
      load: () => {
        if (this.props.chartRef.current) {
          this.props.chartRef.current.cmp.unmask();
        }
      },
    },
  });

  render() {
    return (
      <Container layout="fit">
        <Polar
          shadow
          ref={this.props.chartRef}
          innerPadding={60}
          platformConfig={{
            phone: {
              innerPadding: 20,
            },
          }}
          interactions="rotatePie3d"
          animate={{
            duration: 500,
            easing: "easeIn",
          }}
          store={this.store}
          theme="default"
          legend={{ type: "sprite" }}
          series={[
            {
              type: "pie3d",
              angleField: "value",
              donut: 30,
              distortion: 0.5,
              thickness: 30,
              platformConfig: {
                phone: {
                  thickness: 40,
                },
              },
              label: {
                field: "type",
                calloutColor: "rgba(0,0,0,0)",
                calloutLine: {
                  length: 40,
                },
                renderer: this.labelRendererFn,
              },
              style: {
                strokeStyle: "none",
              },
              tooltip: {
                trackMouse: true,
                renderer: this.tooltipRendererFn,
              },
            },
          ]}
        />
      </Container>
    );
  }
}

export default withTranslation()(
  CapitalsAmountsByCreditCoefficientApproachDashlet
);
