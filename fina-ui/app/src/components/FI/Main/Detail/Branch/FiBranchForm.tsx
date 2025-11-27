import { KeyboardArrowRightRounded } from "@mui/icons-material";
import { Box } from "@mui/material";
import React, { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useConfig from "../../../../../hoc/config/useConfig";
import CloseBtn from "../../../../common/Button/CloseBtn";
import PrimaryBtn from "../../../../common/Button/PrimaryBtn";
import CheckboxForm from "../../../../common/Checkbox/CheckboxForm";
import DatePicker from "../../../../common/Field/DatePicker";
import NumberField from "../../../../common/Field/NumberField";
import Select from "../../../../common/Field/Select";
import TextField from "../../../../common/Field/TextField";
import Wizard from "../../../../Wizard/Wizard";
import FiPersonSelect from "../Person/Select/FiPersonSelect";
import withLoading from "../../../../../hoc/withLoading";
import FiRegionSelect from "../../../Common/FiRegion/FiRegionSelect";
import { styled } from "@mui/material/styles";
import { BranchDataType, BranchTypes } from "../../../../../types/fi.type";
import { CountryDataTypes } from "../../../../../types/common.type";
import { PhysicalPersonDataType } from "../../../../../types/physicalPerson.type";
import isEmpty from "lodash/isEmpty";

const StyledRoot = styled(Box)(({ theme }) => ({
  width: 700,
  borderRadius: 8,
  [theme.breakpoints.down("lg")]: {
    paddingBottom: 15,
  },
}));

const StyledHeader = styled(Box)(({ theme }: any) => ({
  ...theme.modalHeader,
  paddingRight: "20px",
}));

const StyledContent = styled(Box)(({ theme }: any) => ({
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
  color: theme.palette.textColor,
  textTransform: "capitalize",

  height: "400px",
  overflow: "auto",
}));

const StyledFooter = styled(Box)(({ theme }: any) => ({
  ...theme.modalFooter,
  boxShadow: "0px -2px 12px rgba(53, 47, 47, 0.08)",
}));

const StyledWizardCloseBtn = styled(Box)({
  position: "absolute",
  zIndex: 2,
  top: 15,
  right: 20,
});

interface FIBranchFormProps {
  branchTypes: BranchTypes[];
  close: () => void;
  regions?: {
    label: string;
    value: CountryDataTypes;
  }[];
  persons?: PhysicalPersonDataType[];
  formObj: BranchDataType;
  setFormObj: React.Dispatch<React.SetStateAction<BranchDataType>>;
  submit: () => void;
  selectedValue: BranchTypes;
  setSelectedValue: React.Dispatch<React.SetStateAction<BranchTypes>>;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  onAddNewPerson?: (personItem: PhysicalPersonDataType) => void;
  selectedType: BranchTypes;
  loading?: boolean;
  editFiBranchId?: number;
  countries?: CountryDataTypes[];
  allStepsValidation: {
    [step: number]: boolean;
  }[];
  handleOnNext: (prevStep: number, currStep: number) => void;
  errorFields: string[];
  MANDATORY_FIELDS: string[];
}

const FIBranchForm: React.FC<FIBranchFormProps> = ({
  branchTypes,
  close,
  regions,
  persons,
  formObj,
  setFormObj,
  submit,
  selectedValue,
  setSelectedValue,
  isEdit,
  setIsEdit,
  onAddNewPerson,
  selectedType,
  loading,
  editFiBranchId,
  countries,
  handleOnNext,
  allStepsValidation,
  errorFields,
  MANDATORY_FIELDS,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  const [isRegistration, setIsRegistration] = React.useState(true);

  useEffect(() => {
    if (editFiBranchId) {
      setSelectedValue(selectedType);
      setIsEdit(true);
      setIsRegistration(false);
    }
  }, [editFiBranchId]);

  const handleTypeChange = (code: string) => {
    let type = branchTypes.find((e) => e.code === code);
    if (type) setSelectedValue(type);
  };

  const onChange = (
    val: number | string | undefined | null | CountryDataTypes,
    field?: string
  ) => {
    if (!field) return;
    formObj[field] = val;
    setFormObj({ ...formObj });

    if (MANDATORY_FIELDS.includes(field)) {
      if (!val && !errorFields.includes(field)) {
        errorFields.push(field);
      } else if (val && errorFields.includes(field)) {
        const index = errorFields.indexOf(field);
        if (index > -1) errorFields.splice(index, 1);
      }
    }
  };

  useEffect(() => {
    if (branchTypes.length !== 0 && selectedType) {
      handleTypeChange(selectedType.code);
    }
  }, [branchTypes]);

  const getField = (type: string, name: string) => {
    switch (type) {
      case "date":
      case "Date":
        return (
          <DatePicker
            format={getDateFormat(true)}
            label={t(`branchField${name}`)}
            value={formObj[name] || null}
            onChange={(val) =>
              onChange(val ? val.getTime().toString() : val, name)
            }
            size="default"
            data-testid={name}
          />
        );
      case "long":
      case "int":
      case "Long":
      case "Integer":
        return (
          <NumberField
            label={t(`branchField${name}`)}
            value={formObj[name]}
            fieldName={name}
            onChange={onChange}
            size={"default"}
          />
        );
      case "boolean":
      case "Boolean":
        return (
          <Select
            label={t(`branchField${name}`)}
            data={[
              { label: t("yes"), value: true },
              { label: t("no"), value: false },
            ]}
            value={formObj[name] ? t("true") : t("false")}
            onChange={(val) => onChange(val, name)}
            size="default"
            data-testid={name + "-select"}
          />
        );
      case "Region":
      case "RegionMetaModel":
        return (
          <>
            {!loading && !!regions && (
              <FiRegionSelect
                selectedItem={formObj[name] || null}
                onChange={(val) => onChange(val, name)}
                onClear={() => onChange("", name)}
                size={"default"}
                isError={errorFields.includes(name)}
                allowInvalidInputSelection
              />
            )}
          </>
        );
      case "FiPerson":
      case "PersonMetaModel":
        return (
          <div data-testid={name + "-select-container"}>
            {!loading && !!persons && (
              <FiPersonSelect
                data={persons}
                selectedItem={formObj[name] || {}}
                onChange={(val) => onChange(val, name)}
                submitSuccess={onAddNewPerson}
                label={t(`branchField${name}`)}
                size={"default"}
                countryData={countries}
                isError={false}
              />
            )}
          </div>
        );
      default:
        return (
          <TextField
            label={t(`branchField${name}`)}
            value={formObj[name]}
            fieldName={name}
            onChange={onChange}
            size="default"
            isError={errorFields.includes(name)}
          />
        );
    }
  };

  return (
    <StyledRoot display={"flex"} flexDirection={"column"}>
      {isRegistration ? (
        <Fragment>
          <StyledHeader
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {t("createBranchTitle")}
            <CloseBtn onClick={close} />
          </StyledHeader>
          <StyledContent>
            <CheckboxForm
              list={branchTypes.map((e) => ({
                name: e.name,
                value: e.code,
              }))}
              handleChange={handleTypeChange}
              initValue={selectedValue && selectedValue.code}
            />
          </StyledContent>
          <StyledFooter display={"flex"} justifyContent={"flex-end"}>
            <PrimaryBtn
              onClick={() => {
                setIsRegistration(false);
              }}
              disabled={isEmpty(selectedValue) || !selectedValue?.id}
              endIcon={<KeyboardArrowRightRounded />}
              data-testid={"next-button"}
            >
              {t("next")}
            </PrimaryBtn>
          </StyledFooter>
        </Fragment>
      ) : (
        <div
          style={{
            position: "relative",
          }}
        >
          <StyledWizardCloseBtn>
            <CloseBtn onClick={close} />
          </StyledWizardCloseBtn>
          <Wizard
            steps={selectedValue.steps.map((e) => e.name)}
            onCancel={() => {
              if (isEdit) {
                close();
              } else {
                setIsRegistration(true);
              }
            }}
            onSubmit={submit}
            hideHeader={true}
            onBack={(_: number, currentStep: number) => {
              if (currentStep < 0) {
                setIsRegistration(true);
              }
            }}
            showBackButton={true}
            onNext={handleOnNext}
            allStepsValidation={allStepsValidation}
          >
            {selectedValue.steps.map((e, i) => (
              <Box
                key={i}
                sx={{
                  maxHeight: "530px",
                  overflowY: "auto",
                  padding: "0 16px",
                }}
              >
                {e.columns.map((c, j) => (
                  <div
                    key={j}
                    style={{
                      margin: "8px 0",
                    }}
                  >
                    {getField(c.type, c.key)}
                  </div>
                ))}
              </Box>
            ))}
          </Wizard>
        </div>
      )}
    </StyledRoot>
  );
};

export default withLoading(FIBranchForm);
