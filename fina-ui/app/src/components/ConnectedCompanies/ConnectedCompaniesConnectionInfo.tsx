import { Box, Divider, Typography } from "@mui/material";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import React, { useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useTranslation } from "react-i18next";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ConnectedCompaniesSection from "./ConnectedCompaniesSection";
import BusinessAndStrategySection from "./BusinessAndStrategySection";
import { styled } from "@mui/material/styles";
import { ConnectedCompaniesDataType } from "../../types/connectedCompanies.type";
import { BeneficiariesDataType } from "../../types/fi.type";

const StyledContainer = styled(Box)(({ theme }: { theme: any }) => ({
  padding: 12,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  boxSizing: "border-box",
  borderLeft: theme.palette.borderColor,
}));

const StyledArrowIconBox = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  cursor: "pointer",
});

const StyledDivider = styled(Divider)({
  color: "#EAEBF0",
  marginTop: 12,
  marginBottom: 12,
});

const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

const StyledConnectionName = styled(Typography)(
  ({ theme }: { theme: any }) => ({
    color: theme.palette.textColor,
    fontSize: 15,
    fontWeight: 600,
  })
);

const StyledCompanyName = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "connectionType",
})<{
  connectionType: string;
}>(({ connectionType }) => ({
  color:
    connectionType === "AFFILIATED" || connectionType === "BOTH"
      ? "#2962FF"
      : "#FD6B0A",
  fontSize: 15,
  fontWeight: 600,
}));

const StyledConnectionType = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#8695B1" : "#bbc7de",
  fontSize: 13,
  fontWeight: 400,
  marginRight: 5,
}));

const StyledName = styled(Typography)(({ theme }: { theme: any }) => ({
  color: theme.palette.textColor,
  fontSize: 13,
  fontWeight: 400,
  marginLeft: 5,
}));

interface ConnectedCompaniesConnectionInfoProps {
  edge: ConnectedCompaniesDataType;
  setIsEdgeInfoOpen: (open: boolean) => void;
  saveConnectionDetails: (data: ConnectedCompaniesDataType) => void;
}

const ConnectedCompaniesConnectionInfo: React.FC<
  ConnectedCompaniesConnectionInfoProps
