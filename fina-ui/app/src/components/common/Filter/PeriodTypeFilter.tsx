import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import CustomAutoComplete from "../Field/CustomAutoComplete";
import { PeriodType } from "../../../types/period.type";
import GridFilterCloseButton from "../Grid/GridFilterCloseButton";
import { styled } from "@mui/material/styles";
import { FilterIcon } from "../../../api/ui/icons/FilterIcon";

interface PeriodTypeFilterProps {
  closeFilter: (value: PeriodType[]) => void;
  defaultValue?: PeriodType[];
  onClickFunction: (value?: PeriodType[]) => void;
  data: PeriodType[];
  label?: string;
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
  width: "100%",
}));

const PeriodTypeFilter: React.FC<PeriodTypeFilterProps> = ({
  label,
  closeFilter,
  defaultValue,
  onClickFunction,
  data,
}) => {
  const [value, setValue] = useState<PeriodType[]>(defaultValue ?? []);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ padding: "23px 0px 16px 0px", width: "100%", margin: "0px 22px" }}
    >
      <Grid item xs={12} display={"flex"} alignItems={"center"} width={"100%"}>
        <StyledSelectContainer>
          <CustomAutoComplete
            label={label}
            data={data}
            selectedItem={value[0]}
            displayFieldName={"name"}
            valueFieldName={"id"}
            onChange={(value) => {
              setValue([value]);
            }}
            size={"default"}
            displayFieldFunction={(option) => {
              return `${option.code} / ${option.name}`;
            }}
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

export default PeriodTypeFilter;
