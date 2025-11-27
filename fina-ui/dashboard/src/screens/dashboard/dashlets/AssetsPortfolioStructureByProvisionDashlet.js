import React from "react";

import { Container, Polar } from "@sencha/ext-react-modern";
import * as Utils from "../../../AppUtil";
import { withTranslation } from "react-i18next";

const Ext = window["Ext"];

class AssetsPortfolioStructureByProvisionDashlet extends React.Component {
  dataTransformFn = (data) => {
    if (!data || data.length < 1) {
      return [
        {
          name: this.props.t("noData"),
          percentage: 0,
          val: 0,
        },
      ];
    }

    const latestPeriodData = data[data.length - 1],
      total = Utils.getSafeFloatValue(
        latestPeriodData[this.props.totalMdtCode]
      );

    return this.calculatePercentages(
      this.getTopResults(latestPeriodData, 4, total),
      total
    );
  };

  calculatePercentages = (data, total) =>
    data.map((item) => ({
      name: this.getName(item["code"]),
      value: item["value"],
      percentage: (item["value"] / total) * 100,
    }));

  getDataObjectAsArray = (obj) => {
    const result = [];
    for (let [key, value] of Object.entries(obj)) {
      if (key !== "quarter" && key !== this.props.totalMdtCode) {
        result.push({
          code: key,
          value: Utils.getSafeFloatValue(value),
        });
      }
    }

    return result;
  };

  getName = (code) => {
    let name = "";
    switch (code) {
      case this.props.preciousMetalMdtCode:
        name = this.props.t("preciousMetal");
        break;
      case this.props.realEstateMdtCode:
        name = this.props.t("realEstate");
        break;
      case this.props.transportMdtCode:
        name = this.props.t("transport");
        break;
      case this.props.thirdPersonGuaranteeMdtCode:
        name = this.props.t("thirdPersonGuarantee");
        break;
      case this.props.ownSecurityMdtCode:
        name = this.props.t("ownSecurities");
        break;
      case this.props.otherCompanySecurityMdtCode:
        name = this.props.t("otherCompanySecurities");
        break;
      case this.props.governmentSecurityMdtCode:
        name = this.props.t("governmentSecurities");
        break;
      case this.props.withoutCollateralMdtCode:
        name = this.props.t("withoutCollateral");
        break;
      default:
        name = this.props.t("other");
        break;
    }

    return name;
  };

  getTopResults = (data, numTopResults, total) => {
    const dataArray = this.getDataObjectAsArray(data);
    dataArray.sort((d1, d2) => {
      return data[d2.code] - data[d1.code];
    });

    const topResults = dataArray.slice(
        0,
        numTopResults > 0 ? numTopResults : 5
      ),
      sumOfTopResults = topResults.reduce(
        (sum, item) => sum + item["value"],
        0
      );

    const sumOfOthers = total - sumOfTopResults;

    return [...topResults, { code: "other", value: sumOfOthers }];
  };

  onTooltipRender = (tooltip, record) => {
    const formatString = "0,000.0 (მლნ ₾)",
      value = Ext.util.Format.number(
        record.get("value") / 1000000,
        formatString
      );
    tooltip.setHtml(`<b>${value}</b>`);
  };

  onLabelRender = (value, sprite, config, renderData, index) => {
    const record = renderData.store.getAt(index),
      formatString = "0,000 %",
      renderVal = Ext.util.Format.number(
        record.get("percentage"),
        formatString
      );
    return renderVal;
  };

  proxy = {
    type: "ajax",
    url:
      `${Utils.BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=${this.props.totalMdtCode},${this.props.preciousMetalMdtCode},` +
      `${this.props.transportMdtCode},${this.props.realEstateMdtCode},${this.props.thirdPersonGuaranteeMdtCode},${this.props.ownSecurityMdtCode},` +
      `${this.props.otherCompanySecurityMdtCode},${this.props.governmentSecurityMdtCode},${this.props.withoutCollateralMdtCode}&periodType=M`,
    headers: {
      Authorization: "Basic ZmluYTpmaW5hMmRlbW8=",
    },
    reader: {
      type: "json",
      transform: {
        fn: this.dataTransformFn,
      },
    },
  };

  store = Ext.create("Ext.data.Store", {
    fields: ["name", "percentage", "values"],
    autoLoad: true,
    proxy: this.proxy,
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
          innerPadding={40}
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
              angleField: "percentage",
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
                calloutLine: {
                  length: 40,
                },
                renderer: this.onLabelRender,
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

export default withTranslation()(AssetsPortfolioStructureByProvisionDashlet);
