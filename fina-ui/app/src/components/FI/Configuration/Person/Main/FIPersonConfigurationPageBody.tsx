import GridTable from "../../../../common/Grid/GridTable";
import React, { useState } from "react";
import DeleteForm from "../../../../common/Delete/DeleteForm";
import { useTranslation } from "react-i18next";
import ConnectionsModal from "../../../Common/ConnectionsModal";
import ActionBtn from "../../../../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfigPhysicalPersonDataType } from "../../../../../types/physicalPerson.type";
import {
  columnFilterConfigType,
  FilterType,
  GridColumnType,
} from "../../../../../types/common.type";

interface Props {
  loading: boolean;
  columns: GridColumnType[];
  rows: ConfigPhysicalPersonDataType[];
  setRows: React.Dispatch<React.SetStateAction<ConfigPhysicalPersonDataType[]>>;
  deleteRow: (row: ConfigPhysicalPersonDataType) => void;
  onPersonRowClick: (row: ConfigPhysicalPersonDataType) => void;
  onPersonRowEditClick: (row: ConfigPhysicalPersonDataType) => void;
  filterOnChangeFunction: (filters: FilterType[]) => void;
  orderRowByHeader: (cellName: string, arrowDirection: string) => void;
  columnFilterConfig: columnFilterConfigType[];
}

const FIPersonConfigurationPageBody: React.FC<Props> = ({
  loading,
  columns,
  rows,
  setRows,
  deleteRow,
  onPersonRowClick,
  onPersonRowEditClick,
  filterOnChangeFunction,
  columnFilterConfig,
  orderRowByHeader,
}) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ConfigPhysicalPersonDataType>(
    {} as ConfigPhysicalPersonDataType
  );
  const { t } = useTranslation();

  const rowDeleteFunction = (row: ConfigPhysicalPersonDataType) => {
    setSelectedRow(row);
    if (!row?.connection || row.connection.length === 0) {
      setIsDeleteConfirmOpen(true);
    } else {
      setIsConnectionsModalOpen(true);
    }
  };

  const actionButtons = (row: ConfigPhysicalPersonDataType, index: number) => {
    return (
      <>
        <ActionBtn onClick={() => onPersonRowEditClick(row)} rowIndex={index}>
          <EditIcon />
        </ActionBtn>

        <ActionBtn
          onClick={() => rowDeleteFunction(row)}
          color="#FF735A"
          rowIndex={index}
        >
          <DeleteIcon />
        </ActionBtn>
      </>
    );
  };

  return (
    <>
      <GridTable
        rowOnClick={(row: ConfigPhysicalPersonDataType) =>
          onPersonRowClick(row)
        }
        columns={columns}
        rows={rows}
        setRows={setRows}
        loading={loading}
        actionButtons={actionButtons}
        filterOnChangeFunction={filterOnChangeFunction}
        columnFilterConfig={columnFilterConfig}
        orderRowByHeader={orderRowByHeader}
      />

      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={selectedRow?.name ?? ""}
        isDeleteModalOpen={isDeleteConfirmOpen}
        setIsDeleteModalOpen={setIsDeleteConfirmOpen}
        onDelete={() => {
          deleteRow(selectedRow);
          setIsDeleteConfirmOpen(false);
        }}
        showConfirm={false}
      />

      <ConnectionsModal
        isConnectionsModalOpen={isConnectionsModalOpen}
        setIsConnectionsModalOpen={setIsConnectionsModalOpen}
        connections={selectedRow?.connection ?? []}
      />
    </>
  );
};

export default FIPersonConfigurationPageBody;
