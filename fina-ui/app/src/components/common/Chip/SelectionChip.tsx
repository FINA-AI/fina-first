import { Box, ToggleButton } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

interface SelectionChipProps {
  editMode: boolean;
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
}

const StyledSelectionChip = styled(ToggleButton)(() => ({
  height: 25,
  marginRight: 5,
}));

const SelectionChip: React.FC<SelectionChipProps> = ({
  editMode = false,
  value,
  setValue,
  title,
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <StyledSelectionChip
        selected={value}
        onClick={() => {
          if (editMode) {
            setValue(!value);
          }
        }}
        disabled={!editMode}
        value={value}
        data-testid={title}
      >
        {t(title)}
      </StyledSelectionChip>
    </Box>
  );
};

export default SelectionChip;
