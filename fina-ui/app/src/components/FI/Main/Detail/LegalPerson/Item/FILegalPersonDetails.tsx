import FILegalPersonItemBeneficiary from "./FILegalPersonItemBeneficiary";
import FILegalPersonItemManager from "./FILegalPersonItemManager";
import FILegalPersonItemShare from "./FILegalPersonItemShare";
import CriminalRecordContainer from "../../../../../../containers/FI/Main/PhysicalPerson/CriminalRecordContainer";
import { Box, Grid } from "@mui/material";
import FiInput from "../../../../Common/FiInput";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import React from "react";
import { useTranslation } from "react-i18next";
import LegalPersonType from "./registration/LegalPersonType";
import LegalPersonContactInfo from "./registration/LegalPersonContactInfo";
import { FieldType } from "../../../../util/FiUtil";
import withLoading from "../../../../../../hoc/withLoading";
import { legalPersonResidentStatus } from "../../../../Configuration/FiConfigurationConstants";
import { styled } from "@mui/material/styles";
import { LegalPersonDataType } from "../../../../../../types/legalPerson.type";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";
import {
  BeneficiariesDataType,
  CriminalRecordDataType,
  ManagersDataType,
  SharesDataType,
} from "../../../../../../types/fi.type";
import { CountryDataTypes } from "../../../../../../types/common.type";

