import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import React, { FC } from "react";
import Tooltip from "../Tooltip/Tooltip";
import { DashletDataType } from "../../../types/dashboard.type";
import { styled, useTheme } from "@mui/material/styles";

interface CustomBarChartProps {
  columnChart?: boolean;
  data: DashletDataType[];
}
interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: { value: string };
}

const StyledResponsiveContainer = styled(ResponsiveContainer)(() => ({
  "& .recharts-wrapper": {
    width: "100% !important",
    "& .recharts-surface": {
      width: "100% !important",
    },
  },
}));

const CustomBarChart: FC<CustomBarChartProps> = ({
  columnChart = false,
  data,
}) => {
  const theme = useTheme();
  const [fullWidth, setFullWidth] = React.useState(90);

  const options = {
    label: {
      fill: theme.palette.mode === "dark" ? "#FFF" : "#2C3644",
      fontSize: "11px",
      lineHeight: "16px",
      fontWeight: "400",
    },
    title: {
      fill: "#2C3644",
      fontWeight: 400,
      fontSize: "11px",
      lineHeight: "16px",
    },
    item: {
      fontWeight: 600,
      fontSize: "11px",
      lineHeight: "16px",
    },
  };

  const handleBarRef = (node: any) => {
    if (node) {
      setFullWidth(node.props.xAxis.width);
    }
  };

  const CustomTick: FC<CustomTickProps> = (props) => {
    const { x, y, payload } = props;
    const styles: { label: { [key: string]: string } } = {
      label: {
        height: "100%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        textAlign: "center",
        fill: "#2C3644",
        fontSize: "11px",
        lineHeight: "16px",
        fontWeight: "400",
        margin: "0 10px",
      },
    };

    const maxWidth = fullWidth / data.length + 15;

    return (
      <Tooltip title={payload?.value || ""}>
        <g transform={`translate(${x},${y})`}>
          <foreignObject
            x={maxWidth ? -maxWidth / 2 : -45} //default value when adding new dashlet in case no ref
            y={0}
            width={maxWidth ? maxWidth : 80} //default value when adding new dashlet in case no ref.
            height={20}
          >
            <div style={styles.label}>{payload?.value}</div>
          </foreignObject>
        </g>
      </Tooltip>
    );
  };

  return (
    <StyledResponsiveContainer width="100%" height="99%">
      <BarChart
        width={150}
        height={40}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        layout={columnChart ? "vertical" : "horizontal"}
      >
        <Bar
          ref={handleBarRef}
          dataKey="val"
          fill="#4D7CFF"
          style={{ marginRight: 50 }}
          radius={[5, 5, 5, 5]}
          barSize={32}
          label={
            columnChart
              ? { position: "insideLeft", fill: "white", ...options.item }
              : false
          }
          width={0}
        />
        <XAxis
          axisLine={false}
          tickLine={false}
          padding={{ left: 20 }}
          interval={0}
          type={columnChart ? "number" : "category"}
          dataKey={!columnChart ? "type" : ""}
          tick={<CustomTick />}
          style={{
            ...options.title,
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={{ stroke: "#EAEBF0", width: 5 }}
          padding={{ top: 20, bottom: 20 }}
          type={columnChart ? "category" : "number"}
          dataKey={columnChart ? "type" : ""}
          interval={columnChart ? 0 : undefined}
          style={{
            ...options.label,
          }}
        />
      </BarChart>
    </StyledResponsiveContainer>
  );
};

export default CustomBarChart;
