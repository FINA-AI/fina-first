import React, { FC } from "react";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import { DefinitionTableDataType } from "../../../types/matrix.type";
import styled from "@mui/system/styled";

export const StyledHeader = styled(Box)(({ theme }: any) => ({
  boxSizing: "border-box",
  padding: theme.toolbar.padding,
  margin: 0,
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  borderBottom: theme.palette.borderColor,
}));

interface SubMatrixReturnDetailsToolbarProps {
  onSave: () => void;
  addNew: () => void;
  isSaveDisabled: boolean;
  checkedRows: Map<number, DefinitionTableDataType>;
  setDeleteModal: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      row: DefinitionTableDataType;
      index?: number;
      loading: boolean;
    }>
  >;
}

const SubMatrixDefinitionTableToolbar: FC<
  SubMatrixReturnDetailsToolbarProps
> = ({ onSave, addNew, isSaveDisabled, checkedRows, setDeleteModal }) => {
  const { t } = useTranslation();
  const isDeleteDisabled = checkedRows.size;

  return (
    <StyledHeader>
      <PrimaryBtn
        onClick={() =>
          setDeleteModal((prevState) => ({ ...prevState, open: true }))
        }
        style={{ marginRight: 5 }}
        disabled={!isDeleteDisabled}
        endIcon={<DeleteIcon />}
      >
        {t("Delete")}
      </PrimaryBtn>
      <PrimaryBtn
        onClick={() => addNew()}
        style={{ marginRight: 5 }}
        endIcon={<AddIcon />}
      >
        {t("addNew")}
      </PrimaryBtn>
      <PrimaryBtn
        onClick={onSave}
        style={{ marginRight: 5 }}
        disabled={isSaveDisabled}
        endIcon={<DoneIcon />}
      >
        {t("save")}
      </PrimaryBtn>
    </StyledHeader>
  );
};

export default SubMatrixDefinitionTableToolbar;
