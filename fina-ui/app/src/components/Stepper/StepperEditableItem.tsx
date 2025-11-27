import RemoveIcon from "@mui/icons-material/Remove";
import EditableLabel from "../common/Label/EditableLabel";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import React from "react";

interface SteppedEditableItemProps {
  label: string;
  isSelected: boolean;
  index: number;
  isRemovable: boolean;
  circleLabel: number;
  setLabel(index: number, value: string): void;
  onSelect(index: number): void;
  onRemove(index: number): void;
}

const StyledRootBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: 112,
  height: 74,
  borderRadius: 4,
  "&:hover": {
    background: theme.palette.primary.light,
    cursor: "pointer",
    "& #shapeCircle": {
      background: theme.palette.primary.main,
      color: "#FFFFFF",
    },
    "& #label": {
      color: theme.palette.primary.main,
    },
  },
}));

const StyledShapeBox = styled(Box)(() => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 112,
  height: 30,
}));

const StyledShapeCircleBox = styled(Box)<{ shapeCircleActive: boolean }>(
  ({ shapeCircleActive, theme }) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${theme.palette.secondary.main}`,
    background: shapeCircleActive ? theme.palette.secondary.main : "",
    color: shapeCircleActive ? "#FFFFFF" : theme.palette.primary.main,
    width: 24,
    height: 24,
    borderRadius: "50%",
    fontSize: 12,
    fontWeight: 700,
  })
);

const StyledLabelBox = styled(Box)<{ labelActive: boolean }>(
  ({ labelActive, theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 2,
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 112,
    width: 112,
    height: "100%",
    color: labelActive
      ? theme.palette.mode === "light"
        ? theme.palette.primary.dark
        : "#FFFFFF"
      : theme.palette.primary.main,
  })
);

const StyledHeader = styled(Box)(() => ({
  textAlign: "right",
  maxWidth: 112,
  width: 112,
  height: 12,
}));

const StyledRemoveIcon = styled(RemoveIcon)(({ theme }) => ({
  width: 12,
  paddingRight: 10,
  color: theme.palette.primary.main,
  "&:hover": {
    color: theme.palette.primary.dark,
  },
}));

const SteppedEditableItem: React.FC<SteppedEditableItemProps> = ({
  label,
  setLabel,
  isSelected = false,
  index,
  onSelect,
  onRemove,
  isRemovable,
  circleLabel,
}) => {
  const onStepClick = () => {
    onSelect(index);
  };

  const onStepRemoveClick = () => {
    onRemove(index);
  };

  const onLabelSave = (value: string) => {
    setLabel(index, value);
  };

  return (
    <StyledRootBox data-testid={`step-${index}`}>
      <StyledHeader>
        {isRemovable && <StyledRemoveIcon onClick={onStepRemoveClick} />}
      </StyledHeader>
      <StyledShapeBox onClick={onStepClick}>
        <div>
          <StyledShapeCircleBox
            id={"shapeCircle"}
            shapeCircleActive={isSelected}
          >
            {circleLabel}
          </StyledShapeCircleBox>
        </div>
      </StyledShapeBox>
      <StyledLabelBox id={"label"} labelActive={isSelected}>
        <EditableLabel initialValue={label} save={onLabelSave} />
      </StyledLabelBox>
    </StyledRootBox>
  );
};

export default SteppedEditableItem;
