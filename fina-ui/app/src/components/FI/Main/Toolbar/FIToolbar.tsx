import { Box, Grid } from "@mui/material";
import IntersectionObserverWrap from "../../../common/Overflow/IntersectionObserverWrap";
import React, { memo } from "react";
import FiToolbarAction from "./FiToolbarAction";
import FiToolbarSkeleton from "../../Skeleton/Toolbar/FiToolbarSkeleton";
import { styled, useTheme } from "@mui/material/styles";
import { FiDataType, FiTypeDataType } from "../../../../types/fi.type";
import { GridColumnType } from "../../../../types/common.type";

interface FIToolbarProps {
  reloadFi: (data: FiDataType) => void;
  fiTypes: FiTypeDataType[];
  selectedFIType?: FiTypeDataType;
  setSelectedFiType: React.Dispatch<
    React.SetStateAction<FiTypeDataType | undefined>
  >;
  columns: GridColumnType[];
  activeFIMainToolbar: boolean;
  selectedRowsLen: () => number;
  onDeleteMultipleRowsClick: () => void;
  cancelSelectedRows: () => void;
  isDefault: boolean;
  countedFis: Record<string, number>;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  onExport: () => void;
  loadFisByTypeFunction: (id: number, filter?: any) => void;
  setImportProgressActive: React.Dispatch<React.SetStateAction<boolean>>;
  setImportProgress: React.Dispatch<React.SetStateAction<number>>;
}

const StyledHeader = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "isMainToolbar",
})<{
  isMainToolbar: boolean;
}>(({ theme, isMainToolbar }: { theme: any; isMainToolbar: boolean }) => ({
  padding: isMainToolbar ? theme.pageToolbar.padding : "0px 0px 0px 16px",
  minHeight: "56px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  borderRadius: 4,
  backgroundColor: theme.palette.paperBackground,
}));

const StyledCodeTab = styled("span")(({ theme }) => ({
  display: "flex",
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "130%",
  paddingRight: "10px",
  cursor: "pointer !important",
  color: theme.palette.mode === "dark" ? "#ABBACE" : "inherit",
  textTransform: "uppercase",
  textDecoration: "none",
  padding: "4px 5px 10px 5px !important",
  whiteSpace: "nowrap",
  borderRadius: 0,
  "&:hover": {
    borderRadius: 4,
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.primary.light
        : "rgba(80,80,80, 0.05)",
  },
}));

const FIToolbar: React.FC<FIToolbarProps> = ({
  reloadFi,
  fiTypes,
  selectedFIType,
  setSelectedFiType,
  columns,
  activeFIMainToolbar,
  selectedRowsLen,
  onDeleteMultipleRowsClick,
  cancelSelectedRows,
  isDefault,
  countedFis,
  setColumns,
  onExport,
  loadFisByTypeFunction,
  setImportProgressActive,
  setImportProgress,
}) => {
  const theme = useTheme();
  const changeFIRootCode = (item: FiTypeDataType) => {
    setSelectedFiType(item);
  };

  const getCodes = () => {
    return fiTypes.map((item, index) => {
      return (
        <StyledCodeTab
          data-test-id={`fiType-${index}`}
          color={"primary"}
          key={item.code}
          onClick={() => changeFIRootCode(item)}
          data-targetid={item.code}
          style={{
            borderBottom: item.code === selectedFIType?.code ? "2px solid" : "",
            color:
              item.id === selectedFIType?.id
                ? theme.palette.primary.main
                : undefined,
          }}
        >
          {`${item.code} `}
          <span color={"primary"}>
            {countedFis && item.code && countedFis[item.code]
              ? `(${countedFis[item.code]})`
              : ""}
          </span>
        </StyledCodeTab>
      );
    });
  };

  return (
    <StyledHeader
      item
      xs={12}
      data-testid={"fi-toolbar"}
      isMainToolbar={!activeFIMainToolbar}
    >
      {fiTypes.length === 0 ? (
        <FiToolbarSkeleton />
      ) : (
        <Box
          justifyContent={"center"}
          display={"flex"}
          style={{ minWidth: "500px", width: "100%" }}
        >
          <IntersectionObserverWrap>
            <>{getCodes()}</>
          </IntersectionObserverWrap>
          <FiToolbarAction
            columns={columns}
            cancelSelectedRows={cancelSelectedRows}
            selectedRowsLen={selectedRowsLen}
            onDeleteMultipleRowsClick={onDeleteMultipleRowsClick}
            isDefault={isDefault}
            activeFIMainToolbar={activeFIMainToolbar}
            reloadFi={reloadFi}
            setColumns={setColumns}
            onExport={onExport}
            loadFisByTypeFunction={loadFisByTypeFunction}
            selectedFIType={selectedFIType}
            setImportProgressActive={setImportProgressActive}
            setImportProgress={setImportProgress}
          />
        </Box>
      )}
    </StyledHeader>
  );
};

export default memo(FIToolbar);
