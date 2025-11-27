import React from "react";
import { Box, Chip } from "@mui/material";
import Tooltip from "../Tooltip/Tooltip";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

interface StyledChipProps {
  label: string;
  tooltipTextArray?: string[];
}

const StyledMUiChip = styled(Chip)(({ theme }) => ({
  boxSizing: "border-box",
  backgroundColor: theme.palette.mode === "dark" ? "#344258" : "#FFFFFF",
  borderRadius: 36,
  border: `1px solid ${theme.palette.mode === "dark" ? "inherit" : "#D0D0D0"}`,
  padding: "3px",
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#687A9E",
  height: "32px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "130px",
}));

const StyledChip: React.FC<StyledChipProps> = ({
  label,
  tooltipTextArray = [],
}) => {
  const { t } = useTranslation();

  const getChip = () => {
    return <StyledMUiChip label={label} />;
  };
  const getTooltipContent = () => {
    const listItems = tooltipTextArray.map((value, index) => (
      <li
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        key={index}
      >
        {t(value)}
      </li>
    ));
    return (
      <Box
        sx={{
          padding: "10px",
          maxWidth: "150px",
        }}
      >
        {listItems}
      </Box>
    );
  };

  if (tooltipTextArray && tooltipTextArray.length > 0) {
    return (
      <Tooltip title={getTooltipContent()} sx={{ maxWidth: "150px" }}>
        {getChip()}
      </Tooltip>
    );
  }

  return getChip();
};

export default StyledChip;
