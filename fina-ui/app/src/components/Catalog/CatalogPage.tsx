import React, { useState } from "react";
import CatalogMainTable from "./CatalogTable";
import { Box, Grid } from "@mui/material";
import Paging from "../common/Paging/Paging";
import CatalogMainToolbar from "./CatalogToolbar";
import DeleteForm from "../common/Delete/DeleteForm";
import { useTranslation } from "react-i18next";
import GeneralErrorModal from "../common/Modal/GeneralErrorModal";
import { styled } from "@mui/material/styles";
import {
  Catalog,
  CatalogCreateGeneral,
  CatalogCreateMeta,
  CatalogCreateStructureRow,
} from "../../types/catalog.type";
import { GridColumnType } from "../../types/common.type";
import { Config } from "../../types/config.type";

interface CatalogPageProps {
  catalogs: Catalog[];
  setCatalogs: React.Dispatch<React.SetStateAction<Catalog[]>>;
  setActivePage?: (page: number) => void;
  setRowPerPage: (page: number) => void;
  catalogLength: number;
  getCatalog: (catalog: Catalog) => void;
  columns: GridColumnType[];
  catalogImportStage: string;
  catalogImportWarnings: any;
  onImportCatalogClose: VoidFunction;
  pagingPage?: number;
  initialRowsPerPage?: number;
  config?: Config;
  loading: boolean;
  loader: boolean;
  isDefault: boolean;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  error: any;
  setError: any;
  onFilterClick(searchValue: string): void;
  deleteCatalog(row?: Catalog): void;
  onImportCatalog(formData: FormData, file: any): void;
  editCatalog(
    newCatalog: Catalog,
    successCallback: VoidFunction,
    errorCallback: (error: any) => void
  ): void;
  createCatalog(
    generalInfo: CatalogCreateGeneral,
    metaInfo: CatalogCreateMeta,
    rows: CatalogCreateStructureRow[],
    successCallback: VoidFunction,
    errorCallback: (error: any) => void
  ): void;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  ...theme.pageContent,
}));

const StyledGridContainer = styled(Grid)({
  paddingTop: 0,
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

const StyledGridContent = styled(Grid)({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
});

const StyledPagesContainer = styled(Grid)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "default" }),
}));

const CatalogPage: React.FC<CatalogPageProps> = ({
  catalogs,
  setCatalogs,
  setActivePage,
  setRowPerPage,
  catalogLength,
  createCatalog,
  editCatalog,
  getCatalog,
  columns,
  catalogImportStage,
  catalogImportWarnings,
  onImportCatalog,
  onImportCatalogClose,
  deleteCatalog,
  pagingPage,
  config,
  initialRowsPerPage,
  onFilterClick,
  loading,
  loader,
  isDefault,
  setColumns,
  error,
  setError,
}) => {
  const { t } = useTranslation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState();
  const deleteCatalogFunction = () => {
    deleteCatalog(activeRow);
    setIsDeleteModalOpen(false);
  };
  const content = [
    { title: "catalogdependantnodecodes", value: error?.dependantNodes },
    { title: "cataloghascomparisons", value: error?.comparisons },
  ];
  return (
    <StyledRoot>
      <CatalogMainToolbar
        columns={columns}
        createCatalog={createCatalog}
        catalogImportStage={catalogImportStage}
        catalogImportWarnings={catalogImportWarnings}
        onImportCatalog={onImportCatalog}
        onImportCatalogClose={onImportCatalogClose}
        onFilterClick={onFilterClick}
        isDefault={isDefault}
        setColumns={setColumns}
      />
      <StyledGridContainer overflow={"hidden"}>
        <StyledGridContent flex={1}>
          <CatalogMainTable
            catalogs={catalogs}
            setCatalogs={setCatalogs}
            editCatalog={editCatalog}
            getCatalog={getCatalog}
            columns={columns}
            setActiveRow={setActiveRow}
            openDeleteModal={() => setIsDeleteModalOpen(true)}
            config={config}
            loading={loader}
            skeletonLoading={loading}
          />
          <DeleteForm
            headerText={t("delete")}
            bodyText={t("deleteWarning")}
            additionalBodyText={t("catalog")}
            isDeleteModalOpen={isDeleteModalOpen}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            onDelete={deleteCatalogFunction}
          />
        </StyledGridContent>
        <StyledPagesContainer>
          <Paging
            onRowsPerPageChange={(number) => setRowPerPage(number)}
            onPageChange={(number) => setActivePage?.(number)}
            totalNumOfRows={catalogLength}
            initialPage={pagingPage}
            initialRowsPerPage={initialRowsPerPage}
          />
        </StyledPagesContainer>
      </StyledGridContainer>

      {error.open && (
        <GeneralErrorModal
          errorData={error}
          setErrorData={setError}
          content={content}
          config={config}
        />
      )}
    </StyledRoot>
  );
};

export default React.memo(CatalogPage);
