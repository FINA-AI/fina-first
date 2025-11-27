import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { groupsBaseRoute } from "../Groups/Common/GroupRoutes";
import LockIcon from "@mui/icons-material/Lock";
import DownloadIcon from "@mui/icons-material/Download";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { userBaseRoute } from "./Common/UserRoutes";
import TableCustomizationButton from "../../common/Button/TableCustomizationButton";
import { USER_MANAGEMENT_TABLE_KEY } from "../../../api/TableCustomizationKeys";
import UserManagerTranslationModal from "./UserManagerTranslationModal";
import SecondaryToolbar from "../../common/Toolbar/SecondaryToolbar";
import { PERMISSIONS } from "../../../api/permissions";
import useConfig from "../../../hoc/config/useConfig";
import { styled } from "@mui/system";
import { GridColumnType, UIEventType } from "../../../types/common.type";
import { UserType } from "../../../types/user.type";

interface UserManagerMainTabPanelProps {
  tabName: string;
  onDeleteButtonClick: VoidFunction;
  addNewUser: VoidFunction;
  columns?: GridColumnType[];
  setColumns?: (columns: GridColumnType[]) => void;
  onMultiDeleteCancel?: VoidFunction;
  selectedItems?: UserType[];
  usersExportHandler?(event: UIEventType): void;
}

const StyledHeaderBox = styled(Box, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<{ _tabName: string }>(({ theme, _tabName }) => ({
  padding: (theme as any).toolbar.padding,
  borderTopRightRadius: "4px",
  borderTopLeftRadius: "4px",
  borderBottom: _tabName === "groups" ? theme.palette.borderColor : "none",
}));

const StyledHeaderTypography = styled(Typography)<{ _isActive: boolean }>(
  ({ theme, _isActive }) => ({
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "21px",
    textTransform: "capitalize",
    marginRight: "24px",
    cursor: "pointer",
    color: _isActive ? theme.palette.primary.main : "",
    opacity: _isActive ? 1 : "",
    borderBottom: _isActive ? "1px solid" : "",
  })
);

const StyledIconButton = styled(IconButton)(() => ({
  borderRadius: "96px",
  width: "32px",
  height: "32px",
  marginRight: "12px",
  cursor: "pointer",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
}));

const UserManagerMainTabPanel: React.FC<UserManagerMainTabPanelProps> = ({
  tabName = "users",
  onDeleteButtonClick,
  addNewUser,
  usersExportHandler,
  columns,
  setColumns,
  selectedItems = [],
  onMultiDeleteCancel,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const TranslatePermissionsButton = () => {
    const [openTranslationModal, setOpenTranslationModal] = useState(false);

    return (
      <div>
        <StyledIconButton
          onClick={() => setOpenTranslationModal(true)}
          data-testid={"translation-button"}
        >
          <Tooltip title={t("translatepermissions")}>
            <LockIcon sx={(theme: any) => ({ ...theme.smallIcon })} />
          </Tooltip>
        </StyledIconButton>
        {openTranslationModal && (
          <UserManagerTranslationModal
            open={openTranslationModal}
            handleClose={() => setOpenTranslationModal(false)}
          />
        )}
      </div>
    );
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"space-between"}
      data-testid={"main-tab-panel"}
    >
      <StyledHeaderBox
        _tabName={tabName}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        width={"100%"}
        height={"32px"}
      >
        <Box display={"flex"}>
          <StyledHeaderTypography
            _isActive={tabName === "users"}
            onClick={() => history.push(`${userBaseRoute}`)}
            data-testid={"user-tab"}
          >
            {t("user")}
          </StyledHeaderTypography>
          <StyledHeaderTypography
            _isActive={tabName === "groups"}
            onClick={() => history.push(`${groupsBaseRoute}`)}
            data-testid={"group-tab"}
          >
            {t("group")}
          </StyledHeaderTypography>
        </Box>
        {selectedItems.length < 2 && (
          <Box display={"flex"} marginLeft={"20px"} alignItems={"center"}>
            {tabName !== "groups" && <TranslatePermissionsButton />}

            {tabName !== "groups" && (
              <Tooltip title={t("exportusersandpermissions")}>
                <StyledIconButton
                  onClick={usersExportHandler}
                  data-testid={"export-button"}
                >
                  <DownloadIcon sx={(theme: any) => ({ ...theme.smallIcon })} />
                </StyledIconButton>
              </Tooltip>
            )}

            {tabName !== "groups" && (
              <>
                <span
                  style={{
                    paddingRight: "8px",
                  }}
                >
                  <TableCustomizationButton
                    columns={columns}
                    setColumns={setColumns}
                    isDefault={false}
                    hasColumnFreeze={true}
                    tableKey={USER_MANAGEMENT_TABLE_KEY}
                  />
                </span>
              </>
            )}
            {hasPermission(PERMISSIONS.USER_AMEND) && (
              <PrimaryBtn
                height={32}
                onClick={addNewUser}
                endIcon={<AddIcon />}
                data-testid={"create-button"}
              >
                {t("addNew")}
              </PrimaryBtn>
            )}
          </Box>
        )}
      </StyledHeaderBox>
      {selectedItems.length > 1 && (
        <SecondaryToolbar
          selectedItemsCount={selectedItems.length}
          onDeleteButtonClick={onDeleteButtonClick}
          onCancelClick={onMultiDeleteCancel}
        />
      )}
    </Box>
  );
};

export default UserManagerMainTabPanel;