> = ({ edge, setIsEdgeInfoOpen, saveConnectionDetails }) => {
  let connectionType = edge.connectionType;
  let hasShares = connectionType === "AFFILIATED" || connectionType === "BOTH";
  const edgeConnection: ConnectedCompaniesDataType = {
    id: edge.id,
    businessActivity: edge.businessActivity,
    connectionType: edge.connectionType,
    destination: edge.destination,
    source: edge.source,
    strategicPlan: edge.strategicPlan,
    legalPerson: edge.legalPerson,
    dependencyType: edge.dependencyType,
    destinationsConnectedCompanies: edge.destinationsConnectedCompanies,
    sourceConnectedCompanies: edge.sourceConnectedCompanies,
    dependencies: edge.dependencies,
  };

  const { t } = useTranslation();
  const [companyExpand, setCompanyExpand] = useState(false);
  const [connectionExpand, setConnectionExpand] = useState(false);
  const [businessExpand, setBusinessExpand] = useState(false);
  const [strategyExpand, setStrategyExpand] = useState(false);
  const [businessEdit, setBusinessEdit] = useState(false);
  const [strategyEdit, setStrategyEdit] = useState(false);
  const [edgeConnectionInfo, setEdgeConnectionInfo] = useState(edgeConnection);

  useEffect(() => {
    setEdgeConnectionInfo(edgeConnection);
  }, [edge]);

  const getManagerConnectionName = () => {
    let result = "";
    if (edge.destination?.managers?.length !== 0) {
      result = edge.destination?.managers.find(
        (item: any) => item.company?.name === edge.destination?.name
      )?.person?.name;
    }

    if (edge.destination?.beneficiaries.length !== 0) {
      edge.destination?.beneficiaries.forEach(
        (person: BeneficiariesDataType) => {
          const name = person.legalPerson
            ? person.legalPerson?.name
            : person.physicalPerson?.name;
          if (
            edge.source.beneficiaries.find(
              (item) =>
                item.legalPerson?.name === name ||
                item.physicalPerson?.name === name
            ) ||
            edge.source.managers.find((item) => item.person?.name === name)
          ) {
            if (name) result = name;
          }
        }
      );
    }

    return result;
  };

  return (
    <StyledContainer>
      <StyledBox>
        <StyledArrowIconBox onClick={() => setIsEdgeInfoOpen(false)}>
          <DoubleArrowRoundedIcon sx={{ color: "#c2cad8", fontSize: 20 }} />
        </StyledArrowIconBox>
        <Breadcrumbs
          separator={<ArrowRightIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <StyledCompanyName connectionType={connectionType ?? ""}>
            {edge.source.name}
          </StyledCompanyName>
          <StyledConnectionName>{edge.destination?.name}</StyledConnectionName>
        </Breadcrumbs>
        <Box display={"flex"} alignItems={"center"}>
          <StyledConnectionType>
            {(hasShares ? t("share") : t("manager")) + " :"}
          </StyledConnectionType>
          <StyledName>
            {hasShares
              ? edge.destination?.beneficiaries.find(
                  (item: BeneficiariesDataType) =>
                    item.legalPerson?.name === edge.source?.name
                )?.share + "%"
              : getManagerConnectionName()}
          </StyledName>
        </Box>
        {connectionType === "BOTH" && (
          <Box display={"flex"} alignItems={"center"}>
            <StyledConnectionType>{t("manager") + " :"}</StyledConnectionType>
            <StyledName>{getManagerConnectionName()}</StyledName>
          </Box>
        )}
      </StyledBox>
      <StyledDivider />
      <BusinessAndStrategySection
        name={"businessActivities"}
        text={edgeConnectionInfo.businessActivity}
        edit={businessEdit}
        setEdit={setBusinessEdit}
        setExpand={setBusinessExpand}
        expand={businessExpand}
        onSave={() => {
          saveConnectionDetails(edgeConnectionInfo);
          setBusinessEdit(false);
        }}
        onChange={(val) => {
          setEdgeConnectionInfo({
            ...edgeConnectionInfo,
            businessActivity: val,
          });
        }}
        onCancel={() => {
          setEdgeConnectionInfo(edge);
        }}
      />
      <StyledDivider />
      <BusinessAndStrategySection
        name={"strategicPlan"}
        text={edgeConnectionInfo.strategicPlan}
        edit={strategyEdit}
        setEdit={setStrategyEdit}
        setExpand={setStrategyExpand}
        expand={strategyExpand}
        onChange={(val) => {
          setEdgeConnectionInfo({ ...edgeConnectionInfo, strategicPlan: val });
        }}
        onSave={() => {
          saveConnectionDetails(edgeConnectionInfo);
          setStrategyEdit(false);
        }}
        onCancel={() => {
          setEdgeConnectionInfo(edge);
        }}
      />
      <StyledDivider />
      <StyledBox>
        {edge.sourceConnectedCompanies && (
          <ConnectedCompaniesSection
            name={edge.source?.name}
            data={edge.sourceConnectedCompanies}
            expand={companyExpand}
            setExpand={setCompanyExpand}
          />
        )}
      </StyledBox>
      <StyledDivider />
      <StyledBox>
        {edge.destinationsConnectedCompanies && (
          <ConnectedCompaniesSection
            name={edge.destination?.name}
            data={edge.destinationsConnectedCompanies}
            expand={connectionExpand}
            setExpand={setConnectionExpand}
          />
        )}
      </StyledBox>
    </StyledContainer>
  );
};

export default ConnectedCompaniesConnectionInfo;
