import { Box } from "@mui/system";
import GridTable from "../common/Grid/GridTable";
import React, { useState } from "react";
import SurveySidebar from "./SurveySidebar";
import Paging from "../common/Paging/Paging";
import { Paper, Slide } from "@mui/material";
import { styled } from "@mui/material/styles";
import { GridColumnType } from "../../types/common.type";
import { Survey, SurveyResult, SurveySideMenu } from "../../types/survey.type";

interface SurveyGridProps {
  columnHeaders: GridColumnType[];
  list: Survey[];
  setList: (list: Survey[]) => void;
  surveyResult: SurveyResult[];
  totalResult: number;
  pagingPage: number;
  pagingLimit: number;
  setPagingPage: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  orderRowByHeader(sortField: string, sortDir: string): void;
  onPagingLimitChange(limit: number): void;
  mapDataToSurvey(
    result: string,
    surveyName: string,
    username: string
  ): Promise<void>;
}

const StyledBody = styled(Box)(({ theme }: { theme: any }) => ({
  height: "100%",
  background: theme.palette.paperBackground,
  minHeight: 0,
  position: "relative",
}));

const StyledDashboardGridSideBar = styled(Paper)(
  ({ theme }: { theme: any }) => ({
    width: 580,
    height: "100%",
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: theme.zIndex.modal,
    borderLeft: theme.palette.borderColor,
  })
);

const StyledPagingContainer = styled("div")(({ theme }: { theme: any }) => ({
  ...theme.pagePaging({ size: "default" }),
  background: theme.palette.paperBackground,
}));

const SurveyGrid: React.FC<SurveyGridProps> = ({
  columnHeaders,
  list,
  setList,
  surveyResult,
  mapDataToSurvey,
  totalResult,
  pagingPage,
  pagingLimit,
  onPagingLimitChange,
  setPagingPage,
  loading,
  orderRowByHeader,
}) => {
  const [sideMenu, setSideMenu] = useState<SurveySideMenu>({
    open: false,
    row: null,
  });

  return (
    <>
      <StyledBody>
        <Slide direction="left" in={sideMenu.open} timeout={600}>
          <StyledDashboardGridSideBar>
            <SurveySidebar
              setSideMenu={setSideMenu}
              data={sideMenu.row}
              surveyResult={surveyResult}
            />
          </StyledDashboardGridSideBar>
        </Slide>
        <GridTable
          columns={columnHeaders}
          rows={list}
          setRows={setList}
          rowOnClick={(row: Survey, deselect: boolean) => {
            if (deselect) {
              setSideMenu({ open: false, row: null });
            } else {
              setSideMenu({ open: true, row: row });
              mapDataToSurvey(row.survey, row.name, row.userName);
            }
          }}
          loading={loading}
          singleRowSelect={true}
          orderRowByHeader={orderRowByHeader}
        />
      </StyledBody>
      <StyledPagingContainer>
        <Paging
          onRowsPerPageChange={(number) => onPagingLimitChange(number)}
          onPageChange={(number) => setPagingPage(number)}
          totalNumOfRows={totalResult}
          initialPage={pagingPage}
          initialRowsPerPage={pagingLimit}
        />
      </StyledPagingContainer>
    </>
  );
};

export default SurveyGrid;
