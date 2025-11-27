import { Box, Grid, InputBase, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

interface SettingsTextFieldProps {
  name: string;
  value?: string;
  fieldKey: string;
  disabled?: boolean;
  readOnly: boolean;
  fieldType?: string;
  onChangeSecurity?(key: string, value: number | string): void;
}

const StyledItemField = styled("fieldset")(({ theme }) => ({
  border:
    theme.palette.mode === "dark" ? `1px solid #3C4D68` : "1px solid #D0D5DD",
  borderRadius: 4,
  paddingBottom: 0,
  paddingTop: 0,
  "&:focus-within": {
    borderColor: `${theme.palette.primary.main} !important`,
  },
  "&:hover": {
    borderColor:
      theme.palette.mode === "dark" ? "#5D789A" : "rgb(184, 185, 190)",
  },
  "&:focus-within legend": {
    color: `${theme.palette.primary.main} !important`,
  },
}));

const StyledItemName = styled(Typography)({
  fontWeight: 500,
  fontSize: 11,
  lineHeight: "12px",
});

const StyledFieldValue = styled(InputBase)(({ theme }) => ({
  width: "100%",
  fontWeight: 400,
  fontSize: 12,
  color: theme.palette.mode === "dark" ? "#F5F7FA" : "#2C3644",
  overflow: "hidden",
  whiteSpace: "nowrap",
}));

const StyledLegend = styled("legend")(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#AEB8CB" : "#344054",
}));

const SettingsTextField: React.FC<SettingsTextFieldProps> = ({
  name,
  value,
  onChangeSecurity,
  fieldKey,
  disabled,
  readOnly = false,
  fieldType = "string",
}) => {
  const { t } = useTranslation();
  const decimalPattern = /^\d*(?:[.]\d*)?$/;

  const onChange = (e: any) => {
    if (fieldType === "number") {
      if (decimalPattern.test(e.target.value)) {
        onChangeSecurity?.(fieldKey, e.target.value);
      }
    } else {
      onChangeSecurity?.(fieldKey, e.target.value);
    }
  };

  return (
    <Grid item xl={4} md={6} sm={6} xs={12}>
      <Box style={{ padding: "4px 2px" }}>
        <StyledItemField data-testid={name + "-fieldset"}>
          <StyledLegend>
            <StyledItemName>{t(name)}</StyledItemName>
          </StyledLegend>
          <StyledFieldValue
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            data-testid={name + "-input"}
          />
        </StyledItemField>
      </Box>
    </Grid>
  );
};

export default SettingsTextField;
