import { Box } from "@mui/system";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Divider, IconButton, Tab, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ReturnDefinitionsPopover from "./ReturnDefinitionsPopover/ReturnDefinitionsPopover";
import GhostBtn from "../common/Button/GhostBtn";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import FilePrintField from "../common/Field/FilePrintField";
import Tabs from "@mui/material/Tabs";
import ReturnTypeToolbar from "../ReturnTypes/ReturnTypeToolbar";
import ReturnVersionsToolbar from "../ReturnVerions/ReturnVersionsToolbar";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import { ReturnDefinitionType } from "../../types/returnDefinition.type";
import { UIEventType } from "../../types/common.type";

interface ReturnDefinitionsHeaderProps {
  setIsDetailPageOpen: (value: boolean) => void;
  setGeneralInfoEditMode: (value: boolean) => void;
  setCurrentReturnDefinition: (rd: ReturnDefinitionType | {}) => void;
  selectedRows: ReturnDefinitionType[];
  activeTab: string;
  setAddNewReturnTypeModal: (value: boolean) => void;
  setAddNewReturnVersionsModal: (value: boolean) => void;
  setIsDeleteModalOpen: (value: boolean) => void;
  showRelevantContainer(tabName: string): void;
  rebuildReturnDependencyHandler(requestTimeout: number): Promise<true | false>;
  templateHandleClick(type: any): void;
  tableGenerateHandler(ids: number[]): void;
}

const StyledGridHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== "activeTab",
})<{ activeTab: string }>(({ theme, activeTab }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 12px",
  borderBottom:
    activeTab !== "returnDefinition" && (theme as any).palette.borderColor,
}));

const StyledTab = styled(Tab)(({ theme }: { theme: any }) => ({
  padding: "6px 10px",
  minWidth: 0,
  minHeight: 0,
  bottom: "auto",
  fontWeight: 500,
  fontSize: 13,
  lineHeight: "21px",
  marginRight: 10,
  textTransform: "capitalize",
  borderRadius: "40px",
  transition: "all 0.5s ease",
  background: theme.palette.mode === "dark" ? "#2D3747" : "",
  color: theme.palette.textColor,
  border: theme.palette.mode === "dark" ? "1px solid #3C4D68" : "",
  boxShadow:
    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& button.Mui-selected": {
    borderRadius: "40px",
    color: theme.palette.mode === "light" ? "#FFF" : "#1F2532",
    backgroundColor: theme.palette.primary.main,
  },
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .MuiTabs-scroller": {
    height: "40px",
  },
}));

const StyledDivider = styled(Divider)({
  height: 20,
  width: 1,
  marginLeft: "10px",
  marginRight: "10px",
});

