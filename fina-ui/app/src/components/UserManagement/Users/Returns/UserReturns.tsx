import { Box, styled } from "@mui/system";
import GridTable from "../../../common/Grid/GridTable";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PermissionCheckbox from "../Permissions/PermissionCheckbox";
import UserReturnsHeader from "./UserReturnsHeader";
import Paging from "../../../common/Paging/Paging";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import HorizontalRuleOutlinedIcon from "@mui/icons-material/HorizontalRuleOutlined";
import { ReturnDefinitionType } from "../../../../types/returnDefinition.type";
import { ReturnType } from "../../../../types/return.type";

interface UserReturnsProps {
  loading: boolean;
  editMode: boolean;
  checkedReturns: ReturnDefinitionType[];
  returnDefinitions: ReturnDefinitionType[];
  returnTypes: ReturnType[];
  onFilterClear: VoidFunction;
  groupMode: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isSelectAllChecked: boolean;
  isHalfChecked: boolean;
  handleAllCheckChange(checked: boolean): void;
  onFilterChange(filterValue: string): void;
  onReturnTypeSelectionChange(type: ReturnType): void;
  handleCheckChange(row: ReturnDefinitionType, checked: boolean): void;
}

const StyledRootBox = styled(Box)(() => ({
  height: "100%",
  boxSizing: "border-box",
  paddingBottom: 5,
  boxShadow: "none",
}));

const StyledBodyBox = styled(Box)(() => ({
  height: "100%",
  overflow: "hidden",
  borderRadius: "8px",
  backgroundColor: "#FFF",
}));

const StyledFooterBox = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "end",
  zIndex: theme.zIndex.modal,
  boxShadow: "3px -20px 8px -4px #bababa1a",
  position: "relative",
  height: theme.general.footerHeight,
}));

const StyledIconBox = styled(Box)<{ _isActive: boolean }>(
  ({ theme, _isActive }) => ({
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 2,
    backgroundColor: _isActive
      ? theme.palette.mode === "dark"
        ? "#7cff6230"
        : "#ebf5e9"
      : theme.palette.mode === "dark"
      ? "#ffabab57"
      : "#f5e9e9",
  })
);

const UserReturns: React.FC<UserReturnsProps> = ({
  loading,
  editMode,
  handleCheckChange,
  checkedReturns,
  returnDefinitions,
  returnTypes,
  onReturnTypeSelectionChange,
  onFilterChange,
  onFilterClear,
  groupMode,
  setLoading,
  handleAllCheckChange,
  isSelectAllChecked,
  isHalfChecked,
}) => {
  const { t } = useTranslation();
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(25);

  const sliceArray = (arr: ReturnDefinitionType[], num: number) => {
    setLoading(true);
    const res = [];
    for (let i = 0; i < arr?.length; i += num) {
      const chunk = arr.slice(i, i + num);
      res.push(chunk);
    }
    return res;
  };

  const [data, setData] = useState<ReturnDefinitionType[][]>();

  useEffect(() => {
    if (returnDefinitions.length > 0) {
      const rows = sliceArray(returnDefinitions, limit);
      setData([...rows]);
      setLoading(false);
    } else {
      setData([]);
    }
  }, [activePage, returnTypes, limit, returnDefinitions, editMode]);

  const columnHeader = [
    {
      field: "code",
      headerName: t("code"),
      minWidth: 145,
    },
    {
      field: "name",
      headerName: t("description"),
      minWidth: 145,
    },
    {
      field: "returnType",
      headerName: t("returnType"),
      minWidth: 145,
      renderCell: (item: ReturnType) => {
        return `${item.code} / ${item.name}`;
      },
    },
    {
      field: "contactPerson",
      headerName: t("contactPerson"),
      minWidth: 145,
    },
    {
      field: "manualInput",
      headerName: t("manualInput"),
      minWidth: 120,
      hideCopy: true,
      renderCell: (item: boolean) => {
        return (
          <Box paddingX={"20px"}>
            <StyledIconBox _isActive={item}>
              {item ? (
                <DoneOutlinedIcon
                  sx={{ fontSize: "small", color: "#289E20" }}
                />
              ) : (
                <HorizontalRuleOutlinedIcon
                  sx={{
                    fontSize: "small",
                    color: "#ff0600",
                  }}
                />
              )}
            </StyledIconBox>
          </Box>
        );
      },
    },

    {
      field: "isChecked",
      headerName: t("permission"),
      minWidth: 120,
      hideCopy: true,
      renderCell: (item: string, row: ReturnDefinitionType) => {
        return (
          <PermissionCheckbox
            row={row}
            handleCheckChange={handleCheckChange}
            disabled={!groupMode && row["userRoleReturnDefinition"]}
            isRowChecked={isRowChecked(row)}
            editMode={editMode}
          />
        );
      },
    },
  ];

  const isRowChecked = (row: ReturnDefinitionType) => {
    return Boolean(checkedReturns.find((p) => p.id === row.id));
  };

  const getRows = () => {
    return data?.[activePage - 1]
      ? data?.[activePage - 1]?.map((item: ReturnDefinitionType) => ({
          ...item,
          isChecked: isRowChecked(item),
        }))
      : [];
  };

  return (
    <StyledRootBox display={"flex"} flexDirection={"column"}>
      <UserReturnsHeader
        returnTypes={returnTypes}
        onReturnTypeSelectionChange={onReturnTypeSelectionChange}
        onFilterChange={onFilterChange}
        onFilterClear={onFilterClear}
        editMode={editMode}
        handleAllCheckChange={handleAllCheckChange}
        isSelectAllChecked={isSelectAllChecked}
        isHalfChecked={isHalfChecked}
        setActivePage={setActivePage}
      />
      <StyledBodyBox flex={1}>
        {data && (
          <GridTable
            columns={columnHeader}
            rows={getRows()}
            selectedRows={[]}
            setRows={(rows: ReturnDefinitionType[]) => {
              const arr = [];
              arr[activePage - 1] = rows;
              setData(arr);
            }}
            loading={loading}
          />
        )}
      </StyledBodyBox>
      <StyledFooterBox>
        <Paging
          onPageChange={(page) => {
            setActivePage(page);
          }}
          totalNumOfRows={returnDefinitions.length}
          onRowsPerPageChange={(value) => {
            setActivePage(1);
            setLimit(value);
          }}
          initialRowsPerPage={limit}
          initialPage={activePage}
        />
      </StyledFooterBox>
    </StyledRootBox>
  );
};

export default React.memo(UserReturns);
