import { Box } from "@mui/system";
import Grid from "@mui/material/Grid";
import { IconButton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import React, { FC, memo, useMemo, useState } from "react";
import GridTable from "../common/Grid/GridTable";
import DeleteIcon from "@mui/icons-material/Delete";
import ActionBtn from "../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import ScheduleActionModals from "./ScheduleActionModals";
import ScheduleToolbar from "./ScheduleToolbar";
import { GridColumnType } from "../../types/common.type";
import { ScheduleType } from "../../types/schedule.type";
import { FiType } from "../../types/fi.type";
import {
  ReturnDefinitionType,
  ReturnType,
} from "../../types/returnDefinition.type";
import { PeriodType } from "../../types/period.type";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import { styled } from "@mui/material/styles";
import InfinitePaging from "../common/Paging/Infinite/InfinitePaging";
import ClearIcon from "@mui/icons-material/Clear";

const StyledMainLayout = styled(Box)<{
  viewMode: boolean;
}>(({ theme, viewMode }: { theme: any; viewMode: boolean }) => ({
  ...(!viewMode
    ? {
        padding: "16px",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "4px",
        ...theme.mainLayout,
      }
    : {
        display: "flex !important",
        width: "100% !important",
        height: "100% !important",
      }),
}));

const StyledContentContainer = styled(Grid)<{
  viewMode: boolean;
}>(({ theme, viewMode }: { theme: any; viewMode: boolean }) => ({
  backgroundColor: theme.palette.paperBackground,
  borderRadius: "4px",
  height: "100%",
  boxSizing: "border-box",
  paddingBottom: viewMode ? 0 : 150,
}));

const StyledTitleContainer = styled(Grid)({
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
  paddingBottom: "20px",
});

const StyledmMainTitleText = styled(Typography)(({ theme }: any) => ({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "24px",
  color: theme.palette.textColor,
  display: "inline",
}));

const StyledPagingContainer = styled(Box)<{
  viewMode: boolean;
}>(({ theme, viewMode }: { theme: any; viewMode: boolean }) => ({
  position: viewMode ? "absolute" : "relative",
  height: theme.general.footerHeight,
  display: "flex",
  alignItems: "center",
  justifyContent: viewMode ? "space-between" : "end",
  gap: "16px",
  borderBottomLeftRadius: "4px",
  borderBottomRightRadius: "4px",
  marginLeft: viewMode ? "20px" : "",
}));

const StyledSelectedRowsBox = styled(Box)(({ theme }) => ({
  fontWeight: 100,
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.palette.mode === "light" ? "#eaecf0" : "#3c4d68",
  color: "#2D3747",
  padding: "0px 0px 0px 8px",
  borderRadius: "4px",
}));

const StyledSelectedText = styled("span")(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
}));

const StyledDivider = styled("span")(({ theme }) => ({
  width: 1,
  height: "15px",
  backgroundColor: theme.palette.mode === "light" ? "#98A7BC" : "#5D789A",
  marginLeft: "10px",
}));

const StyledClearIconBtn = styled(IconButton)(() => ({
  padding: "0px",
  marginLeft: "4px",
}));

interface SchedulesPageProps {
  column: GridColumnType[];
  setColumn: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  rows: ScheduleType[];
  setRows: React.Dispatch<React.SetStateAction<ScheduleType[]>>;
  selectedRows: ScheduleType[];
  setSelectedRows: React.Dispatch<React.SetStateAction<ScheduleType[]>>;
  deleteSelectedRows: () => void;
  cancelDelete: () => void;
  deleteAllRows: () => void;
  deleteAllModal: boolean;
  setDeleteAllModal: React.Dispatch<React.SetStateAction<boolean>>;
  deleteSelectedRowsModal: boolean;
  setDeleteSelectedRowsModal: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleDeleteErrorModal: boolean;
  setScheduleDeleteErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  deleteRow: (row: ScheduleType) => void;
  viewMode: boolean;
  onScheduleSelectFunction: any;
  onPagingLimitChange: (limit: number) => void;
  onPageChange: (number: number) => void;
  filter: any;
  loading: boolean;
  fis?: FiType[];
  returns: ReturnDefinitionType[];
  loadScheduleData: (filteredData: any) => void;
  onDataUpdateCallBackFunction: any;
  filterOnChangeFunction: any;
  columnFilterConfig: any;
  returnTypes: ReturnType[];
  periodTypes: PeriodType[];
  editDueDateDisable: boolean;
  setFilter: React.Dispatch<React.SetStateAction<any>>;
  dataQuantity: number;
  allSelectedRowsRef: React.MutableRefObject<ScheduleType[]>;
}

