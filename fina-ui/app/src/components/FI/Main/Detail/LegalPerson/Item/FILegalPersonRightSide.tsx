import React, { Fragment, useEffect, useState } from "react";
import { loadFirstLevel } from "../../../../../../api/services/regionService";
import { useSnackbar } from "notistack";
import { Box } from "@mui/material";
import CopyCellButton from "../../../../../common/Grid/CopyCellButton";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { SaveIcon } from "../../../../../../api/ui/icons/SaveIcon";
import { useTranslation } from "react-i18next";
import FILegalPersonDetails from "./FILegalPersonDetails";
import Select from "../../../../../common/Field/Select";
import Tooltip from "../../../../../common/Tooltip/Tooltip";
import TextButton from "../../../../../common/Button/TextButton";
import CheckIcon from "@mui/icons-material/Check";
import FiLegalPersonSelect from "../Select/FiLegalPersonSelect";
import { useHistory, useParams } from "react-router-dom";
import ConfirmModal from "../../../../../common/Modal/ConfirmModal";
import EditIcon from "@mui/icons-material/Edit";
import useErrorWindow from "../../../../../../hoc/ErrorWindow/useErrorWindow";
import { getLegalPersonById } from "../../../../../../api/services/fi/fiLegalPersonService";
import GhostBtn from "../../../../../common/Button/GhostBtn";
import ShareIcon from "@mui/icons-material/Share";
import TextField from "../../../../../common/Field/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import ToolbarIcon from "../../../../../common/Icons/ToolbarIcon";
import ConnectionsModal from "../../../../Common/ConnectionsModal";
import { getLegalPersonConnections } from "../../../../../../api/services/legalPersonService";
import DeleteForm from "../../../../../common/Delete/DeleteForm";
import menuLink from "../../../../../../api/ui/menuLink";
import useConfig from "../../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../../api/permissions";
import { styled } from "@mui/material/styles";
import { LegalPersonDataType } from "../../../../../../types/legalPerson.type";
import {
  BeneficiariesDataType,
  CriminalRecordDataType,
  ManagersDataType,
  SharesDataType,
} from "../../../../../../types/fi.type";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";
import { CountryDataTypes } from "../../../../../../types/common.type";

const StyledRoot = styled(Box)({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

const StyledHeader = styled(Box)({
  height: 32,
  margin: "12px 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const StyledCenterFlexBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const StyledUserName = styled(Box)(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "21px",
  textOverflow: "ellipsis",
  maxWidth: 400,
  overflow: "hidden",
  whiteSpace: "nowrap",
}));

const StyledId = styled(Box)(({ theme }: any) => ({
  color: theme.palette.secondaryTextColor,
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
}));

const StyledSplitter = styled("span")(({ theme }: any) => ({
  borderLeft: theme.palette.borderColor,
  height: 14,
}));

const StyledStatusText = styled(Box)({
  fontSize: 12,
  fontWeight: 500,
  lineHeight: "16px",
});

const StyledRoundedDivider = styled("span")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#EAEBF0" : "#5D789A",
  height: 4,
  width: 4,
  marginLeft: 16,
}));

const StyledDivider = styled("span")(({ theme }) => ({
  width: 1,
  height: 23,
  backgroundColor: theme.palette.mode === "light" ? "#98A7BC" : "#5D789A",
  marginLeft: "8px",
}));

const StyledDeleteIcon = styled(DeleteIcon)(({ theme }: any) => ({
  color: theme.palette.mode === "light" ? "#C2CAD8" : "#5D789A",
  cursor: "pointer",
  marginRight: "5px",
  ...theme.smallIcon,
  "&:hover": {
    color: "#FF4128",
  },
}));

