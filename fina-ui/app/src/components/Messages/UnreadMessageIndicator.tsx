import { useTranslation } from "react-i18next";
import NewMessageDotIndicator from "./NewMessageDotIndicator";
import { Box } from "@mui/system";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { styled } from "@mui/material/styles";

const StyledRoot = styled("div")(({ theme }) => ({
  padding: "3px 8px 4px 8px",
  background: theme.palette.mode === "dark" ? "#3C4D68" : "#EAEBF0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: "2px",
  gap: "4px",
}));

const StyledDot = styled(FiberManualRecordIcon)(({ theme }) => ({
  width: "8px",
  height: "8px",
  color: theme.palette.mode === "dark" ? "#F97066" : "#FF0000",
}));

const StyledText = styled("span")(({ theme }) => ({
  fontWeight: 500,
  fontSize: "10px",
  lineHeight: "10px",
  color: (theme as any).palette.textColor,
}));
const UnreadMessageIndicator = () => {
  const { t } = useTranslation();
  return (
    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
      <div
        style={{
          marginRight: 5,
        }}
      >
        <NewMessageDotIndicator />
      </div>
      <StyledRoot>
        <StyledDot />
        <StyledText>{t("unread")}</StyledText>
      </StyledRoot>
    </Box>
  );
};

export default UnreadMessageIndicator;
