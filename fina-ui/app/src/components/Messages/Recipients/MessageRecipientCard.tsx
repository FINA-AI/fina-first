import { Box, Grid, Typography } from "@mui/material";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import CommunicatorStatusBox from "../../Notifications/NotificationUserGrid/CommunicatorStatusBox";
import UnreadMessageIndicator from "../UnreadMessageIndicator";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import Accordion from "@mui/material/Accordion";
import { CommRecipientType } from "../../../types/communicator.common.type";
import { RecipientType } from "../../../types/messages.type";

interface MessageRecipientCardProps {
  recipient: CommRecipientType;
  onRecipientMessageSelect: (rec: CommRecipientType) => void;
  isSelected: boolean;
}

const messageStyles = ({
  theme,
  hasPendingMessage,
}: {
  theme: any;
  hasPendingMessage: boolean;
}) => ({
  color: hasPendingMessage
    ? theme.palette.mode === "light"
      ? "#ff7301"
      : "#DC6803"
    : theme.palette.secondaryTextColor,
  fontWeight: 400,
  fontSize: 12,
  lineHeight: "20px",
  textOverflow: "ellipsis !important",
  overflow: "hidden !important",
  display: "-webkit-box",
  "-webkit-box-orient": "vertical",
  "-webkit-line-clamp": 1,
  "& a": {
    ...theme.links,
  },
});

const StyledCard = styled(Grid)<{ isSelected: boolean }>(
  ({ theme, isSelected }: { theme: any; isSelected: boolean }) => ({
    background: theme.palette.paperBackground,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    padding: "10px 12px 8px 12px",
    borderRadius: 2,
    border: theme.palette.borderColor,
    marginTop: 8,
    marginBottom: 8,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.buttons.secondary.hover,
      boxShadow: theme.palette.paperBoxShadow,
    },
    "& .MuiAccordionSummary-root": {
      padding: "0px",
      color: "#596D89",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: "20px",
    },
    "& .MuiPaper-elevation": {
      height: "25px",
      alignItems: "center",
      display: "flex",
      background: "inherit",
      overflow: "hidden",
    },
    "& .Mui-expanded": {
      height: "70px",
      "& .MuiTypography-root": { paddingTop: "30px" },
    },
    "& .MuiAccordionSummary-content": {
      margin: "0px",
    },
    "& .MuiAccordionDetails-root": {
      padding: "0px",
    },
    ...(isSelected && {
      backgroundColor: isSelected ? theme.palette.action.select : "inherit",
      "&:hover": {
        background: theme.palette.buttons.secondary.hover,
      },
    }),
  })
);

const StyledName = styled(Typography)<{ hasPendingMessage: boolean }>(
  ({ theme, hasPendingMessage }) => ({
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    fontSize: 11,
    lineHeight: "12px",
    color: hasPendingMessage
      ? theme.palette.mode === "light"
        ? "#ff7301"
        : "#DC6803"
      : (theme as any).palette.secondaryTextColor,
    marginBottom: "6px",
  })
);

const StyledMessage = styled(Typography)<{ hasPendingMessage: boolean }>(
  ({ theme, hasPendingMessage }) => messageStyles({ theme, hasPendingMessage })
);

const StyledTitle = styled(Typography)<{
  hasPendingMessage: boolean;
}>(({ theme, hasPendingMessage }) => ({
  fontWeight: 500,
  fontSize: 13,
  color:
    theme.palette.mode === "light"
      ? hasPendingMessage
        ? "#ff7301"
        : "#5f6770"
      : hasPendingMessage
      ? "#DC6803"
      : "#F5F7FA",
  lineHeight: "20px",
  marginBottom: "4px",
  display: "flex",
}));

const StyledExpandedMessage = styled(Typography)<{
  hasPendingMessage: boolean;
}>(({ theme, hasPendingMessage }) => ({
  color: hasPendingMessage
    ? theme.palette.mode === "light"
      ? "#ff7301"
      : "#DC6803"
    : (theme as any).palette.secondaryTextColor,
  fontWeight: 400,
  fontSize: 12,
  marginBottom: 5,
}));

const StyledSeeMore = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 12,
}));

const StyledSeeMoreContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginTop: 5,
});

