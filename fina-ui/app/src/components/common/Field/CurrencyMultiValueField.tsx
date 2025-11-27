import { Autocomplete } from "@mui/lab";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";

interface CurrencyMultiValueFieldProps {
  defaultValues: DefaultValueType[];
  onChange: (val: DefaultValueType[]) => void;
}

interface DefaultValueType {
  text: string;
  value: string;
}

const StyledAutocomplete = styled(Autocomplete)<{ _size: string }>(
  ({ theme, _size }) => ({
    "& .MuiSvgIcon-root": {
      ...(theme as any).smallIcon,
      color: theme.palette.mode === "dark" && "#5D789A",
    },
    "& .MuiOutlinedInput-root": {
      height: _size === "default" ? "36px" : "32px",
      "& .MuiChip-root": {
        top: "-2px",
        height: "20px",
        "&:hover": {
          color: theme.palette.mode === "dark" ? "#344258" : "#FFFFFF",
        },
        "& .MuiChip-deleteIcon": {
          "&:hover": {
            color: theme.palette.mode === "dark" ? "#344258" : "",
          },
        },
      },
      "& .MuiOutlinedInput-input": {
        height: "0px",
      },
    },
    "& .MuiAutocomplete-clearIndicator": {
      border: "unset",
      background: "inherit",
      padding: "2px",
      "&:hover": {
        background: `${
          (theme as any).palette.buttons.secondary.hover
        } !important`,
      },
    },
    "& .MuiAutocomplete-popupIndicator": {
      border: "unset",
      background: "inherit",
    },
    "& .MuiInputLabel-root": {
      top: `${_size === "default" ? "2px" : "4px"} !important`,
      "&[data-shrink='false']": {
        top: `${_size === "default" ? "-5px" : "-7px"} !important`,
      },
    },
  })
);

const StyledTextField = styled(TextField)<{ _size: string }>(({ _size }) => ({
  "& .MuiInputLabel-root ": {
    fontSize: _size === "default" ? "12px" : "11px",
    textTransform: "capitalize",
    top: "-5px",
  },
}));

const CurrencyMultiValueField: React.FC<CurrencyMultiValueFieldProps> = ({
  defaultValues = [],
  onChange,
}) => {
  const { t } = useTranslation();

  let options = [
    { value: "nationalCurrency", text: t("nationalCurrency") },
    { value: "foreignCurrency", text: t("foreignCurrency") },
  ];

  const [values, setValues] = useState<DefaultValueType[]>([]);

  useEffect(() => {
    setValues(defaultValues);
  }, [defaultValues]);

  return (
    <StyledAutocomplete
      _size={"default"}
      multiple
      id="tags-outlined"
      options={options.filter(
        (opt) => !values.map((item) => item.value).includes(opt.value)
      )}
      getOptionLabel={(option) => (option as DefaultValueType).text}
      value={values}
      defaultValue={values}
      filterSelectedOptions
      onChange={(data, value) => {
        const newValue = value as DefaultValueType[];
        setValues([...newValue]);
        onChange(newValue);
      }}
      renderInput={(params) => (
        <StyledTextField
          _size={"default"}
          data-testid={"currency-textField"}
          {...params}
          label={t("fiBeneficiaryCurrency")}
          placeholder=""
        />
      )}
    />
  );
};

export default CurrencyMultiValueField;
