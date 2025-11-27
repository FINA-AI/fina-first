import { Box, Typography } from "@mui/material";
import React from "react";
import { getNotificationStatusStyle } from "../notificationUtil";
import { styled, useTheme } from "@mui/material/styles";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { CommunicatorStatusType } from "../../../types/communicator.common.type";

const StyledStatusContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "2px 4px",
  borderRadius: 2,
  minWidth: "40px",
  maxWidth: "100px",
});

const StyledDotIcon = styled(FiberManualRecordIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  width: "8px",
  height: "8px",
  marginRight: "4px",
}));

const CommunicatorStatusBox = ({
  status,
}: {
  status: CommunicatorStatusType;
}) => {
  const theme = useTheme();
  const lightMode = theme.palette.mode === "light";

  return (
    <StyledStatusContainer
      style={getNotificationStatusStyle(status, lightMode)}
    >
      {status === "CREATED" && <StyledDotIcon />}
      <Typography
        sx={{ fontWeight: 400, fontSize: 11, lineHeight: "12px" }}
        data-testid={"communicator-status"}
      >
        {status}
      </Typography>
    </StyledStatusContainer>
  );
};

export default CommunicatorStatusBox;
