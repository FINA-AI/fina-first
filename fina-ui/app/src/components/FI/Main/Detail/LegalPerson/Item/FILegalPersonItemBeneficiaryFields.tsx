import { Grid, IconButton, Typography } from "@mui/material";
import Select from "../../../../../common/Field/Select";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { useTranslation } from "react-i18next";
import { FORM_STATE } from "./FILegalPersonItemBeneficiary";
import FiLegalPersonSelect from "../Select/FiLegalPersonSelect";
import FiPersonSelect from "../../Person/Select/FiPersonSelect";
import PercentageField from "../../../../../common/Field/PercentageField";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { styled } from "@mui/material/styles";
import { BeneficiariesDataType } from "../../../../../../types/fi.type";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";
import { LegalPersonDataType } from "../../../../../../types/legalPerson.type";

const StyledAddNewFinalBeneficiaries = styled(Typography)({
  cursor: "pointer",
  color: "#2962FF",
  fontSize: "12px",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
});

const StyledDeleteIconButton = styled(IconButton)(({ theme }: any) => ({
  color: "#AEB8CB",
  "&:hover": {
    color: "#FF4128",
  },
  ...theme.defaultIcon,
  padding: "2px 2px",
  cursor: "pointer",
}));

interface FILegalPersonItemBeneficiaryFieldsProps {
  item: BeneficiariesDataType;
  data: BeneficiariesDataType[];
  index: number;
  formState: string;
  setData: (data: BeneficiariesDataType[]) => void;
  physicalPerson: PhysicalPersonDataType[];
  legalPersons: LegalPersonDataType[];
  submitSuccess?: (data: any) => void;
  getAllFIPhysicalPersons?: () => void;
}

const FILegalPersonItemBeneficiaryFields: React.FC<
  FILegalPersonItemBeneficiaryFieldsProps
