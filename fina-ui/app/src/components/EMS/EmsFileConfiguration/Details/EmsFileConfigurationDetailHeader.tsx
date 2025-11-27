import { Box } from "@mui/system";
import GhostBtn from "../../../common/Button/GhostBtn";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import DeleteForm from "../../../common/Delete/DeleteForm";
import { EmsFileConfigurationDetailDataType } from "../../../../types/emsFileConfiguration.type";
import TableCustomizationButton from "../../../common/Button/TableCustomizationButton";
import { EMS_FILE_CONFIGURATION_ATTRIBUTES_TABLE_KEY } from "../../../../api/TableCustomizationKeys";
import { GridColumnType } from "../../../../types/common.type";
import useConfig from "../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../api/permissions";

interface EmsFileConfigurationDetailHeaderProps {
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedElement: React.Dispatch<React.SetStateAction<null>>;
  removeAtribute: (id: number) => void;
  selectedElement: EmsFileConfigurationDetailDataType | null;
  selectedFileId?: number;
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

const EmsFileConfigurationDetailHeader: FC<
  EmsFileConfigurationDetailHeaderProps
> = ({
  setIsAddModalOpen,
  setSelectedElement,
  removeAtribute,
  selectedElement,
  selectedFileId,
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
            disabled={!selectedFileId}
            startIcon={<AddRoundedIcon />}
            data-testid={"add-button"}
          >
            {t("add")}
          </GhostBtn>
          <GhostBtn
            disabled={!selectedElement}
            onClick={() => {
              setIsAddModalOpen(true);
            }}
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
      <TableCustomizationButton
        hideLabel={true}
        showTooltip={true}
        columns={columns}
        setColumns={setColumns}
        isDefault={false}
        hasColumnFreeze={true}
        tableKey={EMS_FILE_CONFIGURATION_ATTRIBUTES_TABLE_KEY}
      />
      {isDeleteModalOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          onDelete={() => {
            if (selectedElement?.id) {
              removeAtribute(selectedElement.id);
              setIsDeleteModalOpen(false);
              setSelectedElement(null);
            }
          }}
        />
      )}
    </StyledToolbar>
  );
};

export default EmsFileConfigurationDetailHeader;
