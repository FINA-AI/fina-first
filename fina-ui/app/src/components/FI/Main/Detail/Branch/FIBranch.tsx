import GridTable from "../../../../common/Grid/GridTable";
import Paging from "../../../../common/Paging/Paging";
import { Box, Skeleton } from "@mui/material";
import PrimaryBtn from "../../../../common/Button/PrimaryBtn";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import Dropdown from "../../../../common/Button/Dropdown";
import React, { Fragment, useState } from "react";
import FiBranchCreateContainer from "../../../../../containers/FI/Main/Branch/FiBranchCreateContainer";
import ClosableModal from "../../../../common/Modal/ClosableModal";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForm from "../../../../common/Delete/DeleteForm";
import ToolbarIcon from "../../../../common/Icons/ToolbarIcon";
import ActionBtn from "../../../../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import FIBranchHistoryContainer from "../../../../../containers/FI/Main/Branch/FIBranchHistoryContainer";
import TableCustomizationButton from "../../../../common/Button/TableCustomizationButton";
import { FI_BRANCH_TABLE_KEY } from "../../../../../api/TableCustomizationKeys";
import NoRecordIndicator from "../../../../common/NoRecordIndicator/NoRecordIndicator";
import SecondaryToolbar from "../../../../common/Toolbar/SecondaryToolbar";
import useConfig from "../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../api/permissions";
import { styled } from "@mui/material/styles";
import {
  columnFilterConfigType,
  GridColumnType,
} from "../../../../../types/common.type";
import { BranchDataType, BranchTypes } from "../../../../../types/fi.type";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  background: theme.palette.paperBackground,
}));

const StyledHeader = styled(Box)(({ theme }: any) => ({
  padding: theme.toolbar.padding,
}));

const StyledFooter = styled(Box)(({ theme }) => ({
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  zIndex: theme.zIndex.drawer - 1,
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  padding: "8px 16px",
}));

const StyledTypesSkeleton = styled(Skeleton)(({ theme }: any) => ({
  width: "200px",
  height: "32px",
  borderRadius: theme.btn.borderRadius,
}));

interface FIBranchProps {
  columns: GridColumnType[];
  columnFilterConfig?: columnFilterConfigType[];
  data: BranchDataType[];
  setData: (data: BranchDataType[]) => void;
  loading: boolean;
  selectedRows: BranchDataType[];
  setSelectedRows: (rows: BranchDataType[]) => void;
  deleteBranchFunction: (row: BranchDataType) => void;
  setRowPerPage: (rowsPerPage: number) => void;
  setActivePage: (page: number) => void;
  totalSize: number;
  pagingPage: number;
  initialRowsPerPage: number;
  branchTypes: BranchTypes[];
  setSelectedType: (type: BranchTypes | null) => void;
  selectedType: BranchTypes | null;
  submitCallback: (
    result: BranchDataType,
    type: BranchTypes,
    isNewRow: boolean,
    isDelete: boolean
  ) => void;
  deleteMultiBranch: () => void;
  filterOnChangeFunction: (filters: columnFilterConfigType[]) => void;
  fiId: number;
  setColumns: (columns: GridColumnType[]) => void;
}

