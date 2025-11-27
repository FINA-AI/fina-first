import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

const StyledStatusBox = styled(Box)({
  padding: "4px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
const StyledStatusText = styled(Typography)({
  fontSize: 12,
  lineHeight: "16px",
  fontWeight: 500,
});

const ReturnXMLStatusCell = ({ value }: { value: string }) => {
  const { t } = useTranslation();

  const getStatusBackground = () => {
    switch (value) {
      case "CURRENT":
        return "#E9F5E9";
      case "ARCHIVE":
        return "#F0F4FF";
    }
  };
  const getStatusColor = () => {
    switch (value) {
      case "CURRENT":
        return "#289E20";
      case "ARCHIVE":
        return "#2962FF";
    }
  };

  return (
    <StyledStatusBox bgcolor={getStatusBackground()}>
      <StyledStatusText style={{ color: getStatusColor() }}>
        {t(value)}
      </StyledStatusText>
    </StyledStatusBox>
  );
};

export default ReturnXMLStatusCell;
