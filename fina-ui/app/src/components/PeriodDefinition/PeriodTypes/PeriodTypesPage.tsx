import { Grid, Paper } from "@mui/material";
import React from "react";
import PeriodTypeComp from "./PeriodType";
import { PeriodType } from "../../../types/period.type";

interface PeriodTypePageProps {
  addNewModalOpen: boolean;
  setAddNewModalOpen: (isOpen: boolean) => void;
  data: PeriodType[];
  savePeriodTypes: (val: PeriodType) => void;
  periodTypeDeleteHandler: (id: number) => void;
}

const PeriodTypePage: React.FC<PeriodTypePageProps> = ({
  addNewModalOpen,
  setAddNewModalOpen,
  data,
  savePeriodTypes,
  periodTypeDeleteHandler,
}) => {
  return (
    <Grid sx={{ height: "100%", display: "flex" }}>
      <Paper
        sx={{
          width: "100%",
          height: "100%",
          boxShadow: "none",
          overflowY: "auto",
        }}
      >
        <PeriodTypeComp
          data={data}
          addNewModalOpen={addNewModalOpen}
          setAddNewModalOpen={setAddNewModalOpen}
          savePeriodTypes={savePeriodTypes}
          periodTypeDeleteHandler={periodTypeDeleteHandler}
        />
      </Paper>
    </Grid>
  );
};

export default PeriodTypePage;
