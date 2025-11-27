import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import { styled } from "@mui/material/styles";

interface ToolsListProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMenuOpen: boolean;
}

interface Tab {
  label: string;
  value: string;
  permission?: string;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  backgroundColor: theme.palette.paperBackground,
  "& .Mui-selected": {
    backgroundColor:
      theme.palette.mode === "light"
        ? "#EAECF0 !important"
        : "#344258 !important",
  },
  "& .MuiTab-root": {
    alignItems: "flex-start !important",
    padding: "16px 20px",
    textTransform: "none",
    fontSize: 12,
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#4F5863",
    fontWeight: 500,
    lineHeight: "16px",
    background: "inherit",
  },
}));

const StyledTab = styled(Tab)(({ theme }: any) => ({
  borderBottom: theme.palette.borderColor,
  color: `${theme.palette.mode === "dark" ? "#FFFFFF" : "#4F5863"} !important`,
}));

const StyledText = styled("span")({
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "150%",
  textTransform: "capitalize",
  whiteSpace: "nowrap",
  WebkitWritingMode: "vertical-rl",
  padding: "8px",
});

const ToolsList: React.FC<ToolsListProps> = ({
  activeTab,
  setActiveTab,
  isMenuOpen,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const tabs: Tab[] = [
    {
      label: t("releaseMDT"),
      value: "releaseMDT",
      permission: PERMISSIONS.RELEASE_MDT_REVIEW,
    },
    {
      label: t("mdtToXml"),
      value: "mdtToXml",
      permission: PERMISSIONS.MDT_TO_XML,
    },
    {
      label: t("returnToXml"),
      value: "returnToXml",
      permission: PERMISSIONS.RETURN_TO_XML,
    },
    { label: t("package"), value: "package" },
    {
      label: t("finaFileDecryption"),
      value: "finaFileDecryption",
      permission: PERMISSIONS.FINA_FILE_DECRYPTION,
    },
    {
      label: t("auditLog"),
      value: "auditLog",
      permission: PERMISSIONS.AUDIT_LOG_REVIEW,
    },
    {
      label: t("mailLog"),
      value: "mailLog",
      permission: PERMISSIONS.MAIL_LOG_REVIEW,
    },
    {
      label: t("feedback"),
      value: "feedback",
      permission: PERMISSIONS.FEEDBACK_REVIEW,
    },
  ];

  useEffect(() => {
    if (!activeTab) {
      const firstAvailableTab = tabs.find((tab) =>
        hasPermission(tab?.permission || "")
      );
      if (firstAvailableTab) {
        setActiveTab(firstAvailableTab.value);
      }
    }
  }, []);

  const handleChange = (event: any, newValue: string) => {
    setActiveTab(newValue);
  };

  return isMenuOpen ? (
    <StyledRoot>
      <Tabs
        orientation="vertical"
        onChange={handleChange}
        value={activeTab}
        sx={(theme) => ({
          "& .MuiTabs-indicator": {
            display: "flex",
            justifyContent: "center",
            backgroundColor: theme.palette.primary.main,
            left: "0px !important",
            width: 4,
            height: "20px !important",
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            marginTop: "13px !important",
          },
        })}
        data-testid={"tabs-container"}
      >
        {tabs.map((tab) => {
          if (!tab.permission || hasPermission(tab.permission)) {
            return (
              <StyledTab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                data-testid={tab.value}
              />
            );
          }
        })}
      </Tabs>
    </StyledRoot>
  ) : (
    <StyledText>{t(activeTab)}</StyledText>
  );
};

export default ToolsList;
