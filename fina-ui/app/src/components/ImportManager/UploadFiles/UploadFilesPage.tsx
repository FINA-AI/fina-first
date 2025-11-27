import { Grid, Paper } from "@mui/material";
import React, { FC, useState } from "react";
import UploadFileError from "./UploadFileError";
import GridTable from "../../common/Grid/GridTable";
import { GridColumnType } from "../../../types/common.type";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import AccordionDetails from "@mui/material/AccordionDetails";
import UploadFilesFilter from "./UploadFilesFilter";
import UploadFileHeader from "./UploadFileHeader";
import {
  UploadFileFilterType,
  UploadFileType,
} from "../../../types/uploadFile.type";
import { styled } from "@mui/material/styles";
import InfinitePaging from "../../common/Paging/Infinite/InfinitePaging";

interface UploadFilesPageProps {
  onPagingLimitChange: (number: number) => void;
  setPagingPage: (number: number) => void;
  pagingPage: number;
  data: UploadFileType[];
  setData: (arr: UploadFileType[]) => void;
  columns: GridColumnType[];
  showErrorPage: boolean;
  loading: boolean;
  setIsUploadFileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initData: (filters: any) => void;
  filterStatuses: { name: string; status: string }[];
  onErrorPageClose: () => void;
  onUploadFileDelete: (ids: number[]) => void;
  selectedFile?: UploadFileType;
  setFilterData: React.Dispatch<React.SetStateAction<UploadFileFilterType>>;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  onRefresh: () => void;
}

const StyledGridContainer = styled(Grid)({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
  boxSizing: "border-box",
  flexWrap: "nowrap",
  flexDirection: "column",
});

const StyledFooter = styled(Grid)(({ theme }: any) => ({
  height: theme.general.footerHeight,
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  borderTop: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
  padding: 8,
}));

const StyledPaper = styled(Paper)({
  width: "100%",
  height: "100%",
  boxShadow: "none",
});

const StyledErrorPaperGrid = styled(Grid)(({ theme }: any) => ({
  borderLeft: theme.palette.borderColor,
  paddingTop: 0,
  height: "100%",
  width: "100%",
}));

const UploadFilesPage: FC<UploadFilesPageProps> = ({
  onPagingLimitChange,
  setPagingPage,
  pagingPage,
  data,
  columns,
  showErrorPage,
  loading,
  setIsUploadFileModalOpen,
  initData,
  filterStatuses,
  onErrorPageClose,
  onUploadFileDelete,
  selectedFile,
  setFilterData,
  setColumns,
  onRefresh,
  setData,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const [checkedItems, setCheckedItems] = useState<UploadFileType[]>([]);

  return (
    <>
      <StyledGridContainer container>
        <Accordion
          style={{ width: "100%", borderRadius: 0 }}
          expanded={expanded}
          disableGutters={true}
        >
          <AccordionSummary
            style={{ cursor: "default" }}
            expandIcon={
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setExpanded(!expanded);
                }}
              >
                <KeyboardArrowDownRoundedIcon />
              </div>
            }
          >
            <UploadFileHeader
              setIsUploadFileModalOpen={setIsUploadFileModalOpen}
              onUploadFileDelete={onUploadFileDelete}
              checkedItems={checkedItems}
              setCheckedItems={setCheckedItems}
              columns={columns}
              setColumns={setColumns}
              onRefresh={onRefresh}
            />
          </AccordionSummary>
          <AccordionDetails>
            <UploadFilesFilter
              initData={initData}
              filterStatuses={filterStatuses}
              setFilterData={setFilterData}
            />
          </AccordionDetails>
        </Accordion>
        <Grid
          container
          style={{
            height: "100%",
            minHeight: 0,
            boxSizing: "border-box",
            flexWrap: "wrap",
          }}
        >
          <Grid
            sx={{ paddingTop: 0, height: "100%", width: "100%" }}
            item
            xs={showErrorPage ? 6 : 12}
          >
            <StyledPaper>
              <GridTable
                columns={columns}
                rows={data}
                disableRowSelection={true}
                setRows={setData}
                checkboxEnabled={true}
                selectedRows={checkedItems}
                onCheckboxClick={(row: any, checkboxData: any) => {
                  setCheckedItems(checkboxData);
                }}
                loading={loading}
              />
            </StyledPaper>
          </Grid>
          <StyledErrorPaperGrid
            item
            xs={showErrorPage ? 6 : 0}
            style={{
              display: showErrorPage ? "block" : "none",
            }}
          >
            <StyledPaper>
              <UploadFileError
                fileId={selectedFile?.id}
                onErrorPageClose={onErrorPageClose}
              />
            </StyledPaper>
          </StyledErrorPaperGrid>
        </Grid>
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

export default UploadFilesPage;
