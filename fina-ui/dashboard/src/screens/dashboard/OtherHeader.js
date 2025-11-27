import React from "react";
import { Container, Spacer, ToggleField } from "@sencha/ext-react-modern";
import { connect } from "react-redux";
import {
  changePeriodType,
  changeChartLabelVisibility,
} from "../../store/actions";
import { useTranslation } from "react-i18next";

const OtherHeader = ({
  changePeriodType,
  isQuarter,
  changeChartLabelVisibility,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  return (
    <Container
      layout={{ type: "hbox", pack: "left" }}
      defaults={{ margin: "10" }}
    >
      <Spacer />
      <ToggleField
        boxLabel={t("month/quarter")}
        value={isQuarter}
        onChange={({ newValue }) => {
          changePeriodType(newValue);
        }}
      />
      <ToggleField
        boxLabel={t("headerLabelVisibility")}
        value={isChartLabelVisible}
        onChange={({ newValue }) => {
          changeChartLabelVisibility(newValue);
        }}
      />
    </Container>
  );
};

const mapStateToProps = (state) => ({
  isQuarter: state.isQuarter,
  isChartLabelVisible: state.isChartLabelVisible,
});

export default connect(mapStateToProps, {
  changePeriodType,
  changeChartLabelVisibility,
})(OtherHeader);
