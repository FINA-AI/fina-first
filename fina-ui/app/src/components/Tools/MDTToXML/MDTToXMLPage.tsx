import React from "react";
import { Box, Chip, Grid, Typography } from "@mui/material";
import TextField from "../../common/Field/TextField";
import Select from "../../common/Field/Select";
import CustomAutoComplete from "../../common/Field/CustomAutoComplete";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import SettingsIcon from "@mui/icons-material/Settings";
import { useTranslation } from "react-i18next";
import withLoading from "../../../hoc/withLoading";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/material/styles";
import { LanguageTypeWithUIProps } from "../../../types/common.type";
import { MDTToXMLData } from "../../../types/tools.type";
import { ReturnDefinitionType } from "../../../types/returnDefinition.type";

interface MDTToXMLPageProps {
  languageData: LanguageTypeWithUIProps[];
  MDTChips: { chipName: string; value: string }[];
  save: VoidFunction;
  data: MDTToXMLData;
  definitions: ReturnDefinitionType[];
  setData: (data: MDTToXMLData) => void;
  onMDTChange(chip: { chipName: string; value: string }, value: string): void;
}

const StyledChip = styled(Chip)(({ theme }: any) => ({
  "&.inactive": {
    width: "fit-content",
    height: "24px",
    fontSize: "12px",
    border: theme.palette.borderColor,
  },
  "&.active": {
    color: theme.palette.mode === "dark" ? "#344258" : "#F9FAFB",
    backgroundColor: theme.palette.primary.main,
    width: "fit-content",
    height: "24px",
    fontSize: "12px",
    border: `1px solid ${theme.palette.primary.main}`,
    "&:hover": {
      color: theme.palette.mode === "dark" ? "#344258" : "#F9FAFB",
      backgroundColor: theme.palette.secondary.main,
      border: `1px solid ${theme.palette.secondary.main}`,
    },
  },
}));

const StyledMainBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

const StyledDetailsBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "12px 16px",
});

const StyledDetailText = styled(Typography)({
  lineHeight: "21px",
  fontSize: "14px",
  fontWeight: 600,
  marginBottom: "12px",
});

const StyledDefinitionGrid = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  marginTop: "24px",
  paddingRight: "8px",
});

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  ...theme.pageToolbar,
  padding: "9px 16px",
  justifyContent: "flex-end",
  borderBottom: theme.palette.borderColor,
}));

const MDTToXMLPage: React.FC<MDTToXMLPageProps> = ({
  languageData,
  MDTChips,
  save,
  data,
  definitions,
  setData,
  onMDTChange,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  return (
    <StyledMainBox>
      <StyledToolbar>
        <PrimaryBtn
          disabled={!hasPermission(PERMISSIONS.MDT_GENERATE)}
          onClick={() => save()}
          endIcon={<SettingsIcon />}
          data-testid={"generate-button"}
        >
          {t("generate")}
        </PrimaryBtn>
      </StyledToolbar>
      <StyledDetailsBox>
        <StyledDetailText>{t("details")}</StyledDetailText>
        <Grid container display="flex" flexDirection="row">
          <Grid item xs={6} paddingRight={"8px"}>
            <TextField
              label={t("outputFolder")}
              value={data.folder}
              onChange={(value: string) => (data.folder = value)}
              fieldName={"outputFolder"}
            />
          </Grid>
          <Grid item xs={6} paddingLeft={"8px"}>
            <Select
              label={`${t("language")}:`}
              data={languageData as any}
              onChange={(id) =>
                (data.language =
                  languageData.find((row) => row.id.toString() === id) ?? null)
              }
              value={data.language?.value}
              data-testid={"language-select"}
            />
          </Grid>
        </Grid>
        <StyledDefinitionGrid container>
          <StyledDetailText>{t("returnDefinition")}</StyledDetailText>
          <Grid item xs={6} paddingRight={"4px"}>
            <CustomAutoComplete
              label={t("returnDefinition")}
              data={definitions}
              displayFieldName={"name"}
              valueFieldName={"id"}
              selectedItem={data.definition}
              onChange={(val) => (data.definition = val)}
              virtualized={true}
              disabled={data.allReturns}
              fieldName={"returnDefinition"}
            />
          </Grid>
          <StyledChip
            variant="outlined"
            className={data.allReturns ? "active" : "inactive"}
            label={t("chooseAll")}
            onClick={() => setData({ ...data, allReturns: !data.allReturns })}
            style={{ marginTop: "8px" }}
            data-testid={"choose-all-chip"}
          />
        </StyledDefinitionGrid>
      </StyledDetailsBox>
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px 0px 16px",
        }}
      >
        <StyledDetailText>MDT</StyledDetailText>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
          data-testid={"chips-container"}
        >
          {MDTChips.map((chip) => (
            <StyledChip
              key={chip.chipName}
              className={
                data && data.mdt.find((item) => item.value === chip.value)
                  ? "active"
                  : "inactive"
              }
              label={t(chip.chipName)}
              variant="outlined"
              onClick={(event: any) => onMDTChange(chip, event.target.value)}
              data-testid={chip.chipName}
            />
          ))}
        </Box>
      </Grid>
    </StyledMainBox>
  );
};

export default withLoading(MDTToXMLPage);
