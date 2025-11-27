import { Box, Typography } from "@mui/material";
import CopyCellButton from "../../../../../common/Grid/CopyCellButton";
import MuiEditIcon from "@mui/icons-material/Edit";
import TextButton from "../../../../../common/Button/TextButton";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";
import Select from "../../../../../common/Field/Select";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import IconButton from "@mui/material/IconButton";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import GhostBtn from "../../../../../common/Button/GhostBtn";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import Tooltip from "../../../../../common/Tooltip/Tooltip";
import useConfig from "../../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../../api/permissions";
import { styled } from "@mui/material/styles";
import { ManagementDataType } from "../../../../../../types/fi.type";

const StyledRoot = styled(Box)(({ theme }: any) => ({
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

const StyledStatusText = styled(Box)(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontSize: 12,
  fontWeight: 500,
  lineHeight: "16px",
}));

const StyledHeaderName = styled(Typography)(({ theme }: any) => ({
  fontWeight: 600,
  fontSize: "14px",
  textDecorationLine: "none",
  textTransform: "capitalize",
  cursor: "pointer",
  color: theme.palette.textColor,
  lineHeight: "21px",
}));

const StyledHeaderId = styled("span")(({ theme }: any) => ({
  fontSize: "13px",
  color: theme.palette.secondaryTextColor,
  paddingLeft: "10px",
  fontWeight: 400,
  marginRight: "20px",
}));

const StyleDivider = styled("span")(({ theme }) => ({
  width: 1,
  height: 20,
  backgroundColor: theme.palette.mode === "light" ? "#98A7BC" : "#5D789A",
  marginLeft: "8px",
}));

const StyledRoundedDivider = styled("span")(({ theme }) => ({
  width: 4,
  height: 4,
  borderRadius: "50%",
  backgroundColor: theme.palette.mode === "light" ? "#98A7BC" : "#495F80",
  margin: "0 16px",
}));

const StyledPersonIcon = styled(PersonIcon)(({ theme }: any) => ({
  ...theme.smallIcon,
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const commonIconStyles = (theme: any) => ({
  color: theme.palette.mode === "light" ? "#C2CAD8" : "",
  ...theme.smallIcon,
});

const StyledHistoryRoundedIcon = styled(HistoryRoundedIcon)(({ theme }) => ({
  ...commonIconStyles(theme),
}));

const StyledMuiEditIcon = styled(MuiEditIcon)(({ theme }) => ({
  ...commonIconStyles(theme),
}));

const StyledToolbarIconsBox = styled(Box)({
  minWidth: 210,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  "& .MuiButtonBase-root": {
    marginLeft: "6px",
  },
});

interface FIManagementItemPageHeaderProps {
  openPhysicalPerson: (item: ManagementDataType) => void;
  activeEditBtn: {
    mainInfoEditDisabled: boolean;
    comiteteInfoEditDisabled: boolean;
  };
  setActiveEditBtn: (value: {
    mainInfoEditDisabled: boolean;
    comiteteInfoEditDisabled: boolean;
  }) => void;
  currentManagementGeneralInfo: ManagementDataType;
  setCurrentManagementGeneralInfo: (info: ManagementDataType) => void;
  newManagementGeneralInfo: ManagementDataType;
  setConfirmOpen: (value: boolean) => void;
  generalEditModeOpen?: boolean;
  setGeneralEditModeOpen: (value: boolean) => void;
  setNewManagementGeneralInfo: (info: ManagementDataType) => void;
  hasStatus: boolean;
  setCancelOpen: (value: boolean) => void;
  historyMode?: boolean;
  setHistoryMode: (value: boolean) => void;
  setHistoryBarOpen: (value: boolean) => void;
  getHistoryData: () => void;
  originalManagementGenInfo?: ManagementDataType;
}

const FIManagementItemPageHeader: React.FC<FIManagementItemPageHeaderProps> = ({
  openPhysicalPerson,
  activeEditBtn,
  setActiveEditBtn,
  currentManagementGeneralInfo,
  setCurrentManagementGeneralInfo,
  newManagementGeneralInfo,
  setConfirmOpen,
  generalEditModeOpen,
  setGeneralEditModeOpen,
  setNewManagementGeneralInfo,
  hasStatus,
  setCancelOpen,
  historyMode,
  setHistoryMode,
  setHistoryBarOpen,
  getHistoryData,
  originalManagementGenInfo,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const getFullName = () => {
    return currentManagementGeneralInfo && currentManagementGeneralInfo.person
      ? currentManagementGeneralInfo.person.name
      : "";
  };

  const getItemId = () => {
    return currentManagementGeneralInfo && currentManagementGeneralInfo.person
      ? currentManagementGeneralInfo.person.identificationNumber
      : "";
  };

  const onEditIconClickFunction = () => {
    if (!activeEditBtn.mainInfoEditDisabled) {
      setGeneralEditModeOpen(true);
      setGeneralEditModeOpen(!generalEditModeOpen);
      setActiveEditBtn({
        mainInfoEditDisabled: true,
        comiteteInfoEditDisabled: true,
      });
    }
  };

  const onCancel = () => {
    setCancelOpen(true);
  };

  const onSave = () => {
    setConfirmOpen(true);
    setCurrentManagementGeneralInfo(newManagementGeneralInfo);
  };

  const changeGeneralInfo = (key: keyof ManagementDataType, value: any) => {
    if (!newManagementGeneralInfo) return;
    const changedInfo = { ...newManagementGeneralInfo, [key]: value };
    setNewManagementGeneralInfo(changedInfo);
  };

  const getDisableLabel = () => {
    let label = "";
    if (currentManagementGeneralInfo) {
      if (currentManagementGeneralInfo.disable) {
        label = t("inactive");
      } else {
        label = t("active");
      }

      return (
        <StyledToolbarIconsBox>
          {currentManagementGeneralInfo.disable !== null &&
            hasStatus &&
            (!historyMode ? (
              <>
                <Box display={"flex"} alignItems={"center"}>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    alignContent={"center"}
                    style={{
                      color: !currentManagementGeneralInfo.disable
                        ? "#289E20"
                        : "#FF4128",
                      marginRight: 4,
                    }}
                  >
                    <FiberManualRecordIcon sx={{ width: 8, height: 8 }} />
                  </Box>
                  <StyledStatusText>{label}</StyledStatusText>
                </Box>
                <StyledRoundedDivider />
                <Tooltip title={t("history")}>
                  <IconButton
                    onClick={() => {
                      setHistoryBarOpen(true);
                      getHistoryData();
                    }}
                    sx={{ padding: "2px" }}
                  >
                    <StyledHistoryRoundedIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Box>
                <GhostBtn
                  onClick={() => {
                    setHistoryMode(false);
                    if (originalManagementGenInfo) {
                      setCurrentManagementGeneralInfo(
                        originalManagementGenInfo
                      );
                    }
                  }}
                  endIcon={<UndoRoundedIcon />}
                >
                  {t("backToOriginal")}
                </GhostBtn>
                <IconButton
                  onClick={() => setHistoryBarOpen(true)}
                  sx={{
                    transform: "rotate(180deg)",
                    color: "#C2CAD8",
                    marginLeft: 10,
                  }}
                >
                  <DoubleArrowRoundedIcon fontSize={"small"} />
                </IconButton>
              </Box>
            ))}
          {hasPermission(PERMISSIONS.FI_AMEND) && !historyMode && (
            <Tooltip title={t("edit")}>
              <IconButton
                onClick={() => onEditIconClickFunction()}
                sx={{ padding: "2px" }}
                data-testid={"edit-button"}
              >
                <StyledMuiEditIcon />
              </IconButton>
            </Tooltip>
          )}
        </StyledToolbarIconsBox>
      );
    }
  };

  return (
    <Box data-testid={"header"}>
      <StyledRoot>
        <Box display={"flex"}>
          <StyledHeaderName>{getFullName()}</StyledHeaderName>
          <Tooltip title={t("configurationSide")}>
            <IconButton
              onClick={() => openPhysicalPerson(currentManagementGeneralInfo)}
              sx={{ padding: "2px" }}
              style={{
                marginLeft: 8,
              }}
              data-testid={"navigate-configuration-button"}
            >
              <StyledPersonIcon />
            </IconButton>
          </Tooltip>
          <StyleDivider />
          {getItemId() && (
            <span style={{ display: "flex" }}>
              <CopyCellButton text={getItemId()} />
            </span>
          )}
          <StyledHeaderId>{getItemId()}</StyledHeaderId>
          {generalEditModeOpen &&
            currentManagementGeneralInfo &&
            currentManagementGeneralInfo.disable !== null &&
            hasStatus && (
              <Select
                width={130}
                onChange={(value) => changeGeneralInfo("disable", value)}
                value={
                  currentManagementGeneralInfo
                    ? currentManagementGeneralInfo?.disable?.toString()
                    : false
                }
                data={[
                  { label: t("active"), value: false },
                  { label: t("inactive"), value: true },
                ]}
                label={t("status")}
              />
            )}
        </Box>
        <Box display={"flex"} alignContent={"center"}>
          {!generalEditModeOpen ? (
            getDisableLabel()
          ) : (
            <>
              <TextButton
                color={"secondary"}
                style={{ padding: 0 }}
                onClick={onCancel}
              >
                {t("cancel")}
              </TextButton>
              <span
                style={{
                  borderLeft: "1px solid #687A9E",
                  height: 14,
                }}
              />
              <TextButton
                style={{ padding: 0 }}
                onClick={onSave}
                endIcon={<CheckIcon sx={{ width: "12px", height: "12px" }} />}
              >
                {t("save")}
              </TextButton>
            </>
          )}
        </Box>
      </StyledRoot>
    </Box>
  );
};

export default FIManagementItemPageHeader;
