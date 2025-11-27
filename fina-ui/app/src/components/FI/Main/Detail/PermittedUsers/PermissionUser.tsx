import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import VirtualTreeGrid from "../../../../common/TreeGrid/VirtualTreeGrid";
import React, { useCallback, useEffect, useState } from "react";
import MainGridSkeleton from "../../../Skeleton/GridSkeleton/MainGridSkeleton";
import { styled } from "@mui/material/styles";
import { GroupAndUsersDataType } from "../../../../../types/fi.type";
import {
  columnFilterConfigType,
  TreeGridColumnType,
} from "../../../../../types/common.type";

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.textColor,
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "150%",
  textTransform: "capitalize",
  height: "60px",
  padding: "0px 16px",
  borderBottom: theme.palette.borderColor,
}));

interface PermissionUserProps {
  data: GroupAndUsersDataType[];
  columns: (isPermitted: boolean) => TreeGridColumnType[];
  editMode: boolean;
  onPermissionCheckboxChange: (checkedIds: string[]) => void;
  permittedUsers: GroupAndUsersDataType[];
  loading: boolean;
  columnFilterConfig: columnFilterConfigType[];
}

const PermissionUser: React.FC<PermissionUserProps> = ({
  data,
  columns,
  editMode,
  onPermissionCheckboxChange,
  permittedUsers,
  loading,
  columnFilterConfig,
}) => {
  const { t } = useTranslation();
  const [defaultCheckedRows, setDefaultCheckedRows] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<GroupAndUsersDataType[]>();

  useEffect(() => {
    if (!editMode) {
      let defaultCheckedRows = [...getCheckedRows([...permittedUsers])];
      setDefaultCheckedRows(defaultCheckedRows);
    }
  }, [loading]);

  useEffect(() => {
    if (!editMode) {
      let defaultCheckedRows = [...getCheckedRows([...permittedUsers])];
      setDefaultCheckedRows(defaultCheckedRows);
    }
  }, [editMode]);

  const loadChildrenFunction = (parent: GroupAndUsersDataType) => {
    return parent.parentId === 0
      ? data.filter((item) => item.parentId === parent.id)
      : [];
  };

  const checkboxIdProperty = (row: GroupAndUsersDataType) => {
    let group = data.find((g) => g.group && g.id === row.parentId);
    let code = row.parentId !== 0 && group ? `_${group.code}` : "";
    return row.group ? `group_${row.id}` : `user_${row.id}${code}`;
  };

  const getCheckedRows = (rows: GroupAndUsersDataType[]) => {
    let firstLevelItems: GroupAndUsersDataType[] = [];

    for (let item of rows) {
      if (item.group) {
        const group = data.find((g) => g.group && g.id === item.id);
        if (group && group.users?.length === (item.children?.length ?? 0)) {
          firstLevelItems.push(item);
        }
        firstLevelItems = firstLevelItems.concat(
          (item.children ?? []).map((child) => ({
            ...child,
            leaf: true,
            level: (item.level ?? 0) + 1,
            parentId: item.id,
          }))
        );
      } else {
        firstLevelItems.push(item);
      }
    }

    return firstLevelItems.map((item) => checkboxIdProperty(item));
  };

  const filterData = useCallback(
    (filters: Record<string, string>[]) => {
      let newData = data.map((item) =>
        item.group ? { ...item, children: [...(item.children || [])] } : item
      );

      if (filters.length === 0) {
        setFilteredData(undefined);
      } else {
        filters.forEach((filter) => {
          const [key, value] = Object.entries(filter)[0];
          switch (key) {
            case "login":
              for (let i = newData.length - 1; i >= 0; i--) {
                const item = newData[i];
                if (item.group) {
                  item.children = (item.children || []).filter((child) =>
                    child?.login?.toLowerCase().includes(value)
                  );
                  if (item.children.length === 0) newData.splice(i, 1);
                } else {
                  const codeMatch = item?.code?.toLowerCase().includes(value);
                  const loginMatch = item?.login?.toLowerCase().includes(value);
                  if (!codeMatch && !loginMatch) newData.splice(i, 1);
                }
              }
              break;
            case "description":
              for (let i = newData.length - 1; i >= 0; i--) {
                const item = newData[i];
                if (item.group) {
                  item.children = (item.children || []).filter((child) =>
                    child?.description?.toLowerCase().includes(value)
                  );

                  if (item.children.length === 0) {
                    newData.splice(i, 1);
                  }
                } else if (!item?.description?.toLowerCase().includes(value)) {
                  newData.splice(i, 1);
                }
              }
              break;
            default:
              return;
          }
        });
        setFilteredData(newData);
      }
    },
    [data]
  );
  const handleOnChangeFilter = (
    columnsFilter: { name: string; value: string }[]
  ) => {
    const filters: Record<string, string>[] = [];
    for (let filter of columnsFilter) {
      if (!!filter.value) {
        filters.push({ [filter.name]: filter.value.toLowerCase() });
      }
    }
    filterData(filters);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <StyledToolbar>{t("permissionUsers")}</StyledToolbar>
      <Box height={"100%"}>
        {loading ? (
          <MainGridSkeleton
            columns={columns(true)}
            checkboxEnabled={true}
            minWidth={270}
            paddingLeft={"12px"}
          />
        ) : (
          <VirtualTreeGrid
            withCheckbox={true}
            editMode={!editMode}
            checkboxIdProperty={checkboxIdProperty}
            columns={columns(true) ? columns(true) : []}
            columnFilterConfig={columnFilterConfig}
            data={filteredData || data}
            loadChildrenFunction={loadChildrenFunction}
            checkboxOnChange={onPermissionCheckboxChange}
            defaultCheckedRows={defaultCheckedRows}
            filterOnChangeFunction={handleOnChangeFilter}
          />
        )}
      </Box>
    </Box>
  );
};

export default PermissionUser;
