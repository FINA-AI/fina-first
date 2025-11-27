import { Button, ClickAwayListener, Typography } from "@mui/material";
import React, { MouseEvent, useEffect, useState } from "react";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import Tooltip from "../Tooltip/Tooltip";
import { styled } from "@mui/system";

interface DropdownProps<T> {
  dropdownData: T[];
  setSelection: (val: T) => void;
  selectedType?: T;
  buttonDisplayFieldName?: string;
  width?: string;
}

const StyledButton = styled(Button)<{
  open: boolean;
}>(({ theme, open }) => ({
  display: "flex",
  minWidth: 0,
  boxSizing: "border-box",
  borderRadius: (theme as any).btn.borderRadius,
  height: "32px",
  fontSize: (theme as any).btn.fontSize,
  lineHeight: (theme as any).btn.lineHeight,
  fontWeight: 500,
  padding: "8px 16px",
  "&:hover": {
    background: "none",
  },
  textTransform: "none",
  "& .MuiSvgIcon-root": {
    marginLeft: "2px",
  },
  ...(open && {
    color: "#FFF",
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      background: theme.palette.primary.main,
    },
  }),
}));

const StyledTypography = styled(Typography)(() => ({
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
  lineBreak: "anywhere",
  fontSize: 12,
  fontWeight: 500,
  lineHeight: "16px",
}));

const StyledDropDown = styled("div")(({ theme }: any) => ({
  background: theme.palette.mode === "dark" ? "rgba(52, 66, 88, 1)" : "#2C3644",
  position: "absolute",
  zIndex: theme.zIndex.modal,
  borderRadius: 2,
  padding: "8px 4px",
  minWidth: 150,
  maxHeight: 350,
  border: `1px solid ${theme.palette.mode === "dark" ? "#3C4D68" : "#2C3644"}`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0px 19px 38px 0px rgba(0, 0, 0, 0.30), 0px 15px 12px 0px rgba(0, 0, 0, 0.22)"
      : "0px 2px 10px rgba(0, 0, 0, 0.08)",
  overflowY: "auto",
}));

const StyledDropDownItem = styled("div")<{
  selected: boolean;
}>(({ theme, selected }) => ({
  color: "#FFF",
  padding: "4px",
  fontSize: 11,
  lineHeight: "16px",
  "&:hover": {
    cursor: "pointer",
    backgroundColor:
      theme.palette.mode === "dark" ? "#3c4d68" : "rgba(255, 255, 255, 0.1)",
  },
  ...(selected && {
    color: "#98A7BC",
    ...(theme.palette.mode === "dark" && {
      backgroundColor: "#53B1FD36",
      "&:hover": {
        backgroundColor: "#53B1FD36",
      },
    }),
  }),
}));

const StyledNameWrapper = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  boxSizing: "border-box",
  minWidth: 0,
}));

const StyledAdditionalBtn = styled("span")(({ theme }: any) => ({
  color: theme.palette.primary.main,
  flexShrink: 0,
  marginLeft: 5,
}));

const StyledAdditional = styled("span")<{
  selected: boolean;
}>(({ selected }) => ({
  color: "#FFFFFF",
  ...(selected && {
    color: "#959ba1",
  }),
}));

const Dropdown = <T extends Record<string, any>>({
  dropdownData,
  setSelection,
  selectedType = dropdownData[0],
  buttonDisplayFieldName = "name",
  width,
}: DropdownProps<T>) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<T>(selectedType);
  const [tooltip, setTooltip] = useState(false);
  const onMouseEnterFunction = (event: MouseEvent<HTMLElement>) => {
    setTooltip(
      event.currentTarget.scrollWidth > event.currentTarget.clientWidth
    );
  };

  useEffect(() => {
    if (dropdownData.length > 0 && selectedType === null) {
      selectElement(dropdownData[0]);
    } else {
      setSelected(selectedType);
    }
  }, [dropdownData, selectedType]);

  const close = () => {
    setOpen(false);
  };

  const selectElement = (selectedData: T) => {
    setSelected(selectedData);

    if (setSelection) {
      setSelection(selectedData);
    }
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={handleClickAway}
    >
      <div data-testid={"drop-down"}>
        <Tooltip title={tooltip ? selected?.name : ""} arrow>
          <StyledButton
            open={open}
            color={"primary"}
            variant="outlined"
            onClick={() => {
              setOpen(!open);
            }}
            sx={{
              width: width ? width : "auto",
              justifyContent: "space-between",
            }}
            data-testid={"open-button"}
          >
            <StyledNameWrapper>
              <StyledTypography
                onMouseEnter={(event) => onMouseEnterFunction(event)}
              >
                {selected ? (selected as any)[buttonDisplayFieldName] : ""}
                <StyledAdditionalBtn>
                  {selected?.additional}
                </StyledAdditionalBtn>
              </StyledTypography>
            </StyledNameWrapper>
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </StyledButton>
        </Tooltip>
        {open && (
          <StyledDropDown data-testid={"list"}>
            {dropdownData.map((e, i: number) => (
              <StyledDropDownItem
                selected={Boolean(selected?.key === e.key)}
                key={i}
                onClick={() => {
                  selectElement(e);
                  close();
                }}
                data-testid={"option-" + i}
              >
                {e.name}&#160;
                <StyledAdditional
                  selected={Boolean(selected?.key === e.key)}
                  data-testid={"additional-label"}
                >
                  {e.additional}
                </StyledAdditional>
              </StyledDropDownItem>
            ))}
          </StyledDropDown>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default Dropdown;