> = ({
  item,
  data,
  index,
  formState,
  setData,
  physicalPerson,
  legalPersons,
  submitSuccess,
  getAllFIPhysicalPersons,
}) => {
  const { t } = useTranslation();

  const legalStatusDisable = (d: BeneficiariesDataType) => {
    if (formState === FORM_STATE.EDIT) {
      return !d.legalPerson && !d.physicalPerson;
    } else {
      return !d?.newRow;
    }
  };

  const idAndNameDisable = (finalBeneficiaryItem: BeneficiariesDataType) => {
    if (formState === FORM_STATE.EDIT) {
      return (
        !finalBeneficiaryItem.legalPerson &&
        !finalBeneficiaryItem.physicalPerson
      );
    }

    if (formState === FORM_STATE.ADD) {
      if (finalBeneficiaryItem.id !== 0) {
        return true;
      } else {
        return (
          !finalBeneficiaryItem.legalPerson &&
          !finalBeneficiaryItem.physicalPerson
        );
      }
    }

    return false;
  };

  const sharePercentageDisable = (d: BeneficiariesDataType) => {
    if (formState === FORM_STATE.EDIT) {
      if (d.legalPerson && d.legalPerson.bank) {
        return true;
      } else
        return !(
          (d.legalPerson && d.legalPerson.id) ||
          (d.physicalPerson && d.physicalPerson.id)
        );
    } else {
      return !d.newRow;
    }
  };

  const finalBeneficiaryDisable = (d: BeneficiariesDataType) => {
    if (formState === FORM_STATE.EDIT) {
      return !(d.legalPerson && d.legalPerson.id);
    } else {
      if (!d.newRow) {
        return true;
      } else {
        return !(d.legalPerson && d.legalPerson.id);
      }
    }
  };

  const changeLegalStatus = (value: string, index: number) => {
    let tmp: any[] = [...data];
    let legalPersonObj;
    let physicalPerson;
    if (value === "legalPerson") {
      legalPersonObj = {};
      physicalPerson = null;
    } else {
      legalPersonObj = null;
      physicalPerson = {};
    }
    tmp[index] = {
      ...tmp[index],
      legalPerson: legalPersonObj,
      physicalPerson: physicalPerson,
      share: null,
      finalBeneficiaries: [],
    };
    setData(tmp);
  };

  const getIdAndNameValue = (
    d: BeneficiariesDataType
  ): PhysicalPersonDataType | LegalPersonDataType | undefined => {
    if (d.legalPerson && Object.keys(d.legalPerson).length > 0) {
      return d.legalPerson;
    } else if (d.physicalPerson && Object.keys(d.physicalPerson).length > 0) {
      return d.physicalPerson;
    } else {
      return undefined;
    }
  };

  const getShare = (d: BeneficiariesDataType) => {
    return d.share;
  };

  const getFinallBeneficiary = (item: BeneficiariesDataType) => {
    if (Object.keys(item).length !== 0) {
      return item.person;
    } else {
      return undefined;
    }
  };

  const changeLegalGeneralInfo = (
    value: LegalPersonDataType | PhysicalPersonDataType,
    index: number,
    type: "legalPerson" | "physicalPerson"
  ) => {
    let tmp: any[] = [...data];
    if (type === "legalPerson") {
      tmp[index] = {
        ...tmp[index],
        legalPerson: value ?? ({} as LegalPersonDataType),
        finalBeneficiaries: [{ id: 0, person: { name: "" } }],
      };
    } else {
      tmp[index] = {
        ...tmp[index],
        physicalPerson: value ?? ({} as PhysicalPersonDataType),
      };
    }
    setData(tmp);
  };

  const changeShare = (value: number, index: number) => {
    let tmp = [...data];
    tmp[index] = {
      ...tmp[index],
      share: value,
    };
    setData(tmp);
  };

  const changeFinallBeneficiary = (
    value: PhysicalPersonDataType,
    childIndex: number,
    parentIndex: number
  ) => {
    let tmp = [...data];
    tmp[parentIndex].finalBeneficiaries[childIndex].person = value;
    delete (
      tmp[parentIndex].finalBeneficiaries[childIndex] as BeneficiariesDataType
    )["name"];
    setData(tmp);
  };

  const deleteFinalBeneficiary = (
    d: BeneficiariesDataType,
    beneficiaryData: BeneficiariesDataType,
    finalBeneficiatyIndex: number
  ) => {
    let tmp: any = [];
    if (beneficiaryData.id && beneficiaryData.id !== 0) {
      tmp = d.finalBeneficiaries.filter(
        (item) => item.id !== beneficiaryData.id
      );
    } else {
      tmp = d.finalBeneficiaries.filter(
        (_, index) => index !== finalBeneficiatyIndex
      );
    }

    setData(
      data.map((beneficiary) => {
        if (beneficiary.id === d.id) {
          return { ...beneficiary, finalBeneficiaries: tmp };
        }
        return beneficiary;
      })
    );
  };

  const getFinallBeneficiariesFields = (
    d: BeneficiariesDataType,
    index: number
  ) => {
    if (d.finalBeneficiaries) {
      return d.finalBeneficiaries.map((item, p) => (
        <React.Fragment key={p}>
          <Grid xs={3} item key={p} padding={"12px 6px 0px 6px"} />
          <Grid xs={6} item key={p} padding={"12px 6px 0px 6px"}>
            {d.legalPerson && (
              <FiLegalPersonSelect
                fieldName={"name"}
                label={t("finalBeneficiaryIdAndName")}
                data={physicalPerson}
                disabled={finalBeneficiaryDisable(d)}
                onChange={(value) => {
                  changeFinallBeneficiary(value, p, index);
                }}
                selectedItem={getFinallBeneficiary(item)}
                submitSuccess={submitSuccess}
              />
            )}
          </Grid>
          <Grid
            xs={3}
            item
            key={p}
            display={"flex"}
            alignItems={"center"}
            padding={"12px 6px 0px 6px"}
          >
            <StyledDeleteIconButton
              onClick={() => deleteFinalBeneficiary(d, item, p)}
            >
              <DeleteRoundedIcon />
            </StyledDeleteIconButton>
          </Grid>
        </React.Fragment>
      ));
    }
  };

  const addNewFinalBeneficaryField = (
    d: BeneficiariesDataType,
    index: number
  ) => {
    let tmp = [...data];
    let obj: any = { id: 0, person: { name: "" } };
    if (d.finalBeneficiaries.length === 0) {
      tmp[index] = {
        ...tmp[index],
        finalBeneficiaries: [obj],
      };
    } else {
      let finalBeneficiariesArray = [];
      for (let o of d.finalBeneficiaries) {
        finalBeneficiariesArray.push(o);
      }
      finalBeneficiariesArray.push(obj);
      tmp[index] = {
        ...tmp[index],
        finalBeneficiaries: finalBeneficiariesArray,
      };
    }

    setData(tmp);
  };

  const addNewFinalBeneficiaryRow = (
    beneficiaryItem: BeneficiariesDataType
  ) => {
    if (
      beneficiaryItem.legalPerson &&
      Object.keys(beneficiaryItem.legalPerson).length !== 0
    ) {
      if (
        (formState === FORM_STATE.EDIT && beneficiaryItem.id !== 0) ||
        (formState === FORM_STATE.ADD && beneficiaryItem.id === 0)
      ) {
        return (
          <Grid xs={9} item padding={"12px 6px 0px 6px"}>
            <StyledAddNewFinalBeneficiaries
              onClick={() => addNewFinalBeneficaryField(beneficiaryItem, index)}
            >
              {t("addNew")}
              <AddIcon
                sx={{
                  fontSize: "16px !important",
                }}
              />
            </StyledAddNewFinalBeneficiaries>
          </Grid>
        );
      }
    }
  };

  const onValidField = (item: any, value: any, key: string) => {
    if (!item["errors"]) {
      item["errors"] = {};
    }
    item["errors"][key] = !Boolean(value);
  };

  const getFields = (d: BeneficiariesDataType, index: number) => {
    if (d) {
      return (
        <>
          <Grid xs={3} item padding={"10px 6px 0 6px"}>
            <Select
              disabled={legalStatusDisable(d)}
              label={t("fiLegalStatus")}
              data={[
                { label: t("legalPerson"), value: "legalPerson" },
                { label: t("physicalperson"), value: "physicalPerson" },
              ]}
              value={
                d.legalPerson
                  ? "legalPerson"
                  : d.physicalPerson
                  ? "physicalPerson"
                  : ""
              }
              onChange={(value) => {
                changeLegalStatus(value, index);
              }}
              size={"default"}
              isError={d.errors && d.errors["legalStatus"]}
            />
          </Grid>
          <Grid xs={6} item padding={"10px 6px 0 6px"}>
            {d.legalPerson ? (
              <FiLegalPersonSelect
                onChange={(value) => {
                  changeLegalGeneralInfo(value, index, "legalPerson");
                  onValidField(d, value, "legalPerson");
                }}
                selectedItem={getIdAndNameValue(d)}
                data={legalPersons}
                fieldName={"name"}
                label={t("idAndName")}
                disabled={idAndNameDisable(d)}
                submitSuccess={submitSuccess}
                isError={d.errors && d.errors["legalPerson"]}
              />
            ) : (
              <FiPersonSelect
                onChange={(value) => {
                  onValidField(d, value, "physicalPerson");
                  changeLegalGeneralInfo(value, index, "physicalPerson");
                }}
                selectedItem={getIdAndNameValue(d)}
                data={physicalPerson}
                fieldName={"name"}
                label={t("idAndName")}
                disabled={idAndNameDisable(d)}
                submitSuccess={() => getAllFIPhysicalPersons!()}
              />
            )}
          </Grid>
          <Grid xs={3} item padding={"10px 6px 0 6px"}>
            <PercentageField
              isDisabled={sharePercentageDisable(d)}
              label={t("sharePercentage")}
              value={getShare(d)}
              fieldName={"share"}
              format={"#.###"}
              onChange={(value) => {
                onValidField(d, value, "share");
                changeShare(Number(value), index);
              }}
              size={"default"}
              isError={d.errors && d.errors["share"]}
              required={true}
            />
          </Grid>
          {getFinallBeneficiariesFields(d, index)}
          <Grid xs={3} item padding={"10px 6px 0 6px"} />
          {addNewFinalBeneficiaryRow(d)}
        </>
      );
    }
  };

  return getFields(item, index) ?? null;
};

export default FILegalPersonItemBeneficiaryFields;
