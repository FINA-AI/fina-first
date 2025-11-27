import { Box } from "@mui/system";
import React, { SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Typography } from "@mui/material";
import GhostBtn from "../common/Button/GhostBtn";
import SettingsList from "./SettingsList";
import SettingsTabPanel from "./SettingsTabPanel";
import UserManagerBreadcrumb from "./SettingsBreadcrumb";
import SettingsAsGridTable from "./SettingsAsGridTable";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import ConfirmModal from "../common/Modal/ConfirmModal";
import SearchHopField from "../common/Field/SearchHopField";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";
import { styled } from "@mui/material/styles";
import { Language, Property } from "../../types/settings.type";
import { CancelIcon } from "../../api/ui/icons/CancelIcon";

interface SettingsPageProps {
  setData: React.Dispatch<SetStateAction<Property[]>>;
  data: Property[];
  onSaveClick: VoidFunction;
  loading: boolean;
  onChangeTabConfirm: VoidFunction;
  setCancelOpen: (open: boolean) => void;
  isCancelOpen: boolean;
  activeList: string;
  setActiveList: (activeList: string) => void;
  asGridActive: boolean;
  setAsGridActive: (value: boolean) => void;
  setChangeTabName: (value: string | boolean) => void;
  langConfirmModal?: boolean;
  languages: Partial<Language>[];
  setLanguages: (languages: Partial<Language>[]) => void;
  onSaveLanguage(key: string, activeLang: Partial<Language>): void;
  onChangeSecurity(key: string, value: string): void;
  onChange(key: string, value: string): void;
}

export interface SearchInfo {
  hopIndex: number | null;
  searchedRows: Property[];
  searchedValue: string | null;
}

const StyledRoot = styled(Box)({
  overflow: "hidden",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  minHeight: 0,
});

const StyledMainLayout = styled(Box)(({ theme }: { theme: any }) => ({
  padding: "16px",
  backgroundColor: "#F0F1F7",
  height: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  ...theme.mainLayout,
}));

const StyledGridContainer = styled(Grid)({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
});

const StyledGridItem = styled(Grid)({
  paddingTop: 0,
  height: "100%",
});

const StyledGridHeader = styled(Box)(({ theme }: { theme: any }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: 25,
  padding: "14px 12px",
  borderBottom: theme.palette.borderColor,
}));

const StyledTabName = styled(Typography)({
  lineHeight: "21px",
  fontSize: 14,
  fontWeight: 600,
});

const StyledMainFrame = styled(Grid)(({ theme }: { theme: any }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  boxSizing: "border-box",
  minHeight: 0,
  backgroundColor: theme.palette.paperBackground,
  borderRadius: "4px 4px 0px 0px",
}));

const StyledPageDetails = styled(StyledGridItem)({
  width: "100%",
  display: "flex",
});

const StyledListBorder = styled(StyledGridItem)(
  ({ theme }: { theme: any }) => ({
    borderRight: theme.palette.borderColor,
  })
);

