import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import LegalPersonLinkButton from "../common/Button/LegalPersonLinkButton";
import { styled } from "@mui/material/styles";
import { LegalPersonDataType } from "../../types/legalPerson.type";

const StyledConnectedCompanies = styled(Box)(({ theme }: { theme: any }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#F9F9F9" : "#44556b",
  padding: "8px 0px 8px 10px",
  marginBottom: 5,
  borderRadius: 2,
  border: theme.palette.borderColor,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  overflow: "hidden",
}));

const StyledConnection = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isConnectionShares",
})<{ isConnectionShares: boolean }>(({ isConnectionShares }) => ({
  color: isConnectionShares ? "#2962FF" : "#FD6B0A",
  fontSize: 13,
  fontWeight: 500,
  whiteSpace: "nowrap",
  marginLeft: 5,
}));

interface ConnectedCompaniesInfoProps {
  index?: number | string;
  company: { legalPerson?: LegalPersonDataType; dependencyType: string };
}

const ConnectedCompaniesInfo: React.FC<ConnectedCompaniesInfoProps> = ({
  index,
  company,
}) => (
  <StyledConnectedCompanies key={`company_${index}`}>
    <Box display="flex" alignItems="center">
      <LegalPersonLinkButton id={company.legalPerson?.id as number} />
      <StyledConnection
        isConnectionShares={company.dependencyType === "AFFILIATED"}
      >
        {company.legalPerson?.name}
      </StyledConnection>
      <Typography color="#8695B1" fontSize={12} pl="5px" pt="2px">
        {company.legalPerson?.identificationNumber}
      </Typography>
    </Box>
  </StyledConnectedCompanies>
);

export default ConnectedCompaniesInfo;
