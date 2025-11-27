import React from "react";
import SearchField from "../../../../components/common/Field/SearchField";
import { Box, styled } from "@mui/system";
import Paging from "../../../../components/common/Paging/Paging";
import GridTable from "../../../../components/common/Grid/GridTable";
import { GridColumnType } from "../../../../types/common.type";
import { UserType } from "../../../../types/user.type";
import GroupIcon from "@mui/icons-material/Group";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import { ViewMode } from "./GroupUsersContainer";

interface GroupUsersPageProps {
  data: UserType[];
  columns: GridColumnType[];
  pagingLimit: number;
  pagingPage: number;
  setPagingPage: React.Dispatch<React.SetStateAction<number>>;
  dataLength: number;
  editMode: boolean;
  searchValue?: string;
  selectedUsers: UserType[];
  loading: boolean;
  setFilterAndSort: (value: React.SetStateAction<{}>) => void;
  onFilterClear: VoidFunction;
  usersViewMode: ViewMode;
  onUsersViewModeChange: (mode: ViewMode) => void;
  orderRowByHeader(cellName: string, arrowDirection: string): void;
  changeGroupData(checkedRows: UserType[]): void;
  onPagingLimitChange(limit: number): void;
}

const StyledRootBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
}));

const StyledToolbar = styled("div")(({ theme }: any) => ({
  padding: theme.toolbar.padding,
  maxHeight: theme.toolbar.height,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const StyledPageContainer = styled("div")(({ theme }: any) => ({
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  zIndex: theme.zIndex.modal,
  borderBottomRightRadius: "8px",
  borderBottomLeftRadius: "8px",
  position: "relative",
  height: theme.general.footerHeight,
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
}));

const StyledSegmentedControl = styled(Box)<{ editMode: boolean }>(
  ({ theme, editMode }: any) => ({
    visibility: editMode ? "visible" : "hidden",
    height: "24px",
    display: "inline-flex",
    background: theme.palette.mode === "dark" ? "#3c4d6880" : "#596d891f",
    borderRadius: "8px",
    padding: "4px",
    position: "relative",
  })
);

const StyledSegmentButton = styled("button")<any>(({ active, theme }) => ({
  padding: "8px 16px",
  fontSize: "14px",
  fontWeight: 500,
  border: "none",
  borderRadius: "6px",
  cursor: "pointer !important",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  position: "relative",
  zIndex: 1,
  background: active ? theme.palette.primary.main : "transparent",
  color:
    theme.palette.mode === "dark"
      ? active
        ? "#111827"
        : "#838c9f"
      : active
      ? "#FFF"
      : "#838c9f",
  boxShadow: active ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
  "& svg": {
    width: "16px",
    height: "16px",
    marginRight: "8px",
  },
}));

const UsersViewModes = ({
  usersViewMode,
  onUsersViewModeChange,
  editMode,
}: {
  usersViewMode: ViewMode;
  onUsersViewModeChange: (mode: ViewMode) => void;
  editMode: boolean;
}) => {
  const handleToggle = (newMode: ViewMode) => {
    onUsersViewModeChange(newMode);
  };
  return (
    <StyledSegmentedControl editMode={editMode}>
      <StyledSegmentButton
        active={usersViewMode === ViewMode.GROUP_USERS}
        onClick={() => handleToggle(ViewMode.GROUP_USERS)}
      >
        <GroupIcon />
        Group Users
      </StyledSegmentButton>

      <StyledSegmentButton
        active={usersViewMode === ViewMode.ALL_USERS}
        onClick={() => handleToggle(ViewMode.ALL_USERS)}
      >
        <PeopleOutlineIcon />
        All Users
      </StyledSegmentButton>
    </StyledSegmentedControl>
  );
};

const GroupUsersPage: React.FC<GroupUsersPageProps> = ({
  data = [],
  columns = [],
  pagingLimit,
  pagingPage,
  onPagingLimitChange,
  setPagingPage,
  dataLength,
  editMode,
  selectedUsers,
  changeGroupData,
  loading,
  orderRowByHeader,
  setFilterAndSort,
  onFilterClear,
  usersViewMode,
  onUsersViewModeChange,
  searchValue,
}) => {
  return (
    <StyledRootBox>
      <StyledToolbar>
        <UsersViewModes
          usersViewMode={usersViewMode}
          onUsersViewModeChange={onUsersViewModeChange}
          editMode={editMode}
        />
        <SearchField
          onFilterClick={(value) =>
            setFilterAndSort((prev) => ({ ...prev, searchValue: value }))
          }
          withFilterButton={false}
          width={400}
          minSearchTextLength={0}
          onClear={onFilterClear}
          onFilterChange={(value: string) => {
            if (!value && !!searchValue) onFilterClear();
          }}
        />
      </StyledToolbar>
      <Box width={"100%"} height={"100%"} minHeight={"0px"}>
        <GridTable
          rows={[...data]}
          setRows={() => {}}
          selectedRows={editMode ? [...selectedUsers] : []}
          onCheckboxClick={(_: UserType, checkedRows: UserType[]) => {
            changeGroupData(checkedRows);
          }}
          columns={columns}
          checkboxEnabled={editMode}
          loading={loading}
          orderRowByHeader={orderRowByHeader}
        />
      </Box>
      <StyledPageContainer>
        <Paging
          onRowsPerPageChange={(number) => onPagingLimitChange(number)}
          onPageChange={(number) => setPagingPage(number)}
          totalNumOfRows={dataLength}
          initialPage={pagingPage}
          initialRowsPerPage={pagingLimit}
        />
      </StyledPageContainer>
    </StyledRootBox>
  );
};

export default GroupUsersPage;
