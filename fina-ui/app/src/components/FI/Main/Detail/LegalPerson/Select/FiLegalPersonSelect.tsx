import { useTranslation } from "react-i18next";
import CustomAutoComplete from "../../../../../common/Field/CustomAutoComplete";
import React, { useEffect, useState } from "react";
import { getAllLegalPersonSimple } from "../../../../../../api/services/fi/fiLegalPersonService";
import FILegalPersonCreateContainer from "../../../../../Person/legalPersonCreate/FILegalPersonCreateContainer";
import useErrorWindow from "../../../../../../hoc/ErrorWindow/useErrorWindow";
import { LegalPersonDataType } from "../../../../../../types/legalPerson.type";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";

interface FiLegalPersonSelectProps {
  data: LegalPersonDataType[] | PhysicalPersonDataType[];
  setData?: any;
  selectedItem?: LegalPersonDataType | PhysicalPersonDataType | null;
  onChange: (val: any, fieldName?: any) => void;
  label: string;
  fieldName: string;
  disabled: boolean;
  addOption?: boolean;
  size?: string;
  isError?: boolean;
  allowInvalidInputSelection?: boolean;
  submitSuccess?(legalPersonItem: LegalPersonDataType): void;
}

type CurrentValue =
  | LegalPersonDataType
  | PhysicalPersonDataType
  | undefined
  | null;

const FiLegalPersonSelect: React.FC<FiLegalPersonSelectProps> = ({
  data,
  selectedItem,
  onChange,
  label,
  fieldName,
  disabled = false,
  addOption = true,
  submitSuccess,
  size,
  isError = false,
  allowInvalidInputSelection = false,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const [legalPersons, setLegalPersons] = useState(data);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState<CurrentValue>(selectedItem);

  useEffect(() => {
    setCurrentValue(selectedItem);
  }, [selectedItem]);

  useEffect(() => {
    if (!data) {
      setLoading(true);
      getAllLegalPersonSimple()
        .then((resp) => {
          setLegalPersons(resp.data);
        })
        .catch((error) => {
          openErrorWindow(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const hasFieldErrorFunction = () => {
    if (isError === null) {
      return false;
    } else {
      return selectedItem
        ? Object.keys(selectedItem).length === 0
        : !Boolean(selectedItem);
    }
  };

  return (
    <>
      <CustomAutoComplete
        fieldName={"fi-legal-person"}
        label={label}
        data={legalPersons}
        displayFieldName={"name"}
        secondaryDisplayFieldName={"identificationNumber"}
        valueFieldName={"id"}
        selectedItem={currentValue ? currentValue : null}
        onChange={(val) => onChange(val, fieldName)}
        addOption={addOption}
        addNewItemLabelText={t("personCreateQickTitle")}
        secondaryDisplayFieldLabel={t("personCreateId")}
        size={size}
        onAddNewItemClick={() => setIsModalOpen(true)}
        disabled={disabled}
        virtualized={data && data.length > 50}
        loading={loading}
        isError={hasFieldErrorFunction()}
        onClear={() => {
          setCurrentValue({} as CurrentValue);
          allowInvalidInputSelection && onChange(null);
        }}
        allowInvalidInputSelection={allowInvalidInputSelection}
      />
      {isModalOpen && addOption && (
        <FILegalPersonCreateContainer
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          submitSuccess={submitSuccess}
          onCancelFunction={() => setIsModalOpen(false)}
          legalPersons={legalPersons}
          setLegalPersons={setLegalPersons}
          onChange={onChange}
        />
      )}
    </>
  );
};

export default FiLegalPersonSelect;
