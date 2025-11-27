import React from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import TextField from "../common/Field/TextField";
import { styled } from "@mui/material/styles";

interface BusinessAndStrategySectionProps {
  name: string;
  text: string;
  edit: boolean;
  setEdit: (value: boolean) => void;
  expand: boolean;
  setExpand: (value: boolean) => void;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

const StyledSectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: 12,
  color: theme.palette.mode === "light" ? "#707C93" : "#c1d3e7",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  marginRight: 3,
}));

const StyledText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "expand",
})<{ expand: boolean }>(
  ({ theme, expand }: { theme: any; expand: boolean }) => ({
    fontSize: 13,
    fontWeight: 400,
    color: theme.palette.textColor,
    wordBreak: "break-word",
    ...(!expand && {
      textOverflow: "ellipsis!important",
      overflow: "hidden!important",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
    }),
  })
);

const StyledSave = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 12,
  marginLeft: 4,
}));

const StyledCancel = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  padding: 0,
  paddingRight: 4,
  color:
    theme.palette.mode === "light"
      ? "rgba(104, 122, 158, 0.8)"
      : "rgba(153,169,194,0.8)",
  borderRight: "1px solid rgba(104, 122, 158, 0.8)",
}));

const StyledEditIcon = styled(EditIcon)(({ theme }) => ({
  color:
    theme.palette.mode === "light"
      ? "rgba(104, 122, 158, 0.8)"
      : "rgba(153,169,194,0.8)",
  cursor: "pointer",
  fontSize: 16,
}));

const seeMoreLessStyles = {
  color: "#2962FF",
  fontSize: 12,
  cursor: "pointer",
};

const StyledSeeMoreLess = styled(Typography)({
  ...seeMoreLessStyles,
});

const StyledKeyboardArrowUpRounded = styled(KeyboardArrowUpRounded)({
  ...seeMoreLessStyles,
});

const StyledKeyboardArrowDownRounded = styled(KeyboardArrowDownRounded)({
  ...seeMoreLessStyles,
});

const BusinessAndStrategySection: React.FC<BusinessAndStrategySectionProps> = ({
  name,
  text,
  edit,
  setEdit,
  expand,
  setExpand,
  onSave,
  onChange,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" flexDirection="column">
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        marginBottom={"8px"}
      >
        <StyledSectionHeader>{t(name)}</StyledSectionHeader>
        {!edit ? (
          <StyledEditIcon onClick={() => setEdit(true)} />
        ) : (
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <StyledCancel
              onClick={() => {
                setEdit(false);
                onCancel();
              }}
            >
              {t("cancel")}
            </StyledCancel>
            <StyledSave onClick={onSave}>
              {t("save")}
              <CheckIcon fontSize={"inherit"} />
            </StyledSave>
          </Box>
        )}
      </Box>

      {!edit ? (
        <StyledText expand={expand}>{text}</StyledText>
      ) : (
        <TextField
          value={text}
          onChange={onChange}
          multiline={true}
          fontSize={13}
        />
      )}

      {!edit && (
        <Box
          display={"flex"}
          alignItems={"center"}
          sx={{
            wrap: "nowrap",
            marginTop: "5px",
          }}
          onClick={() => setExpand(!expand)}
        >
          <StyledSeeMoreLess>
            {expand ? t("seeLess") : t("seeMore")}
          </StyledSeeMoreLess>
          {expand ? (
            <StyledKeyboardArrowUpRounded />
          ) : (
            <StyledKeyboardArrowDownRounded />
          )}
        </Box>
      )}
    </Box>
  );
};

export default BusinessAndStrategySection;
