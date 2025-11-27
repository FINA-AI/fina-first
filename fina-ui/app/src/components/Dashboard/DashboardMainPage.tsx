import { Box } from "@mui/system";
import GhostBtn from "../common/Button/GhostBtn";
import React, { SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import DashboardBody from "./DashboardBody";
import CreateDashboardModal from "./Create/CreateDashboardModal";
import DeleteForm from "../common/Delete/DeleteForm";
import { useHistory } from "react-router-dom";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import DashboardTabPanel from "./DashboardTabPanel";
import { DashboardType, UpdateDashboardType } from "../../types/dashboard.type";
import { ConfigType } from "../../types/common.type";
import { styled } from "@mui/material/styles";

interface DashboardMainPageProps {
  dashboards: DashboardType[];
  loading: boolean;
  selectedDashboard: DashboardType;
  onSelectDashboard: (dashboard: DashboardType) => void;
  openDashboardModal: { open: boolean; editMode: boolean };
  setOpenDashboardModal: React.Dispatch<
    SetStateAction<{ open: boolean; editMode: boolean }>
  >;
  deleteDashboard: () => void;
  onSaveDashboard: (dashboard: UpdateDashboardType) => void;
  onEditDashboard: (dashboard: UpdateDashboardType) => void;
  deleteModal: boolean;
  setDeleteModal: React.Dispatch<SetStateAction<boolean>>;
  activeTab: number;
  setActiveTab: React.Dispatch<SetStateAction<number>>;
}

const StyledMainLayout = styled(Box)(({ theme }: any) => ({
  ...theme.mainLayout,
}));

const StyledRootBox = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100%",
  height: "100%",
  flexDirection: "column",
  backgroundColor: theme.palette.mode === "dark" ? "#2B3748" : "#F0F1F7",
}));

const StyledHeader = styled(Box)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 16px",
  borderBottom: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
}));

const StyledBody = styled(Box)({
  display: "flex",
  width: "100%",
  backgroundColor: "inherit",
  height: "100%",
  overflowY: "auto",
  overflowX: "hidden",
});

const DashboardMainPage: React.FC<DashboardMainPageProps> = ({
  dashboards,
  loading,
  selectedDashboard,
  onSelectDashboard,
  openDashboardModal,
  setOpenDashboardModal,
  deleteDashboard,
  onEditDashboard,
  onSaveDashboard,
  deleteModal,
  setDeleteModal,
  activeTab,
  setActiveTab,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { config }: { config: ConfigType } = useConfig();
  const hasDashboardManagerPermission = config?.permissions?.includes(
    PERMISSIONS.DASHBOARD_MANAGER
  );

  return (
    <StyledMainLayout data-testid={"dashboard-container"}>
      {loading ? (
        "Skeleton"
      ) : (
        <StyledRootBox>
          <StyledHeader data-testid={"header"}>
            <DashboardTabPanel
              dashboards={dashboards}
              onSelectDashboard={onSelectDashboard}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <Box
              sx={{ display: hasDashboardManagerPermission ? "flex" : "none" }}
            >
              <GhostBtn
                fontSize={12}
                style={{ marginRight: "10px", maxWidth: "150px" }}
                onClick={() => history.push(`/dashboard/dashletlist`)}
                endIcon={<SettingsRoundedIcon />}
                data-testid={"dashlet-list-button"}
              >
                {t("dashletList")}
              </GhostBtn>
              {dashboards.length !== 0 && (
                <>
                  <GhostBtn
                    fontSize={12}
                    style={{ marginRight: "10px", maxWidth: "200px" }}
                    onClick={() => setDeleteModal(true)}
                    startIcon={<DeleteIcon />}
                    data-testid={"remove-button"}
                  >
                    {t("removeDashboard")}
                  </GhostBtn>
                  <GhostBtn
                    fontSize={12}
                    style={{ marginRight: "10px", maxWidth: "150px" }}
                    onClick={() =>
                      setOpenDashboardModal({ open: true, editMode: true })
                    }
                    startIcon={<EditIcon />}
                    data-testid={"edit-button"}
                  >
                    {t("edit")}
                  </GhostBtn>
                </>
              )}
              <PrimaryBtn
                style={{
                  maxWidth: "150px",
                }}
                endIcon={<AddIcon />}
                onClick={() =>
                  setOpenDashboardModal({ open: true, editMode: false })
                }
                data-testid={"create-button"}
              >
                {t("addNew")}
              </PrimaryBtn>
            </Box>
          </StyledHeader>
          <StyledBody>
            <DashboardBody selectedDashboard={selectedDashboard} />
          </StyledBody>
        </StyledRootBox>
      )}
      {openDashboardModal.open && (
        <CreateDashboardModal
          open={openDashboardModal.open}
          setOpen={setOpenDashboardModal}
          editMode={openDashboardModal.editMode}
          onEditDashboard={onEditDashboard}
          onSaveDashboard={onSaveDashboard}
          selectedDashboard={selectedDashboard}
        />
      )}
      {deleteModal && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("menu_dashboard")}
          isDeleteModalOpen={deleteModal}
          setIsDeleteModalOpen={setDeleteModal}
          onDelete={deleteDashboard}
        />
      )}
    </StyledMainLayout>
  );
};

export default DashboardMainPage;
