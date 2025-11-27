import React, { useEffect, useState } from "react";
import { TextField, Tooltip } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  MiProcess,
  MiTable,
  MiTableRowItem,
} from "../../../../types/manualInput.type";
import InfoIcon from "@mui/icons-material/Info";
import { darken, lighten } from "@mui/system";
import FunctionsIcon from "@mui/icons-material/Functions";

interface ManualInputTableTextFieldProps {
  rowItem: MiTableRowItem;
  miProcess: MiProcess;
  table: MiTable;
  isFormula: boolean;
  disabled: boolean;
}

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "isFormula",
})<{ isFormula: boolean }>(
  ({ theme, isFormula }: { theme: any; isFormula: boolean }) => ({
    "& .MuiInputBase-root": {
      width: 200,
      borderRadius: theme.general.borderRadius,
      border: theme.general.border,
      fontSize: "12px",
      height: 31,
      paddingRight: "5px",
      backgroundColor: isFormula
        ? theme.palette.mode === "light"
          ? lighten(theme.palette.primary.main, 0.5)
          : darken(theme.palette.primary.main, 0.5)
        : "",
    },
  })
);

const tooltipSlotProps = (theme: any) => ({
  tooltip: {
    sx: {
      color: "white",
      backgroundColor: "#F89FABFF",
      fontSize: "13px",
    },
  },
  arrow: {
    sx: {
      "&::before": {
        backgroundColor: "#F89FABFF",
        border: `1px solid ${theme.general.borderColor}`,
      },
    },
  },
});

const ManualInputTableTextField: React.FC<ManualInputTableTextFieldProps> = ({
  rowItem,
  miProcess,
  table,
  isFormula,
  disabled,
}) => {
  const [rItem, setRItem] = useState(rowItem);
  const [inputChanged, setInputChanged] = useState(false);
  const invalid = !!rowItem.processMessage?.comparisonError;

  const theme = useTheme();

  useEffect(() => {
    setRItem(rowItem);
  }, [rowItem]);

  const getEndAdornment = () => {
    if (invalid) {
      return <InfoIcon style={{ color: "#FF2600" }} />;
    }

    if (isFormula) {
      return <FunctionsIcon style={{ color: "#FF2600", marginRight: "5px" }} />;
    }
  };

  const inputProps = {
    endAdornment: getEndAdornment(),
  };

  return (
    <Tooltip
      title={invalid ? rowItem.processMessage?.message : ""}
      arrow
      slotProps={tooltipSlotProps(theme)}
    >
      <StyledTextField
        isFormula={isFormula}
        disabled={disabled}
        value={rItem.value ? rItem.value : ""}
        InputProps={inputProps}
        error={rowItem.processMessage && rowItem.processMessage.comparisonError}
        onChange={(event) => {
          const itemValue = event.target.value;
          rowItem.value = itemValue;
          setRItem({ ...rowItem, value: itemValue });
          setInputChanged(true);
        }}
        onBlur={(event) => {
          if (inputChanged) {
            rowItem.value = event.target.value;

            miProcess.recalculate(rowItem, table);
          }
          setInputChanged(false);
        }}
      />
    </Tooltip>
  );
};

export default ManualInputTableTextField;
