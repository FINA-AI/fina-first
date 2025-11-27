import { Box } from "@mui/system";
import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { Paper, Slide } from "@mui/material";
import GridTable from "../common/Grid/GridTable";
import ToolbarIcon from "../common/Icons/ToolbarIcon";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import AuditLogSide from "./AuditLogSide";
import TableCustomizationButton from "../common/Button/TableCustomizationButton";
import { AUDIT_LOG_TABLE_KEY } from "../../api/TableCustomizationKeys";
import {
  columnFilterConfigType,
  FilterType,
  GridColumnType,
} from "../../types/common.type";
import { AuditLogDataType } from "../../types/auditLog.type";
import { styled } from "@mui/material/styles";
import InfinitePaging from "../common/Paging/Infinite/InfinitePaging";

interface AuditLogPageProps {
  columns: GridColumnType[];
  data: AuditLogDataType[];
  setData: (value: AuditLogDataType[]) => void;
  filter: {
    page: number;
    limit: number;
    [key: string]: number | string;
  };
  onPagingLimitChange: (limit: number) => void;
  onPageChange: (page: number) => void;
  dataLoading: boolean;
  filterOnChangeFunction: (obj: FilterType[]) => void;
  setColumns: (columns: GridColumnType[]) => void;
  columnFilterConfig?: columnFilterConfigType[];
  onExport: () => void;
  onSort: (sortField: string, sortDir: string) => void;
}

interface SideMenuType {
  open: boolean;
  row: AuditLogDataType | null;
}

const StyledRootBox = styled(Paper)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  opacity: 1,
  borderTop: theme.palette.borderColor,
  height: "100%",
  width: "700px",
  position: "absolute",
  top: 0,
  right: 0,
  zIndex: theme.zIndex.modal,
  borderLeft: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
  borderRadius: 0,
}));

const StyledContentContainer = styled(Box)(({ theme }: any) => ({
  ...theme.page,
}));

const StyledRoot = styled(Box)(({ theme }: any) => ({
  ...theme.pageContent,
}));

const StyledHeader = styled(Grid)(({ theme }: any) => ({
  ...theme.pageToolbar,
  padding: "9px 12px",
  justifyContent: "flex-end",
}));

const StyledGridContainer = styled(Grid)({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
});

const StyledPagesContainer = styled(Grid)(({ theme }: any) => ({
  ...theme.pagePaging({ size: "default" }),
}));

const StyledContent = styled(Grid)({
  paddingTop: 0,
  height: "100%",
  width: "100%",
});

const StyledPaper = styled(Paper)({
  width: "100%",
  height: "100%",
});
const AuditLogPage: React.FC<AuditLogPageProps> = ({
  columns,
  columnFilterConfig,
  data,
  setData,
  filter,
  onPagingLimitChange,
  onPageChange,
  dataLoading,
  filterOnChangeFunction,
  setColumns,
  onExport,
  onSort,
}) => {
  const [sideMenu, setSideMenu] = useState<SideMenuType>({
    open: false,
    row: null,
  });

  return (
    <StyledContentContainer>
      <StyledRoot>
        <StyledHeader>
          <ToolbarIcon
            onClickFunction={() => onExport()}
            Icon={<PrintRoundedIcon />}
            data-testid={"export-button"}
          />
          <span style={{ paddingLeft: "8px" }}>
            <TableCustomizationButton
              columns={columns}
              setColumns={setColumns}
              isDefault={false}
              hasColumnFreeze={true}
              tableKey={AUDIT_LOG_TABLE_KEY}
            />
          </span>
        </StyledHeader>
        <StyledGridContainer>
          <StyledContent>
            <StyledPaper>
              <GridTable
                columns={columns}
                columnFilterConfig={columnFilterConfig}
                loading={dataLoading}
                rows={data}
                setRows={setData}
                singleRowSelect={true}
                rowOnClick={(row: AuditLogDataType, deselect: boolean) => {
                  if (deselect) {
                    setSideMenu({ open: false, row: null });
                  } else {
                    setSideMenu({ open: true, row: row });
                  }
                }}
                filterOnChangeFunction={filterOnChangeFunction}
                checkboxEnabled={false}
                orderRowByHeader={onSort}
              />
            </StyledPaper>
            <StyledPaper>
              <Slide direction="left" in={sideMenu.open} timeout={600}>
                <StyledRootBox elevation={1}>
                  <AuditLogSide sideMenu={sideMenu} setSideMenu={setSideMenu} />
                </StyledRootBox>
              </Slide>
            </StyledPaper>
          </StyledContent>
        </StyledGridContainer>
        <StyledPagesContainer>
          <InfinitePaging
            onRowsPerPageChange={(number) => onPagingLimitChange(number)}
            onPageChange={onPageChange}
            initialPage={filter.page}
            dataQuantity={data.length}
          />
        </StyledPagesContainer>
      </StyledRoot>
    </StyledContentContainer>
  );
};

export default AuditLogPage;
