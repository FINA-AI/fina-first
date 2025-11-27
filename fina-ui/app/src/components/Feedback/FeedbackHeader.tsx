import { Box } from "@mui/system";
import Tabs from "@mui/material/Tabs";
import { Tab } from "@mui/material";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import { useTranslation } from "react-i18next";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ToolbarIcon from "../common/Icons/ToolbarIcon";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import { styled } from "@mui/material/styles";
import React from "react";
import { FeedbackCategoryType } from "../../types/feedback.type";

const StyledHeader = styled(Box)(({ theme }: any) => ({
  ...theme.pageToolbar,
  padding: "9px",
  justifyContent: "space-between",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledTab = styled(Tab)(({ theme }: any) => ({
  padding: 4,
  minWidth: 0,
  minHeight: 0,
  bottom: "auto",
  fontWeight: 600,
  fontSize: 14,
  lineHeight: "16px",
  marginRight: 24,
  textTransform: "capitalize",
  background: "inherit",
  color: theme.palette.mode === "light" ? "#FFFFFB3" : "#ABBACE",
}));

interface FeedbackHeaderType {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setIsAddNewOpen: React.Dispatch<
    React.SetStateAction<{ isOpen: boolean; card: FeedbackCategoryType }>
  >;
}
const FeedbackHeader: React.FC<FeedbackHeaderType> = ({
  activeTab,
  setActiveTab,
  setIsAddNewOpen,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  return (
    <StyledHeader data-testid={"header"}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tabs
          value={activeTab}
          sx={{ minHeight: "0px" }}
          data-testid={"tabs-container"}
        >
          <StyledTab
            label={"feedback"}
            value={"feedback"}
            onClick={() => setActiveTab("feedback")}
            data-testid={"feedback"}
          />
          <StyledTab
            label={"feedback category"}
            value={"category"}
            onClick={() => setActiveTab("category")}
            data-testid={"category"}
          />
        </Tabs>
      </Box>
      {activeTab === "category" ? (
        <Box sx={{ display: "flex", alignItems: "center" }} gap={"8px"}>
          <ToolbarIcon
            Icon={<RefreshRoundedIcon />}
            onClickFunction={() => {}}
          />
          {hasPermission(PERMISSIONS.FEEDBACK_CATEGORY_AMEND) && (
            <PrimaryBtn
              onClick={() => {
                setIsAddNewOpen({
                  isOpen: true,
                  card: { id: 0, nameStrId: 0, name: "" },
                });
              }}
              endIcon={<AddRoundedIcon />}
              data-testid={"add-new-button"}
            >
              {t("addNew")}
            </PrimaryBtn>
          )}
        </Box>
      ) : (
        <Box height={32} />
      )}
    </StyledHeader>
  );
};

export default FeedbackHeader;
