import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import EditIconMui from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Checkbox, Grid, IconButton, Typography } from "@mui/material";
import TextField from "../../common/Field/TextField";
import TextButton from "../../common/Button/TextButton";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/material/styles";
import { Language } from "../../../types/settings.type";

interface LanguagesCardProps {
  data: Partial<Language>;
  changeSelected: (lang?: string) => void;
  onSaveLanguage: (key: string, activeLang: Partial<Language>) => void;
  onDeleteLanguage: (id?: number, data?: Partial<Language>) => Promise<void>;
  onEditLanguage: (lang: Partial<Language>) => Promise<void>;
  addNewLanguageFunc: (
    newLanguage: Partial<Language>,
    langIndex: number
  ) => void;
  onCancelFunc: (card: Partial<Language>, cardIndex: number) => void;
  index: number;
}

const StyledCardBox = styled(Box)(({ theme }: { theme: any }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#344258" : "#F9F9F9",
  width: "100%",
  border: theme.palette.borderColor,
  borderRadius: 4,
}));

const StyledEditIcon = styled(EditIconMui)(({ theme }: { theme: any }) => ({
  color: "#4D7CFF",
  ...theme.smallIcon,
}));

const StyledDeleteIcon = styled(DeleteIcon)(({ theme }: { theme: any }) => ({
  color: "#FF4128",
  ...theme.smallIcon,
}));

const StyledCardWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  padding: "12px 20px",
});

const StyledCardHeaderBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
});

const StyledLangText = styled(Typography)(({ theme }) => ({
  fontSize: 13,
  color: theme.palette.mode === "dark" ? "#AEB8CB" : "#2C3644",
  lineHeight: "20px",
  fontWeight: 600,
  marginRight: 8,
}));

const StyledLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFF" : "#596D89",
  fontSize: 11,
  fontWeight: 500,
  lineHeight: "12px",
}));

const StyledValue = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  color: theme.palette.mode === "dark" ? "#AEB8CB" : "#2C3644",
  lineHeight: "20px",
}));

const StyledLangName = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFF" : "#596D89",
}));

const StyledCheckbox = styled(Checkbox)(({ theme }: { theme: any }) => ({
  ...theme.smallIcon,
  color: "#98A7BC",
}));

