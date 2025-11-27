import { Grid } from "@mui/material";
import ToolbarListSearch from "../../Catalog/MiniCatalog/ListSearch";
import MiniPaging from "../../common/Paging/MiniPaging";
import RSCDetailCustomList from "./RSCDetailCustomList";
import { useParams } from "react-router-dom";
import RCSDetailGrid from "./RCSDetailGrid";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import ToolbarIcon from "../../common/Icons/ToolbarIcon";
import RefreshIcon from "@mui/icons-material/Refresh";
import { ReturnSchedule } from "../../../types/returnCreationSchedule.type";
import { GridColumnType } from "../../../types/common.type";
import React from "react";
import { ScheduleType } from "../../../types/schedule.type";

interface RCSDetailPageProps {
  data: ScheduleType[];
  setData: (data: ScheduleType[]) => void;
  columns: GridColumnType[];
  pagingLimit: number;
  pagingPage: number;
  totalResults: number;
  setPagingPage: (page: number) => void;
  returnCreationSchedules?: ReturnSchedule[];
  loading: boolean;

  onFilterChange(searchString: string): void;

  getSchedules(id: number): void;

  onListSelect(item: ReturnSchedule): void;
}

const StyledGridItem = styled(Grid)(({ theme }: { theme: any }) => ({
  height: "100%",
  backgroundColor: theme.palette.paperBackground,
  paddingBottom: 3,
  borderTopRightRadius: 2,
  borderBottomRightRadius: 2,
}));

const StyledDrawerContainer = styled(Box)(({ theme }: { theme: any }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRight: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
}));

const StyledPages = styled(Box)(({ theme }: { theme: any }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  height: theme.general.footerHeight,
  borderTop: theme.palette.borderColor,
}));

const StyledGridHeader = styled(Box)({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  boxSizing: "border-box",
  padding: "0px 15px",
  height: 55,
});

const RCSDetailPage: React.FC<RCSDetailPageProps> = ({
  data,
  setData,
  onListSelect,
  columns,
  pagingLimit,
  pagingPage,
  totalResults,
  setPagingPage,
  returnCreationSchedules,
  loading,
  onFilterChange,
  getSchedules,
}) => {
  const { returncreationId }: any = useParams();

  const ItemLeftSide = () => {
    return (
      <StyledDrawerContainer>
        <div data-testid="schedule-search-box">
          <ToolbarListSearch
            to={"/returncreationschedule"}
            onFilter={(searchString) => {
              onFilterChange(searchString);
            }}
            height={55}
          />
        </div>
        <Box sx={{ height: "100%", overflow: "auto" }}>
          <RSCDetailCustomList
            onSelect={onListSelect}
            data={returnCreationSchedules}
            itemId={returncreationId}
          />
        </Box>
        <StyledPages>
          <MiniPaging
            totalNumOfRows={totalResults}
            initialedPage={pagingPage}
            onPageChange={(number) => setPagingPage(number)}
            initialRowsPerPage={pagingLimit}
          />
        </StyledPages>
      </StyledDrawerContainer>
    );
  };

  return (
    <Grid container height={"100%"} direction={"row"} minHeight={0}>
      <Grid item xs={2} height={"100%"}>
        <Grid
          item
          sx={{
            height: "100%",
            borderTopLeftRadius: 2,
            borderBottomLeftRadius: 2,
          }}
        >
          {ItemLeftSide()}
        </Grid>
      </Grid>
      <StyledGridItem item xs={10}>
        <StyledGridHeader>
          <ToolbarIcon
            onClickFunction={() => getSchedules(returncreationId)}
            Icon={<RefreshIcon />}
          />
        </StyledGridHeader>
        <RCSDetailGrid
          columns={columns}
          data={data}
          setData={setData}
          loading={loading}
        />
      </StyledGridItem>
    </Grid>
  );
};

export default RCSDetailPage;
