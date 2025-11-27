import React, { CSSProperties, useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
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
import { useTheme } from "@mui/material/styles";

interface CustomSimpleLineChartProps {
  data: DashletDataType[];
  id?: number;
  style: CSSProperties;
}

const CustomSimpleLineChart: React.FC<CustomSimpleLineChartProps> = ({
  data = [],
  id,
}) => {
  const theme = useTheme();
  const isDataEmpty = !(data && data.length > 0);
  const firstObject = data[0];
  const [fullWidth, setFullWidth] = React.useState(90);
  const [customColors, setCustomColors] = useState<DashletStyleType[]>([]);

  const handleBarRef = (node: any) => {
    if (node) {
      setFullWidth(node.props.xAxis.width);
    }
  };

  useEffect(() => {
    if (id) {
      let colors: any = getDashletColors(id, "LINECHART", data) ?? [];
      setCustomColors(colors);
    }
  }, [id]);

  const getFillColor = (index: number) => {
    if (customColors.length > 0) {
      return customColors[index]?.fill;
    }

    return getRandomFillAndStrokeColor()?.fill;
  };

  const getChartValues = (key: string, index: number) => {
    return (
      <Line
        ref={handleBarRef}
        type="monotone"
        dataKey={key}
        stroke={getFillColor(index)}
        key={index}
      />
    );
  };

  return (
    <>
      {!isDataEmpty && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={getChartDataKey(firstObject)}
              style={{ ...getChartOptions(theme).title }}
              tick={<CustomTick fullWidth={fullWidth} data={data} />}
              interval={0}
            />
            <YAxis style={{ ...getChartOptions(theme).label }} />
            <Tooltip contentStyle={{ ...getChartOptions(theme).tooltip }} />
            <Legend />
            {getDataValueKeys(firstObject).map((key, index) => {
              return getChartValues(key, index);
            })}
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default CustomSimpleLineChart;
