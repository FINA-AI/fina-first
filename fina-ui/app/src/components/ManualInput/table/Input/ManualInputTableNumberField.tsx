import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { darken, lighten } from "@mui/system";
import InfoIcon from "@mui/icons-material/Info";
import FunctionsIcon from "@mui/icons-material/Functions";
import { TextField, Tooltip } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  MiProcess,
  MiTable,
  MiTableRowItem,
} from "../../../../types/manualInput.type";
import { MDTNodeDataType } from "../../../../types/mdt.type";

const pattern = /^-?(\d+(\.\d*)?|\.\d+)$/;

export interface ManualInputTableNumberFieldProps {
  disabled: boolean;
  isFormula: boolean;
  rowItem: MiTableRowItem;
  miProcess: MiProcess;
  table: MiTable;
  getFormattedValue: (value: string) => string;
}

const StyledNumberField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "isFormula",
})<{ isFormula: boolean }>(
  ({ theme, isFormula }: { theme: any; isFormula: boolean }) => ({
    "& .MuiInputBase-root": {
      width: 200,
      borderRadius: theme.general.borderRadius,
      border: theme.general.border,
      fontSize: "12px",
      height: 31,
      paddingRight: 0,
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

const ManualInputTableNumberField: React.FC<
  ManualInputTableNumberFieldProps
> = ({ disabled, isFormula, rowItem, miProcess, table, getFormattedValue }) => {
  const theme = useTheme();
  if (rowItem.dataType === MDTNodeDataType.NUMERIC) {
    rowItem.isNotNumber = isNaN(Number(rowItem.value));
  }

  const [rItem, setRItem] = useState(rowItem);
  const [inputChanged, setInputChanged] = useState(false);

  const [focused, setFocused] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setRItem(rowItem);
  }, [rowItem]);

  const getEndAdornment = () => {
    if (rowItem.isNotNumber || !!rowItem.processMessage) {
      return <InfoIcon style={{ color: "#FF2600", marginRight: "5px" }} />;
    }

    if (isFormula) {
      return <FunctionsIcon style={{ color: "#FF2600", marginRight: "5px" }} />;
    }
  };

  const inputProps = {
    endAdornment: getEndAdornment(),
  };

  const getValue = (value: string | number | null) => {
    if (value) {
      if (focused && !inputChanged) {
        return Number(value);
      }
      return (isFormula || !focused) && typeof value === "string"
        ? getFormattedValue(value)
        : value;
    }
    return "";
  };

  return (
    <Tooltip
      title={
        rowItem.processMessage
          ? rowItem.processMessage.message
          : rowItem.isNotNumber
          ? t("isNotNumber")
          : ""
      }
      arrow
      slotProps={tooltipSlotProps(theme)}
    >
      <StyledNumberField
        isFormula={isFormula}
        disabled={disabled}
        error={!!rowItem.processMessage}
        type={"text"}
        value={getValue(rItem.value)}
        InputProps={inputProps}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={(event) => {
          setFocused(false);
          if (inputChanged) {
            rowItem.isNotNumber = isNaN(Number(event.target.value));

            rowItem.nvalue = Number(event.target.value);
            rowItem.value = event.target.value;
            miProcess.recalculate(rowItem, table);
          }
          setInputChanged(false);
        }}
        onChange={(event) => {
          const newValue = event.target.value;
          if (newValue === "" || pattern.test(newValue)) {
            setRItem({
              ...rowItem,
              value: newValue,
            });
            setInputChanged(true);
          }
        }}
      />
    </Tooltip>
  );
};

export default ManualInputTableNumberField;
