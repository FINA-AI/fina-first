import { Box, Typography } from "@mui/material";
import CopyCellButton from "../../../../../../common/Grid/CopyCellButton";
import GhostBtn from "../../../../../../common/Button/GhostBtn";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Tooltip from "../../../../../../common/Tooltip/Tooltip";
import HistoryIcon from "@mui/icons-material/History";
import MuiEditIcon from "@mui/icons-material/Edit";
import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import { styled } from "@mui/material/styles";
import { PERMISSIONS } from "../../../../../../../api/permissions";
import useConfig from "../../../../../../../hoc/config/useConfig";
import { useTranslation } from "react-i18next";
import { BeneficiariesDataType } from "../../../../../../../types/fi.type";

interface FIBeneficiaryHeaderViewProps {
  selectedBeneficiary?: BeneficiariesDataType;
  openPhysicalPersonItemPage: (personId: number) => void;
  openLegalPersonItemPage: (personId: number) => void;
  getIdentificationCodeForCopy: () => string | undefined;
  selectedHistory: BeneficiariesDataType | null;
  setSelectedHistory: (history: BeneficiariesDataType | null) => void;
  setSelectedBeneficiary: (beneficiary: BeneficiariesDataType) => void;
  originalSelectedBeneficiary?: BeneficiariesDataType;
  setOpenHistoryModal: (open: boolean) => void;
  personType: string | null;
  activeStatus: string | boolean;
  setGeneralInfoEditMode: (edit: boolean) => void;
}

const commonIconStyles = (theme: any) => ({
  ...theme.smallIcon,
  "&:hover": {
    color: theme.palette.primary.main,
  },
});

const StyledPersonIcon = styled(PersonIcon)(({ theme }) => ({
  ...commonIconStyles(theme),
}));

const StyledWorkIcon = styled(WorkIcon)(({ theme }) => ({
  ...commonIconStyles(theme),
}));

const StyledHeaderId = styled("span")(({ theme }: any) => ({
  fontSize: "12px",
  color: theme.palette.secondaryTextColor,
  paddingLeft: "10px",
  fontWeight: 400,
  marginRight: "20px",
  lineHeight: "20px",
}));

const StyledHistoryIcon = styled(HistoryIcon)(({ theme }: any) => ({
  ...theme.smallIcon,
}));

const StyledMuiEditIcon = styled(MuiEditIcon)(({ theme }: any) => ({
  ...theme.smallIcon,
}));

const StyledIconContainer = styled(Box)(({ theme }) => ({
  color:
    theme.palette.mode === "light" ? "rgba(104, 122, 158, 0.8)" : "#5D789A",
  fontSize: 13,
  lineHeight: "20px",
  display: "flex",
  alignItems: "center",
  "& .MuiSvgIcon-root": {
    paddingRight: "5px",
    width: "15px",
    height: "15px",
  },
}));

const StyledDivider = styled("span")(({ theme }) => ({
  width: 1,
  height: 20,
  backgroundColor: theme.palette.mode === "light" ? "#98A7BC" : "#5D789A",
  marginLeft: 8,
}));

const StyledName = styled(Typography)(({ theme }: any) => ({
  fontSize: 14,
  lineHeight: "21px",
  fontWeight: 600,
  color: theme.palette.textColor,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: 600,
}));

const StyledStatusBox = styled(Box)(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontSize: 12,
  fontWeight: 500,
  lineHeight: "16px",
}));

const StyledStatusIndicator = styled(Box)({
  display: "flex",
  alignItems: "center",
  alignContent: "center",
  marginRight: 5,
});

const StyledRoundedDivider = styled("span")(({ theme }) => ({
  width: 4,
  height: 4,
  borderRadius: "50%",
  backgroundColor: theme.palette.mode === "light" ? "#98A7BC" : "#5D789A",
  margin: "0 16px",
}));

const StyledIconButton = styled(IconButton)({
  padding: 2,
  border: "none",
  background: "none",
});

