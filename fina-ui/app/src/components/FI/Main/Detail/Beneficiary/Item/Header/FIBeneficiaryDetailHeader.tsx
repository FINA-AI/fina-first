import { Box } from "@mui/material";
import React from "react";
import FIBeneficiaryHeaderEdit from "./FIBeneficiaryHeaderEdit";
import FIBeneficiaryHeaderView from "./FIBeneficiaryHeaderView";
import { styled } from "@mui/material/styles";
import { BeneficiariesDataType } from "../../../../../../../types/fi.type";
import { LegalPersonDataType } from "../../../../../../../types/legalPerson.type";
import { PhysicalPersonDataType } from "../../../../../../../types/physicalPerson.type";

const StyledRightHeader = styled(Box)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  height: "54px",
  borderBottom: theme.palette.borderColor,
  padding: "0px 16px",
  justifyContent: "space-between",
  "& .MuiBox-root": {
    alignItems: "center",
  },
}));

interface FIBeneficiaryDetailHeaderProps {
  generalInfoEditMode: boolean;
  onPersonTypeChange: (type: string) => void;
  personType: string | null;
  selectedBeneficiary?: BeneficiariesDataType;
  setActiveStatus: (status: boolean) => void;
  activeStatus: string | boolean;
  setIsCancelModalOpen: (open: boolean) => void;
  setSelectedBeneficiary: (beneficiary: BeneficiariesDataType) => void;
  setOriginalSelectedBeneficiary: (beneficiary: BeneficiariesDataType) => void;
  setConfirmOpen: (open: boolean) => void;
  getIdentificationCodeForCopy: () => string | undefined;
  selectedHistory: BeneficiariesDataType | null;
  setSelectedHistory: (history: BeneficiariesDataType | null) => void;
  setOpenHistoryModal: (open: boolean) => void;
  setGeneralInfoEditMode: (editMode: boolean) => void;
  legalPersons: LegalPersonDataType[];
  selectedTypeItem?: LegalPersonDataType | PhysicalPersonDataType;
  setSelectedTypeItem: (
    item: LegalPersonDataType | PhysicalPersonDataType
  ) => void;
  setPersonTypeData: (
    data: LegalPersonDataType | PhysicalPersonDataType | null
  ) => void;
  physicalPersons: PhysicalPersonDataType[];
  openPhysicalPersonItemPage: (personId: number) => void;
  setPhysicalPersons: (persons: PhysicalPersonDataType[]) => void;
  setLegalPersons: (persons: LegalPersonDataType[]) => void;
  originalSelectedBeneficiary?: BeneficiariesDataType;
  openLegalPersonItemPage: (personId: number) => void;
}

const FIBeneficiaryDetailHeader: React.FC<FIBeneficiaryDetailHeaderProps> = ({
  generalInfoEditMode,
  onPersonTypeChange,
  personType,
  selectedBeneficiary,
  setActiveStatus,
  activeStatus,
  setIsCancelModalOpen,
  setSelectedBeneficiary,
  setOriginalSelectedBeneficiary,
  setConfirmOpen,
  getIdentificationCodeForCopy,
  selectedHistory,
  setSelectedHistory,
  setOpenHistoryModal,
  setGeneralInfoEditMode,
  legalPersons,
  selectedTypeItem,
  setSelectedTypeItem,
  setPersonTypeData,
  physicalPersons,
  openPhysicalPersonItemPage,
  setPhysicalPersons,
  setLegalPersons,
  originalSelectedBeneficiary,
  openLegalPersonItemPage,
}) => {
  return (
    <StyledRightHeader data-testid={"header"}>
      <Box display={"flex"} width={"100%"}>
        {generalInfoEditMode ? (
          <FIBeneficiaryHeaderEdit
            personType={personType}
            selectedBeneficiary={selectedBeneficiary}
            legalPersons={legalPersons}
            selectedTypeItem={selectedTypeItem}
            setSelectedTypeItem={setSelectedTypeItem}
            setPersonTypeData={setPersonTypeData}
            physicalPersons={physicalPersons}
            setPhysicalPersons={setPhysicalPersons}
            setLegalPersons={setLegalPersons}
            onPersonTypeChange={onPersonTypeChange}
            setActiveStatus={setActiveStatus}
            activeStatus={activeStatus}
            setIsCancelModalOpen={setIsCancelModalOpen}
            setSelectedBeneficiary={setSelectedBeneficiary}
            setOriginalSelectedBeneficiary={setOriginalSelectedBeneficiary}
            setConfirmOpen={setConfirmOpen}
          />
        ) : (
          <FIBeneficiaryHeaderView
            selectedBeneficiary={selectedBeneficiary}
            openPhysicalPersonItemPage={openPhysicalPersonItemPage}
            openLegalPersonItemPage={openLegalPersonItemPage}
            getIdentificationCodeForCopy={getIdentificationCodeForCopy}
            selectedHistory={selectedHistory}
            setSelectedHistory={setSelectedHistory}
            setSelectedBeneficiary={setSelectedBeneficiary}
            originalSelectedBeneficiary={originalSelectedBeneficiary}
            setOpenHistoryModal={setOpenHistoryModal}
            personType={personType}
            activeStatus={activeStatus}
            setGeneralInfoEditMode={setGeneralInfoEditMode}
          />
        )}
      </Box>
    </StyledRightHeader>
  );
};

export default FIBeneficiaryDetailHeader;
