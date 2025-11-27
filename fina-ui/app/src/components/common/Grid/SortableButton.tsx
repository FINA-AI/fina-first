import React, { useState } from "react";
import SouthIcon from "@mui/icons-material/South";
import { styled } from "@mui/material/styles";

interface SortableButtonProps {
  orderRowByHeader?: (cellName: string, arrowDirection: string) => void;
  cell: any;
  setActiveSortColName?: (name: string) => void;
  treeGrid?: boolean;
  hasFilter: boolean;
  size: string;
}

const StyledSouthIcon = styled(SouthIcon, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<{ _hasFilter: boolean; size: string }>(({ _hasFilter, size, theme }) => ({
  color: theme.palette.mode === "dark" ? "#ACB7CB" : "#707C93",
  cursor: "pointer",
  display: "flex",
  width: "16px",
  transition: "transform 0.3s ease",
  position: "absolute",
  right: _hasFilter ? 25 : 5,
  top: size === "small" ? "12px" : "15px",
}));

const SortableButton: React.FC<SortableButtonProps> = ({
  orderRowByHeader,
  cell = {},
  setActiveSortColName,
  treeGrid = false,
  hasFilter,
  size,
}: SortableButtonProps) => {
  const [arrowDirection, setArrowDirection] = useState("down");

  const changeRowDirection = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.stopPropagation();
    const newDirection = arrowDirection === "up" ? "down" : "up";
    setArrowDirection(newDirection);
    if (orderRowByHeader)
      orderRowByHeader(treeGrid ? cell.dataIndex : cell.field, newDirection);
    if (setActiveSortColName)
      setActiveSortColName(treeGrid ? cell.dataIndex : cell.field);
  };

  return (
    cell &&
    !cell.hideSort && (
      <>
        {arrowDirection === "down" ? (
          <StyledSouthIcon
            size={size}
            _hasFilter={hasFilter}
            onClick={changeRowDirection}
          />
        ) : (
          <StyledSouthIcon
            size={size}
            _hasFilter={hasFilter}
            onClick={changeRowDirection}
            style={{ transform: `rotate(-180deg)` }}
          />
        )}
      </>
    )
  );
};

export default SortableButton;
