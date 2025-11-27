import React from "react";
import { Polar, Container } from "@sencha/ext-react-modern";
import * as Utils from "../../../AppUtil";
import { withTranslation } from "react-i18next";

const Ext = window["Ext"];

class AssetsPortfolioStructureDashlet extends React.Component {
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

    const latestPeriodDataObj = data[data.length - 1],
      topResults = this.getTopResults(latestPeriodDataObj),
      percentages = this.getPercentages(topResults);

    return percentages;
  };

  proxy = {
    type: "ajax",
    url:
      `${Utils.BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=${this.props.trandeAndServicesMdtCode},` +
      `${this.props.consumerLoansMdtCode},${this.props.agricultureMdtCode},${this.props.onlineLoansMdtCode},${this.props.lombardMdtCode},` +
      `${this.props.installementMdtCode},${this.props.otherPhysicalPersonLoansMdtCode},${this.props.tradeAndServiceLoansMdtCode},` +
      `${this.props.agriculturalAndForestryLoansMdtCode},${this.props.transportAndCommunicationLoansMdtCode},${this.props.otherLegalPersonLoansMdtCode}&periodType=M`,
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
    fields: ["name", "val", "percentage"],
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

  getPercentages = (values) => {
    let sum = values.reduce((total, entry) => total + entry.val, 0);

    return values.map((entry) => ({
      name: this.getName(entry["code"]),
      percentage: (100 * entry["val"]) / sum,
      val: entry.val / 1000000,
    }));
  };

  getTopResults = (valuesObject) => {
    const otherPhysicalPersonLoans = Utils.getSafeFloatValue(
        valuesObject[this.props.otherPhysicalPersonLoansMdtCode]
      ),
      otherLegalPersonLoans = Utils.getSafeFloatValue(
        valuesObject[this.props.otherLegalPersonLoansMdtCode]
      );

    let keys = Object.keys(valuesObject).filter((key) => {
      return (
        key !== "quarter" &&
        key !== this.props.otherPhysicalPersonLoansMdtCode &&
        key !== this.props.otherLegalPersonLoansMdtCode
      );
    });

    const numericValuesArr = keys.map((key) => ({
      code: key,
      val: Utils.getSafeFloatValue(valuesObject[key]),
    }));

    //Sort descending
    numericValuesArr.sort((v1, v2) => v2.val - v1.val);

    // get top 4 results
    const topResults = numericValuesArr.slice(0, 4);

    // get sum of other results
    let others = numericValuesArr.slice(4);
    let sumOfOthers = others.reduce((sum, entry) => sum + entry.val, 0);
    sumOfOthers += otherLegalPersonLoans + otherPhysicalPersonLoans;

    return [...topResults, { code: "other", val: sumOfOthers }];
  };

  getName = (nameKey) => {
    let name = nameKey;

    switch (nameKey) {
      case this.props.trandeAndServicesMdtCode:
        name = this.props.t("tradeAndServices");
        break;
      case this.props.consumerLoansMdtCode:
        name = this.props.t("loans");
        break;
      case this.props.agricultureMdtCode:
        name = this.props.t("agriculture");
        break;
      case this.props.onlineLoansMdtCode:
        name = this.props.t("onlineLoans");
        break;
      case this.props.lombardMdtCode:
        name = this.props.t("Pawnshop");
        break;
      case this.props.installementMdtCode:
        name = this.props.t("installement");
        break;
      case this.props.tradeAndServiceLoansMdtCode:
        name = this.props.t("tradeAndServiceLoans");
        break;
      case this.props.agriculturalAndForestryLoansMdtCode:
        name = this.props.t("agriculturalAndForestryLoans");
        break;
      case this.props.transportAndCommunicationLoansMdtCode:
        name = this.props.t("transportAndCommunicationLoans");
        break;
      default:
        name = this.props.t("other");
        break;
    }

    return name;
  };

  onTooltipRender = (tooltip, record) => {
    const formatString = "0,000.0 (მლნ ₾)",
      value = Ext.util.Format.number(record.get("val"), formatString);
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

export default withTranslation()(AssetsPortfolioStructureDashlet);
