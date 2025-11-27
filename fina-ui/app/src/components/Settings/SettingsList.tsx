import { Box } from "@mui/system";
import { Tab } from "@mui/material";
import { useTranslation } from "react-i18next";
import Tabs from "@mui/material/Tabs";
import { styled } from "@mui/material/styles";
import { Property } from "../../types/settings.type";
import React from "react";

interface SettingsListProps {
  activeList: string;
  setActiveList: (activeList: string) => void;
  setCancelOpen: (open: boolean) => void;
  data: Property[];
  setChangeTabName: (value: string) => void;
  langConfirmModal?: boolean;
}

const StyledRoot = styled(Box)(({ theme }: { theme: any }) => ({
  height: "100%",
  backgroundColor: theme.palette.paperBackground,
  "& .Mui-selected": {
    backgroundColor: `${theme.palette.action.select} !important`,
  },
  "& .MuiTab-root": {
    alignItems: "flex-start !important",
    padding: "16px 20px",
    textTransform: "none",
    fontSize: 12,
    color: `${
      theme.palette.mode === "dark" ? "#FFFFFF" : "#4F5863"
    } !important`,
    fontWeight: 500,
    lineHeight: "16px",
    background: theme.palette.mode === "dark" ? "#2B3748" : "#FFFFFF",
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
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
}));

const SettingsList: React.FC<SettingsListProps> = ({
  activeList,
  setActiveList,
  setCancelOpen,
  data,
  setChangeTabName,
  langConfirmModal,
}) => {
  const { t } = useTranslation();

  const handleChange = (event: any, newValue: string) => {
    const field = data.find((item) => item.immutableData);
    if (field || langConfirmModal) {
      setCancelOpen(true);
      setChangeTabName(newValue);
    } else {
      setActiveList(newValue);
    }
  };

  return (
    <StyledRoot>
      <StyledTabs
        orientation={"vertical"}
        onChange={handleChange}
        value={activeList}
        data-testid={"settings-tabs"}
      >
        <Tab
          label={t("security")}
          value="security"
          data-testid={"security-tab"}
        />
        <Tab label={t("e-mail")} value="email" data-testid={"email-tab"} />
        <Tab
          label={t("languages")}
          value="languages"
          data-testid={"languages-tab"}
        />
      </StyledTabs>
    </StyledRoot>
  );
};

export default SettingsList;
