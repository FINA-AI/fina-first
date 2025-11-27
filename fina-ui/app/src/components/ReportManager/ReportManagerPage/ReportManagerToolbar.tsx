import { Box } from "@mui/system";
import { IconButton, Menu, MenuItem } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GhostBtn from "../../common/Button/GhostBtn";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import FilePrintField, {
  PrintFieldOptions,
} from "../../common/Field/FilePrintField";
import SettingsIcon from "@mui/icons-material/Settings";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ReportGenerationWizardContainer from "../Generate/ReportGenerationWizardContainer";
import {
  getStateFromLocalStorage,
  setStateToLocalStorage,
} from "../../../api/ui/localStorageHelper";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/material/styles";
import { Report } from "../../../types/report.type";
import { GenerateWizardOptions } from "./ReportManagerPage";
import { UIEventType } from "../../../types/common.type";

interface ReportManagerToolbarProps {
  selectedReports: Report[];
  hideEmptyFoldersFunc: () => void;
  showFoldersFunc: () => void;
  createReportClickHandler: (reportType: string) => void;
  hasFolderGenerationPermission: boolean;
  generateWizardOptions: GenerateWizardOptions;
  setGenerateWizardOptions: (options: GenerateWizardOptions) => void;
  treeKey: string;
}

const StyledToolbar = styled(Box)({
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
});

const StyledMenu = styled(Menu)(({ theme }: { theme: any }) => ({
  marginTop: "7px",
  "& .MuiList-root": {
    background: "#2D3747",
  },
  "& .MuiPaper-root": {
    boxShadow:
      theme.palette.mode === "dark"
        ? "0px 0px 4px 0px rgba(0,0,0,0.75)"
        : "0px 2px 10px rgba(0, 0, 0, 0.08)",
    color: "#FFFFFF",
    "& .MuiMenuItem-root": {
      fontSize: "13px !important",
      lineHeight: "130%",
    },
    "& .MuiMenuItem-root:hover": {
      background: theme.palette.buttons.primary.hover,
    },
    width: "125px",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }: { theme: any }) => ({
  height: 32,
  width: 32,
  borderRadius: 50,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 10,
  "& .MuiSvgIcon-root": {
    ...theme.smallIcon,
  },
}));

const ReportManagerToolbar: React.FC<ReportManagerToolbarProps> = ({
  selectedReports = [],
  showFoldersFunc,
  hideEmptyFoldersFunc,
  createReportClickHandler,
  hasFolderGenerationPermission,
  generateWizardOptions,
  setGenerateWizardOptions,
  treeKey,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const [hideEmptyFolders, setHideEmptyFolders] = useState(
    getStateFromLocalStorage()[treeKey]?.hideEmptyFolders ?? true
  );
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const displayFolders = () => {
    const reportManagerState = getStateFromLocalStorage()[treeKey];

    setStateToLocalStorage(treeKey, {
      ...reportManagerState,
      hideEmptyFolders: !hideEmptyFolders,
    });
    if (hideEmptyFolders) {
      setHideEmptyFolders(!hideEmptyFolders);
      showFoldersFunc();
    } else {
      setHideEmptyFolders(!hideEmptyFolders);
      hideEmptyFoldersFunc();
    }
  };
  const handleClick = (event: UIEventType) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const getDisplayOptions = () => {
    if (
      selectedReports?.length === 1 &&
      selectedReports[0]?.reportType === "EXCEL"
    ) {
      return PrintFieldOptions.filter((pf) => pf.type === "XLSX");
    }

    return PrintFieldOptions;
  };

  const closeWizard = () => {
    setGenerateWizardOptions({
      open: false,
    });
  };

  const isGenerateButtonDisabled = () => {
    if (!hasFolderGenerationPermission) {
      if (selectedReports.length === 1 && selectedReports[0].leaf) {
        return false;
      }
      return true;
    }
    if (selectedReports.some((report) => report.id <= 0)) {
      return true;
    }
    return selectedReports?.length === 0;
  };

  const isGenerateWithFormulaButtonDisabled = () => {
    if (selectedReports?.length !== 1) {
      return true;
    }

    const firstReport = selectedReports?.[0];

    if (firstReport && firstReport.reportType !== "EXCEL") {
      return true;
    }

    if (!firstReport) {
      return true;
    }
  };

  return (
    <StyledToolbar data-testid={"report-manager-toolbar"}>
      <StyledIconButton
        onClick={displayFolders}
        data-testid={"display-folder-button"}
      >
        {hideEmptyFolders ? (
          <VisibilityOffIcon fontSize={"small"} />
        ) : (
          <VisibilityIcon fontSize={"small"} />
        )}
      </StyledIconButton>

      {hasPermission(PERMISSIONS.FINA_REPORT_GENERATE) && (
        <GhostBtn
          style={{ marginRight: "8px" }}
          data-testid={"generate-formula-button"}
          onClick={() => {
            setGenerateWizardOptions({
              open: true,
              fileType: "XLSX",
              isSchedule: false,
              generateWithFormula: true,
            });
          }}
          disabled={isGenerateWithFormulaButtonDisabled()}
          startIcon={<BackupTableIcon style={{ marginRight: "3px" }} />}
        >
          {t("generateFormula")}
        </GhostBtn>
      )}

      {hasPermission(PERMISSIONS.FINA_REPORT_GENERATE) && (
        <FilePrintField
          label={t("generate")}
          icon={<SettingsIcon style={{ marginRight: "8px" }} />}
          handleClick={(type) => {
            setGenerateWizardOptions({
              open: true,
              fileType: type,
              isSchedule: false,
              generateWithFormula: false,
            });
          }}
          buttonProps={{
            "data-testid": "generate-button",
            style: {
              marginRight: "8px",
            },
          }}
          isDisabled={() => {
            return isGenerateButtonDisabled();
          }}
          displayOptions={getDisplayOptions()}
        />
      )}

      <PrimaryBtn
        data-testid={"add-new-button"}
        onClick={handleClick}
        disabled={selectedReports.length !== 1 || selectedReports[0]?.leaf}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {t("addNew")}
      </PrimaryBtn>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          disabled={selectedReports?.length !== 1 && selectedReports[0]?.leaf}
          onClick={() => {
            createReportClickHandler("report");
            handleClose();
          }}
        >
          {t("report")}
        </MenuItem>
        <MenuItem
          disabled={selectedReports?.length !== 0 && selectedReports[0]?.leaf}
          onClick={() => {
            createReportClickHandler("folder");
            handleClose();
          }}
        >
          {t("folder")}
        </MenuItem>
      </StyledMenu>
      {generateWizardOptions.open && (
        <ReportGenerationWizardContainer
          selectedReports={selectedReports}
          fileType={generateWizardOptions?.fileType || ""}
          closeWizard={closeWizard}
          handleClose={closeWizard}
          isSchedule={generateWizardOptions.isSchedule}
          generateWithFormula={generateWizardOptions.generateWithFormula}
        />
      )}
    </StyledToolbar>
  );
};

export default ReportManagerToolbar;
