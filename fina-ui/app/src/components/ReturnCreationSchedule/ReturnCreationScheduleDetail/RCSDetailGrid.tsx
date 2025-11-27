import GridTable from "../../common/Grid/GridTable";
import React, { useState } from "react";
import { Box } from "@mui/system";
import { Grid, Paper } from "@mui/material";
import RCSDetailSidebar from "./RCSDetailSidebar";
import withLoading from "../../../hoc/withLoading";
import { styled } from "@mui/material/styles";
import { GridColumnType } from "../../../types/common.type";
import { ScheduleType } from "../../../types/schedule.type";

interface RCSDetailGridProps {
  columns: GridColumnType[];
  data: ScheduleType[];
  setData: (data: ScheduleType[]) => void;
  loading: boolean;
}

const StyledRoot = styled(Box)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 4,
});

const StyledGrid = styled(Grid)({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
});

const RCSDetailGrid: React.FC<RCSDetailGridProps> = ({
  columns,
  data,
  setData,
  loading,
}) => {
  const [sideMenu, setSideMenu] = useState<{
    open: boolean;
    row: ScheduleType | null;
  }>({
    open: false,
    row: null,
  });
  const [selectedRows, setSelectedRows] = useState<ScheduleType[]>([]);

  return (
    <StyledRoot>
      <Box height={"100%"}>
        <StyledGrid>
          <Grid sx={{ paddingTop: 0, height: "100%", width: "100%" }}>
            <Paper sx={{ width: "100%", height: "100%", boxShadow: "none" }}>
              <GridTable
                columns={columns}
                rows={data}
                setRows={setData}
                selectedRows={selectedRows}
                rowOnClick={(row: ScheduleType, deselect: boolean) => {
                  if (deselect) {
                    setSelectedRows([]);
                    setSideMenu({ open: false, row: null });
                  } else {
                    setSideMenu({ open: true, row: row });
                    setSelectedRows([row]);
                  }
                }}
                loading={loading}
                singleRowSelect={true}
                virtualized={true}
              />
            </Paper>
            <RCSDetailSidebar
              selectedRCS={selectedRows[0]}
              setIsScheduleInfoOpen={setSideMenu}
              isScheduleInfoOpen={sideMenu.open}
            />
          </Grid>
        </StyledGrid>
      </Box>
    </StyledRoot>
  );
};

export default withLoading(RCSDetailGrid);
