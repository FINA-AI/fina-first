import { Box } from "@mui/system";
import { IconButton, Popover, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { PERMISSIONS } from "../../../api/permissions";
import { connect } from "react-redux";
import { PeriodType } from "../../../types/period.type";
import { ConfigType } from "../../../types/common.type";
import { styled } from "@mui/material/styles";

interface PeriodDefinitionPopoverProps {
  popoverCloseHandler: () => void;
  selectedRows: PeriodType[];
  tableGenerateHandler?: () => void;
  open: boolean;
  popoverOpenHandler?: () => void;
  anchorEl: HTMLElement | null;
  config: ConfigType;
}

const StyledTooltipItem = styled(Box)({
  height: "26px",
  padding: "4px",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "16px",
  color: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  textTransform: "capitalize",
  textJustify: "auto",
  cursor: "pointer",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
  },
});

const StyledMoreIconButton = styled(IconButton)({
  border: "1px solid #EAEBF0",
  borderRadius: "8px !important",
  padding: "4px 4px",
  marginLeft: 10,
});

const StyledVertIcon = styled(MoreVertIcon, {
  shouldForwardProp: (prop) => prop !== "selectedRows",
})<{ selectedRows: PeriodType[] }>(({ selectedRows }) => ({
  color: selectedRows.length < 2 ? "rgba(24, 41, 57, 0.5)" : "#FFF",
}));

const PeriodDefinitionPopover: React.FC<PeriodDefinitionPopoverProps> = ({
  popoverCloseHandler,
  selectedRows,
  open,
  popoverOpenHandler,
  anchorEl,
  config,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <>
      <StyledMoreIconButton onClick={popoverOpenHandler}>
        <StyledVertIcon selectedRows={selectedRows} />
      </StyledMoreIconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={popoverCloseHandler}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          "& .MuiPopover-paper": {
            backgroundColor: "#2A3341 !important",
          },
        }}
      >
        {config.permissions?.includes(PERMISSIONS.PERIODS_REVIEW) && (
          <Box sx={{ padding: "8px", width: "220px" }}>
            <StyledTooltipItem
              onClick={() => {
                history.push(`periodtypes`);
                popoverCloseHandler();
              }}
            >
              <Box display={"flex"} alignItems={"center"} pr={"5px"}>
                <EventNoteIcon />
                <Typography pl={"5px"} fontSize={"inherit"}>
                  {t("periodType")}
                </Typography>
              </Box>
            </StyledTooltipItem>
          </Box>
        )}
      </Popover>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  config: state.get("config").config,
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PeriodDefinitionPopover);
