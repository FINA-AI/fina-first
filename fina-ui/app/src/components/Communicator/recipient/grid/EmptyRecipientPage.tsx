import { Box, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import { styled } from "@mui/material/styles";

interface EmptyRecipientPageProps {
  icon: ReactNode;
  mainText: string;
  additionalText: string;
}

const StyledContainer = styled(Box)({
  display: "flex",
  width: "100%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});

const StyledTitle = styled(Typography)(({ theme }: { theme: any }) => ({
  color: theme.textColor,
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "160%",
  textTransform: "capitalize",
  maxWidth: "300px",
  textAlign: "center",
  marginTop: "20px",
  marginBottom: "10px",
}));

const StyledDescription = styled(Typography)(({ theme }: { theme: any }) => ({
  color: theme.secondaryText,
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "16px",
  textTransform: "capitalize",
  maxWidth: "250px",
  textAlign: "center",
}));

const EmptyRecipientPage: React.FC<EmptyRecipientPageProps> = ({
  icon,
  additionalText,
  mainText,
}) => {
  return (
    <StyledContainer>
      {icon}
      <StyledTitle>{mainText}</StyledTitle>
      <StyledDescription>{additionalText}</StyledDescription>
    </StyledContainer>
  );
};

export default EmptyRecipientPage;
