import Grid from "@mui/material/Grid";
import TextButton from "../../common/Button/TextButton";
import React, { FC, useMemo } from "react";
import FilteredDataDisplay from "./FilteredDataDisplay";
import FilterChip from "../../common/Chip/FilterChip";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { MessageFilterType } from "../../../types/messages.type";
import { styled } from "@mui/material/styles";

const StyledChipIcon = styled(CloseIcon)({
  color: "#9AA7BE",
  fontSize: 15,
});
interface FilterChipDisplayProps {
  setFilters: React.Dispatch<React.SetStateAction<MessageFilterType>>;
  setFiltersData: React.Dispatch<React.SetStateAction<MessageFilterType>>;
  filters: any;
  onFilterChange: (filterObj: MessageFilterType) => void;
  setIsFilterActive: (value: boolean) => void;
  setActiveMessage: (obj: any) => void;
}

const FilterChipDisplay: FC<FilterChipDisplayProps> = ({
  setFilters,
  setFiltersData,
  onFilterChange,
  setIsFilterActive,
  filters,
  setActiveMessage,
}) => {
  const { t } = useTranslation();

  const clear = () => {
    setFilters({} as MessageFilterType);
    setFiltersData({} as MessageFilterType);
    onFilterChange({} as MessageFilterType);
    setIsFilterActive(false);
    setActiveMessage(null);
  };

  const deleteChip = (key: string[]) => {
    let filter = { ...filters };
    delete filter[key[0]];
    setFilters({ ...filter });
  };

  let filteredHiddenData = () => {
    let result: any = [];
    for (let o of Object.entries(filters)) {
      if (o[0] !== "author" && o[0] !== "recipients" && o[0] !== "fis") {
        result.push(o);
      }
    }

    return (
      result.length > 3 && (
        <FilteredDataDisplay result={result} deleteChip={deleteChip} />
      )
    );
  };

  const filtersLength = useMemo(() => {
    return Object.keys(filters).length;
  }, [filters]);

  let filteredVisibleData = () => {
    let result = [];
    for (let o of Object.entries(filters)) {
      if (o[0] !== "author" && o[0] !== "recipients" && o[0] !== "fis") {
        result.push(o);
      }
    }
    return result.slice(0, 3).map((filterItem: any, index) => {
      return (
        <FilterChip
          key={index}
          chipKey={filterItem?.[0]}
          data={filterItem}
          maxWidth={"60px"}
          icon={<StyledChipIcon onClick={() => deleteChip(filterItem)} />}
        />
      );
    });
  };

  return (
    <Grid
      container
      columnSpacing={{ xs: 1 }}
      margin={"0px !important"}
      alignItems={"center"}
      data-testid={"selected-chips-wrapper"}
    >
      <Grid
        item
        xs={10}
        display={"flex"}
        flexDirection={"row"}
        height={"44px"}
        alignItems={"center"}
        paddingLeft={"10px !important"}
      >
        {filteredVisibleData()}
        {filteredHiddenData()}
      </Grid>
      {filtersLength > 0 && (
        <Grid item xs={1}>
          <TextButton
            disabled={false}
            onClick={clear}
            data-testid={"clear-all-button"}
          >
            {t("clearAll")}
          </TextButton>
        </Grid>
      )}
    </Grid>
  );
};

export default FilterChipDisplay;
