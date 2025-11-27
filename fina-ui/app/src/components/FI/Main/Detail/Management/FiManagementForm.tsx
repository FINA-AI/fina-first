import React, { Fragment, useEffect } from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import CloseBtn from "../../../../common/Button/CloseBtn";
import PrimaryBtn from "../../../../common/Button/PrimaryBtn";
import { KeyboardArrowRightRounded } from "@mui/icons-material";
import Wizard from "../../../../Wizard/Wizard";
import TextField from "../../../../common/Field/TextField";
import NumberField from "../../../../common/Field/NumberField";
import DatePicker from "../../../../common/Field/DatePicker";
import Select from "../../../../common/Field/Select";
import useConfig from "../../../../../hoc/config/useConfig";
import CheckboxForm from "../../../../common/Checkbox/CheckboxForm";
import FiPersonSelect from "../Person/Select/FiPersonSelect";
import { styled } from "@mui/material/styles";
import { PhysicalPersonDataType } from "../../../../../types/physicalPerson.type";
import { FiManagementType } from "../../../../../types/fi.type";
import isEmpty from "lodash/isEmpty";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  width: 700,
  background: theme.palette.paperBackground,
  borderRadius: 8,
  backgroundColor: theme.palette.paperBackground,
  [theme.breakpoints.down("lg")]: {
    paddingBottom: 15,
  },
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

const StyledFooter = styled(Box)(({ theme }) => ({
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  zIndex: theme.zIndex.modal,
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  padding: "8px 16px",
}));

const StyledHeader = styled(Box)(({ theme }: any) => ({
  ...theme.modalHeader,
}));

interface RegionType {
  value: number;
  label: string;
}

interface FormObjType {
  [key: string]: any;
}

interface FiManagementFormProps {
  managementTypes: FiManagementType[];
  close: () => void;
  regions: RegionType[];
  persons: PhysicalPersonDataType[];
  formObj: FormObjType;
  setFormObj: (val: FormObjType) => void;
  submit: () => void;
  isRegistration: boolean;
  setIsRegistration: (val: boolean) => void;
  selectedValue: FiManagementType;
  setSelectedValue: (val: FiManagementType) => void;
  isEdit: boolean;
  onAddNewPerson?: (person: PhysicalPersonDataType) => void;
  selectedType: FiManagementType;
  handleOnNext: (prevStep: number, currStep: number) => void;
  allStepsValidation: Array<{
    [key: number]: boolean;
  }>;
  errorFields: string[];
  MANDATORY_FIELDS: string[];
}

