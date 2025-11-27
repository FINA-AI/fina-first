import { Box, Grid } from "@mui/material";
import GhostBtn from "../../../../../common/Button/GhostBtn";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import GridTable from "../../../../../common/Grid/GridTable";
import Paging from "../../../../../common/Paging/Paging";
import { useHistory } from "react-router-dom";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForm from "../../../../../common/Delete/DeleteForm";
import ActionBtn from "../../../../../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import TableCustomizationButton from "../../../../../common/Button/TableCustomizationButton";
import { FI_LEGAL_PERSON_HISTORY_TABLE_KEY } from "../../../../../../api/TableCustomizationKeys";
import useConfig from "../../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../../api/permissions";
import { styled } from "@mui/material/styles";
import { GridColumnType } from "../../../../../../types/common.type";
import { LegalPersonDataType } from "../../../../../../types/legalPerson.type";

const StyledHeaderGrid = styled(Grid)(({ theme }: any) => ({
  padding: theme.toolbar.padding,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
}));

const StyledFooterRoot = styled(Box)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "default" }),
}));

const StyledSecondaryToolbar = styled(Box)({
  width: "530px",
  background: "#157AFF",
  borderRadius: "10px 10px 0px 10px",
  display: "flex",
  justifyContent: "end",
  alignItems: "center",
  paddingTop: "12px",
  paddingBottom: "12px",
  paddingRight: "20px",
});

const StyledDivider = styled(Box)({
  minHeight: "30px",
  minWidth: "2px",
  display: "inline-block",
  background: "#FFFFFF",
  marginLeft: "20px",
  border: "1px solid red",
});

interface FILegalPersonMainPageProps {
  columns: GridColumnType[];
  pagingPage: number;
  pagingLimit: number;
  legalPersonsLength: number;
  onPagingLimitChange: (limit: number) => void;
  setPagingPage: (page: number) => void;
  legalPersons: LegalPersonDataType[];
  tabName: string;
  tableLoading: boolean;
  rowEdit: (row: LegalPersonDataType) => void;
  setLegalPersons: (rows: LegalPersonDataType[]) => void;
  setOriginalSelectedPerson: (person: LegalPersonDataType | undefined) => void;
  deleteMultiLegalPerson: (rows: LegalPersonDataType[]) => void;
  selectedRows: LegalPersonDataType[];
  setSelectedRows: (rows: LegalPersonDataType[]) => void;
  setColumns: (columns: GridColumnType[]) => void;
  fiId: number;
}

const FILegalPersonMainPage: React.FC<FILegalPersonMainPageProps> = ({
  columns,
  pagingPage,
  pagingLimit,
  legalPersonsLength,
  onPagingLimitChange,
  setPagingPage,
  legalPersons,
  tabName,
  tableLoading,
  rowEdit,
  setLegalPersons,
  setOriginalSelectedPerson,
  deleteMultiLegalPerson,
  selectedRows,
  setSelectedRows,
  setColumns,
  fiId,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { hasPermission } = useConfig();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<LegalPersonDataType | null>(
    null
  );
  const [isMultiDelete, setIsMultiDelete] = useState(false);

  const rowOnClick = (row: LegalPersonDataType) => {
    if (row) {
      setOriginalSelectedPerson(row);
      history.push(`/fi/${fiId}/${tabName}/${row.id}`);
    }
  };

  let actionButtons = (row: LegalPersonDataType, index: number) => {
    return (
      <>
        {hasPermission(PERMISSIONS.FI_AMEND) && (
          <ActionBtn
            onClick={() => rowEdit(row)}
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
    <Box display={"flex"} flexDirection={"column"} height={"100%"}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
        >
          <Box />
          {selectedRows.length < 2 ? (
            <>
              <StyledHeaderGrid>
                <span>
                  <TableCustomizationButton
                    columns={columns}
                    setColumns={setColumns}
                    hasColumnFreeze={true}
                    tableKey={FI_LEGAL_PERSON_HISTORY_TABLE_KEY}
                  />
                </span>
              </StyledHeaderGrid>
            </>
          ) : (
            <StyledSecondaryToolbar>
              <span>
                <TableCustomizationButton
                  columns={columns}
                  setColumns={setColumns}
                  hasColumnFreeze={true}
                  tableKey={FI_LEGAL_PERSON_HISTORY_TABLE_KEY}
                />
              </span>
              <FiberManualRecordIcon
                sx={{
                  color: "#FFFFFF",
                  marginLeft: "20px",
                  width: "15px",
                  height: "10px",
                }}
              />
              <span style={{ color: "#FFFFFF" }}>
                {t("selectedItemsFi", { itemsLength: selectedRows.length })}
              </span>
              <GhostBtn
                onClick={() => {
                  setIsMultiDelete(true);
                  setDeleteModalOpen(true);
                }}
                height={32}
                style={{ marginLeft: "15px" }}
                endIcon={<DeleteIcon />}
              >
                {t("delete")}
              </GhostBtn>
              <StyledDivider />
              <span
                style={{
                  cursor: "pointer",
                  marginLeft: "20px",
                  color: "#FFFFFF",
                }}
                onClick={() => setSelectedRows([])}
              >
                {t("cancel")}
              </span>
            </StyledSecondaryToolbar>
          )}
        </Box>
      </Box>
      <Box sx={{ height: "100%", overflow: "auto" }}>
        <GridTable
          rows={legalPersons}
          setRows={setLegalPersons}
          columns={columns}
          selectedRows={selectedRows}
          loading={tableLoading}
          rowOnClick={rowOnClick}
          checkboxEnabled={true}
          actionButtons={actionButtons}
        />
      </Box>
      <StyledFooterRoot>
        <Grid
          sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}
        >
          <Paging
            onRowsPerPageChange={(number) => onPagingLimitChange(number)}
            onPageChange={(number) => setPagingPage(number)}
            totalNumOfRows={legalPersonsLength}
            initialPage={pagingPage}
            initialRowsPerPage={pagingLimit}
          />
        </Grid>
      </StyledFooterRoot>
      {deleteModalOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("legalPerson")}
          isDeleteModalOpen={deleteModalOpen}
          setIsDeleteModalOpen={setDeleteModalOpen}
          onDelete={() => {
            isMultiDelete
              ? deleteMultiLegalPerson(selectedRows)
              : deleteMultiLegalPerson(selectedRow ? [selectedRow] : []);
            setIsMultiDelete(false);
            setDeleteModalOpen(false);
          }}
        />
      )}
    </Box>
  );
};

export default FILegalPersonMainPage;
