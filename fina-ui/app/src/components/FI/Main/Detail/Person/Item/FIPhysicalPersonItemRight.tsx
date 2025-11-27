import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import Select from "../../../../../common/Field/Select";
import TextButton from "../../../../../common/Button/TextButton";
import CheckIcon from "@mui/icons-material/Check";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import EditIcon from "@mui/icons-material/Edit";
import React, { Fragment, useEffect, useRef, useState } from "react";
import CopyCellButton from "../../../../../common/Grid/CopyCellButton";
import FIPhysicalPersonItemDetails from "./FIPhysicalPersonItemDetails";
import FiPersonSelect from "../Select/FiPersonSelect";
import Skeleton from "@mui/material/Skeleton";
import ToolbarIcon from "../../../../../common/Icons/ToolbarIcon";
import useConfig from "../../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../../api/permissions";
import { styled } from "@mui/material/styles";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";
import { CriminalRecordDataType } from "../../../../../../types/fi.type";
import { CountryDataTypes } from "../../../../../../types/common.type";
import { LegalPersonDataType } from "../../../../../../types/legalPerson.type";

const StyledHeader = styled(Box)({
  height: 32,
  margin: "12px 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const StyledCenteredFlexBox = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const StyledUserName = styled(Box)(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "21px",
}));

const StyledId = styled(Box)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#596D89" : "#ABBACE",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
}));

const StyledStatusText = styled(Box)({
  fontSize: 12,
  fontWeight: 500,
  lineHeight: "16px",
  marginRight: 5,
});

const StyledDivider = styled("span")({
  width: 1,
  height: 23,
  backgroundColor: "#5D789A",
  marginLeft: 8,
});

const StyledRoundedDivider = styled("span")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#98A7BC" : "#495F80",
  height: 4,
  width: 4,
  marginLeft: 14,
}));

/* eslint-disable react/prop-types */
interface FIPhysicalPersonItemRightProps {
  configurationMode?: boolean;
  personMain?: PhysicalPersonDataType;
  setPersonMain: React.Dispatch<React.SetStateAction<PhysicalPersonDataType>>;
  save: (person: PhysicalPersonDataType) => void;
  setCancelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  countries: CountryDataTypes[];
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPerson?: PhysicalPersonDataType;
  setSelectedPerson: React.Dispatch<
    React.SetStateAction<PhysicalPersonDataType>
  >;
  isMainEditValid: boolean;
  onSaveCriminalRecord: (
    data: PhysicalPersonDataType | LegalPersonDataType,
    criminalRecord: CriminalRecordDataType[],
    id: number
  ) => Promise<any>;
  companies: LegalPersonDataType[];
  allPersons?: PhysicalPersonDataType[];
  setAllPersons?: React.Dispatch<
    React.SetStateAction<PhysicalPersonDataType[]>
  >;
  loadPerson?: (id: number) => void;
}

