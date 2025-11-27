import GhostBtn from "./GhostBtn";
import SettingsIcon from "@mui/icons-material/Settings";
import { bindActionCreators } from "redux";
import { openTableCustomization } from "../../../redux/actions/stateActions";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import TableCustomization from "../TableCustomization/TableCustomization";
import React from "react";
import { GridColumnType } from "../../../types/common.type";
import { IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/system";

interface TableCustomizationButtonProps {
  setCustomizationModelOpen: (value: string) => void;
  hideLabel?: boolean;
  showTooltip?: boolean;
  tableKey: string;
  columns?: GridColumnType[];
  setColumns?: (value: any[]) => void;
  isDefault?: boolean;
  hasColumnFreeze?: boolean;
  iconButton?: boolean;
}

const StyledIconBtn = styled(IconButton)(({ theme }: any) => ({
  background: "inherit",
  border: "unset",
  "& svg": {
    color: theme.palette.iconColor,
  },
}));

const TableCustomizationButton: React.FC<TableCustomizationButtonProps> = ({
  setCustomizationModelOpen,
  hideLabel = false,
  showTooltip = false,
  tableKey,
  columns,
  setColumns,
  isDefault = false,
  hasColumnFreeze = false,
  iconButton = false,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {iconButton ? (
        <StyledIconBtn
          data-testid={"table-customization-btn"}
          onClick={() => setCustomizationModelOpen(tableKey)}
          size="large"
        >
          <Tooltip title={t("tableCustomizationTitle")}>
            <SettingsIcon color={"secondary"} />
          </Tooltip>
        </StyledIconBtn>
      ) : (
        <GhostBtn
          data-testid={"table-customization-btn"}
          onClick={() => setCustomizationModelOpen(tableKey)}
          tooltipText={showTooltip ? t("tableCustomizationTitle") : ""}
          startIcon={!hideLabel && <SettingsIcon color={"secondary"} />}
        >
          {!hideLabel ? (
            t("tableCustomizationTitle")
          ) : (
            <SettingsIcon color={"secondary"} />
          )}
        </GhostBtn>
      )}

      <TableCustomization
        columns={columns}
        setColumns={setColumns}
        isDefault={isDefault}
        hasColumnFreeze={hasColumnFreeze}
        tableKey={tableKey}
      />
    </>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: any) => ({
  setCustomizationModelOpen: bindActionCreators(
    openTableCustomization,
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableCustomizationButton);
