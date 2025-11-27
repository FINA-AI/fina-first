import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import CommunicatorStatusBox from "./CommunicatorStatusBox";
import useConfig from "../../../hoc/config/useConfig";
import { getFormattedDateValue } from "../../../util/appUtil";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { styled } from "@mui/material/styles";
import { NotificationRecipientType } from "../../../types/notifications.type";

const StyledCard = styled(Grid)(({ theme }) => ({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  padding: "8px 12px",
  borderRadius: 2,
  marginTop: 8,
  marginBottom: 8,
  "&:hover": {
    boxShadow: "0px 2px 10px 0px #00000014",
  },
  border: (theme as any).palette.borderColor,
}));

const StyledLogin = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.mode === "light" ? "#98A7BC" : "#b5b6b9",
  fontSize: "11px",
  fontWeight: 400,
  lineHeight: "16px",
  textTransform: "capitalize",
}));

const StyledName = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.mode === "light" ? "#2C3644" : "#eceef6",
  fontWeight: 500,
  fontSize: "13px",
  lineHeight: "20px",
  textTransform: "capitalize",
}));

const StyledDate = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "end",
  color: theme.palette.mode === "dark" ? "#b5b6b9" : "#C3CAD8",
  fontWeight: 400,
  fontSize: "10px",
  lineHeight: "12px",
  textTransform: "capitalize",
  "& .MuiSvgIcon-root": {
    width: "15px",
    height: "15px",
    marginRight: "3px",
  },
}));

const NotificationRecipientCard = ({
  recipient,
}: {
  recipient: NotificationRecipientType;
}) => {
  const { getDateFormat } = useConfig();

  return (
    <StyledCard item xs={12}>
      <Box display={"flex"} justifyContent={"space-between"}>
        <StyledLogin data-testid={"login"}> {recipient.login} </StyledLogin>
        <CommunicatorStatusBox status={recipient.status} />
      </Box>
      <Box display={"flex"} justifyContent={"space-between"} marginTop={"4px"}>
        <StyledName data-testid={"name"}>{recipient.name}</StyledName>
        {recipient.status === "READ" && (
          <StyledDate data-testid={"read-date"}>
            <DoneAllIcon />
            {getFormattedDateValue(recipient["readDate"], getDateFormat(false))}
          </StyledDate>
        )}
      </Box>
    </StyledCard>
  );
};

export default NotificationRecipientCard;
