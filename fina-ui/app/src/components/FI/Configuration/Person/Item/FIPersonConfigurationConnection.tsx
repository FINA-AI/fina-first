import { Box, Typography } from "@mui/material";
import { BusinessIcon } from "../../../../../api/ui/icons/BusinessIcon";
import React from "react";
import { useTranslation } from "react-i18next";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { styled, useTheme } from "@mui/material/styles";
import {
  BeneficiariesDataType,
  FiConnectionsDataType,
  ManagersDataType,
  PositionDataType,
  SharesDataType,
} from "../../../../../types/fi.type";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  borderBottom: theme.palette.borderColor,
  borderTop: theme.palette.borderColor,
  padding: "12px 16px",
  backgroundColor: theme.palette.mode === "light" ? "inherit" : "#344258",
  marginBottom: 8,
}));

const StyledConnectionHeader = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: "2px",
  minWidth: "35px",
  height: "24px",
  paddingLeft: "10px",
  paddingRight: "5px",
  display: "flex",
  alignItems: "center",
}));

const StyledConnectionName = styled(Box)(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "21px",
}));

const StyledConnectionItemTitle = styled(Box)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFF" : "#2C3644",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  width: "100%",
}));

const StyledConnectionInfoName = styled(Typography)(({ theme }: any) => ({
  fontSize: 11,
  fontWeight: 600,
  lineHeight: "16px",
  color: theme.palette.secondaryTextColor,
}));

const StyledConnectedInfoVal = styled(Typography)(({ theme }: any) => ({
  fontSize: 12,
  fontWeight: 400,
  lineHeight: "20px",
  color: theme.palette.textColor,
}));

const StyledConnectionType = styled(Typography)(({ theme }: any) => ({
  fontSize: 12,
  lineHeight: "16px",
  fontWeight: 500,
  color:
    theme.palette.mode === "dark"
      ? theme.palette.primary.main
      : theme.palette.textColor,
  paddingLeft: 5,
}));

const StyledStatusWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  marginBottom: 16,
});

interface Props {
  connection: FiConnectionsDataType;
  index: number;
}

const FIPersonConfigurationConnection: React.FC<Props> = ({
  connection = {} as FiConnectionsDataType,
  index,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const FiConnectionCard = ({
    connection,
  }: {
    connection: FiConnectionsDataType;
  }) => {
    return (
      <>
        <StyledConnectionItemTitle>
          <StyledConnectionInfoName>
            {t("fiBeneficiaryFinalBeneficiary")}
          </StyledConnectionInfoName>
          {connection.fiBeneficiaries && (
            <div>
              {connection.fiBeneficiaries.map(
                (beneficiaryItem: BeneficiariesDataType, index: number) => {
                  if (beneficiaryItem) {
                    return (
                      <Box key={index} display={"flex"} alignItems={"center"}>
                        <StyledConnectedInfoVal key={index}>
                          {`${t("sharePercentage")} : ${
                            beneficiaryItem.share
                          }% | ${t("legalPersonStatus")} : ${
                            beneficiaryItem.active ? t("active") : t("inactive")
                          }`}
                        </StyledConnectedInfoVal>
                        <Box
                          ml={"5px"}
                          alignContent={"center"}
                          style={{
                            color:
                              connection.status === "ACTIVE"
                                ? "#FF4128"
                                : "#289E20",
                          }}
                        >
                          <FiberManualRecordIcon
                            sx={{
                              width: 10,
                              height: 10,
                              marginRight: 4,
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  }
                }
              )}
            </div>
          )}
        </StyledConnectionItemTitle>
        <StyledConnectionItemTitle paddingLeft={"10px"}>
          <StyledConnectionInfoName>{t("management")}</StyledConnectionInfoName>
          {connection.fiManagements && (
            <div>
              {connection.fiManagements.map(
                (managementItem: ManagersDataType, index: number) => {
                  return (
                    <StyledConnectedInfoVal key={index}>{`${t("position")} : ${
                      managementItem ? managementItem : ""
                    }`}</StyledConnectedInfoVal>
                  );
                }
              )}
            </div>
          )}
        </StyledConnectionItemTitle>
        <StyledConnectionItemTitle paddingLeft={"10px"}>
          <StyledConnectionInfoName>{t("branches")}</StyledConnectionInfoName>
          {connection.fiBranchPositions && (
            <div>
              {connection.fiBranchPositions.map(
                (branchItem: any, index: number) => {
                  if (branchItem) {
                    return (
                      <StyledConnectedInfoVal key={index}>{`${t(
                        "position"
                      )} : ${branchItem.positions
                        .map((p: any) => t(p) + " ")
                        .join(", ")}`}</StyledConnectedInfoVal>
                    );
                  }
                }
              )}
            </div>
          )}
        </StyledConnectionItemTitle>
      </>
    );
  };

  const LegalPersonConnectionCard = ({
    connection,
  }: {
    connection: FiConnectionsDataType;
  }) => {
    return (
      <>
        <StyledConnectionItemTitle paddingLeft={"10px"}>
          <StyledConnectionInfoName>
            {t("fiBeneficiaryFinalBeneficiary")}
          </StyledConnectionInfoName>
          {connection.personShares && (
            <div>
              {connection.personShares.map(
                (share: SharesDataType, index: number) => {
                  return (
                    <StyledConnectedInfoVal key={index}>{`${t(
                      "sharePercentage"
                    )} : ${share.sharePercentage}% | ${t(
                      "legalPersonStatus"
                    )} : ${t("active")}`}</StyledConnectedInfoVal>
                  );
                }
              )}
            </div>
          )}
        </StyledConnectionItemTitle>
        <StyledConnectionItemTitle paddingLeft={"10px"}>
          <StyledConnectionInfoName>{t("management")}</StyledConnectionInfoName>
          {connection.personPositions && (
            <div>
              {connection.personPositions.map(
                (personPosition: PositionDataType, index: number) => {
                  return (
                    <StyledConnectedInfoVal key={index}>{`${t("position")} : ${
                      personPosition.position
                    }`}</StyledConnectedInfoVal>
                  );
                }
              )}
            </div>
          )}
        </StyledConnectionItemTitle>
      </>
    );
  };

  return (
    <StyledRoot key={index}>
      <StyledStatusWrapper>
        <StyledConnectionHeader>
          <BusinessIcon color={theme.palette.primary.main} />
          <StyledConnectionType>
            {t(connection.connectionType)}
          </StyledConnectionType>
        </StyledConnectionHeader>
      </StyledStatusWrapper>
      <StyledConnectionName>{connection.name}</StyledConnectionName>
      <Box display={"flex"} justifyContent={"space-between"} marginTop={"8px"}>
        {connection.connectionType === "FI" ? (
          <FiConnectionCard connection={connection} />
        ) : (
          <LegalPersonConnectionCard connection={connection} />
        )}
      </Box>
    </StyledRoot>
  );
};

export default FIPersonConfigurationConnection;
