import GridTable from "../../../../common/Grid/GridTable";
import React, { useState } from "react";
import DeleteForm from "../../../../common/Delete/DeleteForm";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import ConnectionsModal from "../../../Common/ConnectionsModal";
import ActionBtn from "../../../../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getLegalPersonConnections } from "../../../../../api/services/legalPersonService";
import menuLink from "../../../../../api/ui/menuLink";
import { LegalPersonDataType } from "../../../../../types/legalPerson.type";
import {
  columnFilterConfigType,
  FilterType,
  GridColumnType,
} from "../../../../../types/common.type";

interface Props {
  loading: boolean;
  columns: GridColumnType[];
  configLegalPersons: LegalPersonDataType[];
  setConfigLegalPersons: (rows: LegalPersonDataType[]) => void;
  deleteRow: (row: LegalPersonDataType) => void;
  filterOnChangeFunction: (filter: FilterType) => void;
  columnFilterConfig: columnFilterConfigType[];
  orderRowByHeader: (key: string, direction: string) => void;
}

const FIPersonConfigurationPageBody: React.FC<Props> = ({
  loading,
  columns,
  columnFilterConfig,
  configLegalPersons,
  deleteRow,
  filterOnChangeFunction,
  setConfigLegalPersons,
  orderRowByHeader,
}) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<LegalPersonDataType>(
    {} as LegalPersonDataType
  );
  const [connections, setConnections] = useState<LegalPersonDataType[]>();
  const { t } = useTranslation();
  const history = useHistory();

  const rowOnClick = (row: LegalPersonDataType) => {
    history.push(`${menuLink.configuration}/legalperson/${row.id}`);
  };

  const rowEditClick = (row: LegalPersonDataType) => {
    history.push(`${menuLink.configuration}/legalperson/${row.id}?edit=true`);
  };

  const getConnections = (id: number) => {
    getLegalPersonConnections(id).then((resp) => {
      setConnections(resp.data);
      if (!resp.data || resp.data.length === 0) {
        setIsDeleteConfirmOpen(true);
      } else setIsConnectionsModalOpen(true);
    });
  };

  const rowDeleteFunction = (row: LegalPersonDataType) => {
    if (row.id) {
      getConnections(row.id);
      setSelectedRow(row);
    }
  };

  let actionButtons = (row: LegalPersonDataType, index: number) => {
    return (
      <>
        <ActionBtn
          onClick={() => rowEditClick(row)}
          children={<EditIcon />}
          rowIndex={index}
        />

        <ActionBtn
          onClick={() => rowDeleteFunction(row)}
          children={<DeleteIcon />}
          color={"#FF735A"}
          rowIndex={index}
        />
      </>
    );
  };

  return (
    <>
      <GridTable
        rowOnClick={rowOnClick}
        columns={columns}
        columnFilterConfig={columnFilterConfig}
        rows={configLegalPersons}
        setRows={setConfigLegalPersons}
        loading={loading}
        actionButtons={actionButtons}
        filterOnChangeFunction={filterOnChangeFunction}
        orderRowByHeader={orderRowByHeader}
      />
      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={`${selectedRow.name} `}
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
        connections={connections}
      />
    </>
  );
};

export default FIPersonConfigurationPageBody;