const SettingsPage: React.FC<SettingsPageProps> = ({
  data,
  setData,
  onSaveClick,
  loading,
  onChange,
  onChangeTabConfirm,
  isCancelOpen,
  setCancelOpen,
  onChangeSecurity,
  activeList,
  setActiveList,
  asGridActive,
  setAsGridActive,
  setChangeTabName,
  onSaveLanguage,
  langConfirmModal,
  languages,
  setLanguages,
}) => {
  const { hasPermission } = useConfig();

  const { t } = useTranslation();
  const [searchedInfo, setSearchedInfo] = useState<SearchInfo>({
    hopIndex: null,
    searchedRows: [],
    searchedValue: "",
  });

  const handleChangeFunction = () => {
    const field = data.find((item) => item.immutableData);
    if (field) {
      setCancelOpen(true);
      setChangeTabName(true);
    } else {
      setAsGridActive(!asGridActive);
    }
  };

  const addLanguage = () => {
    setLanguages([
      ...languages,
      {
        version: 0,
        dateFormat: "",
        dateTimeFormat: "",
        htmlEncoding: "",
        xmlEncoding: "",
        numberFormat: "",
        code: "",
        id: 0,
        editMode: true,
        isDefault: false,
      },
    ]);
  };

  const onSearchChange = (value: string) => {
    value = value.toLowerCase();

    if (!value) {
      setSearchedInfo({
        hopIndex: null,
        searchedRows: [],
        searchedValue: value,
      });
      return;
    }

    let arr: Property[] = [];
    for (let item of data) {
      if (
        item.description.toLowerCase().includes(value) ||
        item.key.toLowerCase().includes(value)
      ) {
        arr.push(item);
      }
    }

    let index = data.findIndex((item) => item.id === arr[0]?.id);

    setSearchedInfo({
      hopIndex: index,
      searchedRows: arr,
      searchedValue: value,
    });
  };

  const onNextHopClick = (activeRowIndex: number) => {
    if (activeRowIndex > 0) {
      let index = data.findIndex(
        (item) => item.id === searchedInfo.searchedRows[activeRowIndex - 1].id
      );

      setSearchedInfo({
        ...searchedInfo,
        hopIndex: index,
      });
    }
  };

  const onClear = () => {
    setSearchedInfo({
      hopIndex: null,
      searchedRows: [],
      searchedValue: null,
    });
  };

  return (
    <StyledMainLayout>
      <StyledRoot data-testid={"settings-page"}>
        <UserManagerBreadcrumb name={t("settings")} />
        <StyledMainFrame>
          <Grid>
            <StyledGridHeader>
              <Box>
                <StyledTabName>{t("settings")}</StyledTabName>
              </Box>
              <Box display={"flex"} alignItems={"center"}>
                {asGridActive && activeList === "security" && (
                  <SearchHopField
                    onSearchChange={onSearchChange}
                    searchedTotalResult={searchedInfo.searchedRows.length}
                    onNextHopClick={(index) => onNextHopClick(index)}
                    onClear={onClear}
                  />
                )}

                {activeList === "security" && (
                  <GhostBtn onClick={handleChangeFunction} height={32}>
                    <span> {asGridActive ? t("asGeneral") : t("asGrid")} </span>
                  </GhostBtn>
                )}
                <Box ml={"10px"}>
                  {hasPermission(PERMISSIONS.FINA_SECURITY_AMEND) &&
                    activeList !== "languages" && (
                      <PrimaryBtn
                        onClick={onSaveClick}
                        data-testid={"save-button"}
                      >
                        {t("save")}
                      </PrimaryBtn>
                    )}
                  {activeList === "languages" && (
                    <PrimaryBtn
                      disabled={!hasPermission(PERMISSIONS.FINA_SECURITY_AMEND)}
                      onClick={addLanguage}
                      data-testid={"create-language-button"}
                    >
                      {t("addNew")}
                    </PrimaryBtn>
                  )}
                </Box>
              </Box>
            </StyledGridHeader>
          </Grid>
          <StyledGridContainer height={"100%"} display={"flex"}>
            <StyledListBorder width={200}>
              <SettingsList
                activeList={activeList}
                setActiveList={setActiveList}
                setCancelOpen={setCancelOpen}
                data={data}
                setChangeTabName={setChangeTabName}
                langConfirmModal={langConfirmModal}
              />
            </StyledListBorder>
            <StyledPageDetails>
              {asGridActive && activeList === "security" ? (
                <SettingsAsGridTable
                  data={data}
                  setData={setData}
                  loading={loading}
                  searchedInfo={searchedInfo}
                />
              ) : (
                <SettingsTabPanel
                  activeList={activeList}
                  data={data}
                  onChange={onChange}
                  onChangeSecurity={onChangeSecurity}
                  onSaveLanguage={onSaveLanguage}
                  setLanguages={setLanguages}
                  languages={languages}
                />
              )}
            </StyledPageDetails>
          </StyledGridContainer>
        </StyledMainFrame>
      </StyledRoot>
      {isCancelOpen && (
        <ConfirmModal
          isOpen={isCancelOpen}
          setIsOpen={setCancelOpen}
          onConfirm={() => {
            onChangeTabConfirm();
            setCancelOpen(false);
          }}
          confirmBtnTitle={t("confirm")}
          headerText={t("cancelHeaderText")}
          bodyText={t("cancelBodyText")}
          additionalBodyText={t("changes")}
          icon={<CancelIcon />}
        />
      )}
    </StyledMainLayout>
  );
};

export default SettingsPage;
