import { Box } from "@mui/system";
import React, { Fragment, useState } from "react";
import CopyCellButton from "../../../../common/Grid/CopyCellButton";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "../../../../common/Tooltip/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "../../../../common/Field/TextField";
import Select from "../../../../common/Field/Select";
import TextButton from "../../../../common/Button/TextButton";
import CheckIcon from "@mui/icons-material/Check";
import { Typography } from "@mui/material";
import PersonsFilter from "../../Common/PersonsFilter";
import FIPersonConfigurationConnection from "./FIPersonConfigurationConnection";
import FIPersonConfigurationDetail from "./FIPersonConfigurationDetail";
import { useTranslation } from "react-i18next";
import withLoading from "../../../../../hoc/withLoading";
import NoRecordIndicator from "../../../../common/NoRecordIndicator/NoRecordIndicator";
import { styled, useTheme } from "@mui/material/styles";
import DeleteForm from "../../../../common/Delete/DeleteForm";
import { PhysicalPersonDataType } from "../../../../../types/physicalPerson.type";
import { CountryDataTypes } from "../../../../../types/common.type";
import { LegalPersonDataType } from "../../../../../types/legalPerson.type";

const StyledRoot = styled(Box)({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

const StyledStatusText = styled(Box)({
  fontSize: 12,
  fontWeight: 500,
  lineHeight: "16px",
  marginRight: "5px",
});

const StyledCenteredFlexBox = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const StyledDivider = styled("span")(({ theme }) => ({
  width: 1,
  height: 23,
  backgroundColor: theme.palette.mode === "light" ? "#98A7BC" : "#495F80",
  marginLeft: 8,
}));

const StyledUserName = styled(Box)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFF" : "#2C3644",
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "21px",
}));

const StyledInnerTabsContainer = styled(Box)(({ theme }: any) => ({
  display: "flex",
  borderBottom: theme.palette.borderColor,
  borderTop: theme.palette.borderColor,
  height: "40px",
  justifyContent: "space-between",
  marginBottom: 12,
  paddingLeft: 16,
}));

const StyledLegalForm = styled(Box)(({ theme }: any) => ({
  color: theme.palette.secondaryTextColor,
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
}));

const StyledDetailsContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isInformationPageOpen",
})(({ isInformationPageOpen }: { isInformationPageOpen: boolean }) => ({
  display: isInformationPageOpen ? "flex" : "none",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  minHeight: 0,
}));

const StyledEditIcon = styled(EditIcon)(({ theme }: any) => ({
  color: "#5D789A",
  cursor: "pointer",
  ...theme.smallIcon,
  "&:hover": {
    color: "#2962FF",
  },
}));

const StyledDeleteIcon = styled(DeleteIcon)(({ theme }: any) => ({
  color: "#5D789A",
  cursor: "pointer",
  ...theme.smallIcon,
  "&:hover": {
    color: "#FF4128",
  },
}));

const StyledTabContainer = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "activeTab",
})<{
  activeTab: boolean;
  theme: any;
}>(({ theme, activeTab }) => ({
  fontSize: "13px",
  lineHeight: "20px",
  fontWeight: 500,
  height: "40px",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  padding: "0 16px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  color: activeTab ? theme.palette.textColor : theme.palette.secondaryTextColor,
  borderBottom: activeTab ? `1px solid #53B1FD` : "none",
}));

interface Props {
  persons: PhysicalPersonDataType[];
  selectedPerson?: PhysicalPersonDataType;
  setSelectedPerson: (person: PhysicalPersonDataType) => void;
  isEdit: boolean;
  countries: CountryDataTypes[];
  saveModalOpen: boolean;
  setSaveModalOpen: (val: boolean) => void;
  handleConfirm: (data: any) => void;
  companies: LegalPersonDataType[];
  updatePerson: (person: PhysicalPersonDataType) => Promise<void>;
  onClearFilters: () => void;
  deletePerson: () => void;
  setIsConnectionsModalOpen: (val: boolean) => void;
  setIsInformationPageOpen: (val: boolean) => void;
  isInformationPageOpen: boolean;
  loader: boolean;
  personName: string;
  setPersonName: (name: string) => void;
  identificationNumber: string;
  setIdentificationNumber: (id: string) => void;
  onFilter: () => void;
  setPersonStatus: (status: string) => void;
  personStatus: string;
  setIsCancelModalOpen: (val: boolean) => void;
  setIsEdit: (val: boolean) => void;
}

