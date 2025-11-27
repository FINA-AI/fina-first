import React, { useState } from "react";
import { getEntityNames } from "../../api/services/auditLogService";
import { Box } from "@mui/system";
import Select from "../common/Field/Select";
import { FilterIcon } from "../../api/ui/icons/FilterIcon";
import { useTranslation } from "react-i18next";
import GridFilterCloseButton from "../common/Grid/GridFilterCloseButton";
import { styled } from "@mui/material/styles";

interface EntityNameFilterProps {
  onFilterClick: (val: string | number) => void;
  onClear: () => void;
  defaultValue?: string | number;
}

interface EntityNameType {
  [key: string]: string;
}

const StyledFilterBox = styled(Box)({
  cursor: "pointer",
  paddingRight: "16px",
  paddingLeft: "16px",
  display: "flex",
  alignItems: "center",
});

const EntityNameFilter: React.FC<EntityNameFilterProps> = ({
  onFilterClick,
  onClear,
  defaultValue,
}) => {
  const { t } = useTranslation();

  const [entityNames, setEntityNames] = useState<EntityNameType[] | null>(null);
  const [value, setValue] = useState(defaultValue);

  let data: EntityNameType[] = [];
  if (entityNames && entityNames.length > 0) {
    data = entityNames;
  } else if (entityNames === null) {
    getEntityNames().then((resp) => setEntityNames(resp.data));
  }

  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      width={"100%"}
      height={"100%"}
      justifyContent={"center"}
      pl={"20px"}
      pr={"20px"}
    >
      <Box flex={1}>
        <Select
          label={t("objectName")}
          data={data.map((r) => {
            return { label: r.value, value: r.key };
          })}
          onChange={(v) => {
            setValue(v);
          }}
          value={value}
        />
      </Box>
      <Box display={"flex"} flexDirection={"row"}>
        <StyledFilterBox
          onClick={() => {
            if (value) {
              onFilterClick(value);
            }
          }}
        >
          <FilterIcon />
        </StyledFilterBox>
        <GridFilterCloseButton onClose={onClear} />
      </Box>
    </Box>
  );
};

export default EntityNameFilter;
