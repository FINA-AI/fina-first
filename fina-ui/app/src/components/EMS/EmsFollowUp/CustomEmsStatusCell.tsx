import { Box, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

const getStatusBackground = (val: string) => {
  switch (val) {
    case "IN_PROGRESS":
      return "yellow";
    case "COMPLETED":
      return "lightGreen";
    case "UNFULFILLED":
      return "red";
    case "PARTIALLY_COMPLETED":
      return "orange";
  }
};

interface CustomEmsStatusCellProps {
  val: string;
}

const StyledStatusBox = styled(Box)<{ val: string }>(({ val }) => ({
  backgroundColor: getStatusBackground(val),
  width: 100,
  display: "flex",
  justifyContent: "center",
  padding: "5px 10px",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  borderRadius: "4px",
}));

const StyledStatusText = styled(Typography)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "black",
  fontWeight: 600,
});

const CustomEmsStatusCell: React.FC<CustomEmsStatusCellProps> = ({
  val,
}: CustomEmsStatusCellProps) => {
  const { t } = useTranslation();
  return (
    <Tooltip title={t(val)}>
      <StyledStatusBox val={val}>
        <StyledStatusText fontSize={12}>{t(val)}</StyledStatusText>
      </StyledStatusBox>
    </Tooltip>
  );
};

export default CustomEmsStatusCell;
