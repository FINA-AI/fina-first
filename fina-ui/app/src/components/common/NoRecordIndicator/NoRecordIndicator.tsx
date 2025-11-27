import { Box, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { EmptyDataIcon } from "../../../api/ui/icons/EmptyDataIcon";

interface NoRecordIndicatorProps {}

const StyledEmptyDataMessage = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));

const StyledEmptyDataContainer = styled(Box)(({ theme }: any) => ({
  display: "flex",
  width: "100%",
  height: "100%",
  margin: "0",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.palette.paperBackground,
}));

const NoRecordIndicator: React.FC<NoRecordIndicatorProps> = () => {
  const { t } = useTranslation();

  return (
    <StyledEmptyDataContainer>
      <StyledEmptyDataMessage>
        <EmptyDataIcon />
        <Typography>{t("noRecordInFile")}</Typography>
      </StyledEmptyDataMessage>
    </StyledEmptyDataContainer>
  );
};

export default NoRecordIndicator;
