import { styled } from "@mui/system";
import { ToggleButton } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { MdtNode } from "../../../types/mdt.type";

interface MDTNodeStatusButtonsPropTypes {
  data: MdtNode;
  setData: (data: MdtNode) => void;
  editMode: boolean;
}

const StyledToggleButton = styled(ToggleButton, {
  shouldForwardProp: (prop: string) => {
    return !prop.startsWith("_");
  },
})<{ _editMode?: boolean }>(({ theme, _editMode }) => ({
  marginRight: 5,
  height: 25,
  width: "fit-content",
  padding: "3px 5px 3px 5px",
  fontSize: 12,
  fontWeight: 500,
  textTransform: "capitalize",
  border: "1px solid #707C93",
  backgroundColor: !_editMode
    ? `${
        theme.palette.mode === "dark"
          ? theme.palette.buttons.secondary.hover
          : theme.palette.buttons.secondary.backgroundColor
      } !important`
    : "",
  cursor: !_editMode ? "default" : "pointer",
  borderRadius: "2px !important",
  "&.Mui-selected": {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
}));

const MDTNodeStatusButtons: React.FC<MDTNodeStatusButtonsPropTypes> = ({
  data,
  setData,
  editMode,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <StyledToggleButton
        value={data.key}
        _editMode={editMode}
        onClick={() => {
          setData({ ...data, key: !data.key });
        }}
        disabled={!editMode}
        selected={data.key}
        data-testid={"key-button"}
      >
        {t("key")}
      </StyledToggleButton>
      <StyledToggleButton
        value={data.required}
        _editMode={editMode}
        onClick={() => {
          setData({ ...data, required: !data.required });
        }}
        disabled={!editMode}
        selected={data.required}
        data-testid={"required-button"}
      >
        {t("required")}
      </StyledToggleButton>
      <StyledToggleButton
        value={data.disabled}
        _editMode={editMode}
        onClick={() => {
          setData({ ...data, disabled: !data.disabled });
        }}
        disabled={!editMode}
        selected={data.disabled}
        data-testid={"disabled-button"}
      >
        {t("disabled")}
      </StyledToggleButton>
    </>
  );
};

export default MDTNodeStatusButtons;
