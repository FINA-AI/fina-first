import React, { FC } from "react";
import Tooltip from "../Tooltip/Tooltip";

interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: { value: string };
  fullWidth: number;
  data: object[];
}
const CustomTick: FC<CustomTickProps> = (props) => {
  const { x, y, payload, fullWidth, data } = props;
  const styles: any = {
    label: {
      width: "100%",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      textAlign: "center",
      fill: "#2C3644",
      fontSize: "11px",
      lineHeight: "16px",
      fontWeight: "400",
      margin: "0 5px",
    },
  };

  const maxWidth = fullWidth / data.length;
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

export default CustomTick;
