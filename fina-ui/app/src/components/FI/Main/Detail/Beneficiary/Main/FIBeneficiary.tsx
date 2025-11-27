import React, { Fragment, useState } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import GridTable from "../../../../../common/Grid/GridTable";
import Paging from "../../../../../common/Paging/Paging";
import DeleteForm from "../../../../../common/Delete/DeleteForm";
import ActionBtn from "../../../../../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BeneficiaryHeader from "./BeneficiaryHeader";
import useConfig from "../../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../../api/permissions";

import {
  BeneficiariesDataType,
  BeneficiaryType,
} from "../../../../../../types/fi.type";
import { GridColumnType } from "../../../../../../types/common.type";

const StyledFooter = styled(Box)(({ theme }) => ({
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  zIndex: theme.zIndex.drawer - 1,
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  padding: "8px 16px",
}));

type FIBeneficiaryProps = {
  columns: GridColumnType[];
  data: BeneficiariesDataType[];
  setData: (rows: BeneficiariesDataType[]) => void;
  loading: boolean;
  selectedRows: BeneficiariesDataType[];
  setSelectedRows: (rows: BeneficiariesDataType[]) => void;
  deletebeneficiaryFunction: (row: BeneficiariesDataType) => void;
  setRowPerPage: (rowsPerPage: number) => void;
  setActivePage: (page: number) => void;
  totalSize: number;
  pagingPage: number;
  initialRowsPerPage: number;
  beneficiaryTypes: BeneficiaryType[];
  setSelectedType: (type: BeneficiaryType) => void;
  selectedType: BeneficiaryType | null;
  rowEdit: (row: BeneficiariesDataType) => void;
  addNewItem: () => void;
  rowOnClick: (row: BeneficiariesDataType) => void;
  setColumns: (cols: GridColumnType[]) => void;
};

const FIBeneficiary: React.FC<FIBeneficiaryProps> = ({
  columns,
  data,
  setData,
  loading,
  selectedRows,
  deletebeneficiaryFunction,
  setRowPerPage,
  setActivePage,
  totalSize,
  pagingPage,
  initialRowsPerPage,
  beneficiaryTypes,
  setSelectedType,
  selectedType,
  rowEdit,
  addNewItem,
  rowOnClick,
  setColumns,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<BeneficiariesDataType | null>(
    null
  );

  let actionButtons = (row: BeneficiariesDataType, index: number) => {
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
              setIsDeleteConfirmOpen(true);
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
      <Box display={"flex"} flexDirection={"column"} height={"100%"}>
        <BeneficiaryHeader
          selectedType={selectedType}
          beneficiaryTypes={beneficiaryTypes}
          setSelectedType={setSelectedType}
          addNewItem={addNewItem}
          columns={columns}
          setColumns={setColumns}
        />
        <div
          style={{
            height: `100%`,
            overflow: "auto",
          }}
        >
          <GridTable
            rowOnClick={rowOnClick}
            columns={columns}
            rows={data}
            setRows={setData}
            selectedRows={selectedRows}
            loading={loading}
            actionButtons={actionButtons}
          />
        </div>
        <StyledFooter>
          <Paging
            onRowsPerPageChange={setRowPerPage}
            onPageChange={setActivePage}
            totalNumOfRows={totalSize}
            initialPage={pagingPage}
            initialRowsPerPage={initialRowsPerPage}
          />
        </StyledFooter>
      </Box>

      {isDeleteConfirmOpen && selectedRow && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("beneficiaries")}
          isDeleteModalOpen={isDeleteConfirmOpen}
          setIsDeleteModalOpen={setIsDeleteConfirmOpen}
          onDelete={() => {
            deletebeneficiaryFunction(selectedRow);
            setIsDeleteConfirmOpen(false);
          }}
          showConfirm={false}
        />
      )}
    </Fragment>
  );
};

export default FIBeneficiary;
