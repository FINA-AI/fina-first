import CustomAutoComplete from "../../../../../common/Field/CustomAutoComplete";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { loadAllPersons } from "../../../../../../api/services/fi/fiPersonService";
import PersonCreateContainer from "../../../../../Person/Create/PersonCreateContainer";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";
import { CountryDataTypes } from "../../../../../../types/common.type";
import { LegalPersonDataType } from "../../../../../../types/legalPerson.type";
import isEmpty from "lodash/isEmpty";

interface FiPersonSelectProps {
  data?: PhysicalPersonDataType[];
  selectedItem?: LegalPersonDataType | PhysicalPersonDataType;
  onChange: (val: any, fieldName?: string) => void;
  label: string;
  fieldName?: string;
  disabled?: boolean;
  height?: number;
  size?: string;
  addOption?: boolean;
  submitSuccess?: (person: PhysicalPersonDataType) => void;
  isError?: boolean;
  countryData?: CountryDataTypes[];
  allowInvalidInputSelection?: boolean;
  onClear?: () => void;
}

const FiPersonSelect: React.FC<FiPersonSelectProps> = ({
  data,
  selectedItem,
  onChange,
  label,
  fieldName,
  disabled = false,
  addOption = true,
  size,
  submitSuccess,
  isError,
  countryData,
  allowInvalidInputSelection,
  onClear,
}) => {
  const { t } = useTranslation();
  const [persons, setPersons] = useState<PhysicalPersonDataType[]>(data ?? []);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<
    PhysicalPersonDataType | LegalPersonDataType | undefined
  >(selectedItem);

  const onValueChange = (val: PhysicalPersonDataType, fieldName?: string) => {
    setSelected(val);
    !val && allowInvalidInputSelection && setSelected(undefined);
    onChange(val, fieldName);
  };

  useEffect(() => {
    if (!data) {
      setLoading(true);
      loadAllPersons(-1, -1, false)
        .then((resp) => {
          setLoading(false);
          setPersons(resp.data.list);
        })
        .catch(() => setLoading(false));
    } else {
      setPersons([...data]);
    }
  }, []);

  const hasFieldError = () =>
    isError !== undefined ? isError : isEmpty(selectedItem);

  return (
    <>
      <CustomAutoComplete
        fieldName={"fi-person"}
        label={label}
        data={persons}
        displayFieldName={"name"}
        secondaryDisplayFieldName={"identificationNumber"}
        valueFieldName={"id"}
        selectedItem={selected}
        onChange={(val) => onValueChange(val, fieldName)}
        addOption={true}
        addNewItemLabelText={t("personCreateQickTitle")}
        secondaryDisplayFieldLabel={t("personCreateId")}
        size={size}
        onAddNewItemClick={() => {
          setIsModalOpen(true);
        }}
        disabled={disabled}
        virtualized={true}
        loading={loading}
        isError={hasFieldError()}
        allowInvalidInputSelection={allowInvalidInputSelection}
        onClear={() => {
          if (onClear) {
            setSelected(undefined);
            onClear();
          }
        }}
      />
      {addOption && (
        <PersonCreateContainer
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          afterSubmitSuccess={(person) => {
            submitSuccess?.(person);
            setSelected(person);
          }}
          persons={persons}
          setPersons={setPersons}
          countryData={countryData}
          onChange={onChange}
        />
      )}
    </>
  );
};

export default FiPersonSelect;
