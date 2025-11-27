import React, { memo, useEffect, useState } from "react";
import { Box, styled } from "@mui/system";
import GridTable from "../../../common/Grid/GridTable";
import { useTranslation } from "react-i18next";
import { Checkbox, Typography } from "@mui/material";
import SearchHopField from "../../../common/Field/SearchHopField";
import PermissionCheckbox from "./PermissionCheckbox";
import { UserPermission } from "../../../../types/user.type";

interface UserPermissionsProps {
  editMode: boolean;
  loading: boolean;
  permissions: UserPermission[];
  isRowChecked(row: UserPermission): boolean;
  disabledFunction(row: UserPermission): boolean;
  handleCheckChange(row: UserPermission, checked: boolean): void;
  handleSelectAll(e: any): void;
}

interface SearchedInfo {
  hopIndex: number | null;
  searchedRows: UserPermission[];
  searchedValue: string | null;
}

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  padding: theme.toolbar.padding,
}));

const StyledBody = styled(Box)(() => ({
  height: "100%",
  overflow: "hidden",
  borderRadius: "8px",
  backgroundColor: "#FFF",
}));

const UserPermissions: React.FC<UserPermissionsProps> = ({
  editMode,
  permissions,
  handleSelectAll,
  handleCheckChange,
  disabledFunction,
  isRowChecked,
  loading,
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState<UserPermission[]>([]);
  const [searchedInfo, setSearchedInfo] = useState<SearchedInfo>({
    hopIndex: null,
    searchedRows: [],
    searchedValue: "",
  });

  useEffect(() => {
    setData(permissions);
  }, [permissions]);

  const highlightFilteredWord = (
    permission: UserPermission,
    key: keyof UserPermission
  ) => {
    const value = permission[key];
    const searchValue = searchedInfo?.searchedValue;

    if (
      searchValue &&
      typeof value === "string" &&
      value?.toLowerCase().includes(searchValue)
    ) {
      const parts = value?.split(
        new RegExp(`(${searchedInfo.searchedValue})`, "gi")
      );

      return parts.map((part: string, index: number) => {
        // Apply the mark tag to the parts that match the filter
        if (part.toLowerCase().includes(searchValue?.toLowerCase())) {
          let rowIndex = permissions.findIndex(
            (item) => item.id === permission.id
          );
          return (
            <mark
              key={index}
              style={{
                backgroundColor:
                  rowIndex === searchedInfo.hopIndex ? "#FF9632" : "",
              }}
            >
              {part}
            </mark>
          );
        }
        return <span key={index}>{part}</span>;
      });
    }
    return <span>{permission[key]}</span>;
  };

  const onSearchChange = (value: string) => {
    value = value.toLowerCase();

    if (!value) {
      setSearchedInfo({
        hopIndex: null,
        searchedRows: [],
        searchedValue: value,
      });
      return;
    }

    let arr: UserPermission[] = [];
    for (let permission of data) {
      let idName = permission.idName;
      let name = permission.name;

      if (
        (idName && idName.toLowerCase().includes(value)) ||
        (name && name.toLowerCase().includes(value))
      ) {
        arr.push(permission);
      }
    }

    let index = permissions.findIndex(
      (permission) => permission.id === arr[0]?.id
    );

    setSearchedInfo({
      hopIndex: index,
      searchedRows: arr,
      searchedValue: value,
    });
  };

  const onClear = () => {
    setSearchedInfo({
      hopIndex: null,
      searchedRows: [],
      searchedValue: null,
    });
  };

  const columnHeader = [
    {
      field: "idName",
      headerName: t("IdName"),
      flex: 0.45,
      renderCell: (value: string, row: UserPermission) => {
        let permission = searchedInfo.searchedRows.find(
          (item) => row.id === item.id
        );
        return permission ? highlightFilteredWord(permission, "idName") : value;
      },
    },
    {
      field: "name",
      headerName: t("description"),
      flex: 0.45,
      renderCell: (value: string, row: UserPermission) => {
        let permission = searchedInfo.searchedRows.find(
          (item) => row.id === item.id
        );
        return permission ? highlightFilteredWord(permission, "name") : value;
      },
    },
    {
      hideCopy: true,
      field: "isChecked",
      headerName: t("permission"),
      flex: 0.1,
      renderCell: (value: boolean, row: UserPermission) => {
        return <CheckboxColumn row={row} />;
      },
    },
  ];

  const CheckboxColumn = ({ row }: { row: UserPermission }) => {
    const c = isRowChecked(row);
    return (
      <PermissionCheckbox
        row={row}
        handleCheckChange={handleCheckChange}
        disabled={disabledFunction(row)}
        editMode={editMode}
        isRowChecked={c}
      />
    );
  };

  const onNextHopClick = (activeRowIndex: number) => {
    if (activeRowIndex > 0) {
      let index = permissions.findIndex(
        (permission) =>
          permission.id === searchedInfo.searchedRows[activeRowIndex - 1].id
      );

      setSearchedInfo({
        ...searchedInfo,
        hopIndex: index,
      });
    }
  };

  return (
    <Box
      height={"100%"}
      boxSizing={"border-box"}
      display={"flex"}
      flexDirection={"column"}
    >
      <StyledToolbar display={"flex"} justifyContent={"space-between"}>
        <SearchHopField
          onSearchChange={onSearchChange}
          onClear={onClear}
          searchedTotalResult={searchedInfo.searchedRows.length}
          onNextHopClick={(index) => onNextHopClick(index)}
        />
        {editMode && (
          <Box display={"flex"} alignItems={"center"}>
            <Checkbox
              size={"small"}
              disabled={false}
              onChange={handleSelectAll}
              sx={{
                margin: 0,
              }}
            />
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              {t("selectAll")}
            </Typography>
          </Box>
        )}
      </StyledToolbar>
      <StyledBody flex={1}>
        <GridTable
          columns={columnHeader}
          rows={data.map((per) => ({
            ...per,
            isChecked: isRowChecked(per),
          }))}
          selectedRows={[]}
          setRows={setData}
          loading={loading}
          virtualized={true}
          resizer={true}
          scrollToIndex={searchedInfo.hopIndex}
        />
      </StyledBody>
    </Box>
  );
};

export default memo(UserPermissions);