const FIPersonConfigurationMainDetail: React.FC<Props> = ({
  selectedPerson,
  setSelectedPerson,
  isEdit,
  countries,
  saveModalOpen,
  setSaveModalOpen,
  handleConfirm,
  companies,
  updatePerson,
  persons,
  onClearFilters,
  deletePerson,
  setIsConnectionsModalOpen,
  setIsInformationPageOpen,
  isInformationPageOpen,
  loader,
  setPersonName,
  personName,
  setIdentificationNumber,
  identificationNumber,
  onFilter,
  personStatus,
  setPersonStatus,
  setIsCancelModalOpen,
  setIsEdit,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <StyledRoot>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        padding={"13px 16px"}
      >
        {!isEdit ? (
          <Fragment>
            <StyledCenteredFlexBox>
              <StyledUserName>{personName}</StyledUserName>
              <StyledDivider />
              <CopyCellButton text={personName} />
              <StyledLegalForm ml={1}>{identificationNumber}</StyledLegalForm>
            </StyledCenteredFlexBox>
            <StyledCenteredFlexBox>
              <StyledCenteredFlexBox>
                <StyledCenteredFlexBox
                  alignContent={"center"}
                  style={{
                    color:
                      personStatus === "ACTIVE"
                        ? theme.palette.mode === "dark"
                          ? "#47CD89"
                          : "#289E20"
                        : "#FF4128",
                  }}
                >
                  <FiberManualRecordIcon
                    sx={{ width: 10, height: 10, marginRight: "4px" }}
                  />
                </StyledCenteredFlexBox>
                <StyledStatusText>
                  {personStatus ? t(personStatus) : t("inactive")}
                </StyledStatusText>
              </StyledCenteredFlexBox>
              {isInformationPageOpen && (
                <StyledCenteredFlexBox ml={2}>
                  <StyledEditIcon
                    onClick={() => setIsEdit(true)}
                    data-testid={"edit-btn-inner-page"}
                  />
                </StyledCenteredFlexBox>
              )}
              <Box
                ml={2}
                color={"rgba(104, 122, 158, 0.8)"}
                marginRight={"5px"}
                sx={{
                  opacity:
                    selectedPerson &&
                    selectedPerson.connections &&
                    selectedPerson.connections.length !== 0
                      ? 0.6
                      : 1,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Tooltip title={t("Delete All Links For Remove Person")}>
                  <StyledDeleteIcon
                    onClick={() => {
                      if (
                        !selectedPerson!.connections ||
                        selectedPerson!.connections.length === 0
                      ) {
                        setIsDeleteModalOpen(true);
                      } else {
                        setIsConnectionsModalOpen(true);
                      }
                    }}
                    data-testid={"delete-btn-inner-page"}
                  />
                </Tooltip>
              </Box>
            </StyledCenteredFlexBox>
          </Fragment>
        ) : (
          <Fragment>
            <StyledCenteredFlexBox>
              <Box mr={"8px"} display={"flex"}>
                <Box pr={"8px"}>
                  <TextField
                    width={180}
                    size={"small"}
                    value={personName}
                    onChange={(value: string) => setPersonName(value)}
                    label={t("name")}
                    fieldName={"name"}
                    isError={personName !== undefined && !personName}
                    pattern={/^[\p{L}\p{N}]*$/u}
                  />
                </Box>
                <Box>
                  <TextField
                    width={180}
                    size={"small"}
                    value={identificationNumber}
                    onChange={(value: string) => setIdentificationNumber(value)}
                    label={t("personCreateId")}
                    fieldName={"id"}
                    isError={
                      identificationNumber !== undefined &&
                      !identificationNumber
                    }
                  />
                </Box>
              </Box>
              <Box mr={"8px"}>
                <Select
                  data-testid={"statusSelect"}
                  width={130}
                  size={"small"}
                  onChange={(value) => setPersonStatus(value)}
                  value={personStatus}
                  data={[
                    { label: t("ACTIVE"), value: "ACTIVE" },
                    { label: t("INACTIVE"), value: "INACTIVE" },
                  ]}
                  label={t("status")}
                />
              </Box>
            </StyledCenteredFlexBox>
            <StyledCenteredFlexBox>
              <TextButton
                data-testid={"cancelBtn"}
                color={"secondary"}
                onClick={() => setIsCancelModalOpen(true)}
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
                color={"primary"}
                data-testid={"saveBtn"}
                onClick={() => {
                  setSaveModalOpen(true);
                }}
                endIcon={<CheckIcon sx={{ width: "12px", height: "12px" }} />}
              >
                {t("save")}
              </TextButton>
            </StyledCenteredFlexBox>
          </Fragment>
        )}
      </Box>

      <StyledInnerTabsContainer>
        <Box display={"flex"}>
          <StyledTabContainer
            activeTab={isInformationPageOpen}
            data-testid={"personalInformation"}
            onClick={() => {
              setIsInformationPageOpen(true);
            }}
            theme={undefined}
          >
            {t("personalInformation")}
          </StyledTabContainer>
          <StyledTabContainer
            data-testid={"involvementResult"}
            activeTab={!isInformationPageOpen}
            onClick={() => {
              if (!isEdit) {
                setIsInformationPageOpen(false);
              }
            }}
            theme={undefined}
          >
            {t("involvementResult")}
          </StyledTabContainer>
        </Box>
        {!isInformationPageOpen && (
          <PersonsFilter
            onFilterClick={onFilter}
            onClearFilters={onClearFilters}
          />
        )}
      </StyledInnerTabsContainer>
      <StyledDetailsContainer isInformationPageOpen={isInformationPageOpen}>
        <FIPersonConfigurationDetail
          selectedPerson={selectedPerson}
          setSelectedPerson={setSelectedPerson}
          isEdit={isEdit}
          countries={countries}
          saveModalOpen={saveModalOpen}
          setSaveModalOpen={setSaveModalOpen}
          handleConfirm={handleConfirm}
          companies={companies}
          updatePerson={updatePerson}
          allPersons={persons}
        />
      </StyledDetailsContainer>
      {!isInformationPageOpen && selectedPerson!.connections && (
        <Box height={"100%"} overflow={"auto"}>
          {!loader && selectedPerson!.connections.length === 0 && (
            <NoRecordIndicator />
          )}
          {selectedPerson!.connections.map((connection, index) => {
            return (
              <FIPersonConfigurationConnection
                connection={connection}
                index={index}
                key={index}
              />
            );
          })}
        </Box>
      )}
      {isDeleteModalOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          onDelete={() => {
            deletePerson();
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </StyledRoot>
  );
};

export default withLoading(FIPersonConfigurationMainDetail);
