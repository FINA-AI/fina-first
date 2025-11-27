import { Box } from "@mui/system";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { IconButton, Typography } from "@mui/material";
import React from "react";
import CopyButton from "../common/Button/CopyButton";
import { getFormattedDateValue } from "../../util/appUtil";
import useConfig from "../../hoc/config/useConfig";
import { useTranslation } from "react-i18next";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import DiffArea from "../common/DiffArea";
import { AuditLogDataType } from "../../types/auditLog.type";
import { styled, useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";

interface AuditLogSideProps {
  sideMenu: {
    open: boolean;
    row: AuditLogDataType | null;
  };
  setSideMenu: (val: { open: boolean; row: AuditLogDataType | null }) => void;
}

const StyledContent = styled(Box)(({ theme }: any) => ({
  width: "100%",
  height: "100%",
  borderBottom: theme.palette.borderColor,
  display: "flex",
  flexDirection: "column",
  background: theme.palette.paperBackground,
}));

const StyledWatchLaterIcon = styled(WatchLaterIcon)(({ theme }: any) => ({
  ...theme.smallIcon,
  color: theme.palette.primary.main,
  padding: "2px",
}));

const StyledHeaderText = styled("span")(({ theme }) => ({
  fontSize: "12px",
  lineHeight: "20px",
  fontWeight: 400,
  color: theme.palette.primary.main,
}));

const StyledPrimaryText = styled(Typography)({
  padding: "0px 12px 8px 12px",
});

const StyledMainText = styled("span")({
  color: "#98A7BC",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
});

const StyledSecondaryText = styled("span")(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#e5e7e8" : "#4F5863",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
}));

const StyledValueTitle = styled(Typography)({
  color: "#98A7BC",
  fontWeight: 500,
  fontSize: "11px",
  lineHeight: "12px",
});

const StyledValueText = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFF" : "#4F5863",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "16px",
  marginTop: "4px",
  lineBreak: "anywhere",
}));

const StyledRowId = styled(Typography)(({ theme }: any) => ({
  display: "flex",
  color: theme.palette.textColor,
  fontWeight: 500,
  fontSize: 13,
  lineHeight: "20px",
  padding: "0px 12px 8px 12px",
  alignItems: "center",
}));

const StyledValue = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#2C3644",
  fontWeight: 600,
  fontSize: 12,
  lineHeight: "18px",
  marginBottom: "8px",
}));

const StyledConditionsBox = styled(Box)(({ theme }) => ({
  padding: "12px",
  background: theme.palette.mode === "dark" ? "#26313f" : "#F0F4FF",
  overflow: "auto",
}));

const StyledValueBox = styled(Box)(({ theme }: any) => ({
  borderRadius: "2px",
  border: theme.palette.borderColor,
  padding: "8px 12px",
  display: "flex",
  flexDirection: "column",
}));

