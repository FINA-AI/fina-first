import { IconButton, Paper, Slide, Typography } from "@mui/material";
import { Box } from "@mui/system";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { ScheduleType } from "../../../types/schedule.type";

interface RCSDetailSidebarProps {
  selectedRCS: ScheduleType;
  setIsScheduleInfoOpen: React.Dispatch<
    React.SetStateAction<{ open: boolean; row: ScheduleType | null }>
  >;
  isScheduleInfoOpen: boolean;
}

const StyledInfoBar = styled(Paper)(({ theme }: { theme: any }) => ({
  height: "100%",
  width: `400px`,
  position: "absolute",
  borderTop: theme.palette.borderColor,
  top: 0,
  right: 0,
  zIndex: theme.zIndex.modal,
  borderLeft: theme.palette.borderColor,
  overflow: "auto",
}));

const StyledInfoBarHeader = styled(Box)({
  padding: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const StyledMessageContainer = styled(Box)(({ theme }) => ({
  padding: "12px",
  backgroundColor: theme.palette.mode === "dark" ? "#344258" : "#F6F6F6",
}));

const StyledDefinitionCode = styled(Typography)({
  fontSize: 13,
  fontWeight: 600,
  lineHeight: "20px",
});

const StyledReturnVersion = styled(Typography)({
  fontSize: 11,
  fontWeight: 500,
  lineHeight: "12px",
});

const StyledVersionCode = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  lineHeight: "20px",
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#2C3644",
  marginTop: 4,
}));

const RCSDetailSidebar: React.FC<RCSDetailSidebarProps> = ({
  selectedRCS,
  setIsScheduleInfoOpen,
  isScheduleInfoOpen,
}) => {
  const { t } = useTranslation();
  const { returncreationId }: any = useParams();

  useEffect(() => {
    setIsScheduleInfoOpen({ open: false, row: null });
  }, [returncreationId]);

  return (
    <Paper className="relative-paper" sx={{ width: "100%", height: "100%" }}>
      <Slide direction="left" in={isScheduleInfoOpen} timeout={600}>
        <StyledInfoBar>
          <StyledInfoBarHeader>
            <StyledDefinitionCode>
              {selectedRCS?.definitionCode}
            </StyledDefinitionCode>
            <IconButton
              onClick={() => setIsScheduleInfoOpen({ open: false, row: null })}
              sx={{ padding: "2px" }}
            >
              <ClearRoundedIcon sx={(theme: any) => ({ ...theme.smallIcon })} />
            </IconButton>
          </StyledInfoBarHeader>
          <Divider />
          <Box p={"12px"}>
            <StyledReturnVersion>{t("returnVersion")}</StyledReturnVersion>
            <StyledVersionCode>
              {t(selectedRCS?.versionCode || "")}
            </StyledVersionCode>
          </Box>
          <Divider />
          <StyledMessageContainer>
            <StyledReturnVersion>{t("message")}</StyledReturnVersion>
            <StyledVersionCode>{selectedRCS?.message}</StyledVersionCode>
          </StyledMessageContainer>
        </StyledInfoBar>
      </Slide>
    </Paper>
  );
};

export default RCSDetailSidebar;
