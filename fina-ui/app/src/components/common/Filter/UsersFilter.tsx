import { Box, Grid } from "@mui/material";
import React, { useState } from "react";
import UserAndGroupVirtualizedSelect from "../../UserManagement/UserAndGroupVirtualizedSelect";
import { UserType } from "../../../types/user.type";
import GridFilterCloseButton from "../Grid/GridFilterCloseButton";
import { styled } from "@mui/material/styles";
import { FilterIcon } from "../../../api/ui/icons/FilterIcon";

interface UsersFilterProps {
  label?: string;
  closeFilter: (val: dataType[]) => void;
  defaultValue?: dataType[];
  onClickFunction: (val: dataType[]) => void;
  loading?: boolean;
  data: dataType[];
}

interface dataType {
  code: string;
  description: string;
  group: boolean;
  id: number;
  users: UserType;
}

const StyledFilter = styled("span")(() => ({
  cursor: "pointer",
  paddingRight: "16px",
  display: "flex",
  alignItems: "center",
}));

const UsersFilter: React.FC<UsersFilterProps> = ({
  label,
  closeFilter,
  defaultValue,
  onClickFunction,
  data,
  loading,
}) => {
  const [value, setValue] = useState<dataType[]>(defaultValue ?? []);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ padding: "23px 20px 16px 20px", overflow: "hidden" }}
    >
      <Grid
        item
        xs={12}
        display={"flex"}
        alignItems={"center"}
        sx={{ width: "100%" }}
      >
        <Box
          style={{ display: "inline-block", marginRight: 10, width: "100%" }}
        >
          <UserAndGroupVirtualizedSelect
            label={label}
            width={328}
            selectedUsers={value}
            setSelectedUsers={setValue}
            data={data}
            disabled={loading}
            loading={loading}
            filterMode={true}
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

export default UsersFilter;
