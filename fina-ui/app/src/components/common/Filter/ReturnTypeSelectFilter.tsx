import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import ReturnTypeSelect from "../../ReturnTypes/ReturnTypeSelect";
import { ReturnType } from "../../../types/returnDefinition.type";
import GridFilterCloseButton from "../Grid/GridFilterCloseButton";
import { styled } from "@mui/material/styles";
import { FilterIcon } from "../../../api/ui/icons/FilterIcon";

interface ReturnTypeFilterProps {
  loading: boolean;
  label: string;
  closeFilter: (val: ReturnType[]) => void;
  defaultValue?: ReturnType[];
  onClickFunction: (val: ReturnType[]) => void;
  data: ReturnType[];
  singleSelect: boolean;
}

const StyledGridContainer = styled(Grid)(() => ({
  padding: "23px 0px 16px 0px",
  width: "100%",
  margin: "0px 22px",
  "& .MuiGrid-root": {
    width: "100%",
    "& .MuiBox-root": {
      width: "100%",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #EAEBF0 !important",
    borderRadius: "8px",
    "&.Mui-focused": {
      border: "1px solid #EAEBF0 !important",
      borderRadius: "8px",
    },
  },
}));

const StyledFilter = styled("span")(() => ({
  cursor: "pointer",
  paddingRight: "16px",
  display: "flex",
  alignItems: "center",
}));

const ReturnTypeSelectFilter: React.FC<ReturnTypeFilterProps> = ({
  loading,
  label,
  closeFilter,
  defaultValue,
  onClickFunction,
  data,
  singleSelect,
}) => {
  const [value, setValue] = useState<ReturnType[]>(defaultValue ?? []);

  return (
    <StyledGridContainer
      container
      spacing={0}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={12} display={"flex"} alignItems={"center"}>
        <Box style={{ display: "inline-block", marginRight: 10 }}>
          <ReturnTypeSelect
            onChange={(row, selectedRows) => {
              setValue(singleSelect ? [row] : selectedRows);
            }}
            data={data}
            label={label}
            checkedRows={value}
            isDisabled={loading}
            singleSelect={singleSelect}
          />
        </Box>
        <StyledFilter onClick={() => onClickFunction(value)}>
          <FilterIcon />
        </StyledFilter>
        <GridFilterCloseButton onClose={() => closeFilter(value)} />
      </Grid>
    </StyledGridContainer>
  );
};

export default ReturnTypeSelectFilter;
