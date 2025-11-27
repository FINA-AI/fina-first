import { useHistory } from "react-router-dom";
import GridTable from "../../../../../common/Grid/GridTable";
import { Box } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DeleteForm from "../../../../../common/Delete/DeleteForm";
import ActionBtn from "../../../../../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useConfig from "../../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../../api/permissions";
import { GridColumnType } from "../../../../../../types/common.type";
import {
  FiManagementType,
  ManagementDataType,
} from "../../../../../../types/fi.type";

interface FIManagementPageBodyProps {
  fiId: number;
  columns: GridColumnType[];
  managements: ManagementDataType[];
  setManagements: React.Dispatch<React.SetStateAction<ManagementDataType[]>>;
  loading: boolean;
  tabName: string;
  selectedManagementType?: FiManagementType;
  deleteManagement: (row: ManagementDataType) => void;
  editManagement: (row: ManagementDataType) => void;
  orderRowByHeader: (cellName: string, arrowDirection: string) => void;
}

const FIManagementPageBody: React.FC<FIManagementPageBodyProps> = ({
  fiId,
  columns,
  managements,
  setManagements,
  loading,
  tabName,
  selectedManagementType,
  deleteManagement,
  editManagement,
  orderRowByHeader,
}) => {
  const history = useHistory();
  const { hasPermission } = useConfig();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ManagementDataType>(
    {} as ManagementDataType
  );
  const { t } = useTranslation();

  const rowOnClick = (event: ManagementDataType) => {
    if (selectedManagementType) {
      history.push(
        `/fi/${fiId}/${tabName}/${selectedManagementType.id}/` + event.id
      );
    }
  };

  let actionButtons = (row: ManagementDataType, index: number) => {
    return (
      <>
        {hasPermission(PERMISSIONS.FI_AMEND) && (
          <ActionBtn
            onClick={() => editManagement(row)}
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
    <Box height={"100%"}>
      <GridTable
        rows={managements}
        setRows={setManagements}
        columns={columns}
        selectedRows={[]}
        loading={loading}
        rowOnClick={rowOnClick}
        actionButtons={actionButtons}
        orderRowByHeader={orderRowByHeader}
      />
      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={t("management")}
        isDeleteModalOpen={isDeleteConfirmOpen}
        setIsDeleteModalOpen={setIsDeleteConfirmOpen}
        onDelete={() => {
          deleteManagement(selectedRow);
          setIsDeleteConfirmOpen(false);
        }}
        showConfirm={false}
      />
    </Box>
  );
};

export default FIManagementPageBody;
