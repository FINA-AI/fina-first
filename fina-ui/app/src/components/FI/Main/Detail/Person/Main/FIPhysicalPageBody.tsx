import { useHistory } from "react-router-dom";
import GridTable from "../../../../../common/Grid/GridTable";
import React, { useState } from "react";
import DeleteForm from "../../../../../common/Delete/DeleteForm";
import { useTranslation } from "react-i18next";
import ActionBtn from "../../../../../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useConfig from "../../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../../api/permissions";
import { GridColumnType } from "../../../../../../types/common.type";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";

interface FIPhysicalPageBodyProps {
  columns: GridColumnType[];
  persons: PhysicalPersonDataType[];
  setPersons: React.Dispatch<React.SetStateAction<PhysicalPersonDataType[]>>;
  loading: boolean;
  tabName: string;
  rowEdit: (row: PhysicalPersonDataType) => void;
  rowDelete: (row: PhysicalPersonDataType) => void;
  selectedRows: PhysicalPersonDataType[];
  setSelectedRows?: React.Dispatch<
    React.SetStateAction<PhysicalPersonDataType[]>
  >;
  fiId: number;
}

const FIPhysicalPageBody: React.FC<FIPhysicalPageBodyProps> = ({
  columns,
  persons,
  setPersons,
  loading,
  tabName,
  rowEdit,
  rowDelete,
  selectedRows,
  fiId,
}) => {
  const history = useHistory();
  const { hasPermission } = useConfig();
  const { t } = useTranslation();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PhysicalPersonDataType | null>(
    null
  );

  const rowOnClick = (event: PhysicalPersonDataType) => {
    history.push(`/fi/${fiId}/${tabName}/` + event.fiPersonId);
  };

  let actionButtons = (row: PhysicalPersonDataType, index: number) => {
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
    <div
      style={{
        height: "100%",
        overflow: "auto",
      }}
    >
      <GridTable
        rows={persons}
        setRows={setPersons}
        columns={columns}
        selectedRows={selectedRows}
        loading={loading}
        rowOnClick={rowOnClick}
        checkboxEnabled={true}
        actionButtons={actionButtons}
      />
      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={t("physicalperson")}
        isDeleteModalOpen={isDeleteConfirmOpen}
        setIsDeleteModalOpen={setIsDeleteConfirmOpen}
        onDelete={() => {
          if (!selectedRow) return;
          rowDelete(selectedRow);
          setIsDeleteConfirmOpen(false);
        }}
        showConfirm={false}
      />
    </div>
  );
};

export default FIPhysicalPageBody;
