import { Parameter } from "../../../types/reportGeneration.type";
import { ReportParameterType } from "../../../components/ReportManager/Generate/ParameterTypeNames";
import { ParameterRestriction } from "../../../types/report.type";

export const parseParamNameRestrictions = (
  parameterName: string
): ParameterRestriction | null => {
  if (!parameterName.includes("$")) {
    return null;
  }
  parameterName = "$" + parameterName.split("$")[1];

  const regex = /\$([^#]+)(?:#(\d+))?/;
  const match = parameterName.match(regex);
  let restrictedCodes: any = [];
  let restrictedCount = null;

  if (match) {
    restrictedCodes = match[1].split(",");
    restrictedCount = match[2];
  }
  restrictedCount = restrictedCount ? restrictedCount : 10000;

  const result: ParameterRestriction = {
    restrictedCodes: restrictedCodes,
    restrictedCount: restrictedCount ? Number(restrictedCount) : 0,
  };

  return result;
};

export const validate = (
  parameter: Parameter,
  selectedRows: any[],
  destinationRows: any[]
) => {
  const paramRestriction = parseParamNameRestrictions(parameter.name);

  if (paramRestriction) {
    switch (parameter.type) {
      case ReportParameterType.BANK:
        return validateFiRestrictions(
          paramRestriction,
          selectedRows,
          destinationRows
        );
      case ReportParameterType.PERIOD:
        return validatePeriodTypeRestrictions(
          paramRestriction,
          selectedRows,
          destinationRows
        );
    }
  }

  return {
    isValid: true,
    message: null,
  };
};

const validateFiRestrictions = (
  restriction: ParameterRestriction,
  selectedRows: any[],
  destinationRows: any[]
) => {
  let selectedFisCount = destinationRows.reduce((count: number, row: any) => {
    return count + row.fis.length;
  }, 0);
  let isValid = true;

  selectedRows
    .filter((row: any) => row.fis.length > 0)
    .forEach((row: any) => {
      selectedFisCount += row.fis.length;
      isValid =
        isValid && restriction.restrictedCodes.includes(row.parent.code);
    });

  let message = null;

  if (!isValid) {
    message = `You Can Choose Fis only From: ${restriction.restrictedCodes}`;
  } else if (selectedFisCount > restriction.restrictedCount) {
    message = `Max param size is : ${restriction.restrictedCount}`;
  }

  return {
    isValid: isValid && selectedFisCount <= restriction.restrictedCount,
    message: message,
  };
};

const validatePeriodTypeRestrictions = (
  restriction: ParameterRestriction,
  selectedRows: any[],
  destinationRows: any[]
) => {
  let selectedPeriodCount = selectedRows.length + destinationRows.length;
  let isValid = true;

  selectedRows.forEach((row: any) => {
    isValid =
      isValid &&
      restriction.restrictedCodes.some(
        (code: string) =>
          row.periodType.periodType.toUpperCase() === code.toUpperCase()
      );
  });
  let message = null;

  if (!isValid) {
    message = `You Can Choose Period Types only From: ${restriction.restrictedCodes}`;
  } else if (selectedPeriodCount > restriction.restrictedCount) {
    message = `Max param size is : ${restriction.restrictedCodes}`;
  }

  return {
    isValid: isValid && selectedPeriodCount <= restriction.restrictedCount,
    message: message,
  };
};