const FIBeneficiaryHeaderView: React.FC<FIBeneficiaryHeaderViewProps> = ({
  selectedBeneficiary,
  openPhysicalPersonItemPage,
  openLegalPersonItemPage,
  getIdentificationCodeForCopy,
  selectedHistory,
  setSelectedHistory,
  setSelectedBeneficiary,
  originalSelectedBeneficiary,
  setOpenHistoryModal,
  personType,
  activeStatus,
  setGeneralInfoEditMode,
}) => {
  const { hasPermission } = useConfig();
  const { t } = useTranslation();

  const getName = (): string | undefined => {
    if (selectedBeneficiary) {
      return selectedBeneficiary.physicalPerson
        ? selectedBeneficiary.physicalPerson?.name
        : selectedBeneficiary.legalPerson?.name;
    }
    return undefined;
  };

  const getFullName = () => {
    if (selectedBeneficiary && Object.keys(selectedBeneficiary).length !== 0) {
      if (selectedBeneficiary.physicalPerson) {
        return (
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Tooltip title={getName() ?? ""}>
              <StyledName data-testid={"name-label"}>{getName()}</StyledName>
            </Tooltip>
            <Tooltip title={t("configurationSide")}>
              <StyledIconButton
                onClick={() =>
                  openPhysicalPersonItemPage(
                    selectedBeneficiary.physicalPerson!.id
                  )
                }
                style={{
                  marginLeft: 8,
                }}
                data-testid={"navigate-configuration-button"}
              >
                <StyledPersonIcon />
              </StyledIconButton>
            </Tooltip>
          </Box>
        );
      } else {
        return (
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Tooltip title={getName() ?? ""}>
              <StyledName data-testid={"name-label"}>{getName()}</StyledName>
            </Tooltip>
            <StyledIconButton
              onClick={() =>
                openLegalPersonItemPage(selectedBeneficiary.legalPerson!.id)
              }
              style={{
                marginLeft: 8,
              }}
              data-testid={"navigate-configuration-button"}
            >
              <StyledWorkIcon />
            </StyledIconButton>
          </Box>
        );
      }
    }
  };

  const getIdentificationNumber = (): string | undefined => {
    if (selectedBeneficiary) {
      if (selectedBeneficiary.physicalPerson) {
        return (
          selectedBeneficiary.physicalPerson.identificationNumber ?? undefined
        );
      } else if (selectedBeneficiary.legalPerson) {
        return (
          selectedBeneficiary.legalPerson.identificationNumber ?? undefined
        );
      }
    }
    return undefined;
  };

  return (
    <Box display={"flex"} width={"100%"} justifyContent={"space-between"}>
      <Box display={"flex"}>
        {getFullName()}
        <StyledDivider />
        <span style={{ display: "flex" }}>
          <CopyCellButton text={getIdentificationCodeForCopy() ?? ""} />
        </span>
        <StyledHeaderId data-testid={"identification-number-label"}>
          {getIdentificationNumber()}
        </StyledHeaderId>
      </Box>
      <Box>
        {Boolean(selectedHistory) ? (
          <Box display={"flex"} alignItems={"center"}>
            <GhostBtn
              onClick={() => {
                setSelectedHistory(null);
                if (originalSelectedBeneficiary) {
                  setSelectedBeneficiary(originalSelectedBeneficiary);
                }
                setSelectedHistory(null);
              }}
              endIcon={<UndoRoundedIcon />}
              data-testid={"backToOriginal-button"}
            >
              {t("backToOriginal")}
            </GhostBtn>
            <IconButton
              onClick={() => setOpenHistoryModal(true)}
              sx={{ color: "#C2CAD8", marginLeft: "5px" }}
              data-testid={"history-open-button"}
            >
              <KeyboardDoubleArrowLeftIcon fontSize={"small"} />
            </IconButton>
          </Box>
        ) : (
          <Box display={"flex"} alignContent={"center"}>
            <Box display={"flex"} alignItems={"center"}>
              <StyledIconContainer>
                {personType === "legalPerson" ? (
                  <>
                    <WorkOutlineIcon />
                    {t("legalPerson")}
                  </>
                ) : (
                  <>
                    <PermIdentityIcon />
                    {t("physicalperson")}
                  </>
                )}
              </StyledIconContainer>
              <StyledRoundedDivider />
              <StyledStatusIndicator
                style={{
                  color: activeStatus ? "#289E20" : "#FF4128",
                }}
              >
                <FiberManualRecordIcon sx={{ width: 8, height: 8 }} />
              </StyledStatusIndicator>
              <StyledStatusBox data-testid={"active-status"}>
                {activeStatus ? t("active") : t("inactive")}
              </StyledStatusBox>
            </Box>
            <StyledRoundedDivider />
            <Tooltip title={t("history")}>
              <StyledIconButton
                onClick={() => setOpenHistoryModal(true)}
                data-testid={"history-open-button"}
              >
                <StyledHistoryIcon />
              </StyledIconButton>
            </Tooltip>
            {hasPermission(PERMISSIONS.FI_AMEND) && (
              <Tooltip title={t("edit")}>
                <StyledIconButton
                  onClick={() => setGeneralInfoEditMode(true)}
                  data-testid={"edit-button"}
                >
                  <StyledMuiEditIcon />
                </StyledIconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FIBeneficiaryHeaderView;
