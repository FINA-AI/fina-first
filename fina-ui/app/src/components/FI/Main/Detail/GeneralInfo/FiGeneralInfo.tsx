import { Box, Grid, Tooltip } from "@mui/material";
import FiMainInfo from "./FiMainInfo";
import FiContactInfo from "./FiContactInfo";
import FiAboutInfo from "./FiAboutInfo";
import React, { useEffect, useRef, useState } from "react";
import { createFi } from "../../../../../api/services/fi/fiService";
import { useSnackbar } from "notistack";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import FiGeneralInfoSkeleton from "../../../Skeleton/GeneralInfo/FiGeneralInfoSkeleton";
import useErrorWindow from "../../../../../hoc/ErrorWindow/useErrorWindow";
import GhostBtn from "../../../../common/Button/GhostBtn";
import ConfirmModal from "../../../../../components/common/Modal/ConfirmModal";
import FiLegalTypeInfo from "./FiLegalTypeInfo";
import ToolbarIcon from "../../../../common/Icons/ToolbarIcon";
import TextField from "../../../../common/Field/TextField";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import SubmitBtn from "../../../../common/Button/SubmitBtn";
import HistoryIcon from "@mui/icons-material/History";
import FiHistoryContainer from "../../../../../containers/FI/Main/GeneralInfo/FiHistoryContainer";
import StatusToggleButton from "../../../Common/StatusToggleButton";
import { loadPaths } from "../../../../../api/services/regionService";
import useConfig from "../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../api/permissions";
import { styled } from "@mui/material/styles";
import { FiDataType } from "../../../../../types/fi.type";
import { CountryDataTypes } from "../../../../../types/common.type";
import { CancelIcon } from "../../../../../api/ui/icons/CancelIcon";
import RelationsModal from "../../../../UserManagement/Users/RelationsModal";

const StyledRoot = styled(Box)(({ theme }: { theme: any }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  overflowX: "hidden",
  background: theme.palette.paperBackground,
}));

const StyledFiTitle = styled(Box)(({ theme }: { theme: any }) => ({
  padding: "6px 16px",
  backgroundColor: theme.palette.mode === "light" ? "#F0F4FF" : "#344258",
  borderRadius: "4px",
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "150%",
  textTransform: "capitalize",
  color: theme.palette.textColor,
}));

const StyledCustomIcon = styled(Box)(({ theme }: { theme: any }) => ({
  "& .MuiButtonBase-root": {
    width: "40px",
    height: "40px",
  },
  "& .MuiSvgIcon-root": {
    ...theme.smallIcon,
  },
}));

const StyledSaveBtn = styled(Grid)({
  "& .MuiButton-root": {
    height: "32px",
    marginLeft: "0px",
  },
  "& .MuiSvgIcon-root": {
    marginLeft: "5px",
  },
});

const StyledStatusBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{
  isActive: boolean;
}>(({ theme, isActive }) => ({
  padding: "4px 12px",
  height: "fit-content",
  marginRight: 5,
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "20px",
  textTransform: "capitalize",
  borderRadius: "2px",
  color: isActive
    ? theme.palette.mode === "light"
      ? "#289E20"
      : "#ABEFC6"
    : theme.palette.mode === "light"
    ? "#FF4128"
    : "#912018",
  backgroundColor: isActive
    ? theme.palette.mode === "light"
      ? "#E9F5E9"
      : "#067647"
    : theme.palette.mode === "light"
    ? "rgba(104, 122, 158, 0.1)"
    : "#FDA29B",
}));

const StyledHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  paddingTop: 12,
  marginBottom: 5,
  position: "sticky",
  top: 0,
  paddingLeft: 16,
  paddingRight: 16,
  minHeight: 50,
  zIndex: 999,
});

interface FiGeneralInfoProps {
  fi: FiDataType;
  setFi: (fi: FiDataType) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  defaultEditMode: boolean;
}

