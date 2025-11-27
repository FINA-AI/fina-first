import React, { memo, RefObject } from "react";
import { Box } from "@mui/system";
import FiInput from "../../../../Common/FiInput";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { FieldType } from "../../../../util/FiUtil";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShareContainer from "../../../../../../containers/FI/Main/PhysicalPerson/ShareContainer";
import EducationContainer from "../../../../../../containers/FI/Main/PhysicalPerson/EducationContainer";
import RecommendationContainer from "../../../../../../containers/FI/Main/PhysicalPerson/RecommendationContainer";
import CriminalRecordContainer from "../../../../../../containers/FI/Main/PhysicalPerson/CriminalRecordContainer";
import PositionContainer from "../../../../../../containers/FI/Main/PhysicalPerson/PositionContainer";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import { physicalPersonResidentStatus } from "../../../../Configuration/FiConfigurationConstants";
import { styled } from "@mui/material/styles";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";
import { CountryDataTypes } from "../../../../../../types/common.type";
import { CriminalRecordDataType } from "../../../../../../types/fi.type";
import { LegalPersonDataType } from "../../../../../../types/legalPerson.type";

const StyledDetails = styled(Box)(({ theme }: any) => ({
  borderTop: theme.palette.borderColor,
  marginTop: 12,
  overflow: "auto",
  height: "100%",
  paddingBottom: 4,
}));

interface FIPhysicalPersonItemDetailsProps {
  person?: PhysicalPersonDataType;
  isEdit: boolean;
  onChangePersonPassportId: (value: string) => void;
  onChangePersonCitizenShip: (value: number) => void;
  onChangeResidentStatus: (value: string) => void;
  countries: CountryDataTypes[];
  selectedPerson?: PhysicalPersonDataType;
  setSelectedPerson: (person: PhysicalPersonDataType) => void;
  companies: LegalPersonDataType[];
  onSaveCriminalRecord: (
    data: PhysicalPersonDataType | LegalPersonDataType,
    criminalRecord: CriminalRecordDataType[],
    id: number
  ) => Promise<any>;
  containerRef?: RefObject<HTMLDivElement>;
  allPersons?: PhysicalPersonDataType[];
  configurationMode?: boolean;
}

const FIPhysicalPersonItemDetails: React.FC<
  FIPhysicalPersonItemDetailsProps
> = ({
  person = {},
  isEdit,
  onChangePersonPassportId,
  onChangePersonCitizenShip,
  onChangeResidentStatus,
  countries = [],
  selectedPerson,
  setSelectedPerson,
  companies = [],
  onSaveCriminalRecord,
  containerRef,
  allPersons,
  configurationMode,
}) => {
  const { t } = useTranslation();

  const isDisabled = () => {
    return !(Object.keys(person).length === 0 || person.fiPersonId === 0);
  };

  return (
    <>
      <Grid
        padding={"0 12px"}
        container
        display={"flex"}
        ref={containerRef}
        data-testid={"person-general-card"}
      >
        <Grid
          item
          xs={4}
          sx={{
            width: "100%",
            padding: "0 4px",
          }}
        >
          <FiInput
            title={t("passportNumber")}
            name={"passportNumber"}
            value={person.passportNumber}
            icon={<ImportContactsIcon />}
            editMode={isEdit}
            readOnly={isDisabled() || !configurationMode}
            onValueChange={onChangePersonPassportId}
            inputTypeProp={{ inputType: FieldType.STRING }}
            width={"100%"}
          />
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            width: "100%",
            padding: "0 4px",
          }}
        >
          <FiInput
            title={t("legalStatus")}
            name={"residentStatus"}
            value={person.residentStatus}
            icon={<FingerprintIcon />}
            editMode={isEdit}
            onValueChange={onChangeResidentStatus}
            inputTypeProp={{
              inputType: FieldType.LIST,
              listData: physicalPersonResidentStatus(),
            }}
            width={"100%"}
          />
        </Grid>
        <Grid
          item
          xs={4}
          sx={{
            width: "100%",
            padding: "0 4px",
          }}
        >
          <FiInput
            title={t("citizenship")}
            name={"citizenship"}
            value={person.citizenship?.id}
            icon={<LocationOnIcon />}
            editMode={isEdit}
            readOnly={isDisabled() || !configurationMode}
            onValueChange={onChangePersonCitizenShip}
            inputTypeProp={{
              inputType: FieldType.LIST,
              listData: countries.map((e) => ({
                label: e.name,
                value: e.id,
              })),
            }}
            width={"100%"}
          />
        </Grid>
      </Grid>
      <StyledDetails data-testid={"person-details-container"}>
        <ShareContainer
          selectedPerson={selectedPerson}
          setSelectedPerson={setSelectedPerson}
          countries={countries}
          textMaxWidth={300}
          isEditValid={!isEdit}
        />
        <EducationContainer
          selectedPerson={selectedPerson}
          setSelectedPerson={setSelectedPerson}
          isEditValid={!isEdit}
        />
        <RecommendationContainer
          selectedPerson={selectedPerson}
          setSelectedPerson={setSelectedPerson}
          allPersons={allPersons}
          isEditValid={!isEdit}
        />
        <CriminalRecordContainer
          onSaveCriminalRecordFunction={onSaveCriminalRecord}
          selectedPerson={selectedPerson}
          isEditValid={!isEdit}
          setSelectedPerson={setSelectedPerson}
        />
        <PositionContainer
          selectedPerson={selectedPerson}
          setSelectedPerson={setSelectedPerson}
          companies={companies}
          textMaxWidth={300}
          isEditValid={!isEdit}
        />
      </StyledDetails>
    </>
  );
};

export default memo(FIPhysicalPersonItemDetails);
