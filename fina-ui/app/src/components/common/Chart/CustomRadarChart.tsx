import React, { CSSProperties, useEffect, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { getChartOptions, getRandomFillAndStrokeColor } from "./chartUtil";
import {
  getChartDataKey,
  getDashletColors,
  getDataValueKeys,
} from "./chartDataHelper";
import {
  DashletDataType,
  DashletStyleType,
} from "../../../types/dashboard.type";
import { styled, useTheme } from "@mui/material/styles";

interface CustomRadarChartProps {
  data: DashletDataType[];
  id?: number;
  style: CSSProperties;
}

const StyledResponsiveContainer = styled(ResponsiveContainer)(({ theme }) => ({
  "& .recharts-text": {
    fontSize: "12px",
    fill: theme.palette.mode === "dark" ? "#FFFFFF" : "#2C3644",
  },
}));

const CustomRadarChart: React.FC<CustomRadarChartProps> = ({ data, id }) => {
  const theme = useTheme();

  const isDataEmpty = !(data && data.length > 0);
  const firstObject = data[0];
  const [customColor, setCustomColor] = useState<DashletStyleType>();

  useEffect(() => {
    if (id) {
      let colors: DashletStyleType = getDashletColors(id, "RADARCHART", data);
      setCustomColor(colors);
    }
  }, [id]);
  const getChartValues = (key: string, index: number) => {
    const randomChartStyle = getRandomFillAndStrokeColor();

    return (
      <Radar
        dataKey={key}
        stroke={customColor?.stroke ?? randomChartStyle.stroke}
        fill={customColor?.fill ?? randomChartStyle.fill}
        fillOpacity={0.6}
        key={index}
      />
    );
  };

  return (
    <>
      {!isDataEmpty && (
        <StyledResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey={getChartDataKey(firstObject)} />
            <PolarRadiusAxis
              angle={30}
              axisLine={false}
              style={{ ...getChartOptions(theme).label }}
            />
            {getDataValueKeys(firstObject).map((key, index) => {
              return getChartValues(key, index);
            })}
          </RadarChart>
        </StyledResponsiveContainer>
      )}
    </>
  );
};

export default CustomRadarChart;
