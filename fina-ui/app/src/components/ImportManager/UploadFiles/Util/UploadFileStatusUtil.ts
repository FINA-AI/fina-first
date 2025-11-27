export const i18nReasonText = (reason: string, t: any) => {
  return reason
    .replaceAll("Is not digitally signed", t("notSignedDigitally"))
    .replaceAll("This message is too long", t("messageTooLong"))
    .replaceAll("Following items are required", t("requiredItems"))
    .replaceAll(
      "Invalid number of digital signatures",
      t("invalidDigitalSignatureNumber")
    )
    .replaceAll("Invalid digital signature", t("invalidDigitalSignature"))
    .replaceAll(
      "Invalid user certificate \\(Certificate CN=",
      t("invalidUserSignature")
    )
    .replaceAll("doesn't match", t("dontMatch"))
    .replaceAll("Process OK", t("processOk"))
    .replaceAll(
      "Schedule does not exists. Period",
      t("periodScheduleDoesNotExist")
    )
    .replaceAll("from =", t("fromEquals"))
    .replaceAll("to =", t("toEquals"))
    .replaceAll(
      "Invalid List Element Value. Node Name",
      t("invalidListElement")
    )
    .replaceAll("Values must be", t("valuesMustBe"))
    .replaceAll("itemCode", t("code"))
    .replaceAll("Code", t("code"))
    .replaceAll("rule validation error", t("ruleValidationError"))
    .replaceAll("must be equal", t("mustEqualTo"))
    .replaceAll("Left Equation", t("leftEquation"))
    .replaceAll("Right Equation", t("rightEquation"))
    .replaceAll("value", t("value"))
    .replaceAll("VALUE", t("value"))
    .replaceAll(" row", t("row"))
    .replaceAll("Warning: Following items are absent", t("absentItemWarning"))
    .replaceAll("COMPARISON VIOLATION", t("comparisonViolation"))
    .replaceAll("CELL", t("cell"))
    .replaceAll("Is not from the", t("isNotFromThe"))
    .replaceAll("INVALID DATE FORMAT", t("invalidDateFormat"))
    .replaceAll("Does not match the pattern", t("patternDoesNotMatch"))
    .replaceAll("FORMULA VIOLATION", t("formulaViolation"))
    .replaceAll("Value does not follow the rule", t("ruleValueWarning"))
    .replaceAll("Sheet Password does not match", t("sheetPasswordMismatch"))
    .replaceAll("net.fina.exception.generalError", t("FINA_GENERAL_ERROR"))
    .replaceAll(
      "Unexpected Error, Contact Administrator!",
      t("unexpectedError")
    )
    .replaceAll(
      "Unexpected Error, Please Contact System Administrator!",
      t("unexpectedError")
    )
    .replaceAll(
      "Fina International General Error Contact Administrator!",
      t("FINA_GENERAL_ERROR")
    )
    .replaceAll("Following Returns has errors", t("followingReturnsHasErrors"))
    .replaceAll("General error contact administrator!", t("FINA_GENERAL_ERROR"))
    .replaceAll("Invalid Date", t("invalidDate"))
    .replaceAll("Please use pattern", t("pleaseUsePattern"))
    .replaceAll("INVALID NUMBER FORMAT", t("invalidNumberFormat"))
    .replaceAll("File name FI code", t("fileNameFiCode"))
    .replaceAll("Is not a number", t("isNotNumber"))
    .replaceAll("ERROR", t("error"))
    .replaceAll("is empty", t("isEmpty"))
    .replaceAll("Row", t("row"))
    .replaceAll("Sheet", t("sheet"));
};
