import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SaveIcon } from "../../../../../api/ui/icons/SaveIcon";
import ConfirmModal from "../../../../common/Modal/ConfirmModal";
import FIPhysicalPersonItemDetails from "../../../Main/Detail/Person/Item/FIPhysicalPersonItemDetails";
import { styled } from "@mui/material/styles";
import { PhysicalPersonDataType } from "../../../../../types/physicalPerson.type";
import { CountryDataTypes } from "../../../../../types/common.type";
import { LegalPersonDataType } from "../../../../../types/legalPerson.type";

const StyledRoot = styled(Box)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

interface FIPersonConfigurationDetailProps {
  selectedPerson?: PhysicalPersonDataType;
  setSelectedPerson: (person: PhysicalPersonDataType) => void;
  isEdit: boolean;
  countries: CountryDataTypes[];
  saveModalOpen?: boolean;
  setSaveModalOpen: (value: boolean) => void;
  handleConfirm: (data: any) => void;
  companies: LegalPersonDataType[];
  updatePerson: (person: PhysicalPersonDataType) => Promise<void>;
  allPersons?: PhysicalPersonDataType[];
}

const FIPersonConfigurationDetail: React.FC<
  FIPersonConfigurationDetailProps
> = ({
  selectedPerson,
  isEdit,
  countries,
  saveModalOpen,
  setSaveModalOpen,
  handleConfirm,
  companies,
  updatePerson,
  allPersons,
  setSelectedPerson,
}) => {
  const { t } = useTranslation();
  const [idNumber, setIdNumber] = useState<string | undefined>();
  const [passportNumber, setPassportNumber] = useState<string | undefined>();
  const [citizenShip, setCitizenShip] = useState<number | undefined>();
  const [residentStatus, setResidentStatus] = useState<string | undefined>();

  useEffect(() => {
    if (selectedPerson) {
      setIdNumber(selectedPerson.identificationNumber);
      setPassportNumber(selectedPerson.passportNumber);
      setCitizenShip(selectedPerson.citizenship?.id);
      setResidentStatus(selectedPerson.residentStatus);
    }
  }, [selectedPerson, isEdit]);

  const getData = () => {
    return {
      idNumber: idNumber,
      passportNumber: passportNumber,
      citizenShip: citizenShip,
      residentStatus: residentStatus,
    };
  };

  const onChangeCitizenship = (value: string | number) => {
    setCitizenShip(Number(value));
  };
  return (
    <StyledRoot>
      <FIPhysicalPersonItemDetails
        onChangePersonCitizenShip={(value) => onChangeCitizenship(value)}
        onChangePersonPassportId={setPassportNumber}
        onChangeResidentStatus={setResidentStatus}
        onSaveCriminalRecord={async (data, criminalRecord) =>
          updatePerson({
            ...selectedPerson!,
            criminalRecords: [...criminalRecord],
          })
        }
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
        isEdit={isEdit}
        companies={companies}
        countries={countries}
        person={selectedPerson}
        configurationMode={true}
        allPersons={allPersons}
      />

      {saveModalOpen && (
        <ConfirmModal
          isOpen={saveModalOpen}
          setIsOpen={setSaveModalOpen}
          onConfirm={() => handleConfirm(getData())}
          confirmBtnTitle={t("save")}
          headerText={t("saveHeaderText")}
          bodyText={t("saveBodyText")}
          icon={<SaveIcon />}
        />
      )}
    </StyledRoot>
  );
};

export default FIPersonConfigurationDetail;
