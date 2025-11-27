import { Box, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React, { useState } from "react";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import EmsMenu from "./EmsMenu";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import GavelIcon from "@mui/icons-material/Gavel";
import BalanceIcon from "@mui/icons-material/Balance";
import HandymanIcon from "@mui/icons-material/Handyman";
import { PERMISSIONS } from "../../../api/permissions";
import { styled, useTheme } from "@mui/material/styles";
import { lighten } from "@mui/system";

interface MenuItem {
  name: string;
  route: string;
  icon: React.ReactNode;
  link?: string;
  permission?: string;
}

interface EmsMainLayoutLeftSideProps {
  menuRef: React.RefObject<HTMLDivElement>;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  width: "250px",
  minWidth: "250px",
  height: "100%",
  zIndex: theme.zIndex.drawer - 1,
  "& .MuiFormControl-root": {
    paddingRight: "0px",
  },
  "& .MuiButtonBase-root": {
    padding: "0px",
    backgroundColor:
      theme.palette.mode === "dark"
        ? lighten(theme.palette.primary.main, 0.2)
        : "#c2ddf2",
    marginRight: "5px",
  },
  "& .MuiSvgIcon-root": {
    width: "20px",
    height: "20px",
    color: theme.palette.mode === "dark" ? "#FFF" : "rgb(176, 176, 176)",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "0px",
  },
  transition: "width 0.3s ease-in-out, background-color 0.1s ease-in-out",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
}));

const StyledHeader = styled(Box)(({ theme }: any) => ({
  height: "16px",
  padding: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor:
    theme.palette.mode === "dark" ? "rgb(102, 108, 137)" : "#157fcc",
  fontSize: "13px",
  minHeight: "0px",
  lineHeight: "16px",
}));

const StyledCloseIconButton = styled(IconButton)(({ theme }) => ({
  ...(theme.palette.mode === "dark" && {
    backgroundColor: "rgb(45, 55, 71) !important",
  }),
}));

const StyledVerticalMenu = styled("span")({
  writingMode: "vertical-rl",
  transformOrigin: "bottom",
  color: "#FFF",
  letterSpacing: "1px",
  fontSize: "15px",
  marginTop: "10px",
});

const EmsMainLayoutLeftSide: React.FC<EmsMainLayoutLeftSideProps> = ({
  menuRef,
  isMenuOpen,
  setIsMenuOpen,
}) => {
  const theme: any = useTheme();
  const { t } = useTranslation();

  const [menu] = useState<MenuItem[]>([
    {
      name: "fiprofile",
      route: "profile",
      icon: <AccountBalanceIcon />,
      link: `profile`,
    },
    {
      name: "inspectiontypes",
      route: "inspectionType",
      icon: <BalanceIcon />,
      link: `inspectionType`,
      permission: PERMISSIONS.EMS_INSPECTION_TYPE_REVIEW,
    },
    {
      name: "sanctionandrecommendationtypes",
      route: "sanctionandrecommendation",
      icon: <GavelIcon />,
      link: `sanctionandrecommendation`,
      permission: PERMISSIONS.EMS_SANCTION_AND_RECOMMENDATION_REVIEW,
    },
    {
      name: "finetypes",
      route: "fine",
      icon: <CoPresentIcon />,
      link: `fine`,
      permission: PERMISSIONS.EMS_FINE_TYPES_REVIEW,
    },
    {
      name: "inspectioncolumns",
      route: "inspectionColumn",
      icon: <BackupTableIcon />,
      link: `inspectionColumn`,
      permission: PERMISSIONS.EMS_INSPECTION_COLUMNS_REVIEW,
    },
    {
      name: "recommendations",
      route: "recommendations",
      icon: <InsertDriveFileIcon />,
      link: `recommendations`,
      permission: PERMISSIONS.EMS_RECOMMENDATION_REVIEW,
    },
    {
      name: "fileconfiguration",
      route: "fileConfig",
      icon: <HandymanIcon />,
      link: "fileConfig",
      permission: PERMISSIONS.EMS_FILE_CONFIGURATION_REVIEW,
    },
    {
      name: "importfile",
      route: "importFile",
      icon: <ExitToAppIcon />,
      link: "importFile",
      permission: PERMISSIONS.EMS_IMPORT_FILE_REVIEW,
    },
    {
      name: "followup",
      route: "followup",
      icon: <FolderOpenIcon />,
      link: "followup",
      permission: PERMISSIONS.EMS_FOLLOWUP_REVIEW,
    },
  ]);

  const onMenuClose = (): void => {
    setIsMenuOpen(false);
  };

  const onMenuOpen = (): void => {
    setIsMenuOpen(true);
  };

  return (
    <StyledRoot
      ref={menuRef}
      style={{
        width: isMenuOpen ? "250px" : "30px",
        minWidth: isMenuOpen ? "250px" : "30px",
        backgroundColor: isMenuOpen
          ? theme.palette.paperBackground
          : theme.palette.mode === "dark"
          ? "rgb(102, 108, 137)"
          : "#157fcc",
      }}
      data-testid={"left-layout"}
    >
      {!isMenuOpen ? (
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          marginTop={"10px"}
        >
          <StyledCloseIconButton
            onClick={() => onMenuOpen()}
            style={{ margin: "0px" }}
          >
            <KeyboardArrowRightIcon />
          </StyledCloseIconButton>
          <StyledVerticalMenu>{t("Menu")}</StyledVerticalMenu>
        </Box>
      ) : (
        <>
          <StyledHeader data-testid={"header"}>
            <div
              style={{
                color: "#FFF",
                fontSize: "13px",
                lineHeight: "16px",
              }}
            >
              {t("Menu")}
            </div>
            <div>
              <StyledCloseIconButton
                onClick={() => onMenuClose()}
                data-testid={"toggle-button"}
              >
                <KeyboardArrowLeftIcon />
              </StyledCloseIconButton>
            </div>
          </StyledHeader>
          <div style={{ paddingTop: "20px" }}>
            <EmsMenu menu={menu} />
          </div>
        </>
      )}
    </StyledRoot>
  );
};

export default EmsMainLayoutLeftSide;
