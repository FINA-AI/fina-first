import { Box, Grid } from "@mui/material";
import React, { useState } from "react";
import Select from "../Field/Select";
import GridFilterCloseButton from "../Grid/GridFilterCloseButton";
import { styled } from "@mui/material/styles";
import { FilterIcon } from "../../../api/ui/icons/FilterIcon";

interface ListFilterProps {
  label?: string;
  closeFilter: (val: defaultValueType) => void;
  defaultValue?: defaultValueType;
  onClickFunction: (val: defaultValueType) => void;
  loading?: boolean;
  optionsArray: optionsArrayType[];
  width?: number;
}
interface optionsArrayType {
  label: string;
  value: string;
}
interface defaultValueType {
  key?: string;
  value?: string;
}

const StyledSelectedContainer = styled(Box)(() => ({
  display: "inline-block",
  marginRight: 10,
}));

const StyledFilter = styled("span")(() => ({
  cursor: "pointer",
  paddingRight: "10px",
  display: "flex",
  alignItems: "center",
}));

const ListFilter: React.FC<ListFilterProps> = ({
  label,
  closeFilter,
  defaultValue,
  optionsArray,
  onClickFunction,
  width,
}) => {
  const [value, setValue] = useState<defaultValueType>(defaultValue ?? {});

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onClickFunction(value);
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      justifyContent="center"
      p={"23px 0px 16px 0px"}
    >
      <Grid
        item
        xs={12}
        display={"flex"}
        alignItems={"center"}
        padding={"0px 20px"}
      >
        <StyledSelectedContainer onKeyDown={handleKeyPress}>
          <Select
            size={"default"}
            width={width ? width : 328}
            label={label}
            data={optionsArray}
            value={value.value}
            onChange={(val) => {
              setValue({ ...value, value: val });
            }}
            autoFocus={true}
            TooltipPlacement={"left"}
            data-testid={"select-input"}
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

export default ListFilter;