const StyledSeeMoreWrapper = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  wrap: "nowrap",
  marginTop: 5,
  width: "100%",
});

const StyledAccordion = styled(Accordion)<{
  isSelected: boolean;
  hasPendingMessage: boolean;
  expand: boolean;
}>(({ theme, expanded, isSelected, hasPendingMessage }) => ({
  ...messageStyles({ theme, hasPendingMessage }),

  ...(!expanded && {
    height: 100,
    overflow: "auto",
  }),

  ...(isSelected && {
    backgroundColor: isSelected
      ? (theme as any).palette.action.select
      : "inherit",
    "&:hover": {
      background: (theme as any).palette.buttons.secondary.hover,
    },
  }),
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  marginRight: "10px",
  "& .MuiBadge-badge": {
    color: "#fff",
    backgroundColor: "#fc8c03",
    fontSize: "14px",
    height: "20px",
    border: (theme as any).palette.borderColor,
  },
}));
const StyledSeeMoreIconUp = styled(KeyboardArrowUpRounded)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 12,
}));
const StyledSeeMoreIconDown = styled(KeyboardArrowDownRounded)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 12,
}));

const MessageRecipientCard: React.FC<MessageRecipientCardProps> = ({
  recipient,
  onRecipientMessageSelect,
  isSelected,
}) => {
  const [selected, setSelected] = useState<boolean>(isSelected);

  const { t } = useTranslation();
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    setSelected(isSelected);
  }, [isSelected]);

  useEffect(() => {
    setExpand(false);
  }, [recipient]);

  const recipientInfo = recipient as RecipientType;

  return (
    <StyledCard
      item
      xs={12}
      isSelected={selected}
      onClick={() => onRecipientMessageSelect(recipient)}
    >
      <Box display={"flex"} justifyContent={"space-between"}>
        <StyledName hasPendingMessage={!!recipientInfo?.hasPendingMessage}>
          {recipient?.login}
        </StyledName>
        <Box display={"flex"} gap={"5px"}>
          {recipientInfo.new && <UnreadMessageIndicator />}
          <CommunicatorStatusBox status={recipient?.status || ""} />
        </Box>
      </Box>
      <StyledTitle hasPendingMessage={!!recipientInfo?.hasPendingMessage}>
        {recipient?.name}
      </StyledTitle>
      <Box display={"flex"} justifyContent={"space-between"}></Box>
      <StyledAccordion
        expand={expand}
        isSelected={selected}
        hasPendingMessage={!!recipientInfo?.hasPendingMessage}
        elevation={0}
        expanded={expand}
        onChange={() => setExpand(!expand)}
      >
        <AccordionSummary
          aria-label="Expand"
          aria-controls="additional-actions1-content"
          id="additional-actions1-header"
          style={{ display: expand ? "none" : "" }}
        >
          <StyledMessage hasPendingMessage={!!recipientInfo?.hasPendingMessage}>
            <div
              dangerouslySetInnerHTML={{
                __html: recipientInfo?.lastConversationMessage || "",
              }}
            />
          </StyledMessage>
        </AccordionSummary>
        <AccordionDetails style={{ display: !expand ? "none" : "" }}>
          <StyledExpandedMessage
            hasPendingMessage={!!recipientInfo?.hasPendingMessage}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: recipientInfo?.lastConversationMessage || "",
              }}
            />
          </StyledExpandedMessage>
        </AccordionDetails>
      </StyledAccordion>
      <StyledSeeMoreWrapper
        display={"flex"}
        onClick={(e) => {
          e.stopPropagation();
          setExpand(!expand);
        }}
      >
        <StyledSeeMoreContainer>
          <StyledSeeMore>{expand ? t("seeLess") : t("seeMore")}</StyledSeeMore>
          {expand ? <StyledSeeMoreIconUp /> : <StyledSeeMoreIconDown />}
        </StyledSeeMoreContainer>
        {recipientInfo?.hasPendingMessage && (
          <StyledBadge
            color="primary"
            badgeContent={recipientInfo?.pendingMessageCount}
          />
        )}
      </StyledSeeMoreWrapper>
    </StyledCard>
  );
};

export default MessageRecipientCard;
