import { Box, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import React from "react";
import { styled } from "@mui/material/styles";

const getStatusColor = (val: string) => {
  switch (val) {
    case "IN_PROGRESS":
    case "APPEALED":
    case "IMPOSED":
      return "red";
    case "DONE":
    case "FULFILLED":
      return "green";
    case "PLANNED":
    case "ANNULLED":
      return "blue";
  }
};

interface CustomEmsHistoryStatusCellProps {
  val: string;
}

const StyledStatusBox = styled(Box)({
  display: "flex",
  justifyContent: "start",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
});

const StyledStatusText = styled(Typography)<{ val: string }>(({ val }) => ({
  maxWidth: 220,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: getStatusColor(val),
  fontWeight: 600,
}));

const CustomEmsHistoryStatusCell: React.FC<CustomEmsHistoryStatusCellProps> = ({
  val,
}: CustomEmsHistoryStatusCellProps) => {
  const { t } = useTranslation();
  return (
    <Tooltip title={t(val)}>
      <StyledStatusBox>
        <StyledStatusText fontSize={12} val={val}>
          {t(val)}
        </StyledStatusText>
      </StyledStatusBox>
    </Tooltip>
  );
};
export default CustomEmsHistoryStatusCell;
