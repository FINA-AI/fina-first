import { Grid, Paper, Slide } from "@mui/material";
import GridTable from "../../common/Grid/GridTable";
import ImportManagerDetails from "../ImportManagerDetails";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import InfinitePaging from "../../common/Paging/Infinite/InfinitePaging";
import { ImportedReturn, UploadFile } from "../../../types/importManager.type";
import {
  columnFilterConfigType,
  GridColumnType,
} from "../../../types/common.type";

interface ImportManagerMainPageProps {
  data: UploadFile[];
  setData: (data: UploadFile[]) => void;
  columns: GridColumnType[];
  loading: boolean;
  setLoadingMask: (value: boolean) => void;
  loadingMask: boolean;
  list: ImportedReturn[];
  onPagingLimitChange: (limit: number) => void;
  setPagingPage: (page: number) => void;
  pagingPage: number;
  columnFilterConfig: columnFilterConfigType[];
  filterOnChangeFunction: (filteredData: any[]) => void;
  initImportManagerFile(row: UploadFile): void;
}

const StyledGridContainer = styled(Grid)(({ theme }) => ({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
  backgroundColor: (theme as any).palette.paperBackground,
}));

const StyledGrid = styled(Grid)(() => ({
  paddingTop: 0,
  height: "100%",
  width: "100%",
}));

const StyledRoot = styled(Paper)(({ theme }: { theme: any }) => ({
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
}));

const StyledFooter = styled(Grid)(({ theme }: { theme: any }) => ({
  height: theme.general.footerHeight,
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  borderTop: theme.palette.borderColor,
  padding: 8,
  backgroundColor: theme.palette.paperBackground,
}));

const StyledPaper = styled(Paper)(() => ({
  width: "100%",
  height: "100%",
  boxShadow: "none",
}));

const ImportManagerMainPage: React.FC<ImportManagerMainPageProps> = ({
  data,
  setData,
  columns,
  loading,
  initImportManagerFile,
  setLoadingMask,
  list,
  loadingMask,
  onPagingLimitChange,
  setPagingPage,
  pagingPage,
  columnFilterConfig,
  filterOnChangeFunction,
}) => {
  const [row, setRow] = useState({});
  const [isDetailPageOpen, setIsDetailPageOpen] = useState(false);

  return (
    <>
      <StyledGridContainer>
        <StyledGrid>
          <StyledPaper>
            <GridTable
              rows={data}
              setRows={setData}
              columns={columns}
              columnFilterConfig={columnFilterConfig}
              loading={loading}
              filterOnChangeFunction={filterOnChangeFunction}
              rowOnClick={(row: UploadFile, deselect: boolean) => {
                initImportManagerFile(row);
                setIsDetailPageOpen(!deselect);
                setRow(row);
                setLoadingMask(true);
              }}
            />
          </StyledPaper>
          <StyledPaper>
            <Slide direction="left" in={isDetailPageOpen} timeout={600}>
              <StyledRoot>
                <ImportManagerDetails
                  setIsDetailPageOpen={setIsDetailPageOpen}
                  list={list}
                  row={row}
                  loading={loadingMask}
                />
              </StyledRoot>
            </Slide>
          </StyledPaper>
        </StyledGrid>
      </StyledGridContainer>
      <StyledFooter>
        <InfinitePaging
          onRowsPerPageChange={(number) => onPagingLimitChange(number)}
          onPageChange={(number) => setPagingPage(number)}
          initialPage={pagingPage}
          dataQuantity={data.length}
        />
      </StyledFooter>
    </>
  );
};

export default ImportManagerMainPage;