const ReturnDefinitionsHeader: React.FC<ReturnDefinitionsHeaderProps> = ({
  setIsDetailPageOpen,
  setGeneralInfoEditMode,
  setCurrentReturnDefinition,
  selectedRows,
  tableGenerateHandler,
  templateHandleClick,
  rebuildReturnDependencyHandler,
  activeTab,
  setAddNewReturnTypeModal,
  setAddNewReturnVersionsModal,
  showRelevantContainer,
  setIsDeleteModalOpen,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const open = Boolean(anchorEl);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const popoverOpenHandler = (event: UIEventType) => {
    setAnchorEl(event.currentTarget);
  };

  const popoverCloseHandler = () => {
    setAnchorEl(null);
  };

  const handleOPenDependencies = () => {
    const data = selectedRows.map((r) => r.id);
    window.open(
      `${
        window.location.origin
      }/fina-app/returnDependencies/view.jsp?data=${data.join(",")}`,
      "_blank"
    );
  };

  const closeRebuildSnackbarAction = (
    <React.Fragment>
      <CircularProgress
        size={24}
        style={{ color: "#fff", marginRight: "20px" }}
      />

      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        style={{
          color: "#C2CAD8",
        }}
        onClick={() => {
          closeSnackbar();
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <StyledGridHeader activeTab={activeTab}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <StyledTabs value={activeTab} TabIndicatorProps={{ hidden: true }}>
          <StyledTab
            label={t("returnDefinition")}
            value={"returnDefinition"}
            onClick={() => {
              showRelevantContainer("returnDefinition");
            }}
          />
          <StyledTab
            label={t("returnType")}
            value={"returnType"}
            onClick={() => {
              showRelevantContainer("returnType");
            }}
          />
          {hasPermission(PERMISSIONS.RETURN_VERSION_REVIEW) && (
            <StyledTab
              label={t("returnVersion")}
              value={"returnVersion"}
              onClick={() => {
                showRelevantContainer("returnVersion");
              }}
            />
          )}
        </StyledTabs>
      </Box>
      {activeTab === "returnDefinition" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
          }}
        >
          <ReturnDefinitionsPopover
            popoverCloseHandler={popoverCloseHandler}
            selectedRows={selectedRows}
            tableGenerateHandler={tableGenerateHandler}
            open={open}
            popoverOpenHandler={popoverOpenHandler}
            anchorEl={anchorEl}
            rebuildReturnDependencyHandler={async () => {
              //5 minutes
              const requestTimeout = 5 * 1000 * 60;
              enqueueSnackbar(t("rebuildReturnDependency"), {
                variant: "info",
                autoHideDuration: 60 * 1000 * 2, //2 minutes
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                preventDuplicate: true,
                action: closeRebuildSnackbarAction,
              });
              const success = await rebuildReturnDependencyHandler(
                requestTimeout
              );
              closeSnackbar();
              if (success) {
                enqueueSnackbar(t("restartReturnDefinitionCache"), {
                  variant: "success",
                });
              }
            }}
          />
          <StyledDivider />
          {hasPermission(PERMISSIONS.FINA_RETURN_DEFINITION_AMEND) && (
            <Box>
              <PrimaryBtn
                onClick={() => {
                  setIsDetailPageOpen(true);
                  setGeneralInfoEditMode(true);
                  setCurrentReturnDefinition({});
                }}
                endIcon={<AddRoundedIcon />}
              >
                <Typography mr={"5px"} fontSize={12}>
                  {t("addNew")}
                </Typography>
              </PrimaryBtn>
            </Box>
          )}

          <Box mr={"10px"}>
            <GhostBtn
              disabled={selectedRows.length === 0}
              onClick={handleOPenDependencies}
              height={32}
              startIcon={<AddRoundedIcon />}
            >
              <Typography mr={"5px"} fontSize={12}>
                {t("dependencies")}
              </Typography>
            </GhostBtn>
          </Box>
          <Box mr={"8px"}>
            <FilePrintField
              label={t("review")}
              icon={<TableChartRoundedIcon style={{ marginRight: 4 }} />}
              handleClick={templateHandleClick}
              displayOptions={[
                { type: "HTML", key: "html" },
                { type: "XLSX", key: "xlsx" },
              ]}
              style={{
                marginRight: "8px",
              }}
              isDisabled={() => {
                return selectedRows.length === 0;
              }}
            />
          </Box>

          <GhostBtn
            disabled={!(selectedRows && selectedRows.length > 0)}
            fontSize={12}
            style={{ marginRight: "10px" }}
            onClick={() => setIsDeleteModalOpen(true)}
            startIcon={<DeleteIcon />}
          >
            {t("delete")}
          </GhostBtn>
        </Box>
      )}
      {activeTab === "returnType" && (
        <ReturnTypeToolbar
          setAddNewReturnTypeModal={setAddNewReturnTypeModal}
        />
      )}
      {activeTab === "returnVersion" && (
        <ReturnVersionsToolbar
          setAddNewReturnVersionsModal={setAddNewReturnVersionsModal}
        />
      )}
    </StyledGridHeader>
  );
};

export default ReturnDefinitionsHeader;
