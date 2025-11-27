import { Box } from "@mui/material";
import Select from "../../../../../../common/Field/Select";
import TextButton from "../../../../../../common/Button/TextButton";
import CheckIcon from "@mui/icons-material/Check";
import React from "react";
import FiLegalPersonSelect from "../../../LegalPerson/Select/FiLegalPersonSelect";
import FiPersonSelect from "../../../Person/Select/FiPersonSelect";
import CustomAutoComplete from "../../../../../../common/Field/CustomAutoComplete";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import { BeneficiariesDataType } from "../../../../../../../types/fi.type";
import { LegalPersonDataType } from "../../../../../../../types/legalPerson.type";
import { PhysicalPersonDataType } from "../../../../../../../types/physicalPerson.type";

interface FIBeneficiaryHeaderEditProps {
  personType: string | null;
  selectedBeneficiary?: BeneficiariesDataType;
  legalPersons: LegalPersonDataType[];
  selectedTypeItem?: LegalPersonDataType | PhysicalPersonDataType;
  setSelectedTypeItem: (
    item: LegalPersonDataType | PhysicalPersonDataType
  ) => void;
  setPersonTypeData: (
    data: LegalPersonDataType | PhysicalPersonDataType | null
  ) => void;
  physicalPersons: PhysicalPersonDataType[];
  setPhysicalPersons: (persons: PhysicalPersonDataType[]) => void;
  setLegalPersons: (persons: LegalPersonDataType[]) => void;
  onPersonTypeChange: (type: string) => void;
  setActiveStatus: (status: boolean) => void;
  activeStatus: string | boolean;
  setIsCancelModalOpen: (open: boolean) => void;
  setSelectedBeneficiary: (beneficiary: BeneficiariesDataType) => void;
  setOriginalSelectedBeneficiary: (beneficiary: BeneficiariesDataType) => void;
  setConfirmOpen: (open: boolean) => void;
}

const FIBeneficiaryHeaderEdit: React.FC<FIBeneficiaryHeaderEditProps> = ({
  personType,
  selectedBeneficiary,
  legalPersons,
  selectedTypeItem,
  setSelectedTypeItem,
  setPersonTypeData,
  physicalPersons,
  setPhysicalPersons,
  setLegalPersons,
  onPersonTypeChange,
  setActiveStatus,
  activeStatus,
  setIsCancelModalOpen,
  setSelectedBeneficiary,
  setOriginalSelectedBeneficiary,
  setConfirmOpen,
}) => {
  const { t } = useTranslation();

  const disableAutocomplete = (): boolean => {
    if (!personType) return false;
    return !!(
      selectedBeneficiary &&
      selectedBeneficiary.id &&
      selectedBeneficiary.id !== 0
    );
  };

  const PersonChooserSelect = () => {
    if (personType === "legalPerson") {
      return (
        <FiLegalPersonSelect
          label={t(`idAndName`)}
          data={legalPersons}
          fieldName={"name"}
          selectedItem={selectedTypeItem}
          disabled={disableAutocomplete()}
          onChange={(val: any) => {
            setSelectedTypeItem(val);
            setPersonTypeData(val);
            if (selectedBeneficiary) {
              selectedBeneficiary.legalPerson = val;
            }
          }}
          addOption={true}
          size={"small"}
          submitSuccess={onAddNewLegalPerson}
          isError={!selectedTypeItem}
        />
      );
    } else if (personType === "physicalPerson") {
      return (
        <FiPersonSelect
          fieldName={"name"}
          label={t(`idAndName`)}
          data={physicalPersons}
          selectedItem={selectedTypeItem}
          disabled={disableAutocomplete()}
          onChange={(val) => {
            setSelectedTypeItem(val);
            setPersonTypeData(val);
            if (selectedBeneficiary) {
              selectedBeneficiary.physicalPerson = val;
            }
          }}
          addOption={true}
          submitSuccess={onAddNewPerson}
          size={"small"}
        />
      );
    } else {
      return (
        <CustomAutoComplete
          label={t(`idAndName`)}
          data={[]}
          displayFieldName={"name"}
          secondaryDisplayFieldName={"identificationNumber"}
          valueFieldName={"id"}
          selectedItem={{}}
          onChange={() => {}}
          addNewItemLabelText={t("personCreateQickTitle")}
          secondaryDisplayFieldLabel={t("personCreateId")}
          size={"small"}
          disabled={true}
          isError={
            selectedTypeItem === null ? false : isEmpty(selectedTypeItem)
          }
        />
      );
    }
  };

  const onAddNewPerson = (personItem: PhysicalPersonDataType) => {
    setPhysicalPersons([personItem, ...physicalPersons]);
  };

  const onAddNewLegalPerson = (legalPersonItem: LegalPersonDataType) => {
    setLegalPersons([legalPersonItem, ...legalPersons]);
  };

  const getSelectedBeneficiaryClone = () => {
    if (selectedBeneficiary) {
      return JSON.parse(JSON.stringify(selectedBeneficiary));
    }
  };

  return (
    <Box
      sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
    >
      <Box display={"flex"}>
        <Select
          width={170}
          size={"small"}
          onChange={(value) => onPersonTypeChange(value)}
          value={personType ?? undefined}
          data={[
            { label: t("legalPerson"), value: "legalPerson" },
            {
              label: t("physicalperson"),
              value: "physicalPerson",
            },
          ]}
          label={t("type")}
          disabled={selectedBeneficiary ? selectedBeneficiary.id > 0 : false}
          isError={personType === null ? false : !personType}
          data-testid={"type-select"}
        />
        <span
          style={{
            paddingRight: "10px",
            paddingLeft: 10,
          }}
        >
          <Select
            width={130}
            size={"small"}
            onChange={(value) => {
              setActiveStatus(value === "true");
            }}
            value={activeStatus}
            data={[
              { label: t("active"), value: true },
              { label: t("inactive"), value: false },
            ]}
            label={t("status")}
            isError={activeStatus === null ? false : !activeStatus}
            data-testid={"status-select"}
          />
        </span>
        <span style={{ width: "500px", paddingRight: "10px" }}>
          {PersonChooserSelect()}
        </span>
      </Box>
      <Box display={"flex"} alignItems={"center"}>
        <TextButton
          color={"secondary"}
          style={{ padding: 0 }}
          onClick={() => {
            setIsCancelModalOpen(true);
            setSelectedBeneficiary(getSelectedBeneficiaryClone());
            setOriginalSelectedBeneficiary(getSelectedBeneficiaryClone());
          }}
          data-testid={"cancel-button"}
        >
          {t("cancel")}
        </TextButton>
        <span
          style={{
            borderLeft: "1px solid #687A9E",
            height: 14,
          }}
        />
        <TextButton
          style={{ padding: "12px" }}
          onClick={() => setConfirmOpen(true)}
          endIcon={
            <CheckIcon
              sx={{
                width: "12px",
                height: "12px",
              }}
            />
          }
          data-testid={"save-button"}
        >
          {t("save")}
        </TextButton>
      </Box>
    </Box>
  );
};

export default FIBeneficiaryHeaderEdit;
