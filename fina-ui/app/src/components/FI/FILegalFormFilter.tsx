import { Box, Grid } from "@mui/material";
import React, { FC, useState } from "react";
import LegalFormTypeAutoComplete from "./Common/AutoComplete/LegalFormTypeAutoComplete";
import GridFilterCloseButton from "../common/Grid/GridFilterCloseButton";
import { LegalFormEntityInfo } from "../../types/fi.type";
import { FilterIcon } from "../../api/ui/icons/FilterIcon";

interface FILegalFormFilterProps {
  closeFilter: (value?: string) => void;
  defaultValue?: LegalFormEntityInfo;
  onClickFunction: (value?: string) => void;
  label?: string;
  data?: LegalFormEntityInfo[];
  loading?: boolean;
}

const FILegalFormFilter: FC<FILegalFormFilterProps> = ({
  closeFilter,
  defaultValue,
  onClickFunction,
}) => {
  const [value, setValue] = useState<LegalFormEntityInfo | undefined>(
    defaultValue
  );

  return (
    <Grid
      container
      spacing={0}
      sx={{
        padding: "23px 20px 16px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid item xs={12} display="flex" alignItems="center">
        <Box
          sx={{ display: "inline-block", marginRight: "10px", width: "100%" }}
        >
          <LegalFormTypeAutoComplete
            size={"small"}
            hideLabel={true}
            selectedItem={value}
            onChange={(newValue: LegalFormEntityInfo) => {
              setValue(newValue);
            }}
            onClear={() => setValue(undefined)}
          />
        </Box>
        <span
          onClick={() => onClickFunction(value?.code)}
          style={{
            cursor: "pointer",
            paddingRight: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FilterIcon />
        </span>
        <GridFilterCloseButton onClose={() => closeFilter(value?.code)} />
      </Grid>
    </Grid>
  );
};

export default FILegalFormFilter;
