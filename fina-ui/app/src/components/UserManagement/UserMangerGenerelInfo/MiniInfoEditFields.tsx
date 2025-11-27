import { Box, Grid } from "@mui/material";
import TextField from "../../common/Field/TextField";
import React from "react";
import { styled } from "@mui/system";
import { LegalFormIcon } from "../../../api/ui/icons/LegalFormIcon";

interface MiniInfoEditFieldsProps {
  value?: string;
  onChange: (value: string) => void;
  label: string;
  isIcon?: boolean;
  isRequired?: boolean;
}

const StyledBoxItem = styled(Box)(() => ({
  paddingBottom: "20px",
  paddingTop: "20px",
  "& .MuiAccordionSummary-expandIconWrapper": {
    display: "none !important",
  },
}));

const StyledGridItem = styled(Grid)(() => ({
  width: "100%",
  flexDirection: "row",
  display: "flex",
  gap: 8,
  alignItems: "center",
}));

const StyledLogoContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#2b3748" : "#F0F1F7",
  width: "40px",
  height: "40px",
  borderRadius: "6px",
  color: "#8695B1",
  "& :hover": {
    "& $logoContainer": {
      backgroundColor: "#D4E0FF !important",
      color: "rgba(104, 122, 158, 0.8) !important",
    },
  },
}));

const MiniInfoEditFields: React.FC<MiniInfoEditFieldsProps> = ({
  value,
  onChange,
  label,
  isIcon = true,
  isRequired = false,
}) => {
  return (
    <StyledBoxItem display={"flex"} flex={1} width={"20%"} p={2}>
      <Grid container direction={"column"} spacing={2}>
        <StyledGridItem item>
          {isIcon && (
            <Grid item xs={1}>
              <StyledLogoContainer
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                flex={1}
              >
                <LegalFormIcon />
              </StyledLogoContainer>
            </Grid>
          )}
          <TextField
            onChange={(val: string) => {
              onChange(val);
            }}
            label={label}
            value={value}
            required={isRequired}
          />
        </StyledGridItem>
      </Grid>
    </StyledBoxItem>
  );
};

export default MiniInfoEditFields;
