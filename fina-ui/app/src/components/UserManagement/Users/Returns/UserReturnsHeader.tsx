import SearchField from "../../../common/Field/SearchField";
import Dropdown from "../../../common/Button/Dropdown";
import { useTranslation } from "react-i18next";
import { Box, Checkbox, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { ReturnType } from "../../../../types/return.type";
import React from "react";

interface UserReturnsHeaderProps {
  returnTypes: ReturnType[];
  onFilterClear: VoidFunction;
  editMode: boolean;
  isSelectAllChecked: boolean;
  isHalfChecked: boolean;
  setActivePage: (page: number) => void;
  handleAllCheckChange(checked: boolean): void;
  onFilterChange(filterValue: string): void;
  onReturnTypeSelectionChange(type: ReturnType): void;
}

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  padding: theme.toolbar.padding,
  display: "flex",
  alignItems: "center",
  justifyItems: "center",
}));

const StyledSelectContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  "& .MuiButtonBase-root": {
    padding: "5px",
  },
}));

const StyledTypography = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: 12,
  whiteSpace: "nowrap",
}));

const UserReturnsHeader: React.FC<UserReturnsHeaderProps> = ({
  returnTypes,
  onReturnTypeSelectionChange,
  onFilterChange,
  onFilterClear,
  editMode,
  handleAllCheckChange,
  isSelectAllChecked,
  isHalfChecked,
  setActivePage,
}) => {
  const { t } = useTranslation();

  return (
    <StyledToolbar justifyContent={"space-between"}>
      <Box display={"flex"}>
        <Box marginRight={"10px"}>
          <Dropdown
            dropdownData={returnTypes}
            setSelection={(selectedData) => {
              onReturnTypeSelectionChange(selectedData as ReturnType);
              setActivePage(1);
            }}
            buttonDisplayFieldName={"code"}
          />
        </Box>
        <SearchField
          withFilterButton={false}
          onClear={() => {
            onFilterClear();
            setActivePage(1);
          }}
          width={276}
          onFilterChange={(v) => {
            onFilterChange(v);
            setActivePage(1);
          }}
        />
      </Box>
      {editMode && (
        <StyledSelectContainer>
          <Checkbox
            size={"small"}
            disabled={false}
            onClick={(event: any) => {
              handleAllCheckChange(event.target.checked);
            }}
            sx={{
              margin: 0,
            }}
            checked={isSelectAllChecked}
            indeterminate={isHalfChecked}
          />
          <StyledTypography>{t("selectAll")}</StyledTypography>
        </StyledSelectContainer>
      )}
    </StyledToolbar>
  );
};

export default UserReturnsHeader;
