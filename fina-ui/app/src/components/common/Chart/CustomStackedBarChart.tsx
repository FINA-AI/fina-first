import React, { CSSProperties, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { getChartOptions, getRandomFillAndStrokeColor } from "./chartUtil";
import {
  getChartDataKey,
  getDashletColors,
  getDataValueKeys,
} from "./chartDataHelper";
import CustomTick from "./CustomTick";
import {
  DashletDataType,
  DashletStyleType,
} from "../../../types/dashboard.type";
import { styled, useTheme } from "@mui/material/styles";

interface CustomStackedBarChartProps {
  data: DashletDataType[];
  style: CSSProperties;
  id?: number;
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

const CustomStackedBarChart: React.FC<CustomStackedBarChartProps> = ({
  data = [],
  id,
}) => {
  const theme = useTheme();
  const isDataEmpty = !(data && data.length > 0);
  const firstObject = data[0];
  const [fullWidth, setFullWidth] = React.useState(90);
  const [customColors, setCustomColors] = useState<DashletStyleType[]>([]);

  useEffect(() => {
    if (id) {
      let colors: any = getDashletColors(id, "STACKEDBARCHART", data) ?? [];
      setCustomColors(colors);
    }
  }, [id]);

  const handleBarRef = (node: any) => {
    if (node) {
      setFullWidth(node.props.xAxis.width);
    }
  };

  const getFillColor = (index: number) => {
    if (customColors.length > 0) {
      return customColors[index]?.fill;
    }

    return getRandomFillAndStrokeColor()?.fill;
  };

  const getChartValues = (key: string, index: number) => {
    return (
      <Bar
        ref={handleBarRef}
        dataKey={key}
        fill={getFillColor(index)}
        key={index}
      />
    );
  };

  return (
    <>
      {!isDataEmpty && (
        <StyledResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 15 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={getChartDataKey(firstObject)}
              style={{ ...getChartOptions(theme).title }}
              tick={<CustomTick fullWidth={fullWidth} data={data} />}
              interval={0}
            />
            <YAxis style={{ ...getChartOptions(theme).label }} />
            <Legend />
            {getDataValueKeys(firstObject).map((key, index) => {
              return getChartValues(key, index);
            })}
          </BarChart>
        </StyledResponsiveContainer>
      )}
    </>
  );
};

export default CustomStackedBarChart;
