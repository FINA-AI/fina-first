import Grid from "@mui/material/Grid";
import GridTable from "../../common/Grid/GridTable";
import withLoading from "../../../hoc/withLoading";
import { useHistory } from "react-router-dom";
import { FITabs } from "../fiTabs";
import DeleteForm from "../../common/Delete/DeleteForm";
import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import ActionBtn from "../../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { FiDataType } from "../../../types/fi.type";
import {
  columnFilterConfigType,
  GridColumnType,
} from "../../../types/common.type";

/* eslint-disable react/prop-types */

interface FITableProps {
  columns: GridColumnType[];
  columnFilterConfig?: columnFilterConfigType[];
  rows: FiDataType[];
  setRows: React.Dispatch<React.SetStateAction<FiDataType[]>>;
  selectedRows: FiDataType[];
  setSelectedRows: React.Dispatch<React.SetStateAction<FiDataType[]>>;
  deleteFIFunction: (row: FiDataType) => void;
  FilterOnChangeFunction: (filters: columnFilterConfigType[]) => void;
  skeletonLoading: boolean;
  orderRowByHeader: (
    cellName: keyof FiDataType,
    arrowDirection: string
  ) => void;
}

const FITable: React.FC<FITableProps> = memo(
  ({
    columns,
    columnFilterConfig,
    rows,
    setRows,
    selectedRows,
    setSelectedRows,
    deleteFIFunction,
    FilterOnChangeFunction,
    skeletonLoading,
    orderRowByHeader,
  }) => {
    const history = useHistory();
    const { hasPermission } = useConfig();
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<FiDataType | null>(null);
    const { t } = useTranslation();

    const rowEditFunction = (row: FiDataType) => {
      history.push(`fi/${row.id}/${FITabs.GENERAL}?edit=true`);
    };

    const rowOnClick = (row: FiDataType) => {
      history.push(`fi/${row.id}/${FITabs.GENERAL}`);
    };

    let actionButtons = (row: FiDataType, index: number) => {
      return (
        <>
          {hasPermission(PERMISSIONS.FI_AMEND) && (
            <ActionBtn
              onClick={() => rowEditFunction(row)}
              children={<EditIcon />}
              rowIndex={index}
              buttonName={"edit"}
            />
          )}

          {hasPermission(PERMISSIONS.FI_DELETE) && (
            <ActionBtn
              onClick={() => {
                {
                  setSelectedRow(row);
                  setIsDeleteConfirmOpen(true);
                }
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
      <Grid item xs={12} height="100%">
        <GridTable
          columns={columns}
          columnFilterConfig={columnFilterConfig}
          rows={rows}
          setRows={setRows}
          selectedRows={selectedRows}
          rowOnClick={rowOnClick}
          filterOnChangeFunction={FilterOnChangeFunction}
          loading={skeletonLoading}
          checkboxEnabled={true}
          actionButtons={actionButtons}
          onCheckboxClick={(
            _currRow: FiDataType,
            selectedRows: FiDataType[]
          ) => {
            setSelectedRows(selectedRows);
          }}
          orderRowByHeader={orderRowByHeader}
        />
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("fi")}
          isDeleteModalOpen={isDeleteConfirmOpen}
          setIsDeleteModalOpen={setIsDeleteConfirmOpen}
          onDelete={() => {
            if (selectedRow) {
              deleteFIFunction(selectedRow);
              setIsDeleteConfirmOpen(false);
            }
          }}
          showConfirm={false}
        />
      </Grid>
    );
  }
);

export default withLoading(FITable);
