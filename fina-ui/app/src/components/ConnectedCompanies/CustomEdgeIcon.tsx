import React from "react";
import { EdgeProps, getBezierPath } from "reactflow";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import "../../App.css";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";

const foreignObjectSize = 40;

const StyledIconContainer = styled(Box)({
  backgroundColor: "#FFFFFF",
  borderRadius: "50px",
  width: 15,
  height: 15,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
});

const CustomEdgeIcon: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <StyledIconContainer>
            <AccountCircleRoundedIcon sx={{ color: "#FF8D00" }} />
          </StyledIconContainer>
        </div>
      </foreignObject>
    </>
  );
};

export default CustomEdgeIcon;
