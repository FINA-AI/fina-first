import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

const StyledContentContainer = styled(Grid)({
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
  paddingBottom: "14px",
});

const StyledText = styled(Typography)({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "24px",
  display: "inline",
});

const FIHeader = () => {
  const { t } = useTranslation();
  return (
    <StyledContentContainer item xs={12}>
      <StyledText>{t("FIMainPageHeaderName")}</StyledText>
    </StyledContentContainer>
  );
};

export default FIHeader;
