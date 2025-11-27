import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import GhostBtn from "../common/Button/GhostBtn";
import PrimaryBtn from "../../components/common/Button/PrimaryBtn";
import SearchField from "../common/Field/SearchField";
import CatalogCreateWizard from "./Create/CatalogCreateWizard";
import CatalogExcelFileUpload from "./Upload/CatalogExcelFileUpload";
import { Box } from "@mui/system";
import { PERMISSIONS } from "../../api/permissions";
import useConfig from "../../hoc/config/useConfig";
import { Grid } from "@mui/material";
import TableCustomizationButton from "../common/Button/TableCustomizationButton";
import { CATALOG_TABLE_KEY } from "../../api/TableCustomizationKeys";
import { styled } from "@mui/material/styles";
import { GridColumnType } from "../../types/common.type";
import {
  CatalogCreateGeneral,
  CatalogCreateMeta,
  CatalogCreateStructureRow,
} from "../../types/catalog.type";

interface CatalogToolbarProps {
  columns: GridColumnType[];
  catalogImportStage: string;
  catalogImportWarnings: any;
  onImportCatalogClose: VoidFunction;
  isDefault: boolean;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  onFilterClick(searchValue: string): void;
  onImportCatalog(formData: FormData, file: any): void;
  createCatalog(
    generalInfo: CatalogCreateGeneral,
    metaInfo: CatalogCreateMeta,
    rows: CatalogCreateStructureRow[],
    successCallback: VoidFunction,
    errorCallback: (error: any) => void
  ): void;
}

const StyledRoot = styled(Grid)(({ theme }: any) => ({
  ...theme.pageToolbar,
  justifyContent: "space-between",
}));

const CatalogToolbar: React.FC<CatalogToolbarProps> = ({
  columns,
  createCatalog,
  catalogImportStage,
  catalogImportWarnings,
  onImportCatalog,
  onImportCatalogClose,
  onFilterClick,
  isDefault,
  setColumns,
}) => {
  const { t } = useTranslation();
  const [isUploadExcelFileWindowOpen, setIsUploadExcelFileWindowOpen] =
    useState(false);
  const [isCatalogCreateWindowOpen, setIsCatalogCreateWindowOpen] =
    useState(false);
  const { hasPermission } = useConfig();

  return (
    <StyledRoot>
      <Box display={"flex"} alignItems={"center"}>
        <SearchField
          onFilterClick={onFilterClick}
          onClear={() => onFilterClick("")}
          minSearchTextLength={1}
        />
      </Box>
      <Box>
        <span>
          <TableCustomizationButton
            columns={columns}
            setColumns={setColumns}
            hasColumnFreeze={true}
            tableKey={CATALOG_TABLE_KEY}
            isDefault={isDefault}
          />
        </span>
        {hasPermission(PERMISSIONS.CATALOG_IMPORT) && (
          <GhostBtn
            fontSize={12}
            onClick={() => setIsUploadExcelFileWindowOpen(true)}
            style={{ margin: "0 10px" }}
            endIcon={<FileCopyIcon style={{ marginLeft: "3px" }} />}
            data-testid={"upload-excel-button"}
          >
            {t("uploadExcel")}
          </GhostBtn>
        )}
        {hasPermission(PERMISSIONS.CATALOG_AMEND) && (
          <PrimaryBtn
            onClick={() => setIsCatalogCreateWindowOpen(true)}
            fontSize={12}
            endIcon={<AddIcon />}
            data-testid={"create-catalog-button"}
          >
            {t("addNew")}
          </PrimaryBtn>
        )}
      </Box>
      {isUploadExcelFileWindowOpen && (
        <CatalogExcelFileUpload
          isOpen={isUploadExcelFileWindowOpen}
          setIsOpen={setIsUploadExcelFileWindowOpen}
          importStage={catalogImportStage}
          importWarnings={catalogImportWarnings}
          onFileUpload={onImportCatalog}
          handleClose={onImportCatalogClose}
        />
      )}

      {isCatalogCreateWindowOpen && (
        <CatalogCreateWizard
          isOpen={isCatalogCreateWindowOpen}
          setIsOpen={setIsCatalogCreateWindowOpen}
          onSave={createCatalog}
        />
      )}
    </StyledRoot>
  );
};

export default React.memo(CatalogToolbar);
