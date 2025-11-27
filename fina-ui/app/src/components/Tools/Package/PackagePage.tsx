import { Box } from "@mui/system";
import { Grid, IconButton, Paper } from "@mui/material";
import DeleteForm from "../../common/Delete/DeleteForm";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import GridTable from "../../common/Grid/GridTable";
import ActionBtn from "../../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import PackageSide from "./PackageSide";
import ClosableModal from "../../common/Modal/ClosableModal";
import PackageModal from "./Modal/PackageModal";
import { styled } from "@mui/material/styles";
import {
  columnFilterConfigType,
  FilterType,
  GridColumnType,
} from "../../../types/common.type";
import { OSTPackage } from "../../../types/tools.type";
import { DeleteModal } from "../../../containers/Tools/PackageContainer";
import { FiTypeDataType } from "../../../types/fi.type";
import { ReturnType } from "../../../types/returnDefinition.type";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  ...theme.pageContent,
}));

const StyledGridContainer = styled(Grid)({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
});

const StyledContent = styled(Grid)({
  paddingTop: 0,
  height: "100%",
  width: "100%",
});

const StyledToolbar = styled(Grid)(({ theme }: any) => ({
  ...theme.pageToolbar,
  padding: "9px 16px",
  justifyContent: "flex-end",
}));

const StyledIconBackground = styled(IconButton)(({ theme }: any) => ({
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

interface PackagePageProps {
  columns: GridColumnType[];
  data: OSTPackage[];
  loading: boolean;
  setData: (data: OSTPackage[]) => void;
  rowEditFunction: (row: OSTPackage) => void;
  deleteModal: DeleteModal;
  onDeleteFunction: VoidFunction;
  closeDeleteModal: VoidFunction;
  isEditModalOpen: boolean;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  returnTypes?: ReturnType[];
  fiTypes?: FiTypeDataType[];
  columnFilterConfig: columnFilterConfigType[];
  filterOnChangeFunction: (filterConfig: FilterType[]) => void;

  onPackageSave(item: OSTPackage): void;

  rowDeleteFunction(row: OSTPackage): void;
}

export interface SideMenuType {
  open: boolean;
  row: OSTPackage | null;
}

const PackagePage: React.FC<PackagePageProps> = ({
  columns,
  data,
  loading,
  setData,
  rowEditFunction,
  rowDeleteFunction,
  deleteModal,
  onDeleteFunction,
  closeDeleteModal,
  onPackageSave,
  isEditModalOpen,
  setIsEditModalOpen,
  returnTypes,
  fiTypes,
  columnFilterConfig,
  filterOnChangeFunction,
}) => {
  const { t } = useTranslation();
  const [sideMenu, setSideMenu] = useState<SideMenuType>({
    open: false,
    row: null,
  });
  const [selectedItem, setSelectedItem] = useState<OSTPackage>(
    {} as OSTPackage
  );

  let actionButtons = (row: OSTPackage, index: number) => {
    return (
      <>
        <ActionBtn
          onClick={() => {
            setIsEditModalOpen(true);
            rowEditFunction(row);
            setSelectedItem(row);
          }}
          children={<EditIcon />}
          rowIndex={index}
        />

        <ActionBtn
          onClick={() => rowDeleteFunction(row)}
          children={<DeleteIcon />}
          color={"#FF735A"}
          rowIndex={index}
        />
      </>
    );
  };

  return (
    <StyledRoot>
      <StyledToolbar>
        <StyledIconBackground>
          <RefreshIcon fontSize={"small"} />
        </StyledIconBackground>
        <PrimaryBtn
          onClick={() => {
            setIsEditModalOpen(true);
            setSelectedItem({} as OSTPackage);
          }}
          endIcon={<AddIcon />}
          data-testid={"create-package-button"}
        >
          {t("addNew")}
        </PrimaryBtn>
      </StyledToolbar>
      <StyledGridContainer>
        <StyledContent flex={1}>
          <GridTable
            columns={columns}
            rows={data}
            setRows={setData}
            rowOnClick={(row: OSTPackage, deselect: boolean) => {
              if (deselect) {
                setSideMenu({ open: false, row: null });
              } else {
                setSideMenu({ open: true, row: row });
              }
            }}
            loading={loading}
            actionButtons={actionButtons}
            columnFilterConfig={columnFilterConfig}
            filterOnChangeFunction={filterOnChangeFunction}
          />
          <Paper>
            <PackageSide sideMenu={sideMenu} setSideMenu={setSideMenu} />
          </Paper>
          <DeleteForm
            headerText={t("delete")}
            bodyText={t("deleteWarning")}
            additionalBodyText={t("package")}
            isDeleteModalOpen={deleteModal.isOpen}
            setIsDeleteModalOpen={closeDeleteModal}
            onDelete={onDeleteFunction}
          />
        </StyledContent>
        {isEditModalOpen && (
          <ClosableModal
            onClose={() => setIsEditModalOpen(false)}
            open={isEditModalOpen}
            title={t("package")}
            width={700}
            height={520}
          >
            <PackageModal
              onPackageSave={onPackageSave}
              selectedItem={selectedItem}
              returnTypes={returnTypes}
              fiTypes={fiTypes}
            />
          </ClosableModal>
        )}
      </StyledGridContainer>
    </StyledRoot>
  );
};

export default PackagePage;
