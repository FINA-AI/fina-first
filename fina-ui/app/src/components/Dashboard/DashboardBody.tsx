import { Box } from "@mui/system";
import React from "react";
import DashboardDashlet from "./DashboardDashlet";
import { DashboardType } from "../../types/dashboard.type";
import { styled } from "@mui/material/styles";

interface DashboardBodyProps {
  selectedDashboard: DashboardType;
}

const StyledRoot = styled(Box)({
  display: "flex",
  height: "100%",
  width: "100%",
  justifyContent: "space-between",
  boxSizing: "border-box",
});

const StyledDashboardItemWrapper = styled(Box)({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  minWidth: 0,
});

const DashboardBody: React.FC<DashboardBodyProps> = ({ selectedDashboard }) => {
  return (
    selectedDashboard &&
    selectedDashboard.dashlets && (
      <StyledRoot padding={"0px 6px"}>
        {Object.values(selectedDashboard.dashlets).map((dashlet, index) => {
          return (
            <StyledDashboardItemWrapper key={index}>
              {dashlet.list.map((item) => {
                return <DashboardDashlet item={item} key={item.id} />;
              })}
            </StyledDashboardItemWrapper>
          );
        })}
      </StyledRoot>
    )
  );
};

export default DashboardBody;