const FiGeneralInfo: React.FC<FiGeneralInfoProps> = ({
  fi,
  setFi,
  loading,
  setLoading,
  defaultEditMode = false,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { hasPermission } = useConfig();
  const validationRef = useRef<Record<string, boolean | undefined>>({});

  const [editMode, setEditMode] = useState(defaultEditMode);
  const [countries, setCountries] = useState<CountryDataTypes[]>([]);
  const [isCancelOpen, setCancelOpen] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [isRelationsModalOpen, setIsRelationsModalOpen] = useState(false);
  const [fiHistory, setFIHistory] = useState<any>(null);
  const [fiHistoryLength, setFIHistoryLength] = useState<number | null>(null);
  const [disableSave, setDisableSave] = useState(false);

  const fiChangedData = useRef<Partial<FiDataType>>({}).current;
  let currentFi = { ...fi, ...fiChangedData };

  const onEditClick = () => setEditMode(true);
  const onCancelClick = () => setEditMode(false);

  useEffect(() => {
    initCountries();
  }, []);

  const onValueChange = (value: any, nameField: string, isValid?: boolean) => {
    validationRef.current = { ...validationRef.current, [nameField]: isValid };
    fiChangedData[nameField as keyof FiDataType] = value;
    checkValidation();
  };

  const checkValidation = () => {
    let isValid = true;

    if (Object.values(validationRef.current).some((item) => item === false)) {
      isValid = false;
    }
    if (isValid) {
      setDisableSave(false);
    } else {
      setDisableSave(true);
    }
  };

  const onSubmit = (removeFiPermissions: boolean) => {
    const submitFiData: FiDataType = {
      ...fi,
      ...fiChangedData,
    };
    setLoading(true);
    createFi(submitFiData, removeFiPermissions)
      .then((res) => {
        setLoading(false);
        setFi(res.data);
        Object.keys(fiChangedData).forEach(
          (key) => delete fiChangedData[key as keyof FiDataType]
        );
        currentFi = fi;
        setEditMode(false);
        setFIHistory(null);
        setFIHistoryLength(0);
        enqueueSnackbar(t("FiEdited"), { variant: "success" });
      })
      .catch((err) => {
        setLoading(false);
        openErrorWindow(err, t("error"), true);
        currentFi = { ...fi, ...fiChangedData };
      });
  };

  const onSaveClick = () => {
    const isOpenRelationsModal =
      typeof fiChangedData?.disable === "boolean"
        ? fiChangedData?.disable
        : currentFi?.disable;

    if (isOpenRelationsModal) {
      setIsRelationsModalOpen(true);
    } else {
      onSubmit(false);
    }
  };

  const initCountries = async () => {
    try {
      const resp = await loadPaths();
      setCountries(resp.data);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  const EditHeaderButtons = () => {
    return (
      <Grid container direction={"row"} spacing={1} width={"100%"}>
        <Grid item xs={6} display={"flex"}>
          <Tooltip title={t("history")} arrow>
            <StyledCustomIcon display={"flex"}>
              <ToolbarIcon
                data-testid={"historyBtn"}
                onClickFunction={() => setOpenHistoryModal(true)}
                Icon={<HistoryIcon />}
              />
            </StyledCustomIcon>
          </Tooltip>
          {hasPermission(PERMISSIONS.FI_AMEND) && (
            <Tooltip title={t("edit")} arrow>
              <StyledCustomIcon display={"flex"}>
                <ToolbarIcon
                  data-testid={"editBtn"}
                  onClickFunction={onEditClick}
                  Icon={<EditIcon />}
                  isSquare={true}
                />
              </StyledCustomIcon>
            </Tooltip>
          )}
        </Grid>
      </Grid>
    );
  };

  const UpdateHeaderButtons = () => {
    return (
      <Grid container direction={"row"} width={"100%"} marginRight={"16px"}>
        <Grid item xs={6}>
          <GhostBtn
            onClick={() => setCancelOpen(true)}
            data-testid={"cancel-button"}
          >
            {t("cancel")}
          </GhostBtn>
        </Grid>
        <StyledSaveBtn item xs={6}>
          <SubmitBtn
            onClick={onSaveClick}
            disabled={disableSave}
            endIcon={<DoneRoundedIcon fontSize={"small"} />}
            data-testid={"save-button"}
          >
            {t("save")}
          </SubmitBtn>
        </StyledSaveBtn>
      </Grid>
    );
  };

  const Header = () => {
    return (
      <StyledHeader data-testid={"header"}>
        {editMode ? (
          <Box sx={{ padding: "8px 0px" }}>
            <TextField
              onChange={(val: string) => {
                onValueChange(val, "name");
              }}
              value={currentFi?.name}
              fieldName={"name"}
            />
          </Box>
        ) : (
          <StyledFiTitle>{currentFi?.name}</StyledFiTitle>
        )}
        <Box
          display={"flex"}
          flex={1}
          justifyContent={"flex-end"}
          alignItems={"center"}
        >
          <Box display={"flex"} alignItems={"center"}>
            {editMode ? (
              <StatusToggleButton
                status={!currentFi.disable}
                onChange={(value) => onValueChange(!value, "disable")}
              />
            ) : (
              <Box
                sx={{ padding: "3px", marginRight: "10px" }}
                display={"flex"}
                alignItems={"center"}
              >
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  alignContent={"center"}
                >
                  <StyledStatusBox
                    data-testid={"status-label"}
                    isActive={!currentFi.disable}
                  >
                    {currentFi.disable ? t("inactive") : t("active")}
                  </StyledStatusBox>
                </Box>
              </Box>
            )}
            {editMode ? <UpdateHeaderButtons /> : <EditHeaderButtons />}
          </Box>
        </Box>
      </StyledHeader>
    );
  };

  const clearFiChangedDataRef = () => {
    Object.keys(fiChangedData).forEach(
      (key) => delete fiChangedData[key as keyof FiDataType]
    );
  };

  return (
    <Box display={"flex"} height={"100%"} width={"100%"}>
      {loading ? (
        <FiGeneralInfoSkeleton />
      ) : (
        currentFi && (
          <StyledRoot>
            {Header()}
            <Box sx={{ padding: "0 12px", overflow: "auto" }}>
              <Box display={"flex"} flex={1}>
                <FiMainInfo
                  fi={currentFi}
                  editMode={editMode}
                  onValueChange={onValueChange}
                  countries={countries}
                />
              </Box>
              <Box display={"flex"} flex={1}>
                <FiContactInfo
                  fi={currentFi}
                  editMode={editMode}
                  onValueChange={onValueChange}
                />
              </Box>
              <Box display={"flex"} flex={1}>
                <FiAboutInfo
                  fi={currentFi}
                  editMode={editMode}
                  onValueChange={onValueChange}
                />
              </Box>

              <Box display={"flex"} flex={1}>
                <FiLegalTypeInfo
                  additionalInfo={currentFi.additionalInfo}
                  editMode={editMode}
                  onValueChange={onValueChange}
                />
              </Box>
            </Box>
          </StyledRoot>
        )
      )}
      <ConfirmModal
        isOpen={isCancelOpen}
        setIsOpen={setCancelOpen}
        onConfirm={() => {
          onCancelClick();
          setCancelOpen(false);
          setDisableSave(false);
          clearFiChangedDataRef();
        }}
        confirmBtnTitle={t("confirm")}
        headerText={t("cancelHeaderText")}
        bodyText={t("cancelBodyText")}
        additionalBodyText={t("changes")}
        icon={<CancelIcon />}
      />
      {openHistoryModal && (
        <FiHistoryContainer
          open={openHistoryModal}
          setOpen={setOpenHistoryModal}
          fiHistory={fiHistory}
          setFIHistory={setFIHistory}
          fiHistoryLength={fiHistoryLength}
          setFIHistoryLength={setFIHistoryLength}
          fiId={currentFi?.id}
        />
      )}

      <RelationsModal
        setOpenRelationWarningModal={() => setIsRelationsModalOpen(false)}
        openRelationWarningModal={isRelationsModalOpen}
        onSave={onSubmit}
        title={"removefipermissions"}
        saveOnClose={true}
      />
    </Box>
  );
};

export default FiGeneralInfo;
