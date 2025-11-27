import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Select as MuiSelect } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import ScheduleReturnsContainer from "../../containers/Schedules/ScheduleReturnsContainer";
import { styled } from "@mui/material/styles";
import {
  ReturnDefinitionType,
  ReturnType,
} from "../../types/returnDefinition.type";

interface ReturnDefinitionSelectProps {
  data: ReturnDefinitionType[];
  onChange: (key: string, value: ReturnDefinitionType[]) => void;
  label?: string;
  isDisabled?: boolean;
  checkedRows: ReturnDefinitionType[];
  singleSelect?: boolean;
  returnTypes?: ReturnType[];
}

const StyledFormControl = styled(FormControl, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<{ _isDisabled: boolean; _size?: string }>(
  ({ theme, _isDisabled, _size }) => ({
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    "& .MuiFormLabel-root": {
      opacity: _isDisabled ? "0.4 !important" : 1,
    },
    "& .MuiSvgIcon-root": {
      ...(theme as any).smallIcon,
      color: "#98A7BC",
      padding: "1px 4px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10px 0 10px 14px!important",
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
        color: theme.palette.mode === "dark" ? "#FFFFFF" : "#596D89",
      },
    },
    "& .MuiInputLabel-root": {
      top: `${_size === "default" ? "2px" : "4px"} !important`,
      "&[data-shrink='false']": {
        top: `${_size === "default" ? "-5px" : "-7px"} !important`,
      },
    },
  })
);

const ReturnDefinitionSelect: React.FC<ReturnDefinitionSelectProps> = ({
  data,
  onChange,
  label,
  isDisabled = false,
  checkedRows = [],
  singleSelect,
  returnTypes,
}) => {
  const [checkedFis, setCheckedFis] = useState(checkedRows);

  useEffect(() => {
    setCheckedFis(checkedRows);
  }, [checkedRows]);

  const getSelectValue = () => {
    let result = "";
    for (let ret of checkedFis) {
      result += `${ret.name ? ret.name : ret.code}  `;
    }

    return result;
  };

  return (
    <Box>
      <StyledFormControl _isDisabled={isDisabled} variant={"outlined"}>
        {label && <InputLabel>{label}</InputLabel>}
        <MuiSelect
          disabled={isDisabled}
          value={checkedFis && checkedFis.length > 0 ? "returns" : ""}
          onChange={() => {}}
          label={label}
          multiple={false}
          MenuProps={{
            PaperProps: {
              sx: (theme) => ({
                width: "inherit",
                boxSizing: "border-box",
                borderRight: `4px solid ${
                  theme.palette.mode === "dark" ? "#2B3748" : "#fff"
                }`,
                borderLeft: `4px solid ${
                  theme.palette.mode === "dark" ? "#2B3748" : "#fff"
                }`,
                overflow: "hidden",
              }),
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
          <MenuItem style={{ display: "none" }} value={"returns"}>
            {getSelectValue()}
          </MenuItem>
          <Box key={label}>
            <Box width={"100%"} height={"300px"} marginTop={"5px"}>
              <ScheduleReturnsContainer
                data={data}
                onNewScheduleChange={onChange}
                checkedRows={checkedRows}
                singleSelect={singleSelect}
                returnTypes={returnTypes}
              />
            </Box>
          </Box>
        </MuiSelect>
      </StyledFormControl>
    </Box>
  );
};

export default ReturnDefinitionSelect;
