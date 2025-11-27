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

interface CustomSimpleBarChartProps {
  data: DashletDataType[];
  id?: number;
  style: CSSProperties;
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

const CustomSimpleBarChart: React.FC<CustomSimpleBarChartProps> = ({
  data = [],
  id,
}) => {
  const theme = useTheme();
  const isDataEmpty = !(data && data.length > 0);

  const firstObject = data[0];
  const [fullWidth, setFullWidth] = React.useState(90);
  const [customColor, setCustomColor] = useState<DashletStyleType>();

  const handleBarRef = (node: any) => {
    if (node) {
      setFullWidth(node.props.xAxis.width);
    }
  };

  useEffect(() => {
    if (id) {
      let colors: any = getDashletColors(id, "BARCHART", data);
      setCustomColor(colors);
    }
  }, [id]);

  const getChartValues = (key: string, index: number) => {
    const randomChartStyle = getRandomFillAndStrokeColor();

    return (
      <Bar
        ref={handleBarRef}
        dataKey={key}
        fill={customColor?.fill ?? randomChartStyle?.fill}
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

export default CustomSimpleBarChart;