const LanguagesCard: React.FC<LanguagesCardProps> = ({
  data,
  changeSelected,
  onSaveLanguage,
  onDeleteLanguage,
  onEditLanguage,
  addNewLanguageFunc,
  onCancelFunc,
  index,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const [languageInfo, setLanguageInfo] = useState<Partial<Language>>(data);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<{ [key: string]: boolean }>({
    code: false,
    name: false,
    dateFormat: false,
    dateTimeFormat: false,
    htmlCharSet: false,
    xmlEncoding: false,
    numberFormat: false,
  });

  const isDisabled = !hasPermission(PERMISSIONS.FINA_SECURITY_AMEND);

  useEffect(() => {
    setLanguageInfo(data);
    setEditMode(data?.editMode ?? false);
  }, [data]);

  const clickHandler = (data: Partial<Language>) => {
    if (!data.default) {
      data.default = true;
      onSaveLanguage("fina2.default.language.id", data);
    }
    changeSelected(data?.code);
  };

  const onChangeValue = (key: keyof Language, value: string) => {
    (languageInfo as any)[key] = value;
  };

  const onCancel = () => {
    data.editMode = false;
    setEditMode(false);
    onCancelFunc(data, index);
  };

  const onSave = () => {
    if (data.id === 0) {
      addNewLanguageFunc(languageInfo, index);
      data.editMode = false;
    } else {
      onEditLanguage(languageInfo);
      data.editMode = false;
    }
    onFieldErrorHandler();
  };

  const onFieldErrorHandler = () => {
    Object.entries(error).forEach(([key, _]) => {
      error[key] = !Boolean((languageInfo as any)[key]);
    });
    setError({ ...error });
  };

  const GetFields = (label: keyof Language, value?: string) => {
    return editMode ? (
      <TextField
        label={t(label)}
        value={value}
        onChange={(value: string) => {
          onChangeValue(label, value);
        }}
        size={"small"}
        isError={error[label]}
        required={true}
        fieldName={label + "-field"}
      />
    ) : (
      <Box>
        <StyledLabel data-testid={label + "-label"}>{t(label)}</StyledLabel>
        <StyledValue data-testid={label + "-value"}>{value}</StyledValue>
      </Box>
    );
  };

  return (
    <Box style={{ marginTop: "15px" }}>
      <StyledCardBox>
        <StyledCardWrapper data-testid={"language-card-" + index}>
          <StyledCardHeaderBox data-testid={"header"}>
            <Box display={"flex"} alignItems={"center"} mb={"14px"}>
              <Box mr={"10px"}>
                <StyledCheckbox
                  icon={<StarOutlineIcon />}
                  checked={data.isDefault}
                  checkedIcon={<StarIcon style={{ color: "#FF8D00" }} />}
                  onChange={() => {
                    clickHandler(data);
                  }}
                  data-testid={"default-language-checkbox"}
                />
              </Box>
              <StyledLangText data-testid={"language-code"}>
                {data.id === 0 ? (
                  <Grid item xs={2}>
                    {data.id === 0 && GetFields("code", data.code)}
                  </Grid>
                ) : (
                  data.code
                )}
              </StyledLangText>
              <StyledLangName
                fontSize={12}
                mr={"8px"}
                data-testid={"language-name"}
              >
                {data.id === 0 ? (
                  <Grid item xs={2}>
                    {data.id === 0 && GetFields("name", data.name)}
                  </Grid>
                ) : (
                  data.name
                )}
              </StyledLangName>
            </Box>
            <Box>
              {editMode ? (
                <>
                  <TextButton
                    color={"secondary"}
                    onClick={() => {
                      onCancel();
                    }}
                    data-testid={"cancel-button"}
                  >
                    {t("cancel")}
                  </TextButton>
                  <TextButton
                    onClick={() => {
                      onSave();
                    }}
                    endIcon={
                      <CheckIcon sx={{ width: "12px", height: "12px" }} />
                    }
                    data-testid={"save-button"}
                  >
                    {t("save")}
                  </TextButton>
                </>
              ) : (
                <Box display={"flex"} alignItems={"center"} gap={"4px"}>
                  <IconButton
                    disabled={isDisabled}
                    style={{
                      padding: 4,
                      background: "none",
                      border: "none",
                      opacity: isDisabled ? 0.5 : 1,
                    }}
                    onClick={() => {
                      setEditMode(true);
                    }}
                    data-testid={"edit-icon-button"}
                  >
                    <StyledEditIcon />
                  </IconButton>
                  <IconButton
                    disabled={isDisabled}
                    style={{
                      padding: 4,
                      background: "none",
                      border: "none",
                      opacity: isDisabled ? 0.5 : 1,
                    }}
                    onClick={() => onDeleteLanguage(data.id, data)}
                    data-testid={"delete-icon-button"}
                  >
                    <StyledDeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </StyledCardHeaderBox>
          <Box>
            <Grid container spacing={editMode ? 2 : 0}>
              <Grid item xs={2}>
                {GetFields("dateFormat", data.dateFormat)}
              </Grid>
              <Grid item xs={2}>
                {GetFields("dateTimeFormat", data.dateTimeFormat)}
              </Grid>
              <Grid item xs={2}>
                {GetFields("htmlCharSet", data.htmlCharSet)}
              </Grid>
              <Grid item xs={2}>
                {GetFields("xmlEncoding", data.xmlEncoding)}
              </Grid>
              <Grid item xs={2}>
                {GetFields("numberFormat", data.numberFormat)}
              </Grid>
            </Grid>
          </Box>
        </StyledCardWrapper>
      </StyledCardBox>
    </Box>
  );
};

export default LanguagesCard;
