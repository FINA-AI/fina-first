import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FC } from "react";
import { styled, useTheme } from "@mui/material/styles";

interface RevisionTypeColumnFieldProps {
  value: "ADD" | "MOD" | "DEL";
}

const StyledStatusBox = styled(Box)<{ bgColor: string }>(({ bgColor }) => ({
  backgroundColor: bgColor,
  borderRadius: 2,
  lineBreak: "anywhere",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingTop: "3px",
  paddingBottom: "3px",
}));

const StyledStatusText = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: 12,
  lineHeight: "16px",
}));

const RevisionTypeColumnField: FC<RevisionTypeColumnFieldProps> = ({
  value,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const getColor = () => {
    switch (value) {
      case "ADD":
        return theme.palette.mode === "light" ? "#289E20" : "#ABEFC6";
      case "MOD":
        return theme.palette.mode === "light" ? "ORANGE" : "#FEF0C7";
      case "DEL":
        return theme.palette.mode === "light" ? "#FF4128" : "#B42318";
    }
  };

  const getBgColor = () => {
    switch (value) {
      case "ADD":
        return theme.palette.mode === "light" ? "#ebf5e9" : "#079455";
      case "MOD":
        return theme.palette.mode === "light" ? "#fff7e6" : "#DC6803";
      case "DEL":
        return theme.palette.mode === "light" ? "#f5e9e9" : "#FDA29B";
    }
  };

  return (
    <StyledStatusBox width={"100%"} bgColor={getBgColor()}>
      <StyledStatusText color={getColor()}>{t(value)}</StyledStatusText>
    </StyledStatusBox>
  );
};

export default RevisionTypeColumnField;
