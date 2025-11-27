import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip as RechartsTooltip,
} from "recharts";
import { Grid, Tooltip as MuiTooltip, Typography } from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import {
  getChartDataKey,
  getDashletColors,
  getDataValueKeys,
} from "./chartDataHelper";
import { getRandomFillAndStrokeColor } from "./chartUtil";
import {
  DashletDataType,
  DashletStyleType,
} from "../../../types/dashboard.type";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";

interface LegendPayloadType {
  color: string;
  payload: {
    type: string;
    val: number;
  };
}

interface CustomPieChartProps {
  data: DashletDataType[];
  innerRadius?: number;
  outerRadius?: number;
  id?: number;
  cx?: number;
  cy?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
  stroke?: string;
  payload?: LegendPayloadType[];
  style?: DashletStyleType;
}

const StyledResponsiveContainer = styled(ResponsiveContainer)(() => ({
  width: "100%",
  height: 300,
  "& .recharts-layer .recharts-pie-sector": {
    outline: "none !important",
  },
  "& .recharts-default-tooltip": {
    border: "none !important",
    padding: "0 !important",
  },
  "& .recharts-tooltip-item": {
    color: "#FFF !important",
    fontSize: 11,
  },
  "& .recharts-tooltip-item-list": {
    padding: "2px !important",
    backgroundColor: "#2A3341",
    borderRadius: 4,
  },
}));

const StyledLegendGridContainer = styled(Grid)(() => ({
  overflowY: "auto",
  maxHeight: 270,
  padding: "0 10px",
  "&::-webkit-scrollbar": {
    display: "none",
  },
}));

const StyledLegendListItem = styled("li")(() => ({
  display: "flex",
  alignItems: "center",
  marginRight: "10px",
  fontSize: "12px",
}));

const StyledCircleRoundedIcon = styled(CircleRoundedIcon)(() => ({
  height: 8,
  width: 8,
  marginRight: 5,
}));

const StyledCustomTooltipBox = styled(Box)(() => ({
  width: "fit-content",
  maxWidth: 150,
  backgroundColor: "#2A3341",
  border: "none !important",
  padding: 5,
  borderRadius: 2,
}));

const CustomPieChart: FC<CustomPieChartProps> = ({
  data,
  innerRadius = 60,
  outerRadius = 80,
  id,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [chartData, setChartData] = useState<DashletDataType[]>(data);

  useEffect(() => {
    if (data) {
      if (data.length === 1) {
        if (data[0]) {
          let arr = [];
          const entries = Object.entries(data[0]);
          for (const [key, value] of entries) {
            let style = getRandomFillAndStrokeColor();
            arr.push({
              type: key,
              val: value,
              color: style.fill,
              createdAt: data[0].createdAt,
            });
          }
          setChartData(arr);
        }
      }
      let colors = getDashletColors(id, "PIECHART", data);
      if (colors) {
        const newArr = data.map((item: DashletDataType, index) => {
          return {
            ...item,
            type: item[getChartDataKey(item)],
            val: item[getDataValueKeys(item)[0]],
            color: colors[index]?.fill || getRandomFillAndStrokeColor().fill,
          };
        });
        setChartData(newArr as DashletDataType[]);
      }
    }
  }, []);

  const onPieEnter = useCallback(
    (_: any, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;

    return (
      <g>
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

  const renderLegend = (props: any) => {
    const { payload } = props;

    return (
      <StyledLegendGridContainer
        container
        justifyContent={"center"}
        direction={"column"}
      >
        <Grid item maxHeight={250} style={{ maxWidth: "240px" }}>
          <ul style={{ padding: 0, margin: 0 }}>
            {payload.map((entry: LegendPayloadType, index: number) => {
              return (
                <StyledLegendListItem key={`item-${index}`}>
                  <StyledCircleRoundedIcon style={{ color: entry.color }} />
                  <MuiTooltip title={entry.payload.type} arrow>
                    <Typography
                      fontSize={12}
                      fontWeight={"500"}
                      lineHeight={"16px"}
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {entry.payload.type}
                    </Typography>
                  </MuiTooltip>

                  <Typography
                    color={"#596D89"}
                    fontSize={12}
                    fontWeight={"400"}
                    lineHeight={"20px"}
                    pl={"5px"}
                  >
                    ({entry.payload.val})
                  </Typography>
                </StyledLegendListItem>
              );
            })}
          </ul>
        </Grid>
      </StyledLegendGridContainer>
    );
  };

  const CustomTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      return (
        <StyledCustomTooltipBox>
          <Typography
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
            overflow={"hidden"}
            color={"#FFF"}
            fontSize={11}
          >{`${payload[0].payload.type}(${payload[0].payload.val})`}</Typography>
        </StyledCustomTooltipBox>
      );
    }
    return null;
  };

  return (
    <StyledResponsiveContainer width={"99%"} height={"100%"}>
      <PieChart height={200}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          dataKey="val"
          data={chartData}
          cx={100}
          cy={"50%"}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#82ca9d"
          onMouseEnter={onPieEnter}
          onMouseLeave={() => setActiveIndex(-1)}
          stroke={""}
          onClick={() => {}}
        >
          {chartData.map((entry, index) => {
            return (
              <Cell
                style={{ outline: "none" }}
                key={`cell-${index}`}
                fill={`${entry.color}`}
              />
            );
          })}
        </Pie>
        <RechartsTooltip
          itemStyle={{ backgroundColor: "#2A3341" }}
          content={<CustomTooltip />}
        />
        <Legend
          iconType="square"
          content={renderLegend}
          layout="vertical"
          verticalAlign="middle"
          align="left"
        />
      </PieChart>
    </StyledResponsiveContainer>
  );
};

export default CustomPieChart;
