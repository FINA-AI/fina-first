import React, { FC, useCallback, useState } from "react";
import { Box } from "@mui/system";
import Tooltip from "../common/Tooltip/Tooltip";
import SwitchBtn from "../common/Button/SwitchBtn";
import GhostBtn from "../common/Button/GhostBtn";
import SettingsIcon from "@mui/icons-material/Settings";
import TableCustomizationButton from "../common/Button/TableCustomizationButton";
import { SCHEDULE_DEFINITION_TABLE_KEY } from "../../api/TableCustomizationKeys";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { ScheduleType } from "../../types/schedule.type";
import { GridColumnType } from "../../types/common.type";
import SecondaryToolbar from "../common/Toolbar/SecondaryToolbar";
import { Typography } from "@mui/material";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import { styled, useTheme } from "@mui/material/styles";

const StyledToolbar = styled(Box)<{ isMultiSelect: boolean }>(
  ({ theme, isMultiSelect }: { theme: any; isMultiSelect: boolean }) => ({
    padding: isMultiSelect ? "" : theme.toolbar.padding,
    maxHeight: theme.toolbar.height,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
  })
);

const StyledAddNewBtn = styled(Box)({
  "& .MuiSvgIcon-root": {
    paddingLeft: "10px",
  },
});

const StyledAddNewIcon = styled(AddIcon)(({ theme }: any) => ({
  color: theme.palette.mode === "light" ? "#F5F7FA" : "#2D3747",
}));

const StyledAddNewText = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.mode === "light" ? "#F5F7FA" : "#2D3747",
  fonsSize: "12px",
  fontWeight: 500,
  lineLength: "16px",
  whiteSpace: "nowrap",
}));

interface ScheduleToolbarProps {
  viewMode: boolean;
  isMultiSelect: boolean;
  editDueDateDisable: boolean;
  setScheduleDueEditModal: () => void;
  setAddNewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteSelectedRowsModal: React.Dispatch<React.SetStateAction<boolean>>;
  cancelDelete: () => void;
  column: GridColumnType[];
  setColumn: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  filter: any;
  setFilter: React.Dispatch<React.SetStateAction<any>>;
  allSelectedRowsRef: React.MutableRefObject<ScheduleType[]>;
}

const ScheduleToolbar: FC<ScheduleToolbarProps> = ({
  viewMode,
  isMultiSelect,
  setScheduleDueEditModal,
  setAddNewOpen,
  setDeleteSelectedRowsModal,
  cancelDelete,
  column,
  setColumn,
  filter,
  setFilter,
  editDueDateDisable,
  allSelectedRowsRef,
}) => {
  const theme = useTheme();

  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const [loadAllDataSwitchEnabled, setLoadAllDataSwitchEnabled] =
    useState(false);

  const onLoadAllDataSwitchClick = useCallback(() => {
    setFilter({
      ...filter,
      loadAllPeriodData: !loadAllDataSwitchEnabled,
      page: 1,
    });
    setLoadAllDataSwitchEnabled(!loadAllDataSwitchEnabled);
  }, [loadAllDataSwitchEnabled, filter]);

  if (viewMode) {
    return null;
  }

  return (
    <StyledToolbar isMultiSelect={isMultiSelect}>
      {isMultiSelect && <Box width={"100%"} />}
      <Box display={"flex"} justifyContent={"center"}>
        {isMultiSelect && hasPermission(PERMISSIONS.SCHEDULE_DELETE) ? (
          <SecondaryToolbar
            style={{
              padding: (theme as any).toolbar.padding,
              borderTopRightRadius: "4px",
              borderRadius: "4px",
            }}
            selectedItemsCount={allSelectedRowsRef.current.length}
            onDeleteButtonClick={() => setDeleteSelectedRowsModal(true)}
            onCancelClick={() => cancelDelete()}
          />
        ) : (
          <>
            <Box
              display={"flex"}
              marginRight={"8px"}
              gap={"8px"}
              alignItems={"center"}
            >
              <Tooltip title={"Load All Data"}>
                <Box marginRight={"5px"}>
                  <SwitchBtn
                    onClick={() => {
                      onLoadAllDataSwitchClick();
                    }}
                    checked={loadAllDataSwitchEnabled}
                    size={"small"}
                  />
                </Box>
              </Tooltip>
            </Box>
            {hasPermission(PERMISSIONS.SCHEDULE_AMEND) && (
              <Box marginRight={"10px"}>
                <GhostBtn
                  fontSize={12}
                  height={32}
                  onClick={() => setScheduleDueEditModal()}
                  disabled={editDueDateDisable}
                  startIcon={<SettingsIcon />}
                >
                  {t("editDueData")}
                </GhostBtn>
              </Box>
            )}

            <span style={{ paddingRight: "8px" }}>
              <TableCustomizationButton
                columns={column}
                setColumns={setColumn}
                isDefault={false}
                hasColumnFreeze={true}
                tableKey={SCHEDULE_DEFINITION_TABLE_KEY}
              />
            </span>

            {hasPermission(PERMISSIONS.SCHEDULE_AMEND) && (
              <StyledAddNewBtn>
                <PrimaryBtn
                  onClick={() => {
                    setAddNewOpen(true);
                  }}
                  endIcon={<StyledAddNewIcon />}
                >
                  <StyledAddNewText>{t("addNew")}</StyledAddNewText>
                </PrimaryBtn>
              </StyledAddNewBtn>
            )}
          </>
        )}
      </Box>
    </StyledToolbar>
  );
};

export default ScheduleToolbar;