const StyledRoot = styled(Box)({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

const StyledDetailsContainer = styled(Box)(({ theme }: any) => ({
  height: "100%",
  overflowY: "auto",
  overflowX: "hidden",
  marginTop: "12px",
  borderTop: theme.palette.borderColor,
  paddingTop: 4,
}));

interface FILegalPersonDetailsProps {
  isEdit: boolean;
  selectedPerson: LegalPersonDataType;
  setSelectedPerson: (val: LegalPersonDataType) => void;
  allPhysicalPerson: PhysicalPersonDataType[];
  beneficiarySaveFunction: (data: BeneficiariesDataType[]) => void;
  submitSuccess: (data: LegalPersonDataType) => void;
  getAllFIPhysicalPersons: () => void;
  onSaveManagerFunction: (
    data: LegalPersonDataType,
    managers: ManagersDataType[]
  ) => void;
  openNewPhysicalPersonItem?: (data: any) => void;
  onSaveOtherShareFunction: (
    data: LegalPersonDataType,
    shares: SharesDataType[]
  ) => void;
  openNewLegalPersonItem?: (data: any) => void;
  onSaveCriminalRecordFunction: (
    data: LegalPersonDataType,
    records: CriminalRecordDataType[],
    fiId?: number
  ) => void;
  allLegalPersons: LegalPersonDataType[];
  countryData: CountryDataTypes[];
  editable: boolean;
  legalPersonData: LegalPersonDataType;
  loading?: boolean;
  configurationMode?: boolean;
  changeLegalPersonDetailsEditMode?: (val: boolean) => void;
  legalPersonDetailsEditMode?: boolean;
}

const FILegalPersonDetails: React.FC<FILegalPersonDetailsProps> = ({
  isEdit,
  selectedPerson,
  setSelectedPerson,
  allPhysicalPerson,
  beneficiarySaveFunction,
  submitSuccess,
  getAllFIPhysicalPersons,
  onSaveManagerFunction,
  onSaveOtherShareFunction,
  onSaveCriminalRecordFunction,
  allLegalPersons,
  countryData,
  editable,
  legalPersonData,
  configurationMode,
  changeLegalPersonDetailsEditMode = () => {},
  legalPersonDetailsEditMode = false,
}) => {
  const { t } = useTranslation();

  return (
    <StyledRoot>
      <Box>
        <Box display={"flex"} sx={{ margin: "0 12px" }}>
          <Grid container item xs={12} width={"100%"}>
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              sx={{ width: "100%", padding: "0 4px" }}
            >
              <FiInput
                title={t("branchFieldregistrationNumber")}
                name={"branchFieldregistrationNumber"}
                value={selectedPerson.registrationNumber}
                icon={<ImportContactsIcon />}
                editMode={selectedPerson.bank ? false : isEdit}
                readOnly={!configurationMode}
                width={"100%"}
                onValueChange={(value) => {
                  legalPersonData.registrationNumber = value;
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              sx={{ width: "100%", padding: "0 4px" }}
            >
              <FiInput
                title={t("fiLegalStatus")}
                name={"fiLegalStatus"}
                value={selectedPerson.residentStatus}
                icon={<FingerprintIcon />}
                editMode={selectedPerson.bank ? false : isEdit}
                readOnly={!configurationMode}
                width={"100%"}
                onValueChange={(value) => {
                  legalPersonData.residentStatus = value;
                }}
                inputTypeProp={{
                  inputType: FieldType.LIST,
                  listData: legalPersonResidentStatus(),
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              sx={{ width: "100%", padding: "0 4px" }}
            >
              <FiInput
                title={t("country")}
                name={"id"}
                value={selectedPerson.country?.id}
                icon={<LocationOnIcon />}
                editMode={selectedPerson.bank ? false : isEdit}
                readOnly={!configurationMode}
                width={"100%"}
                onValueChange={(value) => {
                  const country = countryData.find((c) => c.id === value);
                  if (country) {
                    legalPersonData.country = country;
                  }
                }}
                inputTypeProp={{
                  inputType: FieldType.LIST,
                  listData: countryData.map((e) => ({
                    label: e.name,
                    value: e.id,
                  })),
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <StyledDetailsContainer>
        <Box paddingLeft={"10px"}>
          <Grid item xs={12} container padding={"0px 18px"} width={"100%"}>
            <LegalPersonType
              selectedPerson={selectedPerson}
              setSelectedPerson={setSelectedPerson}
              editable={selectedPerson.bank ? false : isEdit}
              disabled={!(configurationMode || !selectedPerson.bank)}
            />
            <LegalPersonContactInfo
              selectedPerson={selectedPerson}
              setSelectedPerson={setSelectedPerson}
              editable={selectedPerson.bank ? false : isEdit}
              legalPersonData={legalPersonData}
            />
          </Grid>
        </Box>
        <FILegalPersonItemBeneficiary
          currentLegalPerson={selectedPerson}
          physicalPerson={allPhysicalPerson}
          legalPersons={allLegalPersons}
          beneficiarySaveFunction={beneficiarySaveFunction}
          submitSuccess={submitSuccess}
          getAllFIPhysicalPersons={getAllFIPhysicalPersons}
          isEditValid={!editable ? false : !legalPersonDetailsEditMode}
          onModeChange={(isOpen) => changeLegalPersonDetailsEditMode(isOpen)}
        />
        <FILegalPersonItemManager
          selectedPerson={selectedPerson}
          physicalPerson={allPhysicalPerson}
          onSaveManagerFunction={onSaveManagerFunction}
          isEditValid={!editable ? false : !legalPersonDetailsEditMode}
          onModeChange={(isOpen) => changeLegalPersonDetailsEditMode(isOpen)}
        />
        <FILegalPersonItemShare
          selectedPerson={selectedPerson}
          legalPersons={allLegalPersons}
          onSaveOtherShareFunction={onSaveOtherShareFunction}
          countryData={countryData}
          isEditValid={!editable ? false : !legalPersonDetailsEditMode}
          onModeChange={(isOpen) => changeLegalPersonDetailsEditMode(isOpen)}
        />
        <CriminalRecordContainer
          onSaveCriminalRecordFunction={(oldData, criminalRecord, fiId) =>
            onSaveCriminalRecordFunction(
              oldData as LegalPersonDataType,
              criminalRecord,
              fiId
            )
          }
          selectedPerson={selectedPerson}
          setSelectedPerson={() => {}}
          isEditValid={!editable ? false : !legalPersonDetailsEditMode}
          onModeChange={(isOpen) => changeLegalPersonDetailsEditMode(isOpen)}
        />
      </StyledDetailsContainer>
    </StyledRoot>
  );
};

export default withLoading(FILegalPersonDetails);
