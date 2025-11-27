import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GridTable from "../../../common/Grid/GridTable";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { getFormattedDateValue } from "../../../../util/appUtil";
import useConfig from "../../../../hoc/config/useConfig";
import Paging from "../../../common/Paging/Paging";
import UserFIToolbar from "./UserFIToolbar";
import PermissionCheckbox from "../Permissions/PermissionCheckbox";
import { styled } from "@mui/system";
import { FiDataType } from "../../../../types/fi.type";
import {
  UserFi as UserFiInfo,
  UserFiData,
  UserFiType,
  UserType,
} from "../../../../types/user.type";
import { GridColumnType } from "../../../../types/common.type";

interface UserFiProps {
  editMode: boolean;
  fiTypes: UserFiData[];
  originalFiTypes: UserFiData[];
  loading: boolean;
  initialRowsPerPage?: number;
  selectedFIType?: UserFiType;
  setSelectedFIType: (value: UserFiType) => void;
  mainData: number[];
  selectedFisId: number[];
  setSelectedFisId: (ids: number[]) => void;
  setSelectedFIData: (ids: number[]) => void;
  setFiTypes: (fis: UserFiData[]) => void;
  onFilterClear: VoidFunction;
  isGroup: boolean;
  inheritedFiIds?: number[];
  setData(object: Partial<UserType>): void;
}

const StyledContentContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.paperBackground,
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
}));

const StyledFooter = styled("div")(({ theme }: any) => ({
  display: "flex",
  justifyContent: "space-between",
  zIndex: theme.zIndex.modal,
  boxShadow: "3px -20px 8px -4px #bababa1a",
  position: "relative",
  height: theme.general.footerHeight,
}));

const StyledText = styled(Box)(() => ({
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  float: "left",
  maxWidth: 120,
}));

