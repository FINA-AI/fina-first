import React from "react";
import {
  Button,
  Container,
  Spacer,
  ToggleField,
} from "@sencha/ext-react-modern";
import { connect } from "react-redux";

import { withRouter } from "react-router";
import { compose } from "redux";
import {
  changePeriodType,
  changeChartLabelVisibility,
} from "../../store/actions";
import { useTranslation } from "react-i18next";

const MfoHeader = ({
  history,
  location: { pathname },
  changePeriodType,
  isQuarter,
  url,
  changeChartLabelVisibility,
  isChartLabelVisible,
}) => {
  const { t } = useTranslation();

  let type = pathname.split("/").slice(-1).pop();

  const onTypeChange = (type) => {
    history.push(`${url}/${type}`);
  };

  return (
    <Container
      layout={{ type: "hbox", pack: "left" }}
      defaults={{ margin: "10" }}
    >
      <Button
        {...(type === "assets"
          ? { ui: "alt raised confirm" }
          : { ui: "raised" })}
        text={t("assets")}
        handler={() => {
          onTypeChange("assets");
        }}
      />
      <Button
        {...(type === "liquidities"
          ? { ui: "alt raised confirm" }
          : { ui: "raised" })}
        text={t("liquidities")}
        handler={() => {
          onTypeChange("liquidities");
        }}
      />
      <Button
        {...(type === "profitability"
          ? { ui: "alt raised confirm" }
          : { ui: "raised" })}
        text={t("profitability")}
        handler={() => {
          onTypeChange("profitability");
        }}
      />
      <Button
        {...(type === "capitals"
          ? { ui: "alt raised confirm" }
          : { ui: "raised" })}
        text={t("capital")}
        handler={() => {
          onTypeChange("capitals");
        }}
      />
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

export default compose(
  withRouter,
  connect(mapStateToProps, { changePeriodType, changeChartLabelVisibility })
)(MfoHeader);
