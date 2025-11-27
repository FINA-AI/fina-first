import { Box } from "@mui/system";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { CommFilterType } from "../../../types/communicator.common.type";

interface FilterFooterButtonsProps {
  filters: CommFilterType;
  handleFilterClose: () => void;
  onFilterClick: (filters: CommFilterType) => void;
}

const FilterFooterButtons: FC<FilterFooterButtonsProps> = ({
  filters,
  handleFilterClose,
  onFilterClick,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      padding={"10px 12px 8px 12px"}
      justifyContent={"flex-end"}
      display={"flex"}
      gap={"8px"}
    >
      <GhostBtn
        onClick={() => handleFilterClose()}
        data-testid={"cancel-button"}
      >
        {t("cancel")}
      </GhostBtn>
      <PrimaryBtn
        onClick={() => {
          handleFilterClose();
          onFilterClick(filters);
        }}
        data-testid={"filter-button"}
      >
        {t("filter")}
      </PrimaryBtn>
    </Box>
  );
};

export default FilterFooterButtons;
