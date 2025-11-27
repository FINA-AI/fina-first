import { Box } from "@mui/system";
import GhostBtn from "../../../common/Button/GhostBtn";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CachedRoundedIcon from "@mui/icons-material/CachedRounded";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import DeleteForm from "../../../common/Delete/DeleteForm";
import TableCustomizationButton from "../../../common/Button/TableCustomizationButton";
import { EMS_FILE_CONFIGURATION_TABLE_KEY } from "../../../../api/TableCustomizationKeys";
import { GridColumnType } from "../../../../types/common.type";
import useConfig from "../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../api/permissions";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

interface EmsFileConfigurationHeaderProps {
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedElement: { id: number } | null;
  removeEmsConfig: (id: number) => void;
  setSelectedElement: React.Dispatch<React.SetStateAction<null>>;
  getFileConfigs: () => void;
  onDelete: () => void;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  columns: GridColumnType[];
}

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.toolbar.padding,
  borderTopRightRadius: "2px",
  gap: 4,
}));

const EmsFileConfigurationHeader: FC<EmsFileConfigurationHeaderProps> = ({
  setIsAddModalOpen,
  selectedElement,
  removeEmsConfig,
  setSelectedElement,
  getFileConfigs,
  onDelete,
  setColumns,
  columns,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  return (
    <StyledToolbar data-testid={"toolbar"}>
      {hasPermission(PERMISSIONS.EMS_FILE_CONFIGURATION_AMEND) && (
        <>
          <GhostBtn
            onClick={() => {
              setIsAddModalOpen(true);
              setSelectedElement(null);
            }}
            startIcon={<AddRoundedIcon />}
            data-testid={"add-button"}
          >
            {t("add")}
          </GhostBtn>
          <GhostBtn
            onClick={() => {
              setIsAddModalOpen(true);
            }}
            disabled={!selectedElement}
            data-testid={"edit-button"}
          >
            {t("edit")}
          </GhostBtn>
        </>
      )}
      {hasPermission(PERMISSIONS.EMS_FILE_CONFIGURATION_DELETE) && (
        <GhostBtn
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={!selectedElement}
          startIcon={<RemoveRoundedIcon />}
          data-testid={"delete-button"}
        >
          {t("delete")}
        </GhostBtn>
      )}
      <GhostBtn
        onClick={() => {
          getFileConfigs();
        }}
        startIcon={<CachedRoundedIcon />}
        data-testid={"refresh-button"}
      >
        {t("refresh")}
      </GhostBtn>
      {isDeleteModalOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("fileconfiguration")}
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          onDelete={() => {
            if (selectedElement?.id) removeEmsConfig(selectedElement.id);
            setIsDeleteModalOpen(false);
            onDelete();
          }}
        />
      )}
      <TableCustomizationButton
        hideLabel={true}
        showTooltip={true}
        tableKey={EMS_FILE_CONFIGURATION_TABLE_KEY}
        columns={columns}
        setColumns={setColumns}
        isDefault={false}
        hasColumnFreeze={true}
      />
    </StyledToolbar>
  );
};

export default EmsFileConfigurationHeader;
