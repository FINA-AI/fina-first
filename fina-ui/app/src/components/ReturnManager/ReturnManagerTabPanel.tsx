import { useTranslation } from "react-i18next";
import { memo, useState } from "react";
import { Grid, Tab, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Tabs from "@mui/material/Tabs";
import ReturnManagerContainer from "../../containers/ReturnManager/ReturnManagerContainer";
import OverdueReturnsContainer from "../../containers/OverdueReturns/OverdueReturnsContainer";
import { styled } from "@mui/material/styles";

const StyledMainLayout = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.mainLayout,
}));

const StyledTabs = styled(Box)(({ theme }) => ({
  "& .MuiTabs-root": {
    [theme.breakpoints.between(900, 1300)]: {
      height: "40px !important",
      minHeight: "40px",
    },
  },
  "& .MuiButtonBase-root": {
    fontWeight: 600,
    fontSize: 14,
    lineHeight: "21px",
    textTransform: "capitalize",
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#2C3644",
    opacity: "0.8",
    overflow: "hidden",
    textOverflow: "ellipsis",
    backgroundColor: "inherit",
    [theme.breakpoints.between(900, 1600)]: {
      fontSize: "1rem",
      padding: "6px",
    },
  },
  "& .Mui-selected": {
    opacity: "1",
    color: theme.palette.primary.main,
  },
}));

const StyledContentContainer = styled(Grid)({
  backgroundColor: "#fff",
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
  paddingBottom: 45,
});

const StyledTitleContainer = styled(Grid)(({ theme }) => ({
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
  paddingTop: "8px",
  paddingBottom: "14px",
  [theme.breakpoints.between(900, 1300)]: {
    padding: `4px`,
  },
}));

const StyledMainTitleText = styled(Typography)(({ theme }: { theme: any }) => ({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "24px",
  color: theme.palette.textColor,
  display: "inline",
  [theme.breakpoints.between(900, 1300)]: {
    fontSize: `1rem`,
  },
}));

const StyledTabPanel = styled(Box)({
  position: "absolute",
  marginLeft: 24,
  zIndex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const ReturnManagerTabPanel = () => {
  const { t } = useTranslation();

  const [returnManagerRendered, setReturnManagerRendered] = useState(true);
  const [overdueReturnRendered, setOverdueReturnRendered] = useState(false);
  const [selectedTab, setSelectedTab] = useState("returnManager");
  const [tooltip, setTooltip] = useState(false);

  const onMouseEnterFunction = (event: any) => {
    setTooltip(event.target.scrollWidth > event.target.clientWidth);
  };

  return (
    <StyledMainLayout>
      <Grid
        container
        spacing={0}
        overflow={"hidden"}
        height={"100%"}
        borderRadius={"4px"}
      >
        <Grid item xs={12}>
          <StyledTitleContainer item xs={12}>
            <StyledMainTitleText>{t("returnManager")}</StyledMainTitleText>
          </StyledTitleContainer>
        </Grid>
        <StyledContentContainer item xs={12}>
          <StyledTabPanel>
            <StyledTabs>
              <Tabs value={selectedTab} data-testid={"tabs-container"}>
                <Tab
                  value={"returnManager"}
                  onClick={() => {
                    setSelectedTab("returnManager");
                    setReturnManagerRendered(true);
                  }}
                  data-testid={"return-manager"}
                  icon={
                    <Tooltip
                      title={tooltip ? t("returnManager") : ""}
                      placement="bottom"
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(event) => onMouseEnterFunction(event)}
                      >
                        {t("returnManager")}
                      </span>
                    </Tooltip>
                  }
                />
                <Tab
                  value={"overdueReturn"}
                  onClick={() => {
                    setSelectedTab("overdueReturn");
                    setOverdueReturnRendered(true);
                  }}
                  data-testid={"overdue-return"}
                  icon={
                    <Tooltip
                      title={tooltip ? t("overdueReturns") : ""}
                      placement="bottom"
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(event) => onMouseEnterFunction(event)}
                      >
                        {t("overdueReturns")}
                      </span>
                    </Tooltip>
                  }
                />
              </Tabs>
            </StyledTabs>
          </StyledTabPanel>
          <div
            style={{
              display: selectedTab === "returnManager" ? "block" : "none",
              height: "100%",
            }}
          >
            {returnManagerRendered && <ReturnManagerContainer />}
          </div>
          <div
            style={{
              height: "100%",
              display: selectedTab === "overdueReturn" ? "block" : "none",
            }}
          >
            {overdueReturnRendered && <OverdueReturnsContainer />}
          </div>
        </StyledContentContainer>
      </Grid>
    </StyledMainLayout>
  );
};

export default memo(ReturnManagerTabPanel);