const SchedulesPage: FC<SchedulesPageProps> = ({
  column,
  setColumn,
  rows,
  setRows,
  selectedRows,
  setSelectedRows,
  deleteSelectedRows,
  cancelDelete,
  deleteAllRows,
  deleteAllModal,
  setDeleteAllModal,
  deleteSelectedRowsModal,
  setDeleteSelectedRowsModal,
  scheduleDeleteErrorModal,
  setScheduleDeleteErrorModal,
  deleteRow,
  viewMode,
  onScheduleSelectFunction,
  onPagingLimitChange,
  onPageChange,
  filter,
  loading,
  fis,
  returns,
  loadScheduleData,
  onDataUpdateCallBackFunction,
  filterOnChangeFunction,
  columnFilterConfig,
  returnTypes,
  periodTypes,
  editDueDateDisable,
  setFilter,
  dataQuantity,
  allSelectedRowsRef,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const [isAddNewOpen, setAddNewOpen] = useState(false);
  const [deleteSingleRowModal, setDeleteSingleRowModal] = useState<{
    isOpen: boolean;
    row?: ScheduleType;
  }>({
    isOpen: false,
    row: undefined,
  });
  const [scheduleDueEditModal, setScheduleDueEditModal] = useState<{
    isOpen: boolean;
    row?: ScheduleType;
    multi: boolean;
    rows?: ScheduleType[];
  }>({
    isOpen: false,
    multi: false,
  });

  let isMultiSelect = allSelectedRowsRef.current.length > 1;

  let actionButtons = (row: ScheduleType, index: number) => {
    if (viewMode) {
      return "";
    }
    return (
      <>
        {hasPermission(PERMISSIONS.SCHEDULE_AMEND) && (
          <ActionBtn
            onClick={() => {
              setScheduleDueEditModal({
                isOpen: true,
                row: row,
                multi: false,
              });
            }}
            children={<EditIcon />}
            rowIndex={index}
          />
        )}

        {hasPermission(PERMISSIONS.SCHEDULE_DELETE) && (
          <ActionBtn
            onClick={() => setDeleteSingleRowModal({ isOpen: true, row: row })}
            children={<DeleteIcon />}
            color={"#FF735A"}
            rowIndex={index}
          />
        )}
      </>
    );
  };

  const clearAllSelectedRowsRef = () => {
    allSelectedRowsRef.current = [];
    setSelectedRows([]);
    if (viewMode && onScheduleSelectFunction) {
      onScheduleSelectFunction([]);
    }
  };

  const updateAllSelectedRowsRef = (selectedRows: ScheduleType[]) => {
    setRows((prevRows) => {
      const currentSelectedRowsIds = selectedRows.map(
        (row: ScheduleType) => row.id
      );
      const currentRowsIds = prevRows.map((row) => row.id);

      const commonIds = currentSelectedRowsIds.filter((id: number) =>
        currentRowsIds.includes(id)
      );
      const unCommonIds = currentRowsIds.filter(
        (id) => !currentSelectedRowsIds.includes(id)
      );

      let allSelectedRows: ScheduleType[] = allSelectedRowsRef.current;
      const newSelectedRows = prevRows.filter((row) =>
        commonIds.includes(row.id)
      );

      const differenceRows = newSelectedRows.filter(
        (currRow) =>
          !allSelectedRows.some(
            (selRow: ScheduleType) => selRow.id === currRow.id
          )
      );

      allSelectedRows = [...allSelectedRows, ...differenceRows];
      allSelectedRowsRef.current = allSelectedRows.filter(
        (row: any) => !unCommonIds.includes(row.id)
      );
      if (viewMode && onScheduleSelectFunction) {
        onScheduleSelectFunction(allSelectedRowsRef.current);
      }

      return prevRows;
    });
  };

  const memoizedGrid = useMemo(
    () => (
      <Grid item xs={12} height={"100%"}>
        <GridTable
          columns={column}
          rows={rows}
          setRows={setRows}
          selectedRows={selectedRows}
          onCheckboxClick={(row: ScheduleType, data: ScheduleType[]) => {
            updateAllSelectedRowsRef(data);
            setSelectedRows(data);
          }}
          rowOnClick={(selectedRow: ScheduleType) => {
            if (viewMode && onScheduleSelectFunction) {
              onScheduleSelectFunction(selectedRow);
            }
          }}
          filterOnChangeFunction={filterOnChangeFunction}
          checkboxEnabled={true}
          actionButtons={actionButtons}
          loading={loading}
          columnFilterConfig={columnFilterConfig}
          checkboxSelection={true}
        />
        <StyledPagingContainer viewMode={viewMode}>
          <InfinitePaging
            onRowsPerPageChange={(number) => onPagingLimitChange(number)}
            initialPage={filter.page}
            onPageChange={onPageChange}
            dataQuantity={dataQuantity}
          />
          {allSelectedRowsRef.current.length > 0 && viewMode && (
            <StyledSelectedRowsBox>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <StyledSelectedText>{t("selected")}</StyledSelectedText>
                <StyledSelectedText>
                  {allSelectedRowsRef.current.length}
                </StyledSelectedText>
              </Box>
              <StyledDivider />
              <StyledClearIconBtn onClick={clearAllSelectedRowsRef}>
                <ClearIcon />
              </StyledClearIconBtn>
            </StyledSelectedRowsBox>
          )}
        </StyledPagingContainer>
      </Grid>
    ),
    [column, rows, loading, selectedRows, columnFilterConfig]
  );

  return (
    <StyledMainLayout viewMode={viewMode}>
      <Grid
        container
        spacing={0}
        overflow={"hidden"}
        height={"100%"}
        borderRadius={"4px"}
      >
        {!viewMode && (
          <Grid item xs={12}>
            <StyledTitleContainer item xs={12}>
              <StyledmMainTitleText>
                {t("scheduleDefinition")}
              </StyledmMainTitleText>
            </StyledTitleContainer>
          </Grid>
        )}
        <StyledContentContainer item xs={12} viewMode={viewMode}>
          <ScheduleToolbar
            viewMode={viewMode}
            isMultiSelect={isMultiSelect}
            editDueDateDisable={editDueDateDisable}
            setScheduleDueEditModal={() =>
              setScheduleDueEditModal({
                isOpen: true,
                multi: true,
                rows: rows,
              })
            }
            setAddNewOpen={setAddNewOpen}
            setDeleteSelectedRowsModal={setDeleteSelectedRowsModal}
            cancelDelete={cancelDelete}
            column={column}
            setColumn={setColumn}
            filter={filter}
            setFilter={setFilter}
            allSelectedRowsRef={allSelectedRowsRef}
          />
          {memoizedGrid}
        </StyledContentContainer>
      </Grid>
      <ScheduleActionModals
        isAddNewOpen={isAddNewOpen}
        setAddNewOpen={setAddNewOpen}
        loadScheduleData={loadScheduleData}
        fis={fis}
        returns={returns}
        onDataUpdateCallBackFunction={onDataUpdateCallBackFunction}
        returnTypes={returnTypes}
        periodTypes={periodTypes}
        scheduleDeleteErrorModal={scheduleDeleteErrorModal}
        setScheduleDeleteErrorModal={setScheduleDeleteErrorModal}
        deleteSingleRowModal={deleteSingleRowModal}
        setDeleteSingleRowModal={setDeleteSingleRowModal}
        deleteAllRows={deleteAllRows}
        deleteAllModal={deleteAllModal}
        setDeleteAllModal={setDeleteAllModal}
        deleteSelectedRowsModal={deleteSelectedRowsModal}
        setDeleteSelectedRowsModal={setDeleteSelectedRowsModal}
        deleteSelectedRows={deleteSelectedRows}
        scheduleDueEditModal={scheduleDueEditModal}
        deleteRow={deleteRow}
        setScheduleDueEditModal={setScheduleDueEditModal}
        selectedRows={selectedRows}
        filter={filter}
      />
    </StyledMainLayout>
  );
};

export default memo(SchedulesPage);
