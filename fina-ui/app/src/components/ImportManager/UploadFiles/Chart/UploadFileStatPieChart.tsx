import React, { useCallback, useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
} from "recharts";
import Grid from "@mui/material/Grid";
import { useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { ChartData } from "../../../../types/importManager.type";

export interface UploadFileStatPieChartProps {
  data: ChartData[];
  COLORS: Map<string, string>;
  chartTitle: string;
  chartPercentage: string;
  legendTitle: string;
  centerSubTitle: string;
  legendAlign: Record<string, any>;
  height: number;
  cx?: string;
  cy?: string;
  innerRadius?: string;
  outerRadius?: string;
  startAngle?: string;
  endAngle?: string;
  fill?: string;
  payload?: Record<string, any>;
}

const ChartTitleBox = styled(Box)({
  position: "absolute",
  paddingLeft: "30px",
  paddingTop: "20px",
  paddingBottom: "0",
  fontSize: "10px",
});

const commonLegendStyles = (theme: any) => ({
  display: "block",
  marginRight: "10px",
  fontSize: "10px",
  lineHeight: "12px",
  [theme.breakpoints.only("xs")]: {
    marginRight: "-5px",
  },
});

const StyledLi = styled("li")(({ theme }) => ({
  ...commonLegendStyles(theme),
}));

const StyledLegendTextBox = styled(Box)(({ theme }) => ({
  ...commonLegendStyles(theme),
}));

const UploadFileStatPieChart: React.FC<UploadFileStatPieChartProps> = ({
  data = [
    { key: "ERRORS", name: "0 Error", value: 0 },
    { key: "IMPORTED", name: "2 Imported", value: 2 },
  ],
  COLORS,
  chartTitle,
  chartPercentage,
  centerSubTitle,
  legendTitle,
  legendAlign = { vAlign: "middle", align: "right" },
  height,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLegend, setShowLegend] = useState(true);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 500 && showLegend) {
        setShowLegend(false);
      } else if (window.innerWidth >= 500 && showLegend === false) {
        setShowLegend(true);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showLegend]);

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          direction={"column"}
          fill={"#A0A1B2"}
        >
          <tspan
            x={cx}
            y={cy}
            dy="0em"
            style={{
              fontSize: "16px",
              lineHeight: "19px",
            }}
          >
            {chartPercentage}
          </tspan>
          <tspan
            style={{
              fontSize: "10px",
              lineHeight: "12px",
            }}
            x={cx}
            dy="1.2em"
          >
            {centerSubTitle}
          </tspan>
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 5}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  const onPieEnter = useCallback(
    (_: any, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const renderLegend = (props: any) => {
    const { payload } = props;

    return (
      <Grid
        container
        justifyContent={"center"}
        direction={"column"}
        spacing={2}
      >
        <Grid item>
          <StyledLegendTextBox>{legendTitle}</StyledLegendTextBox>
        </Grid>

        <Grid item>
          <ul>
            {payload.map((entry: any, index: number) => (
              <StyledLi key={`item-${index}`}>
                {/*<BulletIcon*/}
                {/*  iconType={entry.type}*/}
                {/*  iconSize={7}*/}
                {/*  color={entry.color}*/}
                {/*/>*/}
                {entry.value}
              </StyledLi>
            ))}
          </ul>
        </Grid>
      </Grid>
    );
  };
  const query = useTheme();
  const isSmBreakPoint = useMediaQuery(query.breakpoints.down("md"));

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        "& .recharts-wrapper": {
          width: "inherit !important",
        },
        "& .recharts-surface": {
          maxWidth: "100%",
        },
      }}
    >
      <ChartTitleBox>{chartTitle}</ChartTitleBox>
      <ResponsiveContainer width={"99%"} height={height}>
        <PieChart style={{ marginLeft: "1%" }}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx={"50%"}
            cy={isSmBreakPoint ? "40%" : "50%"}
            innerRadius={60}
            outerRadius={80}
            startAngle={-90}
            endAngle={520}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={() => setActiveIndex(0)}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS.get(entry.key)} />
            ))}
          </Pie>
          <Legend
            iconType="square"
            iconSize={7}
            content={renderLegend}
            layout="vertical"
            verticalAlign={legendAlign.vAlign}
            align={legendAlign.align}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default UploadFileStatPieChart;
