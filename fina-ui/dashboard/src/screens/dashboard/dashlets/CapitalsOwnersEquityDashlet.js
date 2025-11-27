import React from "react";

import { Container, Polar } from "@sencha/ext-react-modern";
import { BASE_REST_URL } from "../../../AppUtil";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

const Ext = window["Ext"];

class CapitalsOwnersEquityDashlet extends React.Component {
  getDataItemObject = (name, value, total) => {
    return {
      name,
      value: Math.round((value / 1000000) * 10) / 10,
      percentValue: Math.round((value * 100) / total),
    };
  };

  storeTransformData = {
    fn: (data) => {
      if (!data || data.length === 0) {
        return [
          {
            name: this.props.t("noData"),
            percentValue: 0,
            value: 0,
          },
        ];
      }

      const {
        [this.props.residentMdtCode]: resident,
        [this.props.nonResidentMdtCode]: nonresident,
      } = data[data.length - 1];

      const residentParsed = parseFloat(resident);
      const nonresidentParsed = parseFloat(nonresident);

      return [
        this.getDataItemObject(
          this.props.t("resident"),
          residentParsed,
          residentParsed + nonresidentParsed
        ),
        this.getDataItemObject(
          this.props.t("nonResident"),
          nonresident,
          residentParsed + nonresidentParsed
        ),
      ];
    },
  };

  store = Ext.create("Ext.data.Store", {
    fields: ["name", "val"],
    autoLoad: true,
    proxy: {
      type: "ajax",
      url: `${BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=${this.props.residentMdtCode},${this.props.nonResidentMdtCode}&periodType=M`,
      headers: {
        Authorization: "Basic ZmluYTpmaW5hMmRlbW8=",
      },
      reader: {
        type: "json",
        transform: this.storeTransformData,
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

  renderLabel = (val, item, conf, store) => {
    const record = store.store.findRecord("name", val);
    if (record) {
      return Ext.util.Format.number(record.get("percentValue"), "0,000%");
    }
  };

  onTooltipRender = (tooltip, record, item) => {
    const value = Ext.util.Format.number(
      record.get(item.field),
      "0,000.0 (მლნ ₾)"
    );
    tooltip.setHtml(`<b>${value}</b>`);
  };

  render() {
    return (
      <Container layout="fit">
        <Polar
          shadow
          ref={this.props.chartRef}
          store={this.store}
          interactions="rotatePie3d"
          theme="default"
          innerPadding={60}
          platformConfig={{
            phone: {
              innerPadding: 20,
            },
          }}
          animate={{
            duration: 500,
            easing: "easeIn",
          }}
          legend={{
            type: "sprite",
            docked: "bottom",
            marker: { size: 16 },
          }}
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
                field: "name",
                calloutColor: "rgba(0,0,0,0)",
                color: "rgb(0,0,0)",
                calloutLine: {
                  length: 40,
                },
                renderer: this.renderLabel,
              },
              style: {
                strokeStyle: "none",
              },
              tooltip: {
                trackMouse: true,
                renderer: this.onTooltipRender,
              },
            },
          ]}
        />
      </Container>
    );
  }
}

CapitalsOwnersEquityDashlet.propTypes = {
  residentMdtCode: PropTypes.string,
  nonResidentMdtCode: PropTypes.string,
  chartRef: PropTypes.any,
};

export default withTranslation()(CapitalsOwnersEquityDashlet);
