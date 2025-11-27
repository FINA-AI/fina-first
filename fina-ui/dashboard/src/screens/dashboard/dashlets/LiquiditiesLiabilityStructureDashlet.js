import React from "react";
import PropTypes from "prop-types";
import { Polar, Container } from "@sencha/ext-react-modern";
import { BASE_REST_URL, getSafeFloatValue } from "../../../AppUtil";
import { withTranslation } from "react-i18next";

const Ext = window["Ext"];

class LiquiditiesLiabilityStructureDashlet extends React.Component {
  getLastElementOfArray = (array) => {
    if (array == null || array.length < 1) {
      return null;
    }
    return array[array.length - 1];
  };

  getDataItemObject = (loanType, value, total) => {
    return {
      loanType,
      value: Math.round((value / 1000000) * 10) / 10,
      percentValue: Math.round((value * 100) / total),
    };
  };

  storeTransformData = {
    fn: (data) => {
      if (!data || data.length === 0) {
        return [
          {
            loanType: this.props.t("noData"),
            value: 0,
            percentValue: 0,
          },
        ];
      }

      const result = [];
      const lastDataItem = this.getLastElementOfArray(data);

      if (lastDataItem) {
        const loansFi = getSafeFloatValue(
            lastDataItem[this.props.loansFiMdtCode]
          ),
          loansSubordinated = getSafeFloatValue(
            lastDataItem[this.props.loansSubordinatedMdtCode]
          ),
          loansPhysicalPersons = getSafeFloatValue(
            lastDataItem[this.props.loansPhysicalPersonMdtCode]
          ),
          loansLegalPersons = getSafeFloatValue(
            lastDataItem[this.props.loansLegalPersonMdtCode]
          ),
          total =
            loansFi +
            loansSubordinated +
            loansPhysicalPersons +
            loansLegalPersons;

        result.push(
          this.getDataItemObject(this.props.t("fis"), loansFi, total),
          this.getDataItemObject(
            this.props.t("subordinatedLoan"),
            loansSubordinated,
            total
          ),
          this.getDataItemObject(
            this.props.t("physicalPerson"),
            loansPhysicalPersons,
            total
          ),
          this.getDataItemObject(
            this.props.t("legalPerson"),
            loansLegalPersons,
            total
          )
        );
      }

      return result;
    },
  };

  store = Ext.create("Ext.data.Store", {
    fields: ["loanType", "value"],
    autoLoad: true,
    proxy: {
      type: "ajax",
      url: `${BASE_REST_URL}/dashboard/aggregatedNodesData?nodeCodes=${this.props.loansFiMdtCode},${this.props.loansSubordinatedMdtCode},${this.props.loansPhysicalPersonMdtCode},${this.props.loansLegalPersonMdtCode}&periodType=M`,
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

  formatFloatNumber = (value, format) =>
    Ext.util.Format.number(parseFloat(value), format);

  onTooltipRender = (tooltip, record, item) => {
    const value = Ext.util.Format.number(
      record.get(item.field),
      this.chartConfig.numberFormatGelMln
    );
    tooltip.setHtml(`<b>${value}</b>`);
  };

  renderLabel = (value, item, conf, store) => {
    let record = store.store.findRecord("loanType", value);
    if (record) {
      return this.formatFloatNumber(
        record.get("percentValue"),
        this.chartConfig.numberFormatPercent
      );
    }
  };

  chartConfig = {
    theme: "Default",
    interactions: "rotatePie3d",
    numberFormatPercent: "0,000%",
    numberFormatGelMln: "0,000.0 (მლნ ₾)",
  };

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
          interactions={this.chartConfig.interactions}
          animate={{
            duration: 500,
            easing: "easeIn",
          }}
          legend={{
            type: "sprite",
            docked: "bottom",
          }}
          store={this.store}
          theme={this.chartConfig.theme}
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
                field: "loanType",
                calloutColor: "rgba(0,0,0,0)",
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

LiquiditiesLiabilityStructureDashlet.propTypes = {
  chartRef: PropTypes.any,
  loansFiMdtCode: PropTypes.string,
  loansPhysicalPersonMdtCode: PropTypes.string,
  loansLegalPersonMdtCode: PropTypes.string,
  loansSubordinatedMdtCode: PropTypes.string,
};

export default withTranslation()(LiquiditiesLiabilityStructureDashlet);
