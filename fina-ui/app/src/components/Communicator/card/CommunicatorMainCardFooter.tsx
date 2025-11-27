import { Grid, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import React from "react";
import { useTranslation } from "react-i18next";
import { getFormattedDateValue } from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { styled } from "@mui/material/styles";
import { RootMessageType } from "../../../types/messages.type";
import { RootNotificationType } from "../../../types/notifications.type";

interface CommunicatorMainCardFooterProps {
  data: RootMessageType | RootNotificationType;
}

const StyledFooter = styled(Grid)(({ theme }) => ({
  borderTop: (theme as any).palette.borderColor,
  paddingTop: 8,
}));

const StyledFooterGrid = styled(Grid)({
  display: "flex",
  alignItems: "center",
});

const commonIconStyles = (theme: any) => ({
  color: theme.palette.primary.main,
  fontSize: 15,
});

const StyledCreateNewIcon = styled(CreateNewFolderIcon)(({ theme }) => ({
  ...commonIconStyles(theme),
}));
const StyledSendIcon = styled(SendIcon)(({ theme }) => ({
  ...commonIconStyles(theme),
}));
const StyledPersonIcon = styled(PersonIcon)(({ theme }) => ({
  ...commonIconStyles(theme),
}));

const StyledDate = styled(Typography)(({ theme }) => ({
  fontSize: 11,
  color: (theme as any).palette.textColor,
  lineHeight: "16px",
}));

const StyledDateText = styled(Typography)(({ theme }) => ({
  fontSize: 11,
  color: (theme as any).palette.secondaryTextColor,
  fontWeight: 400,
  lineHeight: "16px",
  marginBottom: "2px",
}));

const StyledIconBox = styled(Grid)(({ theme }) => ({
  width: 30,
  height: 30,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor:
    theme.palette.mode === "light" ? "rgb(240, 244, 255)" : "#344258",
}));

const StyledInfoBox = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  paddingLeft: "7px",
});

const CommunicatorMainCardFooter: React.FC<CommunicatorMainCardFooterProps> = ({
  data,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  const getFormattedValue = (date: Date | number) => {
    return getFormattedDateValue(date, getDateFormat(true));
  };

  return (
    <StyledFooter container data-testid={"footer"}>
      <StyledFooterGrid item xs={4}>
        <StyledIconBox>
          <StyledCreateNewIcon />
        </StyledIconBox>
        <StyledInfoBox>
          <StyledDateText>{t("creationDate")}</StyledDateText>
          <StyledDate data-testid={"creation-date"}>
            {getFormattedValue(data.creationDate)}
          </StyledDate>
        </StyledInfoBox>
      </StyledFooterGrid>
      <StyledFooterGrid item xs={4}>
        <StyledIconBox>
          <StyledSendIcon fontSize={"small"} />
        </StyledIconBox>
        <StyledInfoBox>
          <StyledDateText>{t("sendingDate")}</StyledDateText>
          {data.sendDate && (
            <StyledDate data-testid={"sending-date"}>
              {getFormattedValue(data.sendDate)}
            </StyledDate>
          )}
        </StyledInfoBox>
      </StyledFooterGrid>
      <StyledFooterGrid item xs={4}>
        <StyledIconBox>
          <StyledPersonIcon />
        </StyledIconBox>
        <StyledInfoBox>
          <StyledDateText>{t("recipients")}</StyledDateText>
          <StyledDate data-testid={"recipient-count"}>
            {data.recipientCount}
          </StyledDate>
        </StyledInfoBox>
      </StyledFooterGrid>
    </StyledFooter>
  );
};

export default CommunicatorMainCardFooter;
