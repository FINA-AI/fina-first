import { Box, styled } from "@mui/system";
import SearchField from "../../../common/Field/SearchField";
import React from "react";

interface UserMDTToolbarProps {
  onFilterClear: VoidFunction;
  onFilterChange(value: string): void;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  padding: theme.toolbar.padding,
}));

const UserMDTToolbar: React.FC<UserMDTToolbarProps> = ({
  onFilterChange,
  onFilterClear,
}) => {
  return (
    <StyledRoot>
      <SearchField
        withFilterButton={false}
        width={276}
        onClear={onFilterClear}
        onFilterChange={onFilterChange}
      />
    </StyledRoot>
  );
};

export default UserMDTToolbar;
