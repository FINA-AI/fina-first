import { Box, Grid } from "@mui/material";
import React, { useState } from "react";
import FiRegionSelect from "../../FI/Common/FiRegion/FiRegionSelect";
import GridFilterCloseButton from "../Grid/GridFilterCloseButton";
import { styled } from "@mui/material/styles";
import { CountryDataTypes } from "../../../types/common.type";
import { FilterIcon } from "../../../api/ui/icons/FilterIcon";

interface CountryFilterProps {
  closeFilter: (value: CountryDataTypes | null) => void;
  defaultValue: CountryDataTypes;
  onClickFunction: (value?: CountryDataTypes | null) => void;
  data: CountryDataTypes[];
  loading: boolean;
}

const StyledFilter = styled("span")(() => ({
  cursor: "pointer",
  paddingRight: "16px",
  display: "flex",
  alignItems: "center",
}));

const StyledSelectContainer = styled(Box)(() => ({
  display: "inline-block",
  marginRight: 10,
}));

const CountryFilter: React.FC<CountryFilterProps> = ({
  closeFilter,
  defaultValue,
  onClickFunction,
  data,
  loading,
}) => {
  const [value, setValue] = useState<CountryDataTypes | null>(
    defaultValue || null
  );

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      p={"23px 0px 16px 0px"}
    >
      <Grid
        item
        xs={12}
        display={"flex"}
        alignItems={"center"}
        width={"100%"}
        padding={"0px 19px"}
      >
        <StyledSelectContainer width={"100%"}>
          <FiRegionSelect
            selectedItem={value}
            onChange={(val) => {
              setValue(val);
            }}
            size={"default"}
            countryData={data}
            disabled={loading}
            onClear={() => setValue(null)}
          />
        </StyledSelectContainer>
        <StyledFilter onClick={() => onClickFunction(value)}>
          <FilterIcon />
        </StyledFilter>
        <GridFilterCloseButton onClose={() => closeFilter(value)} />
      </Grid>
    </Grid>
  );
};

export default CountryFilter;
