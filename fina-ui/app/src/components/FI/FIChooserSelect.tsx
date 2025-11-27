import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { Select as MuiSelect } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import FITreeGrid from "./FITreeGrid";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import { styled, useTheme } from "@mui/material/styles";
import { FiType } from "../../types/fi.type";

const StyledChip = styled(Box)(({ theme }: any) => ({
  backgroundColor: theme.palette.lightBackgroundColor,
  color: theme.palette.textColor,
  padding: "2px 4px",
  border: theme.palette.borderColor,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 2,
}));

const StyledRoot = styled(Box, {
  shouldForwardProp: (prop) => !prop.toString().startsWith("_"),
})<{
  _size?: "default" | "small";
  _width?: string | number;
}>(({ theme, _size, _width }) => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  "& .MuiOutlinedInput-root fieldset legend span": {
    fontSize: "9px",
  },
  "& .MuiSvgIcon-root": {
    ...(theme as any).smallIcon,
    color: "#98A7BC",
    padding: "1px 4px",
  },
  "& .MuiOutlinedInput-input": {
    padding: "10px 0 10px 14px!important",
  },
  "& .MuiInputBase-root": {
    minWidth: _width ? _width : "328px",
    maxHeight: "35px",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor:
        theme.palette.mode === "dark" ? "#5D789A" : "rgb(184, 185, 190)",
    },
  },
  "& .MuiOutlinedInput-root": {
    height: _size === "small" ? "32px" : "36px",
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",

      fontWeight: 500,
      lineHeight: "16px",
      fontSize: _size === "default" ? "12px" : "11px",
      textTransform: "capitalize",
      color: "#596D89",
    },
  },
  "& .MuiFormControl-root": {
    width: _width ? `${_width}px` : "100%",
    height: _size === "default" ? "36px" : "32px",
  },
  "& .MuiInputLabel-root": {
    top: `${_size === "default" ? "2px" : "4px"} !important`,
    "&[data-shrink='false']": {
      top: `${_size === "default" ? "-5px" : "-7px"} !important`,
    },
  },
}));

interface FIChooserSelectProps {
  data?: FiType[];
  checkedRows?: FiType[];
  onChange: (rows: FiType[]) => void;
  label?: string;
  singleSelect?: boolean;
  isDisabled?: boolean;
  width?: string | number;
  popoverWidth?: number;
  loading?: boolean;
  fiTypesOnly?: boolean;
}

const FIChooserSelect: React.FC<FIChooserSelectProps> = ({
  data,
  checkedRows = [],
  onChange,
  label,
  singleSelect = false,
  isDisabled = false,
  width,
  popoverWidth,
  loading,
  fiTypesOnly = false,
}) => {
  const theme: any = useTheme();
  const [checkedFis, setCheckedFis] = useState<FiType[]>(checkedRows);

  useEffect(() => {
    setCheckedFis(checkedRows);
  }, [checkedRows]);

  const onChangeWrapper = (fis: FiType[] | null) => {
    if (fis) setCheckedFis(fis);
    onChange(fis ?? []);
  };
  return (
    <StyledRoot _width={width || 328} data-testid={"fi-chooser-select"}>
      <FormControl variant={"outlined"} disabled={isDisabled || loading}>
        {label && <InputLabel>{label}</InputLabel>}
        <MuiSelect
          value={checkedFis && checkedFis.length > 0 ? "fis" : ""}
          onChange={() => {}}
          label={label}
          multiple={false}
          endAdornment={
            loading && (
              <InputAdornment position="end" sx={{ marginRight: "20px" }}>
                <CircularProgress size={15} style={{ color: "#aaaaaa" }} />
              </InputAdornment>
            )
          }
          MenuProps={{
            PaperProps: {
              style: {
                width: "inherit",
                boxSizing: "border-box",
                borderRight: `4px solid ${theme.palette.paperBackground}`,
                borderLeft: `4px solid ${theme.palette.paperBackground}`,
                overflow: "hidden",
              },
            },
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
          }}
        >
          <MenuItem style={{ display: "none" }} value={"fis"}>
            <Box sx={{ display: "flex", width: "80%", overflow: "hidden" }}>
              {checkedFis?.map((item) => {
                if (item && item.level && item.level > 0) {
                  return <StyledChip>{item.code}</StyledChip>;
                }
              })}
            </Box>
          </MenuItem>
          <Box key={label} width={popoverWidth ? popoverWidth : "inherit"}>
            <Box width={"100%"} height={"300px"} marginTop={"5px"}>
              <FITreeGrid
                data={data}
                checkedRows={checkedRows}
                onChange={onChangeWrapper}
                singleSelect={singleSelect}
                size={"small"}
                fiTypesOnly={fiTypesOnly}
              />
            </Box>
          </Box>
        </MuiSelect>
      </FormControl>
    </StyledRoot>
  );
};

export default FIChooserSelect;
