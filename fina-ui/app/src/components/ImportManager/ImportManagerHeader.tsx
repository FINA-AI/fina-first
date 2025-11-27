import React from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import Tabs from "@mui/material/Tabs";
import { Tab } from "@mui/material";
import { PERMISSIONS } from "../../api/permissions";
import useConfig from "../../hoc/config/useConfig";

import { styled } from "@mui/material/styles";

interface ImportManagerHeaderProps {
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
}

export const StyledGridHeader = styled(Box)(({ theme }: { theme: any }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: theme.toolbar.height,
  padding: theme.toolbar.padding,
  boxSizing: "border-box",
  width: "100%",
}));

export const StyledFlexBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

export const StyledTabWrapper = styled(Tabs)(() => ({
  minHeight: 0,
}));

export const StyledTab = styled(Tab)(() => ({
  padding: 4,
  minWidth: 0,
  minHeight: 0,
  bottom: "auto",
  fontWeight: 600,
  fontSize: 14,
  lineHeight: "21px",
  marginRight: 24,
  textTransform: "capitalize",
  background: "inherit",
}));

const ImportManagerHeader: React.FC<ImportManagerHeaderProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { hasPermission } = useConfig();
  const { t } = useTranslation();

  return (
    <StyledGridHeader>
      <StyledFlexBox>
        <StyledTabWrapper value={activeTab}>
          {hasPermission(PERMISSIONS.IMPORT_MANAGER_FILE_REVIEW) && (
            <StyledTab
              label={t("uploadfiles")}
              value={"uploadFiles"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveTab("uploadFiles");
              }}
            />
          )}
          <StyledTab
            label={t("importmanager")}
            value={"importManager"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveTab("importManager");
            }}
          />
        </StyledTabWrapper>
      </StyledFlexBox>
    </StyledGridHeader>
  );
};

export default ImportManagerHeader;
