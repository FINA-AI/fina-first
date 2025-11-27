import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import ReturnDefinitionSelect from "../../ReturnDefinitions/ReturnDefinitionSelect";
import CustomAutoComplete from "../Field/CustomAutoComplete";
import { ReturnDefinitionType } from "../../../types/returnDefinition.type";
import GridFilterCloseButton from "../Grid/GridFilterCloseButton";
import { styled } from "@mui/material/styles";
import { FilterIcon } from "../../../api/ui/icons/FilterIcon";

interface ReturnDefinitionFilterProps {
  loading: boolean;
  label?: string;
  closeFilter: (val: ReturnDefinitionType[]) => void;
  defaultValue?: ReturnDefinitionType[];
  onClickFunction: (val: ReturnDefinitionType[]) => void;
  data: ReturnDefinitionType[];
  singleSelect?: boolean;
  isGrid?: boolean;
}

const StyledSelectContainer = styled(Box)(() => ({
  display: "inline-block",
  marginRight: 10,
  width: "100%",
}));

const StyledFilter = styled("span")(() => ({
  cursor: "pointer",
  paddingRight: "16px",
  display: "flex",
  alignItems: "center",
}));

const ReturnDefinitionFilter: React.FC<ReturnDefinitionFilterProps> = ({
  loading,
  label,
  closeFilter,
  defaultValue,
  onClickFunction,
  data,
  singleSelect,
  isGrid = true,
}) => {
  const [value, setValue] = useState<any>(defaultValue ?? []);

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
          {isGrid ? (
            <ReturnDefinitionSelect
              onChange={(key, value) => {
                setValue(value.map((i: ReturnDefinitionType) => i.id));
              }}
              data={data}
              label={label}
              checkedRows={value}
              isDisabled={loading}
              singleSelect={singleSelect}
            />
          ) : (
            <CustomAutoComplete
              disabled={false}
              label={label}
              data={data}
              selectedItem={value}
              displayFieldName={"code"}
              displayFieldFunction={(item) => {
                return `${item.returnType.code} / ${item.code} - ${item.name}`;
              }}
              valueFieldName={"id"}
              onChange={(item) => {
                setValue(item);
              }}
              virtualized={true}
              onClear={() => setValue([])}
            />
          )}
        </StyledSelectContainer>
        <StyledFilter onClick={() => onClickFunction(value)}>
          <FilterIcon />
        </StyledFilter>
        <GridFilterCloseButton onClose={() => closeFilter(value)} />
      </Grid>
    </Grid>
  );
};

export default ReturnDefinitionFilter;
