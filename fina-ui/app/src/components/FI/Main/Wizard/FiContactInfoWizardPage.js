import { Grid } from "@mui/material";
import TextField from "../../../common/Field/TextField";
import DatePicker from "../../../common/Field/DatePicker";
import CustomAutoComplete from "../../../common/Field/CustomAutoComplete";
import FiRegionSelect from "../../Common/FiRegion/FiRegionSelect";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { validateEmail } from "../../../../util/component/validationUtil";
import useConfig from "../../../../hoc/config/useConfig";
import { styled } from "@mui/material/styles";

const fiStatuses = [
  {
    label: "ACTIVE",
    value: false,
  },
  {
    label: "INACTIVE",
    value: true,
  },
];

const StyledGrid = styled(Grid)({
  "& .MuiGrid-item": {
    paddingTop: "12px",
  },
  paddingBottom: "25px",
});

const FiContactInfoWizardPage = ({
  contactInfoRef,
  onContactInfoChange,
  isNextStepEnable,
}) => {
  const { t } = useTranslation();
  const { config } = useConfig();
  const [contactInfo, setContactInfo] = useState(contactInfoRef);
  const [errorFields, setErrorFields] = useState(contactInfoRef.isError);
  const [country, setCountry] = useState(contactInfoRef.region);
  const [status, setStatus] = useState(contactInfoRef.status);

  useEffect(() => {
    setContactInfo(contactInfoRef);
    setCountry(contactInfoRef.region);
    setStatus(contactInfoRef.status);
  }, []);

  useEffect(() => {
    if (isNextStepEnable !== null) {
      setErrorFields({ ...contactInfoRef.isError });
    }
  }, [isNextStepEnable]);

  const validateEmailFunc = (value) => {
    let isValid = validateEmail(config, value);
    return isValid;
  };

  return (
    <StyledGrid
      container
      direction={"column"}
      spacing={2}
      data-testid={"fi-contact-info-container"}
    >
      <Grid item>
        <TextField
          value={contactInfo.phone}
          onChange={(fiType) => {
            onContactInfoChange("phone", fiType);
          }}
          label={t("phone")}
          isDisabled={false}
          size={"default"}
          fieldName={"phone"}
        />
      </Grid>
      <Grid item>
        <TextField
          value={contactInfo.email}
          onChange={(fiType) => {
            onContactInfoChange("email", fiType);
          }}
          label={t("email")}
          isDisabled={false}
          size={"default"}
          fieldValidationFunction={validateEmailFunc}
          fieldName={"email"}
        />
      </Grid>
      <Grid item data-testid={"region-select-container"}>
        <FiRegionSelect
          selectedItem={contactInfo.region}
          isError={country ? false : errorFields["region"]}
          onChange={(fiType) => {
            onContactInfoChange("region", fiType);
            setCountry(fiType);
          }}
          size={"default"}
          onClear={() => {
            onContactInfoChange("region", null);
            setCountry(null);
            errorFields["region"] = true;
          }}
          allowInvalidInputSelection
        />
      </Grid>
      <Grid item>
        <TextField
          value={contactInfo.addressString}
          onChange={(fiType) => {
            onContactInfoChange("addressString", fiType);
          }}
          label={t("address")}
          isDisabled={false}
          size={"default"}
          fieldName={"address"}
        />
      </Grid>
      <Grid item>
        <DatePicker
          value={contactInfo.registrationDate}
          onChange={(fiType) => {
            onContactInfoChange("registrationDate", fiType);
          }}
          label={t("registrationDate")}
          isDisabled={false}
          size={"default"}
          data-testid={"registrationDate"}
        />
      </Grid>
      <Grid item>
        <DatePicker
          value={contactInfo.closeDate}
          onChange={(fiType) => {
            onContactInfoChange("closeDate", fiType);
          }}
          label={t("closingDate")}
          isDisabled={false}
          size={"default"}
          data-testid={"closeDate"}
        />
      </Grid>
      <Grid item data-testid={"status-select-container"}>
        <CustomAutoComplete
          disabled={false}
          label={t("status")}
          data={fiStatuses}
          displayFieldName={"label"}
          valueFieldName={"value"}
          selectedItem={contactInfo.status}
          isError={status ? false : errorFields["status"]}
          onChange={(fiType) => {
            onContactInfoChange("status", fiType);
            setStatus(fiType);
          }}
          size={"default"}
          fieldName={"status"}
          onClear={() => {
            onContactInfoChange("status", null);
            setStatus(null);
            errorFields["status"] = true;
          }}
          allowInvalidInputSelection
        />
      </Grid>
    </StyledGrid>
  );
};

FiContactInfoWizardPage.propTypes = {
  contactInfoRef: PropTypes.object.isRequired,
  onContactInfoChange: PropTypes.func.isRequired,
  isNextStepEnable: PropTypes.any,
  nextDisableFunc: PropTypes.func,
};

export default FiContactInfoWizardPage;
