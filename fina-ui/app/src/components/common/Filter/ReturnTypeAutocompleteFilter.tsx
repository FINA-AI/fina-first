import React, { useState } from "react";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import CustomAutoComplete from "../Field/CustomAutoComplete";
import { ReturnType } from "../../../types/returnDefinition.type";
import GridFilterCloseButton from "../Grid/GridFilterCloseButton";
import { styled } from "@mui/material/styles";
import { FilterIcon } from "../../../api/ui/icons/FilterIcon";

interface ReturnTypeAutocompleteFilterProps {
  label?: string;
  closeFilter: (val: ReturnType | {}) => void;
  defaultValue?: ReturnType;
  onClickFunction: (val: ReturnType | {}) => void;
  data: ReturnType[];
}

const StyledFilter = styled("span")(() => ({
  cursor: "pointer",
  paddingRight: "16px",
  display: "flex",
  alignItems: "center",
}));

const ReturnTypeAutocompleteFilter: React.FC<
  ReturnTypeAutocompleteFilterProps
> = ({ label, closeFilter, defaultValue, onClickFunction, data }) => {
  const [value, setValue] = useState<ReturnType | {}>(defaultValue || {});

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
        <Box
          style={{
            display: "inline-block",
            marginRight: 10,
            width: "100%",
          }}
        >
          <CustomAutoComplete
            disabled={false}
            label={label}
            data={data}
            selectedItem={value}
            displayFieldName={"code"}
            displayFieldFunction={(item) => {
              return `${item.code} / ${item.name}`;
            }}
            valueFieldName={"id"}
            onChange={(item) => {
              setValue(item);
            }}
            onClear={() => setValue({})}
          />
        </Box>
        <StyledFilter onClick={() => onClickFunction(value)}>
          <FilterIcon />
        </StyledFilter>
        <GridFilterCloseButton onClose={() => closeFilter(value)} />
      </Grid>
    </Grid>
  );
};

export default ReturnTypeAutocompleteFilter;
