import { Box } from "@mui/system";
import ToolbarIcon from "../common/Icons/ToolbarIcon";
import RefreshIcon from "@mui/icons-material/Refresh";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { useTranslation } from "react-i18next";
import Tabs from "@mui/material/Tabs";
import { Tab } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { PeriodSubmitDataType } from "../../types/period.type";
import SecondaryToolbar from "../common/Toolbar/SecondaryToolbar";
import { PERMISSIONS } from "../../api/permissions";
import useConfig from "../../hoc/config/useConfig";
import { styled } from "@mui/material/styles";

interface PeriodDefinitionHeaderProps {
  setModalOpen: (val: boolean) => void;
  selectedRows: PeriodSubmitDataType[];
  setSelectedRows: (rows: PeriodSubmitDataType[]) => void;
  setDeleteMultiPeriodsModal: (value: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setAddNewPeriodTypeModal: (val: boolean) => void;
  setReloadPeriodData: (val: boolean) => void;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  backgroundColor: theme.palette.paperBackground,
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
}));

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  padding: theme.toolbar.padding,
  maxHeight: theme.toolbar.height,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
  backgroundColor: theme.palette.paperBackground,
  position: "relative",
  width: "100%",
}));

const StyledTab = styled(Tab)({
  padding: 4,
  minWidth: 0,
  minHeight: 0,
  bottom: "auto",
  fontWeight: 600,
  fontSize: 14,
  lineHeight: "21px",
  marginRight: 24,
  textTransform: "capitalize",
  background: "inherit",
});

const StyledAddNewBtn = styled(Box)({
  "& .MuiSvgIcon-root": {
    paddingLeft: "10px",
  },
});

const PeriodDefinitionHeader: React.FC<PeriodDefinitionHeaderProps> = ({
  selectedRows,
  setDeleteMultiPeriodsModal,
  setSelectedRows,
  setModalOpen,
  activeTab,
  setActiveTab,
  setAddNewPeriodTypeModal,
  setReloadPeriodData,
}) => {
  let secondaryToolbar = selectedRows.length > 1;
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  return (
    <StyledRoot display={"flex"} width={"100%"}>
      <StyledToolbar data-testid={"main-toolbar"}>
        <Box display={"flex"} alignItems={"center"}>
          <Tabs value={activeTab} sx={{ minHeight: 0 }}>
            <StyledTab
              label={t("periodDefinition")}
              value={"perioddefinition"}
              onClick={() => setActiveTab("perioddefinition")}
              data-testid={"period-definition-tab"}
            />
            <StyledTab
              label={t("periodType")}
              value={"periodtype"}
              onClick={() => setActiveTab("periodtype")}
              data-testid={"period-type-tab"}
            />
          </Tabs>
        </Box>

        {activeTab === "perioddefinition" && !secondaryToolbar && (
          <Box display={"flex"} justifyContent={"end"}>
            <Box display={"flex"} marginRight={"5px"}>
              <ToolbarIcon
                onClickFunction={() => {
                  setReloadPeriodData(true);
                }}
                Icon={<RefreshIcon />}
                data-testid={"refresh-icon-button"}
              />
            </Box>
            {hasPermission(PERMISSIONS.PERIODS_AMEND) && (
              <StyledAddNewBtn>
                <PrimaryBtn
                  onClick={() => {
                    setModalOpen(true);
                  }}
                  endIcon={<AddIcon />}
                  data-testid={"create-period-definition"}
                >
                  {t("addNew")}
                </PrimaryBtn>
              </StyledAddNewBtn>
            )}
          </Box>
        )}
        {activeTab === "periodtype" && (
          <>
            {hasPermission(PERMISSIONS.PERIODS_AMEND) && (
              <PrimaryBtn
                onClick={() => {
                  setAddNewPeriodTypeModal(true);
                }}
                endIcon={<AddRoundedIcon />}
                data-testid={"create-period-type"}
              >
                {t("addNew")}
              </PrimaryBtn>
            )}
          </>
        )}
      </StyledToolbar>
      {activeTab === "perioddefinition" &&
        secondaryToolbar &&
        hasPermission(PERMISSIONS.PERIODS_DELETE) && (
          <SecondaryToolbar
            style={{ padding: "12px 20px" }}
            selectedItemsCount={selectedRows.length}
            onDeleteButtonClick={() => setDeleteMultiPeriodsModal(true)}
            onCancelClick={() => setSelectedRows([])}
          />
        )}
    </StyledRoot>
  );
};

export default PeriodDefinitionHeader;
