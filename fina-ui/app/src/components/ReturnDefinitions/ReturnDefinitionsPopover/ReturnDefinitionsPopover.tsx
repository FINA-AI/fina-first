import { Box } from "@mui/system";
import CalendarViewDayRoundedIcon from "@mui/icons-material/CalendarViewDayRounded";
import { IconButton, Popover, Typography } from "@mui/material";
import PlusOneIcon from "@mui/icons-material/PlusOne";
import React from "react";
import { useTranslation } from "react-i18next";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/material/styles";
import { ReturnDefinitionType } from "../../../types/returnDefinition.type";
import { UIEventType } from "../../../types/common.type";

interface Props {
  popoverCloseHandler: VoidFunction;
  selectedRows: ReturnDefinitionType[];
  open: boolean;
  anchorEl: Element | null;
  rebuildReturnDependencyHandler: VoidFunction;
  popoverOpenHandler(event: UIEventType): void;
  tableGenerateHandler(ids: number[]): void;
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

const ReturnDefinitionsPopover: React.FC<Props> = ({
  popoverCloseHandler,
  selectedRows,
  tableGenerateHandler,
  open,
  popoverOpenHandler,
  anchorEl,
  rebuildReturnDependencyHandler,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  return (
    <>
      <IconButton
        onClick={popoverOpenHandler}
        sx={{
          borderRadius: "8px !important",
          padding: "3px 3px",
          marginLeft: "10px",
        }}
      >
        <MoreVertIcon />
      </IconButton>
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
        <Box sx={{ padding: "8px", width: "220px" }}>
          {hasPermission(PERMISSIONS.FINA_REG_GENERATE_TABLE) && (
            <StyledTooltipItem
              onClick={() => {
                if (selectedRows.length !== 0) {
                  tableGenerateHandler(selectedRows.map((item) => item.id));
                  popoverCloseHandler();
                }
              }}
              sx={{
                ...(selectedRows.length === 0 && {
                  opacity: 0.5,
                  cursor: "context-menu",
                }),
              }}
            >
              <Box display={"flex"} alignItems={"center"} pr={"5px"}>
                <CalendarViewDayRoundedIcon />
                <Typography pl={"5px"} fontSize={"inherit"}>
                  {t("generateTable")}
                </Typography>
              </Box>
            </StyledTooltipItem>
          )}

          <StyledTooltipItem
            onClick={() => {
              rebuildReturnDependencyHandler();
              popoverCloseHandler();
            }}
          >
            <Box display={"flex"} alignItems={"center"} pr={"5px"}>
              <PlusOneIcon />
              <Typography pl={"5px"} fontSize={"inherit"}>
                {t("rebuildReturnDependency")}
              </Typography>
            </Box>
          </StyledTooltipItem>
        </Box>
      </Popover>
    </>
  );
};

export default ReturnDefinitionsPopover;