interface FILegalPersonRightSideProps {
  submitSuccess?: (data: LegalPersonDataType) => void;
  isEdit: boolean;
  setIsEdit: (val: boolean) => void;
  onSave: (data?: LegalPersonDataType) => void;
  saveEdit?: () => void;
  selectedPerson: LegalPersonDataType;
  setSelectedPerson: (val: LegalPersonDataType) => void;
  legalPersons: LegalPersonDataType[];
  currentLegalPerson?: LegalPersonDataType;
  beneficiarySaveFunction: (data: BeneficiariesDataType[]) => void;
  onSaveCriminalRecordFunction: (
    data: LegalPersonDataType,
    criminalRecords: CriminalRecordDataType
  ) => void;
  onSaveOtherShareFunction: (
    data: LegalPersonDataType,
    shares: SharesDataType[]
  ) => void;
  onSaveManagerFunction: (
    data: LegalPersonDataType,
    managers: ManagersDataType[]
  ) => void;
  openNewLegalPersonItem: (data: any) => void;
  openNewPhysicalPersonItem: (data: any) => void;
  setIsConfirmModal: (val: boolean) => void;
  getAllFIPhysicalPersons: () => void;
  setIsCancelModalOpen: (val: boolean) => void;
  allLegalPersons: LegalPersonDataType[];
  allPhysicalPerson: PhysicalPersonDataType[];
  configurationMode?: boolean;
  isConfirmModal: boolean;
  deleteLegalPersonConfigurationSide?: (id: string | undefined) => void;
  changeLegalPersonDetailsEditMode?: (val: boolean) => void;
  legalPersonDetailsEditMode?: boolean | null;
  legalPersonData: LegalPersonDataType;
}

