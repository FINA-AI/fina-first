import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Select as MuiSelect } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import GridTable from "../common/Grid/GridTable";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { ReturnType } from "../../types/returnDefinition.type";

interface ReturnTypeSelectProps {
  data: ReturnType[];
  onChange: (row: ReturnType, selectedRows: ReturnType[]) => void;
  label: string;
  isDisabled: boolean;
  checkedRows: ReturnType[];
  singleSelect: boolean;
}

const StyledRoot = styled(Box)<{ isDisabled: boolean }>(({ isDisabled }) => ({
  flexDirection: "column",
  boxSizing: "border-box",
  height: "100%",
  width: "100%",
  display: "flex",
  "& .MuiFormLabel-root": {
    opacity: isDisabled ? "0.4 !important" : 1,
  },
}));

const StyledSelectMenu = styled(MuiSelect)({
  width: "inherit",
  boxSizing: "border-box",
  borderRight: "4px solid #fff",
  borderLeft: "4px solid #fff",
  overflow: "hidden",
});

const StyledFormControl = styled(FormControl)<{ width?: number }>(
  ({ width }) => ({
    width: !!width ? width + "px" : "100%",
    minWidth: !!width ? width : "inherit",
    "& .MuiOutlinedInput-input": {
      paddingTop: 16,
    },
    "& .MuiInputBase-root": {
      height: 40,
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "4px !important",
    },
    "& label": {
      marginTop: -6,
      width: "85%",
    },
    "& .Mui-focused": {
      marginTop: 0,
    },
    "& .MuiFormLabel-filled": {
      marginTop: 0,
    },
  })
);

const ReturnTypeSelect: React.FC<ReturnTypeSelectProps> = ({
  checkedRows,
  singleSelect,
  data,
  onChange,
  label,
  isDisabled = false,
}) => {
  const { t } = useTranslation();
  const [checkedReturnTypes, setCheckedReturnTypes] = useState(checkedRows);

  const [columnHeader] = useState([
    {
      field: "code",
      headerName: t("code"),
      width: 50,
    },
    {
      field: "name",
      headerName: t("description"),
      width: 70,
    },
  ]);

  useEffect(() => {
    setCheckedReturnTypes(checkedRows);
  }, [checkedRows]);

  const getSelectValue = () => {
    if (checkedReturnTypes) {
      let result = "";

      for (let ret of checkedReturnTypes) {
        if (ret.code) result += ret.code;
        result += " - ";
        if (ret.name) result += ret.name;
      }

      return result;
    }
  };

  return (
    <StyledRoot isDisabled={isDisabled}>
      <StyledFormControl variant={"outlined"}>
        {label && <InputLabel>{label}</InputLabel>}
        <StyledSelectMenu
          disabled={isDisabled}
          value={
            checkedReturnTypes && checkedReturnTypes.length > 0 ? "returns" : ""
          }
          onChange={() => {}}
          label={label}
          multiple={false}
          MenuProps={{
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
              <Box overflow={"auto"} height={"100%"}>
                <GridTable
                  columns={columnHeader}
                  rows={data}
                  setRows={() => {}}
                  selectedRows={checkedReturnTypes}
                  onCheckboxClick={onChange}
                  checkboxEnabled={true}
                  virtualized={true}
                  singleRowSelect={singleSelect}
                />
              </Box>
            </Box>
          </Box>
        </StyledSelectMenu>
      </StyledFormControl>
    </StyledRoot>
  );
};

export default ReturnTypeSelect;
