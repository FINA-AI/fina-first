import i18n from "i18next";
import PropTypes from "prop-types";

const customTags = ["<", ">"]; // change default mustache tags {{}} to <>
var mustache = require("mustache");

export const processTemplate = (inputCell, comparisonItem, dataObj) => {
  if (comparisonItem) {
    dataObj.comparisonItem = comparisonItem;
  }

  const item = {
    code: inputCell.code,
    description: inputCell.description,
    equation: inputCell.equation,
    dataElementValue: inputCell.dataItemValue,
  };
  dataObj.item = item;
  return mustache.render(
    comparisonItem.messageTemplate,
    dataObj,
    {},
    customTags
  );
};

export const compileErrorMessage = (
  inputItem,
  comparisonItem,
  itemValue,
  condition,
  compValue,
  leftEquationPresent,
  conditionSymbol
) => {
  return (
    i18n.t("miInfo") +
    ": " +
    inputItem.description +
    "[" +
    inputItem.code +
    "]\n" +
    "   " +
    itemValue +
    "  " +
    condition +
    " " +
    compValue +
    "\n   " +
    (leftEquationPresent
      ? i18n.t("leftEquation") + ": " + comparisonItem.leftEquation + " "
      : "") +
    i18n.t("value") +
    " = " +
    itemValue +
    "\n   " +
    (leftEquationPresent ? i18n.t("rightEquation") : i18n.t("equation")) +
    ": " +
    comparisonItem.equation +
    " " +
    i18n.t("value") +
    " " +
    conditionSymbol +
    " " +
    compValue +
    "\n   "
  );
};

processTemplate.prototypes = {
  inputCell: PropTypes.object.isRequired,
  comparisonItem: PropTypes.object,
  dataObj: PropTypes.object.isRequired,
};

compileErrorMessage.prototypes = {
  inputItem: PropTypes.object.isRequired,
  comparisonItem: PropTypes.object,
  itemValue: PropTypes.number,
  condition: PropTypes.string,
  compValue: PropTypes.number,
  leftEquationPresent: PropTypes.bool.isRequired,
  conditionSymbol: PropTypes.string,
};
