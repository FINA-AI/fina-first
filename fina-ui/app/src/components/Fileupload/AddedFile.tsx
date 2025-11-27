import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Tooltip from "@mui/material/Tooltip";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface AddedFileProps {
  fileName: string;
  onFileRemove: (fileName: string) => void;
  isValid: boolean;
  invalidText?: string;
  progress?: number;
  size?: number;
}

const AddedFile: React.FC<AddedFileProps> = ({
  fileName,
  size,
  onFileRemove,
  isValid,
  invalidText,
  progress,
}) => {
  return (
    <div
      style={{
        display: "flex",
        margin: "8px 0",
      }}
    >
      <DescriptionOutlinedIcon
        style={{
          margin: "10px",
          color: isValid ? "#3f51b5" : "#DF4260",
        }}
      />
      <div
        style={{
          width: "100%",
          margin: "auto 0px",
          color: "inherit",
        }}
      >
        <div>
          <span
            style={{
              color: !isValid ? "#DF4260" : "",
            }}
          >
            {fileName}
          </span>
          {!isValid && (
            <Tooltip arrow title={invalidText} placement="top">
              <ErrorOutlineIcon
                style={{
                  color: "#DF4260",
                  marginLeft: "8px",
                }}
              />
            </Tooltip>
          )}
          <ClearIcon
            onClick={() => onFileRemove(fileName)}
            style={{
              color: "#DF4260",
              cursor: "pointer",
              marginLeft: "8px",
            }}
          />
        </div>
        <Box display={"flex"} alignItems={"center"}>
          {isValid && size && <div>{Math.round(size / 1000)} kb</div>}
          {isValid && progress && (
            <Box
              style={{
                width: "70%",
                marginLeft: "10px",
              }}
              display="flex"
              alignItems="center"
            >
              <LinearProgress
                style={{
                  width: "80%",
                  marginRight: "10px",
                }}
                variant="determinate"
                value={progress}
              />
              <Typography variant="body2" color="textSecondary">{`${Math.round(
                progress
              )}%`}</Typography>
            </Box>
          )}
        </Box>
      </div>
    </div>
  );
};

export default AddedFile;
