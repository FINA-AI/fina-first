import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";
import { useTranslation } from "react-i18next";
import BundlesToolbar from "./BundlesToolbar";
import BundlesMainTable from "./BundlesMainTable";
import {
  columnFilterConfigType,
  FilterType,
  GridColumnType,
} from "../../types/common.type";
import { BundlesDataType } from "../../types/bundles.type";
import { styled } from "@mui/material/styles";

interface BundlesPageProps {
  columns: GridColumnType[];
  bundles: BundlesDataType[];
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  cancelEditHandler: () => void;
  saveHandler: () => void;
  columnFilterConfig: columnFilterConfigType[];
  filterOnChangeFunction: (filterConfig: FilterType[]) => void;
  onPagingLimitChange: (limit: number) => void;
  pagingPage: number;
  pagingLimit: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  setSaveModalOpen: (isOpen: boolean) => void;
  orderRowByHeader: (fieldName: string, direction: string) => void;
  isSaveDisabled: boolean;
  scrollToIndex: number;
}

const StyledMainLayout = styled(Box)(({ theme }: any) => ({
  ...theme.mainLayout,
}));

const StyledContentContainer = styled(Grid)(({ theme }: any) => ({
  ...theme.page,
}));

const StyledTitle = styled(Typography)(({ theme }: any) => ({
  ...theme.pageTitle,
}));

const StyledRoot = styled(Box)(({ theme }: any) => ({
  ...theme.pageContent,
}));

const BundlesPage: React.FC<BundlesPageProps> = ({
  columns,
  bundles,
  editMode,
  setEditMode,
  cancelEditHandler,
  saveHandler,
  columnFilterConfig,
  filterOnChangeFunction,
  onPagingLimitChange,
  pagingPage,
  pagingLimit,
  onPageChange,
  totalRows,
  loading,
  setSaveModalOpen,
  orderRowByHeader,
  isSaveDisabled,
  scrollToIndex,
}) => {
  const { t } = useTranslation();

  return (
    <StyledMainLayout>
      <StyledContentContainer>
        <StyledTitle>{t("bundles")}</StyledTitle>
        <StyledRoot>
          <BundlesToolbar
            editMode={editMode}
            setEditMode={setEditMode}
            cancelEditHandler={cancelEditHandler}
            saveEditHandler={saveHandler}
            setSaveModalOpen={setSaveModalOpen}
            isSaveDisabled={isSaveDisabled}
          />
          <BundlesMainTable
            columns={columns}
            bundles={bundles}
            columnFilterConfig={columnFilterConfig}
            filterOnChangeFunction={filterOnChangeFunction}
            onPagingLimitChange={onPagingLimitChange}
            pagingPage={pagingPage}
            pagingLimit={pagingLimit}
            onPageChange={onPageChange}
            totalRows={totalRows}
            loading={loading}
            orderRowByHeader={orderRowByHeader}
            scrollToIndex={scrollToIndex}
          />
        </StyledRoot>
      </StyledContentContainer>
    </StyledMainLayout>
  );
};

export default BundlesPage;
