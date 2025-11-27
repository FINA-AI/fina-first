import { GridColumnType } from "../../../types/common.type";
import React, { useState } from "react";
import { Grid } from "@mui/material";
import GridTable from "../../common/Grid/GridTable";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {
  SubMatrixDataType,
  SubMatrixSaveDataType,
} from "../../../types/matrix.type";
import ActionBtn from "../../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SubMatrixAddModal from "./Modals/SubMatrixAddModal";
import { ReturnDefinitionType } from "../../../types/returnDefinition.type";
import DeleteForm from "../../common/Delete/DeleteForm";
import { styled } from "@mui/material/styles";

export const StyledRoot = styled(Grid)(({ theme }: { theme: any }) => ({
  width: "100%",
  ...theme.pageContent,
}));

export const StyledGridContainer = styled(Grid)({
  height: "100%",
  minHeight: 0,
});

export const StyledHeader = styled(Grid)(({ theme }: { theme: any }) => ({
  ...theme.pageToolbar,
  justifyContent: "flex-end",
}));

interface SubMatrixPageProps {
  columns: GridColumnType[];
  data: SubMatrixDataType[];
  setData: (val: SubMatrixDataType[]) => void;
  loading: boolean;
  returns: ReturnDefinitionType[];
  subMatrixDeleteHandler: (id: number) => void;
  onSaveSubMatrix: (subMatrixData: SubMatrixSaveDataType) => void;
}
const SubMatrixPage: React.FC<SubMatrixPageProps> = ({
  columns,
  data,
  loading,
  returns,
  subMatrixDeleteHandler,
  onSaveSubMatrix,
  setData,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const url = history.location.pathname;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SubMatrixDataType>();

  const onAddModalClose = () => {
    setSelectedRow(undefined);
    setIsAddModalOpen(false);
  };

  let actionButtons = (row: any, index: number) => {
    return (
      <>
        <ActionBtn
          onClick={() => {
            setSelectedRow(row);
            setIsAddModalOpen(true);
          }}
          children={<EditIcon />}
          rowIndex={index}
        />

        <ActionBtn
          onClick={() => {
            setSelectedRow(row);
            setIsDeleteConfirmOpen(true);
          }}
          children={<DeleteIcon />}
          color={"#FF735A"}
          rowIndex={index}
        />
      </>
    );
  };

  return (
    <>
      <StyledRoot>
        <StyledHeader>
          <PrimaryBtn
            onClick={() => {
              setIsAddModalOpen(true);
              setSelectedRow(undefined);
            }}
            endIcon={<AddIcon />}
          >
            <>{t("addNew")}</>
          </PrimaryBtn>
        </StyledHeader>

        <StyledGridContainer>
          <GridTable
            rows={data}
            columns={columns}
            loading={loading}
            rowOnClick={(row: SubMatrixDataType) => {
              history.push(`${url}/${row.id}`);
            }}
            actionButtons={actionButtons}
            virtualized={true}
            setRows={setData}
          />
        </StyledGridContainer>
        {isAddModalOpen && (
          <SubMatrixAddModal
            isAddModalOpen={isAddModalOpen}
            returns={returns}
            onClose={onAddModalClose}
            selectedRow={selectedRow}
            onSaveSubMatrix={onSaveSubMatrix}
          />
        )}
      </StyledRoot>
      {isDeleteConfirmOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("submatrix")}
          isDeleteModalOpen={isDeleteConfirmOpen}
          setIsDeleteModalOpen={setIsDeleteConfirmOpen}
          onDelete={() => {
            if (selectedRow) {
              subMatrixDeleteHandler(selectedRow.id);
              setIsDeleteConfirmOpen(false);
            }
          }}
          showConfirm={false}
        />
      )}
    </>
  );
};

export default SubMatrixPage;
