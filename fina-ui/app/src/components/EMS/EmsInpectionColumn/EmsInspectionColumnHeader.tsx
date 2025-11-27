import { Box } from "@mui/system";
import GhostBtn from "../../common/Button/GhostBtn";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import CachedRoundedIcon from "@mui/icons-material/CachedRounded";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import DeleteForm from "../../common/Delete/DeleteForm";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import TableCustomizationButton from "../../common/Button/TableCustomizationButton";
import { EMS_INSPECTION_COLUMNS_TABEL_KEY } from "../../../api/TableCustomizationKeys";
import { GridColumnType } from "../../../types/common.type";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";

interface EmsInspectionColumnHeaderProps {
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initData: () => void;
  removeInspectionColumn: (id: number) => void;
  selectedElement?: { id?: number };
  setSelectedElement: React.Dispatch<React.SetStateAction<any>>;
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

const EmsInspectionColumnHeader: FC<EmsInspectionColumnHeaderProps> = ({
  setIsAddModalOpen,
  initData,
  removeInspectionColumn,
  selectedElement,
  setSelectedElement,
  columns,
  setColumns,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  return (
    <StyledToolbar data-testid={"toolbar"}>
      {hasPermission(PERMISSIONS.EMS_INSPECTION_COLUMNS_AMEND) && (
        <>
          <GhostBtn
            onClick={() => {
              setIsAddModalOpen(true);
              setSelectedElement(undefined);
            }}
            startIcon={<AddRoundedIcon />}
            data-testid={"create-button"}
          >
            {t("add")}
          </GhostBtn>
          <GhostBtn
            onClick={() => {
              setIsAddModalOpen(true);
            }}
            disabled={!selectedElement}
            startIcon={<EditRoundedIcon />}
            data-testid={"edit-button"}
          >
            {t("edit")}
          </GhostBtn>
        </>
      )}
      {hasPermission(PERMISSIONS.EMS_INSPECTION_COLUMNS_DELETE) && (
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
          initData();
        }}
        startIcon={<CachedRoundedIcon />}
        data-testid={"refresh-button"}
      >
        {t("refresh")}
      </GhostBtn>
      <TableCustomizationButton
        hideLabel={true}
        showTooltip={true}
        columns={columns}
        setColumns={setColumns}
        isDefault={false}
        hasColumnFreeze={true}
        tableKey={EMS_INSPECTION_COLUMNS_TABEL_KEY}
      />

      {isDeleteModalOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          onDelete={() => {
            if (selectedElement?.id) removeInspectionColumn(selectedElement.id);
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </StyledToolbar>
  );
};

export default EmsInspectionColumnHeader;
