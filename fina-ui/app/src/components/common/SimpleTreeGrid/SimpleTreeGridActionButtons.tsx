import { IconButton } from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/material/styles";

interface SimpleTreeGridActionButtonsProps {
  deleteRow: (val: any) => void;
  editRow: (val: any) => void;
  openRow: (val: any) => void;
  row: any;
  actionBtnCfg?: any;
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  margin: 5,
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(43,55,72,0.79)" : "#FFFFFF",
  height: 32,
  width: 32,
  border: "0.5px solid rgba(104, 122, 158, 0.08)",
}));

const commonIconStyles = () => ({
  fontSize: 21,
  cursor: "pointer",
  color: "#7589A5",
});

const StyledOpenInFullIcon = styled(OpenInFullIcon)(() => ({
  ...commonIconStyles(),
}));

const StyledEditIcon = styled(EditIcon)(() => ({
  ...commonIconStyles(),
}));

const StyledDeleteIcon = styled(DeleteIcon)(() => ({
  ...commonIconStyles(),
  color: "#FF735A",
}));

const SimpleTreeGridActionButtons: React.FC<
  SimpleTreeGridActionButtonsProps
> = ({ deleteRow, editRow, openRow, row = {}, actionBtnCfg }) => {
  const { hasPermission } = useConfig();
  const hideDelete =
    row.level > 1 && !hasPermission(PERMISSIONS.FINA_LICTYPE_DELETE);
  const hideEdit =
    row.level > 1 && !hasPermission(PERMISSIONS.FINA_LICTYPE_AMEND);

  return (
    <>
      {openRow && !actionBtnCfg?.hideExpand && (
        <StyledIconButton
          edge="start"
          onClick={(event) => {
            event.stopPropagation();
            openRow(row);
          }}
          data-testid={`rowDeleteFunction-${0}`}
          size="large"
        >
          <StyledOpenInFullIcon />
        </StyledIconButton>
      )}
      {editRow && !actionBtnCfg?.hideEdit && !hideEdit && (
        <StyledIconButton
          edge="start"
          onClick={(event) => {
            event.stopPropagation();
            editRow(row);
          }}
          data-testid={`rowDeleteFunction-${0}`}
          size="large"
        >
          <StyledEditIcon />
        </StyledIconButton>
      )}
      {deleteRow && !actionBtnCfg?.hideDelete && !hideDelete && (
        <StyledIconButton
          edge="start"
          onClick={(event) => {
            event.stopPropagation();
            deleteRow(row);
          }}
          data-testid={`rowDeleteFunction-${0}`}
          size="large"
        >
          <StyledDeleteIcon />
        </StyledIconButton>
      )}
    </>
  );
};

export default SimpleTreeGridActionButtons;