const AuditLogSide: React.FC<AuditLogSideProps> = ({
  sideMenu,
  setSideMenu,
}) => {
  const { getDateFormat } = useConfig();
  const { t } = useTranslation();
  const theme: any = useTheme();

  const getDate = () => {
    if (sideMenu.row) {
      let date = new Date(sideMenu.row["relevanceTime"]);
      return `${
        date.getHours() + ":" + date.getMinutes()
      } | ${getFormattedDateValue(
        sideMenu.row["relevanceTime"],
        getDateFormat(true)
      )}`;
    }
  };

  const getName = () => {
    if (sideMenu.row) {
      let items = sideMenu.row["actorId"].split(" ");
      if (items.length === 0) {
        return sideMenu.row["actorId"];
      } else {
        let res = "";
        for (let i = 0; i <= items.length - 1; i++) {
          res += items[i];
        }
        return res.trim();
      }
    }
  };

  const getIP = () => {
    if (sideMenu.row) {
      let items = sideMenu.row["actorId"].split(" ");
      if (items.length === 0) {
        return "";
      } else {
        return sideMenu.row["actorId"].split(" ").pop();
      }
    }
  };

  return (
    <>
      {sideMenu.open && (
        <StyledContent data-testid={"audit-log-side-menu"}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            padding={"12px 12px 9px 12px"}
            color={"#2962FF"}
          >
            <Box display={"flex"} alignItems={"center"}>
              <StyledWatchLaterIcon />
              <StyledHeaderText data-testid={"data"}>
                {getDate()}
              </StyledHeaderText>
            </Box>
            <IconButton
              onClick={() => setSideMenu({ open: false, row: null })}
              data-testid={"close-button"}
            >
              <DoubleArrowIcon sx={{ color: "#C2CAD8", fontSize: 16 }} />
            </IconButton>
          </Box>
          <StyledRowId data-testid={"id"}>
            {sideMenu.row && sideMenu.row.id}
            <CopyButton text={sideMenu.row ? sideMenu.row.id : ""} />
          </StyledRowId>
          <StyledPrimaryText>
            <StyledMainText>{t("IdName")}: </StyledMainText>
            <StyledSecondaryText data-testid={"id-name"}>
              {getName()}
            </StyledSecondaryText>
          </StyledPrimaryText>
          <StyledPrimaryText>
            <StyledMainText>{t("action")}: </StyledMainText>
            <StyledSecondaryText data-testid={"operation-type"}>
              {sideMenu.row && sideMenu.row["operationType"]}
            </StyledSecondaryText>
          </StyledPrimaryText>
          <StyledPrimaryText>
            <StyledMainText>{t("ipNumber")}: </StyledMainText>
            <StyledSecondaryText data-testid={"ip-number"}>
              {getIP()}
            </StyledSecondaryText>
          </StyledPrimaryText>
          <StyledPrimaryText>
            <StyledMainText>{t("objectName")}: </StyledMainText>
            <StyledSecondaryText data-testid={"entity-name"}>
              {sideMenu.row && sideMenu.row["entityName"]}
            </StyledSecondaryText>
          </StyledPrimaryText>
          <StyledPrimaryText>
            <StyledMainText>{t("property")}: </StyledMainText>
            <StyledSecondaryText data-testid={"entity-property"}>
              {sideMenu.row && sideMenu.row["entityProperty"]}
            </StyledSecondaryText>
          </StyledPrimaryText>
          <StyledPrimaryText>
            <StyledMainText>{t("objectId")}: </StyledMainText>
            <StyledSecondaryText data-testid={"entity-id"}>
              {sideMenu.row && sideMenu.row["entityId"]}
            </StyledSecondaryText>
          </StyledPrimaryText>
          {sideMenu.row &&
            (sideMenu.row["entityPropertyNewValue"] ||
              sideMenu.row["entityPropertyOldValue"]) && (
              <StyledConditionsBox>
                <StyledValue>{t("Value")}</StyledValue>
                <StyledValueBox>
                  <Box
                    display={"flex"}
                    paddingBottom={"8px"}
                    borderBottom={
                      sideMenu.row["entityPropertyOldValue"]
                        ? theme.palette.borderColor
                        : ""
                    }
                  >
                    <Box flex={1}>
                      <StyledValueTitle>{t("New Value")}</StyledValueTitle>
                      <StyledValueText data-testid={"entity-new-value"}>
                        {sideMenu.row["entityPropertyNewValue"]}
                      </StyledValueText>
                    </Box>
                    <Box display={"flex"} alignItems={"center"}>
                      <Divider
                        orientation={"vertical"}
                        variant="middle"
                        flexItem
                        sx={{ mx: 2 }}
                      />
                    </Box>
                    <Box flex={1}>
                      <StyledValueTitle>{t("Old Value")}</StyledValueTitle>
                      <StyledValueText data-testid={"entity-old-value"}>
                        {sideMenu.row["entityPropertyOldValue"]}
                      </StyledValueText>
                    </Box>
                  </Box>
                  {(sideMenu.row["entityPropertyOldValue"] ||
                    sideMenu.row["entityPropertyNewValue"]) && (
                    <Box display={"flex"} marginTop={"8px"}>
                      <Box marginRight={"8px"}>
                        <PublishedWithChangesIcon
                          style={{
                            color: "#289E20",
                            width: "16px",
                            height: "16px",
                          }}
                        />
                      </Box>
                      <Box flex={1} lineHeight={"16px"}>
                        <DiffArea row={sideMenu.row} mode={"words"} />
                      </Box>
                    </Box>
                  )}
                </StyledValueBox>
              </StyledConditionsBox>
            )}
        </StyledContent>
      )}
    </>
  );
};

export default AuditLogSide;