const FIBranch: React.FC<FIBranchProps> = ({
  columns,
  columnFilterConfig,
  data,
  setData,
  loading,
  selectedRows,
  setSelectedRows,
  deleteBranchFunction,
  setRowPerPage,
  setActivePage,
  totalSize,
  pagingPage,
  initialRowsPerPage,
  branchTypes,
  setSelectedType,
  selectedType,
  submitCallback,
  deleteMultiBranch,
  filterOnChangeFunction,
  fiId,
  setColumns,
}) => {
  const { hasPermission } = useConfig();
  const { t } = useTranslation();
  const [modalInfo, setModalInfo] = useState<{
    open: boolean;
    selectedFiBranch: BranchDataType | null;
  }>({ open: false, selectedFiBranch: null });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<BranchDataType | null>(null);
  const [isMultiDelete, setIsMultiDelete] = useState(false);
  const [showHistoryConfig, setShowHistoryConfig] = useState<{
    branchId: number;
  } | null>(null);

  const onCloseHistoryClick = () => {
    setShowHistoryConfig(null);
  };

  let actionButtons = (row: BranchDataType, index: number) => {
    return (
      <>
        <ActionBtn
          onClick={() => setShowHistoryConfig({ branchId: row.id })}
          rowIndex={index}
          children={<RestoreIcon />}
          buttonName={"restore"}
        />
        {hasPermission(PERMISSIONS.FI_AMEND) && (
          <ActionBtn
            onClick={() => {
              setModalInfo({ open: true, selectedFiBranch: row });
            }}
            children={<EditIcon />}
            rowIndex={index}
            buttonName={"edit"}
          />
        )}
        {hasPermission(PERMISSIONS.FI_DELETE) && (
          <ActionBtn
            onClick={() => {
              setSelectedRow(row);
              setDeleteModalOpen(true);
            }}
            children={<DeleteIcon />}
            color={"#FF735A"}
            rowIndex={index}
            buttonName={"delete"}
          />
        )}
      </>
    );
  };

  return (
    <Fragment>
      <StyledRoot>
        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
        >
          <StyledHeader
            style={{ flex: `${selectedRows.length > 1 ? 0.6 : ""}` }}
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            width={"100%"}
            data-testid={"header"}
          >
            {loading ? (
              <StyledTypesSkeleton variant="text" animation={"wave"} />
            ) : (
              <Dropdown
                dropdownData={branchTypes}
                setSelection={(val) => setSelectedType(val as BranchTypes)}
                selectedType={selectedType ?? undefined}
                width={"150px"}
              />
            )}
            {selectedRows.length < 2 && (
              <Box display={"flex"} justifyContent={"center"}>
                <Box display={"flex"} marginRight={"8px"} gap={"8px"}>
                  <ToolbarIcon
                    onClickFunction={() => {
                      setShowHistoryConfig({ branchId: -1 });
                    }}
                    Icon={<RestoreIcon />}
                    data-testid={"history-button"}
                  />
                </Box>
                {selectedType && (
                  <>
                    <span
                      style={{
                        paddingRight: "8px",
                      }}
                    >
                      <TableCustomizationButton
                        columns={columns}
                        setColumns={setColumns}
                        isDefault={false}
                        hasColumnFreeze={true}
                        tableKey={`${FI_BRANCH_TABLE_KEY}${selectedType.code}`}
                      />
                    </span>
                  </>
                )}
                {hasPermission(PERMISSIONS.FI_AMEND) && (
                  <PrimaryBtn
                    onClick={() =>
                      setModalInfo({ open: true, selectedFiBranch: null })
                    }
                    endIcon={<AddIcon />}
                    data-testid={"create-button"}
                  >
                    {t("addNew")}
                  </PrimaryBtn>
                )}
              </Box>
            )}
          </StyledHeader>
          {selectedRows.length > 1 && (
            <SecondaryToolbar
              selectedItemsCount={selectedRows.length}
              onDeleteButtonClick={() => {
                setIsMultiDelete(true);
                setDeleteModalOpen(true);
              }}
              onCancelClick={() => {
                setSelectedRows([]);
              }}
            />
          )}
        </Box>
        <div
          style={{
            height: "100%",
            overflow: "hidden",
          }}
        >
          {columns.length > 0 ? (
            <GridTable
              columns={columns}
              columnFilterConfig={columnFilterConfig}
              rows={data}
              setRows={setData}
              selectedRows={selectedRows}
              onCheckboxClick={(
                currRow: BranchDataType,
                selectedRows: BranchDataType[]
              ) => {
                setSelectedRows(selectedRows);
              }}
              loading={loading}
              actionButtons={actionButtons}
              filterOnChangeFunction={filterOnChangeFunction}
              checkboxEnabled={true}
            />
          ) : (
            <NoRecordIndicator />
          )}
        </div>
        <StyledFooter>
          <Paging
            onRowsPerPageChange={(number) => setRowPerPage(number)}
            onPageChange={(number) => setActivePage(number)}
            totalNumOfRows={totalSize}
            initialPage={pagingPage}
            initialRowsPerPage={initialRowsPerPage}
          />
        </StyledFooter>
      </StyledRoot>

      {modalInfo.open && (
        <ClosableModal
          onClose={() => setModalInfo({ open: false, selectedFiBranch: null })}
          open={modalInfo.open}
          includeHeader={false}
          disableBackdropClick={true}
        >
          <FiBranchCreateContainer
            setOpen={() =>
              setModalInfo({ open: false, selectedFiBranch: null })
            }
            fiId={fiId}
            modalInfo={modalInfo}
            selectedType={
              branchTypes.find(
                (b) => b.key === modalInfo.selectedFiBranch?.fiBranchTypeId
              ) ||
              selectedType ||
              ({} as BranchTypes)
            }
            submitCallback={submitCallback}
          />
        </ClosableModal>
      )}

      {deleteModalOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("branch")}
          isDeleteModalOpen={deleteModalOpen}
          setIsDeleteModalOpen={setDeleteModalOpen}
          onDelete={() => {
            if (isMultiDelete) {
              deleteMultiBranch();
            } else if (selectedRow) {
              deleteBranchFunction(selectedRow);
            }

            setIsMultiDelete(false);
            setDeleteModalOpen(false);
          }}
        />
      )}
      {showHistoryConfig && (
        <FIBranchHistoryContainer
          branchId={showHistoryConfig.branchId}
          onCloseHistoryClick={onCloseHistoryClick}
          columns={columns}
          filterOnChangeFunction={filterOnChangeFunction}
          fiId={fiId}
        />
      )}
    </Fragment>
  );
};

export default FIBranch;