const UserFi: React.FC<UserFiProps> = ({
  editMode,
  fiTypes = [],
  originalFiTypes = [],
  loading,
  selectedFIType,
  setSelectedFIType,
  setData,
  mainData,
  selectedFisId,
  setSelectedFisId,
  setSelectedFIData,
  setFiTypes,
  onFilterClear,
  isGroup,
  inheritedFiIds,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const [activePage, setActivePage] = useState(1);
  const [rowData, setRowData] = useState<UserFiInfo[][]>([]);
  const [columns, setColumns] = useState<GridColumnType[]>([]);
  const [selectedRows, setSelectedRows] = useState<UserFiInfo[]>([]);
  const [scrollToIndex, setScrollToIndex] = useState(0);
  const [pageLimit, setPageLimit] = useState(25);

  const sliceArray = (arr: any, num: number) => {
    const res = [];
    for (let i = 0; i < arr?.length; i += num) {
      const chunk = arr.slice(i, i + num);
      res.push(chunk);
    }
    return res;
  };

  const onCheck = (row: any, checked: boolean, isMulti?: boolean) => {
    const updateData = (updatedData: number[]) => {
      updateFiData(updatedData);
      setSelectedFisId(updatedData);
      setSelectedFIData(updatedData);
      setSelectedFIData(updatedData);
    };
    const rowIds: any = isMulti ? row : [row.id];
    const updatedData = checked
      ? [...mainData, ...rowIds]
      : mainData.filter((item) => !rowIds?.includes(item));

    updateData(updatedData);
  };

  const updateFiData = (fiIds: number[]) => {
    if (isGroup) {
      setData({ fiIds: fiIds });
    } else {
      const newArr = fiIds.filter((rId) => !inheritedFiIds?.includes(rId));
      setData({ fiIds: newArr });
    }
  };

  const changeFIRootCode = (item: UserFiType) => {
    setSelectedFIType(item);
    setActivePage(1);
    setSelectedRows([]);
  };

  const columnHeader = [
    {
      field: "name",
      headerName: t("name"),
      minWidth: 120,
      hideCopy: true,
      renderCell: (value: string, rows: UserFiInfo) => {
        value = rows["name"];
        return <StyledText>{value}</StyledText>;
      },
    },
    {
      field: "code",
      headerName: t("code"),
      minWidth: 120,
      hideCopy: true,
      renderCell: (value: string) => {
        return <StyledText>{value}</StyledText>;
      },
    },
    {
      field: "licenseCode",
      headerName: t("licenseCode"),
      minWidth: 120,
      hideCopy: true,
      renderCell: (value: string, rows: UserFiInfo) => {
        value = rows["licenseCode"];
        return (
          <Box
            display={"flex"}
            justifyContent={"space-around"}
            alignItems={"center"}
          >
            {value}
          </Box>
        );
      },
    },
    {
      field: "createdAt",
      headerName: t("creatingDate"),
      minWidth: 120,
      hideCopy: true,
      renderCell: (value: number, row: UserFiInfo) => {
        value = row["createdAt"];
        return (
          <Box
            display={"flex"}
            justifyContent={"space-around"}
            alignItems={"center"}
          >
            {getFormattedDateValue(value, getDateFormat(true))}
          </Box>
        );
      },
    },
    {
      field: "address",
      headerName: t("address"),
      minWidth: 120,
      hideCopy: true,
      renderCell: (value: string, row: UserFiInfo) => {
        value = row["address"];
        return <StyledText>{value}</StyledText>;
      },
    },
    {
      field: "modifiedAt",
      headerName: t("changeDate"),
      minWidth: 120,
      hideCopy: true,
      renderCell: (value: number, row: UserFiInfo) => {
        value = row["modifiedAt"];
        return (
          <Box
            display={"flex"}
            justifyContent={"space-around"}
            alignItems={"center"}
          >
            {getFormattedDateValue(value, getDateFormat(true))}
          </Box>
        );
      },
    },
    {
      field: "icChecked",
      headerName: t("permission"),
      minWidth: 120,
      hideCopy: true,
      renderCell: (value: string, row: UserFiInfo) => {
        return (
          <PermissionCheckbox
            row={row}
            editMode={editMode}
            disabled={!isGroup && row["roleFi"]}
            handleCheckChange={onCheck}
            isRowChecked={mainData.some((r) => r === row.id)}
          />
        );
      },
    },
  ];

  let data = fiTypes.find(
    (item) => item.parent.code === selectedFIType?.code
  )?.fis;

  useEffect(() => {
    setColumns([...columnHeader]);
  }, [editMode, t, mainData, rowData]);

  useEffect(() => {
    const rows = sliceArray(data, pageLimit);
    setRowData([...rows]);
    if (selectedRows[0]?.id) return;
    setScrollToIndex((prevState) => (prevState === 0 ? -1 : 0));
  }, [activePage, selectedFIType, fiTypes, pageLimit]);

  useEffect(() => {
    if (selectedRows[0]?.id) {
      const selectedRow = selectedRows[0];
      const rows: UserFiInfo[][] = sliceArray(data, pageLimit);
      const index = rows[activePage - 1].findIndex(
        (f) => f.id === selectedRow.id
      );
      setScrollToIndex(index !== -1 ? index : -1);
    }
  }, [selectedRows]);

  const onFilterClick = (searchValue: string) => {
    const isRowMatch = (row: any) => {
      return (
        row.code.toLowerCase().includes(searchValue.toLowerCase()) ||
        row.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    };

    const filterFiTypes = originalFiTypes.map((fiType) => {
      return {
        parent: fiType.parent,
        fis: fiType.fis.filter((item) => isRowMatch(item)),
      };
    });
    setFiTypes(filterFiTypes);

    const filteredRows = data?.filter((item) => isRowMatch(item));
    const rows = sliceArray(filteredRows, pageLimit);
    setRowData(rows);
    setSelectedRows([]);
  };

  const handleOnChange = (item: UserFiInfo) => {
    const newSelectedFIType = fiTypes.find(
      (fi) => fi.parent.id === item.fiType.id
    );
    if (newSelectedFIType?.parent) {
      setSelectedFIType(newSelectedFIType.parent);
      setSelectedRows([item]);
      const newRows: FiDataType[][] = sliceArray(
        newSelectedFIType.fis,
        pageLimit
      );

      newRows.forEach((arr, index) =>
        arr.forEach((row) => {
          if (item.id === row.id) {
            setActivePage(index + 1);
          }
        })
      );
    }
  };

  const handleOnClear = () => {
    setSelectedRows([]);
    setScrollToIndex(0);
    setActivePage(1);
  };

  const getRows = () => {
    return rowData[activePage - 1]
      ? rowData[activePage - 1]?.map((item) => ({
          ...item,
          icChecked: mainData.some((r) => r === item.id),
        }))
      : [];
  };

  return (
    <StyledContentContainer display={"flex"} flexDirection={"column"}>
      <UserFIToolbar
        fiTypes={fiTypes}
        selectedFIType={selectedFIType}
        changeFIRootCode={changeFIRootCode}
        mainData={mainData}
        editMode={editMode}
        onCheck={onCheck}
        onFilterClick={onFilterClick}
        onFilterClear={onFilterClear}
        handleOnChange={handleOnChange}
        handleOnClear={handleOnClear}
      />
      <GridTable
        columns={columns}
        rows={getRows()}
        selectedRows={selectedRows}
        setRows={(rows: UserFiData[]) => {
          const arr: any = [];
          arr[activePage - 1] = rows;
          setRowData(arr);
        }}
        loading={loading}
        scrollToIndex={scrollToIndex}
      />
      <StyledFooter>
        {editMode && selectedFisId.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              paddingLeft: "20px",
            }}
          >
            <DoneRoundedIcon
              sx={{
                color: "#289E20",
                fontSize: 18,
              }}
            />
            {selectedFisId.length !== 0 && (
              <Typography color={"#707C93"}>
                {selectedFisId.length} {t("selectedFIs")}
              </Typography>
            )}
          </Box>
        ) : (
          <span />
        )}
        <Paging
          onPageChange={(page) => {
            setActivePage(page);
            setSelectedRows([]);
          }}
          totalNumOfRows={data?.length ?? 0}
          onRowsPerPageChange={(number) => setPageLimit(number)}
          initialPage={activePage}
          initialRowsPerPage={pageLimit}
        />
      </StyledFooter>
    </StyledContentContainer>
  );
};

export default UserFi;
