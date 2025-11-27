import { Grid } from "@mui/material";
import FiTypeSelect from "../../Common/FiType/FiTypeSelect";
import TextField from "../../../common/Field/TextField";
import FiGroupSelect from "../../Common/FiGroup/FiGroupSelect";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import LegalFormTypeAutoComplete from "../../Common/AutoComplete/LegalFormTypeAutoComplete";
import EconomicEntityTypeAutoComplete from "../../Common/AutoComplete/EconomicEntityTypeAutoComplete";
import EquityFormTypeAutoComplete from "../../Common/AutoComplete/EquityFormTypeAutoComplete";
import ManagementFormTypeAutoComplete from "../../Common/AutoComplete/ManagementFormTypeAutoComplete";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

const StyledGrid = styled(Grid)({
  "& .MuiGrid-item": {
    paddingTop: "12px",
  },
  paddingBottom: "25px",
});

const FiBasicInfoWizardPage = ({
  basicInfo,
  onBasicInfoChange,
  onBasicInfoDetailChange,
  isNextStepEnable,
}) => {
  const { t } = useTranslation();

  const [basicInfoObj, setBasicInfoObj] = useState();
  const [errorFields, setErrorFields] = useState(basicInfo.isError);

  useEffect(() => {
    setBasicInfoObj(basicInfo);
  }, []);

  useEffect(() => {
    if (isNextStepEnable !== null) {
      setErrorFields({ ...basicInfo.isError });
    }
  }, [isNextStepEnable]);

  const onFieldErrorChange = (field, val) => {
    if (!!!val === errorFields[field]) {
      return;
    }
    setErrorFields({
      ...errorFields,
      [field]: !errorFields[field],
    });
  };

  return (
    <StyledGrid
      container
      direction={"column"}
      spacing={2}
      data-testid={"fi-basic-info-container"}
    >
      <Grid item data-testid={"fi-type-select-container"}>
        <FiTypeSelect
          size={"default"}
          selectedItem={basicInfoObj?.fiType}
          isError={basicInfoObj?.fiType ? false : errorFields["fiType"]}
          onChange={(fiType) => {
            onBasicInfoChange("fiType", fiType);
            onFieldErrorChange("fiType", fiType);
          }}
          onClear={() => {
            onBasicInfoChange("fiType", null);
            onFieldErrorChange("fiType", null);
          }}
          allowInvalidInputSelection
        />
      </Grid>
      <Grid item data-testid={"legal-form-select-container"}>
        <LegalFormTypeAutoComplete
          selectedItem={basicInfoObj?.additionalInfo?.businessEntity}
          onChange={(value) => {
            onBasicInfoDetailChange("businessEntity", value);
          }}
          size={"default"}
          onClear={() => {
            onBasicInfoDetailChange("businessEntity", "");
          }}
          allowInvalidInputSelection
        />
      </Grid>
      <Grid item data-testid={"economic-entity-select-container"}>
        <EconomicEntityTypeAutoComplete
          selectedItem={basicInfoObj?.additionalInfo?.economicEntity}
          onChange={(value) => {
            onBasicInfoDetailChange("economicEntity", value);
          }}
          onClear={() => {
            onBasicInfoDetailChange("economicEntity", "");
          }}
          allowInvalidInputSelection
        />
      </Grid>
      <Grid item data-testid={"equity-formType-select-container"}>
        <EquityFormTypeAutoComplete
          selectedItem={basicInfoObj?.additionalInfo?.equityForm}
          onChange={(value) => {
            onBasicInfoDetailChange("equityForm", value);
          }}
          onClear={() => {
            onBasicInfoDetailChange("equityForm", "");
          }}
          allowInvalidInputSelection
        />
      </Grid>
      <Grid item data-testid={"management-formType-select-container"}>
        <ManagementFormTypeAutoComplete
          selectedItem={basicInfoObj?.additionalInfo?.managementForm}
          onChange={(value) => {
            onBasicInfoDetailChange("managementForm", value);
          }}
          onClear={() => {
            onBasicInfoDetailChange("managementForm", "");
          }}
          allowInvalidInputSelection
        />
      </Grid>
      <Grid item>
        <TextField
          value={basicInfoObj?.name}
          onChange={(fiType) => {
            onBasicInfoChange("name", fiType);
            onFieldErrorChange("name", fiType);
          }}
          label={t("name")}
          isDisabled={false}
          isError={errorFields["name"]}
          size={"default"}
          fieldName={"name"}
        />
      </Grid>
      <Grid item>
        <TextField
          value={basicInfoObj?.shortNameString}
          onChange={(fiType) => {
            onBasicInfoChange("shortNameString", fiType);
          }}
          label={t("shortName")}
          isDisabled={false}
          size={"default"}
          fieldName={"shortName"}
        />
      </Grid>
      <Grid item>
        <TextField
          value={basicInfoObj?.code}
          onChange={(value) => {
            onBasicInfoChange("code", value);
            onFieldErrorChange("code", value);
          }}
          label={t("code")}
          isDisabled={false}
          isError={errorFields["code"]}
          size={"default"}
          fieldName={"code"}
        />
      </Grid>
      <Grid item>
        <TextField
          value={basicInfoObj?.swiftCode}
          onChange={(fiType) => {
            onBasicInfoChange("swiftCode", fiType);
          }}
          label={t("swiftCode")}
          isDisabled={false}
          size={"default"}
          fieldName={"swiftCode"}
          maxLength={11}
          pattern={/^$|^[\p{L}\p{N}]+$/u}
        />
      </Grid>
      <Grid item data-testid={"defaultGroup-select-container"}>
        <FiGroupSelect
          size={"default"}
          selectedItem={basicInfoObj?.fiGroup}
          isError={basicInfoObj?.fiGroup ? false : errorFields["fiGroup"]}
          onChange={(fiType) => {
            onBasicInfoChange("fiGroup", fiType);
            onFieldErrorChange("fiGroup", fiType);
          }}
          onClear={() => {
            onBasicInfoChange("fiGroup", null);
            onFieldErrorChange("fiGroup", null);
          }}
          allowInvalidInputSelection
        />
      </Grid>
      <Grid item>
        <TextField
          value={basicInfoObj?.identificationCode}
          label={t("fiMainId")}
          isDisabled={false}
          isError={errorFields["identificationCode"]}
          onChange={(fiType) => {
            onBasicInfoChange("identificationCode", fiType);
            onFieldErrorChange("identificationCode", fiType);
          }}
          size={"default"}
          fieldName={"identificationCode"}
        />
      </Grid>
    </StyledGrid>
  );
};

FiBasicInfoWizardPage.propTypes = {
  basicInfo: PropTypes.object.isRequired,
  onBasicInfoChange: PropTypes.func.isRequired,
  onBasicInfoDetailChange: PropTypes.func.isRequired,
  isNextStepEnable: PropTypes.any,
  nextDisableFunc: PropTypes.func,
};

export default FiBasicInfoWizardPage;
