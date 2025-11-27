import React, { CSSProperties, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
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

interface CustomStackedAreaChartProps {
  data: DashletDataType[];
  id?: number;
  style: CSSProperties;
}

const CustomStackedAreaChart: React.FC<CustomStackedAreaChartProps> = ({
  data = [],
  id,
}) => {
  const theme = useTheme();
  const isDataEmpty = !(data && data.length > 0);
  const firstObject = data[0];
  const [fullWidth, setFullWidth] = React.useState(90);
  const [customColor, setCustomColor] = useState<DashletStyleType>();

  useEffect(() => {
    if (id) {
      let colors: any = getDashletColors(id, "STACKEDAREACHART", data);
      setCustomColor(colors);
    }
  }, [id]);

  const getChartValues = (key: string, index: number) => {
    const randomChartStyle = getRandomFillAndStrokeColor();

    return (
      <Area
        ref={handleBarRef}
        type="monotone"
        dataKey={key}
        stroke={customColor?.stroke ?? randomChartStyle.stroke}
        fill={customColor?.fill ?? randomChartStyle?.fill}
        stackId="1"
        key={index}
      />
    );
  };

  const handleBarRef = (node: any) => {
    if (node) {
      setFullWidth(node.props.xAxis.width);
    }
  };

  return (
    <>
      {!isDataEmpty && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
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
            {getDataValueKeys(firstObject).map((key, index) => {
              return getChartValues(key, index);
            })}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default CustomStackedAreaChart;