const FILegalPersonRightSide: React.FC<FILegalPersonRightSideProps> = ({
  submitSuccess,
  isEdit,
  setIsEdit,
  onSave,
  saveEdit,
  selectedPerson,
  setSelectedPerson,
  currentLegalPerson,
  beneficiarySaveFunction,
  onSaveCriminalRecordFunction,
  onSaveOtherShareFunction,
  onSaveManagerFunction,
  openNewLegalPersonItem,
  openNewPhysicalPersonItem,
  legalPersons,
  setIsConfirmModal,
  getAllFIPhysicalPersons,
  setIsCancelModalOpen,
  allLegalPersons,
  allPhysicalPerson,
  configurationMode = false,
  isConfirmModal,
  legalPersonData,
  deleteLegalPersonConfigurationSide,
  changeLegalPersonDetailsEditMode,
  legalPersonDetailsEditMode,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const history = useHistory();
  const { id, legalPersonId } = useParams<{
    id: string;
    legalPersonId: string;
  }>();
  const { hasPermission } = useConfig();
  const { openErrorWindow } = useErrorWindow();

  const [countryData, setCountryData] = useState<CountryDataTypes[]>([]);
  const [isFI, setIsFI] = useState(false);
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false);
  const [connections, setConnections] = useState();
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    setIsFI(selectedPerson.bank);
    if (selectedPerson.id) {
      legalPersonData.registrationNumber =
        legalPersonData?.registrationNumber ||
        selectedPerson?.registrationNumber;
      legalPersonData.residentStatus =
        legalPersonData?.residentStatus || selectedPerson?.residentStatus;
      legalPersonData.country =
        legalPersonData?.country || selectedPerson?.country;
      legalPersonData.contactInfo = selectedPerson?.contactInfo ?? {
        citizenship: {} as CountryDataTypes,
        address: "",
        phone: "",
        id: 0,
      };
    }
  }, [selectedPerson]);

  useEffect(() => {
    initCountries();
  }, []);

  const initCountries = async () => {
    try {
      let res = await loadFirstLevel();
      const data = res.data;
      setCountryData(data);
    } catch (error: any) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };
  const validateData = () => {
    return new Promise((resolve, reject) => {
      selectedPerson.identificationNumber ? resolve(true) : reject(false);
    });
  };

  const saveData = () => {
    if (configurationMode) {
      onSave();
      history.push(
        `${menuLink.configuration}/legalperson/${selectedPerson.id}`
      );
    } else {
      {
        if (isEdit) {
          setIsConfirmModal(true);
          saveEdit!();
        } else onSave(legalPersonData);
      }
    }
  };

  const getConnections = () => {
    getLegalPersonConnections(legalPersonId).then((resp) => {
      setConnections(resp.data);
      if (!resp.data || resp.data.length === 0) {
        setDeleteModalOpen(true);
      } else setIsConnectionsModalOpen(true);
    });
  };

  const onCancelHandler = () => {
    if (configurationMode) {
      if (isEdit) {
        setIsCancelModalOpen(true);
      } else {
        history.push(
          `${menuLink.configuration}/legalperson/${selectedPerson.id}`
        );
      }
    } else {
      if (isEdit) {
        setIsCancelModalOpen(true);
      } else {
        history.push(`/fi/${id}/legalperson`);
      }
    }
  };

  const setValue = (key: string, value: any) => {
    setSelectedPerson({
      ...selectedPerson,
      [key]: value,
    });
  };

  const isEditMode = () => {
    if (!configurationMode) {
      return isEdit;
    }
    return isEdit && Object.keys(selectedPerson).length === 0;
  };

  const loadLegalPerson = (id: number) => {
    setLoading(true);
    getLegalPersonById(id)
      .then((res) => {
        setSelectedPerson(res.data);
        setLoading(false);
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
        setLoading(false);
      });
  };

  const openNewTab = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <StyledRoot>
      <StyledHeader data-testid={"header"}>
        {isEdit ? (
          <Fragment>
            <StyledCenterFlexBox>
              <Box mr={"20px"}>
                {!configurationMode ? (
                  <Box width={300}>
                    {allLegalPersons.length !== 0 && (
                      <FiLegalPersonSelect
                        onChange={(value) => {
                          setSelectedPerson(value);
                          setIsFI(value.bank);
                          loadLegalPerson(value.id);
                        }}
                        selectedItem={selectedPerson}
                        disabled={isEditMode()}
                        data={allLegalPersons}
                        fieldName={"name"}
                        label={t("idAndName")}
                        size={"default"}
                      />
                    )}
                  </Box>
                ) : (
                  <StyledCenterFlexBox>
                    <Box paddingRight={"20px"}>
                      <TextField
                        isDisabled={selectedPerson.bank ? isEdit : false}
                        value={selectedPerson.name}
                        label={t("name")}
                        fieldName={"name"}
                        size={"default"}
                        onChange={(val: string) => {
                          setValue("name", val);
                        }}
                        isError={
                          selectedPerson.name !== undefined &&
                          !selectedPerson.name
                        }
                      />
                    </Box>
                    <Box>
                      <TextField
                        isDisabled={selectedPerson.bank ? isEdit : false}
                        value={selectedPerson.identificationNumber}
                        size={"default"}
                        label={t("personCreateId")}
                        fieldName={"personCreateId"}
                        onChange={(val: boolean) => {
                          setValue("identificationNumber", val);
                        }}
                        isError={
                          selectedPerson.name !== undefined &&
                          !selectedPerson.identificationNumber
                        }
                      />
                    </Box>
                  </StyledCenterFlexBox>
                )}
              </Box>
              <Box mr={"20px"}>
                <Select
                  data-testid={"statusSelect"}
                  width={130}
                  size={"default"}
                  value={selectedPerson.status}
                  onChange={(val) => {
                    setValue("status", val);
                  }}
                  data={[
                    { label: t("active"), value: "ACTIVE" },
                    { label: t("inactive"), value: "INACTIVE" },
                  ]}
                  label={t("status")}
                />
              </Box>
            </StyledCenterFlexBox>
            <Box display={"flex"} alignItems={"center"}>
              <TextButton
                data-testid="cancelBtn"
                color={"secondary"}
                onClick={() => onCancelHandler()}
              >
                {t("cancel")}
              </TextButton>
              <StyledSplitter>&nbsp;</StyledSplitter>
              <TextButton
                data-testid={"saveBtn"}
                onClick={() => {
                  setIsConfirmModal(true);
                }}
                endIcon={<CheckIcon sx={{ width: "12px", height: "12px" }} />}
              >
                {t("save")}
              </TextButton>
            </Box>
          </Fragment>
        ) : (
          <Fragment>
            <StyledCenterFlexBox alignContent={"center"}>
              <Tooltip title={selectedPerson.name}>
                <StyledUserName>{selectedPerson.name}</StyledUserName>
              </Tooltip>
              <StyledDivider />
              <CopyCellButton text={selectedPerson.name} />
              <StyledId ml={1}>
                {t(selectedPerson.identificationNumber)}
              </StyledId>
            </StyledCenterFlexBox>
            <StyledCenterFlexBox alignContent={"center"}>
              {configurationMode && (
                <Box mr={"15px"}>
                  <GhostBtn
                    data-testid={"connectedCompaniesBtn"}
                    onClick={() =>
                      openNewTab(
                        `#/legalpersons/${legalPersonId}/connectedcompanies`
                      )
                    }
                    endIcon={
                      <ShareIcon sx={{ marginLeft: "5px", fontSize: 13 }} />
                    }
                  >
                    {t("connectedCompanies")}
                  </GhostBtn>
                </Box>
              )}
              <StyledCenterFlexBox
                alignContent={"center"}
                style={{
                  color:
                    selectedPerson.status === "ACTIVE" ? "#289E20" : "#FF4128",
                }}
              >
                <FiberManualRecordIcon
                  sx={{ width: 10, height: 10, marginRight: "4px" }}
                />
              </StyledCenterFlexBox>
              <StyledCenterFlexBox>
                <StyledStatusText>
                  {t(selectedPerson.status)}
                  &nbsp;
                </StyledStatusText>
              </StyledCenterFlexBox>
              {hasPermission(PERMISSIONS.FI_AMEND) && (
                <>
                  <StyledRoundedDivider />
                  <StyledCenterFlexBox
                    ml={"16px"}
                    data-testid={"legalPerson-edit-inner-btn"}
                  >
                    <Box display={"flex"} marginRight={"10px"}>
                      <ToolbarIcon
                        onClickFunction={() => setIsEdit(true)}
                        Icon={<EditIcon />}
                        hideBackground={true}
                        iconColor={"#C2CAD8"}
                        hoverColor={"#2962FF"}
                        disabled={Boolean(legalPersonDetailsEditMode)}
                      />
                    </Box>
                  </StyledCenterFlexBox>
                </>
              )}
              {configurationMode && (
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  color={"rgba(104, 122, 158, 0.8)"}
                  sx={{
                    opacity:
                      currentLegalPerson?.connections &&
                      currentLegalPerson?.connections.length !== 0
                        ? 0.6
                        : 1,
                    cursor: "pointer",
                  }}
                  data-testid={"legalPerson-delete-inner-btn"}
                >
                  <Tooltip
                    title={t("Delete All Links For Remove Legal Person")}
                  >
                    <StyledDeleteIcon onClick={getConnections} />
                  </Tooltip>
                </Box>
              )}
            </StyledCenterFlexBox>
          </Fragment>
        )}
      </StyledHeader>
      <StyledRoot overflow={"hidden"}>
        <FILegalPersonDetails
          isEdit={isFI ? isEdit && configurationMode : isEdit}
          selectedPerson={selectedPerson}
          countryData={countryData}
          setSelectedPerson={setSelectedPerson}
          currentLegalPerson={currentLegalPerson}
          legalPersons={legalPersons}
          beneficiarySaveFunction={beneficiarySaveFunction}
          submitSuccess={submitSuccess}
          getAllFIPhysicalPersons={getAllFIPhysicalPersons}
          onSaveManagerFunction={onSaveManagerFunction}
          openNewPhysicalPersonItem={openNewPhysicalPersonItem}
          onSaveOtherShareFunction={onSaveOtherShareFunction}
          openNewLegalPersonItem={openNewLegalPersonItem}
          onSaveCriminalRecordFunction={onSaveCriminalRecordFunction}
          allLegalPersons={allLegalPersons}
          allPhysicalPerson={allPhysicalPerson}
          editable={isFI ? false : !isEdit}
          legalPersonData={legalPersonData}
          loading={loading}
          configurationMode={configurationMode}
          changeLegalPersonDetailsEditMode={changeLegalPersonDetailsEditMode}
          legalPersonDetailsEditMode={legalPersonDetailsEditMode}
        />
        {isConfirmModal && (
          <ConfirmModal
            isOpen={isConfirmModal}
            setIsOpen={setIsConfirmModal}
            onConfirm={() => {
              validateData()
                .then(() => {
                  saveData();
                  setIsConfirmModal(false);
                  setIsEdit(false);
                })
                .catch(() => {
                  setIsConfirmModal(false);
                  enqueueSnackbar(t("requiredFieldsAreEmpty"), {
                    variant: "warning",
                  });
                });
            }}
            confirmBtnTitle={t("save")}
            headerText={t("saveHeaderText")}
            bodyText={t("saveBodyText")}
            icon={<SaveIcon />}
            additionalBodyText={t("changes")}
          />
        )}
        {deleteModalOpen && (
          <DeleteForm
            headerText={t("delete")}
            bodyText={t("deleteWarning")}
            additionalBodyText={t("recommendation")}
            isDeleteModalOpen={deleteModalOpen}
            setIsDeleteModalOpen={setDeleteModalOpen}
            onDelete={() => {
              deleteLegalPersonConfigurationSide!(legalPersonId);
              setDeleteModalOpen(false);
            }}
            showConfirm={false}
          />
        )}
        {isConnectionsModalOpen && (
          <ConnectionsModal
            isConnectionsModalOpen={isConnectionsModalOpen}
            setIsConnectionsModalOpen={setIsConnectionsModalOpen}
            connections={connections}
          />
        )}
      </StyledRoot>
    </StyledRoot>
  );
};

export default FILegalPersonRightSide;