const FIPhysicalPersonItemRight: React.FC<FIPhysicalPersonItemRightProps> =
  React.memo(
    ({
      configurationMode = false,
      personMain,
      setPersonMain,
      save,
      setCancelOpen,
      countries,
      isEdit,
      setIsEdit,
      selectedPerson,
      setSelectedPerson,
      isMainEditValid,
      onSaveCriminalRecord,
      companies,
      allPersons,
      setAllPersons,
      loadPerson,
    }) => {
      const { hasPermission } = useConfig();
      const { t } = useTranslation();
      const ref = useRef(null);
      const [personInfo, setPersonInfo] = useState<PhysicalPersonDataType>();

      useEffect(() => {
        if (personMain) setPersonInfo(personMain);
      }, [personMain]);

      const onEditClick = () => {
        setIsEdit(true);
      };

      const onChangePassportId = (value: string) => {
        if (personInfo) {
          personInfo.passportNumber = value;
        }
        setPersonMain({ ...personMain!, passportNumber: value });
      };

      const onChangeCitizenShip = (value: number) => {
        if (personInfo) {
          personInfo.citizenship = { id: value } as CountryDataTypes;
        }
        setPersonMain({
          ...personMain!,
          citizenship: { id: value } as CountryDataTypes,
        });
      };

      const onChangePersonStatus = (value: string) => {
        if (personInfo) {
          personInfo.status = value;
        }
        setPersonMain({ ...personMain!, status: value });
      };

      const onChangeResidentStatus = (value: string) => {
        if (personInfo) {
          personInfo.residentStatus = value;
        }
        setPersonMain({ ...personMain!, residentStatus: value });
      };

      const isEditMode = () => {
        if (configurationMode && Object.keys(personMain!).length === 0) {
          return !isEdit;
        }
        return isEdit;
      };

      return (
        <Box height={"100%"}>
          <StyledHeader data-testid={"header"}>
            {isEdit ? (
              <Fragment>
                <StyledCenteredFlexBox>
                  <Box
                    sx={{
                      marginRight: "20px",
                    }}
                  >
                    <Box width={300}>
                      {!allPersons ? (
                        <Skeleton
                          variant="rectangular"
                          width={300}
                          height={34}
                          sx={{ borderRadius: 8 }}
                        />
                      ) : (
                        <FiPersonSelect
                          label={t("idAndName")}
                          size={"small"}
                          fieldName={"name"}
                          selectedItem={personMain}
                          disabled={isEditMode() && !!selectedPerson?.id}
                          submitSuccess={(newPerson) => {
                            setAllPersons!([newPerson, ...allPersons]);
                            setPersonMain(newPerson);
                            setPersonInfo(newPerson);
                          }}
                          onChange={(item) => {
                            loadPerson!(item.id);
                          }}
                          data={allPersons}
                        />
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      marginRight: "20px",
                    }}
                  >
                    <Select
                      width={130}
                      size={"small"}
                      onChange={onChangePersonStatus}
                      value={personMain?.status}
                      data={[
                        { label: t("ACTIVE"), value: "ACTIVE" },
                        { label: t("INACTIVE"), value: "INACTIVE" },
                      ]}
                      label={t("status")}
                      data-testid={"status-select"}
                    />
                  </Box>
                </StyledCenteredFlexBox>
                <StyledCenteredFlexBox>
                  <TextButton
                    color={"secondary"}
                    onClick={() => setCancelOpen(true)}
                    data-testid={"cancel-button"}
                  >
                    {t("cancel")}
                  </TextButton>
                  <span
                    style={{
                      borderLeft: "1px solid #687A9E",
                      height: 14,
                    }}
                  >
                    &nbsp;
                  </span>
                  <TextButton
                    onClick={() => {
                      if (personInfo) save(personInfo);
                    }}
                    endIcon={
                      <CheckIcon sx={{ width: "12px", height: "12px" }} />
                    }
                    data-testid={"save-button"}
                  >
                    {t("save")}
                  </TextButton>
                </StyledCenteredFlexBox>
              </Fragment>
            ) : (
              <Fragment>
                <StyledCenteredFlexBox>
                  <StyledUserName data-testid={"name-label"}>
                    {personMain?.name}
                  </StyledUserName>
                  <StyledDivider />
                  <CopyCellButton text={personMain?.name || ""} />
                  <StyledId ml={1} data-testid={"identification-number-label"}>
                    {t(personMain?.identificationNumber || "")}
                  </StyledId>
                </StyledCenteredFlexBox>
                <StyledCenteredFlexBox>
                  <StyledCenteredFlexBox>
                    <StyledCenteredFlexBox
                      alignContent={"center"}
                      style={{
                        color:
                          personMain?.status === "ACTIVE"
                            ? "#289E20"
                            : "#FF4128",
                      }}
                    >
                      <FiberManualRecordIcon
                        sx={{ width: 10, height: 10, marginRight: "4px" }}
                      />
                    </StyledCenteredFlexBox>
                    <StyledStatusText data-testid={"status-label"}>
                      {t(personMain?.status || "")}
                    </StyledStatusText>
                  </StyledCenteredFlexBox>
                  {hasPermission(PERMISSIONS.FI_AMEND) && (
                    <>
                      <StyledRoundedDivider />
                      <StyledCenteredFlexBox ml={"14px"}>
                        <Box display={"flex"} marginRight={"10px"}>
                          <ToolbarIcon
                            onClickFunction={
                              isMainEditValid ? onEditClick : () => {}
                            }
                            Icon={<EditIcon />}
                            hideBackground={true}
                            data-testid={"edit-button"}
                          />
                        </Box>
                      </StyledCenteredFlexBox>
                    </>
                  )}
                </StyledCenteredFlexBox>
              </Fragment>
            )}
          </StyledHeader>
          <FIPhysicalPersonItemDetails
            person={personMain}
            allPersons={allPersons}
            selectedPerson={selectedPerson}
            setSelectedPerson={setSelectedPerson}
            countries={countries}
            companies={companies}
            containerRef={ref}
            isEdit={isEdit}
            onSaveCriminalRecord={onSaveCriminalRecord}
            onChangePersonPassportId={onChangePassportId}
            onChangePersonCitizenShip={onChangeCitizenShip}
            onChangeResidentStatus={onChangeResidentStatus}
            configurationMode={configurationMode}
          />
        </Box>
      );
    },
    (prevProps, nextProps) => {
      return (
        prevProps.isEdit === nextProps.isEdit &&
        prevProps.personMain?.id === nextProps.personMain?.id &&
        prevProps.countries === nextProps.countries &&
        prevProps.allPersons === nextProps.allPersons
      );
    }
  );

export default FIPhysicalPersonItemRight;