const FiManagementForm: React.FC<FiManagementFormProps> = ({
  managementTypes,
  close,
  regions,
  persons,
  formObj,
  setFormObj,
  submit,
  isRegistration,
  setIsRegistration,
  selectedValue,
  setSelectedValue,
  isEdit,
  onAddNewPerson,
  selectedType,
  handleOnNext,
  allStepsValidation,
  errorFields,
  MANDATORY_FIELDS,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  const handleTypeChange = (code: string) => {
    let type = managementTypes.find((e) => e.code === code);
    if (type) setSelectedValue(type);
  };

  const onChange = (
    val: number | string | undefined | boolean,
    field?: string
  ) => {
    let tmp = { ...formObj };
    if (field) {
      tmp[field] = val;
      setFormObj(tmp);

      if (MANDATORY_FIELDS.includes(field)) {
        if (!val && !errorFields.includes(field)) {
          errorFields.push(field);
        } else if (val && errorFields.includes(field)) {
          const index = errorFields.indexOf(field);
          if (index > -1) errorFields.splice(index, 1);
        }
      }
    }
  };

  useEffect(() => {
    if (managementTypes.length !== 0) {
      handleTypeChange(selectedType.code);
    }
  }, [managementTypes]);

  const getField = (type: string, name: string) => {
    switch (type) {
      case "date":
      case "Date":
        return (
          <DatePicker
            format={getDateFormat(true)}
            label={t(`managementField${name}`)}
            value={formObj[name] ? formObj[name] : null}
            onChange={(val) => onChange(val ? val.getTime() : val, name)}
            size={"default"}
            data-testid={name}
          />
        );
      case "long":
      case "int":
      case "Long":
      case "Integer":
        return (
          <NumberField
            label={t(`managementField${name}`)}
            value={formObj[name]}
            fieldName={name}
            onChange={onChange}
            size={"default"}
          />
        );
      case "boolean":
      case "Boolean":
        let yesLabel = t("yes");
        let noLabel = t("no");
        let value = "";

        if (name === "dependencyStatus") {
          yesLabel = t("dependent");
          noLabel = t("independent");
          value =
            formObj[name] === true
              ? "true"
              : formObj[name] === false
              ? "false"
              : "";
        } else if (name === "disable") {
          yesLabel = t("ACTIVE");
          noLabel = t("INACTIVE");
          value =
            formObj[name] === true
              ? "false"
              : formObj[name] === false
              ? "true"
              : "";
        }

        return (
          <Select
            label={t(`managementField${name}`)}
            data={[
              { label: yesLabel, value: "true" },
              { label: noLabel, value: "false" },
            ]}
            value={value}
            onChange={(val) => {
              if (name === "disable") {
                onChange(val === "false", name);
              } else {
                onChange(val === "true", name);
              }
            }}
            size={"default"}
            data-testid={name + "-select"}
          />
        );
      case "Region":
      case "RegionMetaModel":
        return (
          <Select
            label={t(`managementField${name}`)}
            data={regions}
            value={formObj[name]}
            onChange={(val) => onChange(val, name)}
            size={"default"}
            data-testid={name + "-select"}
          />
        );
      case "FiPerson":
      case "PersonMetaModel":
        return (
          <div data-testid={name + "-select-container"}>
            <FiPersonSelect
              data={persons}
              selectedItem={formObj[name] ? formObj[name] : {}}
              onChange={(val) => {
                onChange(val, name);
              }}
              submitSuccess={onAddNewPerson}
              label={t(`branchField${name}`)}
              size={"default"}
              allowInvalidInputSelection
              onClear={() => {
                onChange("", name);
              }}
              isError={errorFields.includes(name)}
            />
          </div>
        );
      default:
        if (name === "commentId1String") {
          return (
            <TextField
              label={t(`managementField${name}`)}
              value={formObj[name]}
              fieldName={name}
              onChange={onChange}
              multiline
              rows={4}
              InputProps={{
                inputComponent: "textarea",
                inputProps: {
                  style: {
                    height: "70px",
                  },
                },
              }}
            />
          );
        }

        return (
          <TextField
            label={t(`managementField${name}`)}
            value={formObj[name]}
            fieldName={name}
            onChange={onChange}
            size={"default"}
          />
        );
    }
  };

  return (
    <StyledRoot display={"flex"} flexDirection={"column"}>
      {!isRegistration ? (
        <Fragment>
          <StyledHeader
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {t("createFiManagementTitle")}
            <CloseBtn onClick={close} />
          </StyledHeader>
          <StyledContent>
            <CheckboxForm
              list={managementTypes.map((e) => ({
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
                setIsRegistration(true);
              }}
              disabled={isEmpty(selectedValue) || selectedValue?.id === -1}
              endIcon={<KeyboardArrowRightRounded />}
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
          <div
            style={{
              position: "absolute",
              zIndex: 2,
              top: 15,
              right: 20,
            }}
          >
            <CloseBtn onClick={close} />
          </div>
          <Wizard
            steps={selectedValue.steps.map((e) => e.name)}
            onCancel={() => {
              if (isEdit) {
                close();
              } else {
                setIsRegistration(false);
              }
            }}
            onSubmit={submit}
            hideHeader={true}
            onBack={(_: number, currentStep: number) => {
              if (currentStep < 0) {
                setIsRegistration(false);
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
                  maxHeight: 530,
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

export default FiManagementForm;
