import Grid from "@mui/material/Grid";
import { Paper } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForm from "../../common/Delete/DeleteForm";
import PeriodDefinitionModal from "./PeriodDefinitionModal";
import Paging from "../../common/Paging/Paging";
import ActionBtn from "../../common/Button/ActionBtn";
import PeriodsGridContainer from "../../../containers/PeriodDefinition/PeriodsGridContainer";
import ExistingPeriodDefinitionsModal from "./ExistingPeriodDefinitionsModal";
import { PeriodSubmitDataType, PeriodType } from "../../../types/period.type";
import { FilterType } from "../../../types/common.type";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/material/styles";

interface PeriodPageProps {
  rows: PeriodSubmitDataType[];
  loading: boolean;
  onDelete: () => void;
  onDeleteMulti: () => void;
  modalOpen?: boolean;
  setModalOpen: (isOpen: boolean) => void;
  selectedRows: PeriodSubmitDataType[];
  setSelectedRows: React.Dispatch<React.SetStateAction<PeriodSubmitDataType[]>>;
  deleteMultiPeriodsModal?: boolean;
  deleteSinglePeriodModal: {
    isOpen: boolean;
    row: null | PeriodSubmitDataType;
  };
  setDeleteMultiPeriodsModal?: (value: boolean) => void;
  setDeleteSinglePeriodModal: (modal: {
    isOpen: boolean;
    row: null | PeriodSubmitDataType;
  }) => void;
  saveFunction: (val: PeriodSubmitDataType) => void;
  periodTypes: PeriodType[];
  pagingPage: number;
  pagingLimit: number;
  totalResults: number;
  onPagingLimitChange: (limit: number) => void;
  setPagingPage: (page: number) => void;
  setTotalResults: (total: number) => void;
  existingPeriodDefinitions: PeriodSubmitDataType[];
  isExistingPeriodModalOpen?: boolean;
  setExistingPeriodDefinitions: (definitions: PeriodSubmitDataType[]) => void;
  setIsExistingPeriodModalOpen: (isOpen: boolean) => void;
  saveLoading: boolean;
  filterOnChangeFunction: (val: FilterType[]) => void;
  orderRowByHeader: (sortField: string, arrowDirection: string) => void;
}

const StyledRoot = styled(Grid)({
  height: "100%",
  display: "flex",
  justifyContent: "end",
  flexDirection: "row",
  backgroundColor: "red",
  minHeight: "0px",
});

const StyledFooterRoot = styled(Grid)(({ theme }: any) => ({
  height: theme.general.footerHeight,
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  borderTop: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
}));

const StyledFooterGrid = styled(Grid)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  height: theme.general.footerHeight,
}));

const PeriodPage: React.FC<PeriodPageProps> = ({
  rows,
  onDelete,
  onDeleteMulti,
  modalOpen,
  setModalOpen,
  selectedRows,
  setSelectedRows,
  deleteMultiPeriodsModal,
  deleteSinglePeriodModal,
  setDeleteMultiPeriodsModal,
  setDeleteSinglePeriodModal,
  saveFunction,
  periodTypes,
  pagingPage,
  pagingLimit,
  totalResults,
  onPagingLimitChange,
  setPagingPage,
  loading,
  existingPeriodDefinitions,
  isExistingPeriodModalOpen,
  setExistingPeriodDefinitions,
  setIsExistingPeriodModalOpen,
  saveLoading,
  filterOnChangeFunction,
  orderRowByHeader,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  let actionButtons = (row: PeriodSubmitDataType, index: number) => {
    return (
      <>
        {hasPermission(PERMISSIONS.PERIODS_DELETE) && (
          <ActionBtn
            onClick={() =>
              setDeleteSinglePeriodModal({ isOpen: true, row: row })
            }
            children={<DeleteIcon />}
            color={"#FF735A"}
            rowIndex={index}
            buttonName={"delete"}
          />
        )}
      </>
    );
  };

  const handleOnCheckFunc = (selectedPeriodRows: PeriodSubmitDataType[]) => {
    setSelectedRows((prev) => {
      const selectedRowIds = selectedPeriodRows.map((r) => r.id);
      const unSelectedRowIds = rows
        .filter((r) => !selectedRowIds.includes(r.id))
        .map((r) => r.id);

      return [
        ...prev
          .filter((r) => !unSelectedRowIds.includes(r.id))
          .filter((r) => !selectedRowIds.includes(r.id)),
        ...selectedPeriodRows,
      ];
    });
  };

  return (
    <>
      <StyledRoot item xs={12}>
        <Paper sx={{ width: "100%", height: "100%", boxShadow: "none" }}>
          <PeriodsGridContainer
            rows={rows}
            selectedRows={selectedRows}
            onCheckFunc={handleOnCheckFunc}
            actionButtons={actionButtons}
            checkboxEnabled={true}
            parentLoading={loading}
            periodTypes={periodTypes}
            filterOnChangeFunction={filterOnChangeFunction}
            orderRowByHeader={orderRowByHeader}
          />
        </Paper>
      </StyledRoot>

      <StyledFooterRoot>
        <StyledFooterGrid>
          <Paging
            onRowsPerPageChange={(number) => onPagingLimitChange(number)}
            onPageChange={(number) => setPagingPage(number)}
            totalNumOfRows={totalResults}
            initialPage={pagingPage}
            initialRowsPerPage={pagingLimit}
          />
        </StyledFooterGrid>
      </StyledFooterRoot>
      {modalOpen && (
        <PeriodDefinitionModal
          handClose={() => setModalOpen(false)}
          open={modalOpen}
          onSave={saveFunction}
          periodTypes={periodTypes}
          saveLoading={saveLoading}
        />
      )}
      {isExistingPeriodModalOpen && (
        <ExistingPeriodDefinitionsModal
          data={existingPeriodDefinitions}
          setData={setExistingPeriodDefinitions}
          open={isExistingPeriodModalOpen}
          handleClose={() => setIsExistingPeriodModalOpen(false)}
        />
      )}
      {deleteSinglePeriodModal.isOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("period")}
          isDeleteModalOpen={deleteSinglePeriodModal.isOpen}
          setIsDeleteModalOpen={setDeleteSinglePeriodModal}
          onDelete={onDelete}
          showConfirm={false}
        />
      )}
      {deleteMultiPeriodsModal && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("periods")}
          isDeleteModalOpen={deleteMultiPeriodsModal}
          setIsDeleteModalOpen={setDeleteMultiPeriodsModal}
          onDelete={() => onDeleteMulti()}
          showConfirm={false}
        />
      )}
    </>
  );
};

export default PeriodPage;
