import { Box, Grid } from "@mui/material";
import React, { useState } from "react";
import FIChooserSelect from "../../FI/FIChooserSelect";
import { FiType } from "../../../types/fi.type";
import GridFilterCloseButton from "../Grid/GridFilterCloseButton";
import { styled } from "@mui/material/styles";
import { FilterIcon } from "../../../api/ui/icons/FilterIcon";

interface FiFilterProps {
  label?: string;
  closeFilter: (val: FiType[]) => void;
  defaultValue?: FiType[];
  onClickFunction: (val: FiType[]) => void;
  data?: FiType[];
  loading?: boolean;
}

const StyledSelectedContainer = styled(Box)(() => ({
  display: "inline-block",
  marginRight: 10,
}));

const StyledFilter = styled("span")(() => ({
  cursor: "pointer",
  paddingRight: "16px",
  display: "flex",
  alignItems: "center",
}));

const FiFilter: React.FC<FiFilterProps> = ({
  label,
  closeFilter,
  defaultValue,
  onClickFunction,
  data,
  loading,
}) => {
  const [value, setValue] = useState(defaultValue ? defaultValue : []);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      p={"23px 0px 16px 0px"}
    >
      <Grid item xs={12} display={"flex"} alignItems={"center"}>
        <StyledSelectedContainer>
          <FIChooserSelect
            onChange={(val) => {
              setValue(val);
            }}
            checkedRows={value}
            label={label}
            data={data}
            loading={loading}
          />
        </StyledSelectedContainer>
        <StyledFilter
          onClick={() => onClickFunction(value)}
          data-testid={"filter-button"}
        >
          <FilterIcon />
        </StyledFilter>
        <GridFilterCloseButton onClose={() => closeFilter(value)} />
      </Grid>
    </Grid>
  );
};

export default FiFilter;
