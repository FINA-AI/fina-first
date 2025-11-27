import DescriptionIcon from "@mui/icons-material/Description";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ClearIcon from "@mui/icons-material/Clear";
import React, { FC } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "../../../common/Tooltip/Tooltip";
import { styled } from "@mui/material/styles";

interface AddedFileProps {
  fileName: string;
  size: number;
  onFileRemove: (fileName: string) => void;
  isValid: boolean;
  invalidText?: string;
  progress?: number;
}

const StyledUploadFileTextBox = styled(Box)(({ theme }) => ({
  width: "100%",
  margin: "auto 0px",
  color: theme.palette.mode === "dark" ? "#FFFF" : "inherit",
  maxWidth: "80%",
}));

const StyledClearIcon = styled(ClearIcon)(({ theme }: any) => ({
  color: theme.general.errorColor,
  cursor: "pointer",
  marginLeft: "8px",
}));

const StyledErrorIcon = styled(ErrorOutlineIcon)(({ theme }: any) => ({
  color: theme.general.errorColor,
  marginLeft: "8px",
}));

const UploadFileProgressView: FC<AddedFileProps> = ({
  fileName,
  size,
  onFileRemove,
  isValid,
  invalidText,
  progress,
}) => {
  return (
    <div style={{ display: "flex", margin: "8px 0" }}>
      <DescriptionIcon
        sx={(theme: any) => ({
          margin: "10px",
          color: isValid
            ? theme.palette.primary.main
            : theme.general.errorColor,
        })}
      />
      <StyledUploadFileTextBox>
        <div style={{ overflow: "hidden", display: "flex" }}>
          <Tooltip title={fileName}>
            <Box
              component={"span"}
              sx={(theme: any) => ({
                color: !isValid
                  ? theme.general.errorColor
                  : theme.palette.primary.main,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              })}
            >
              {fileName}
            </Box>
          </Tooltip>

          {!isValid && (
            <Tooltip
              arrow
              title={invalidText || ""}
              placement="top"
              slotProps={{
                arrow: {
                  sx: (theme: any) => ({
                    "&::before": {
                      border: `1px solid ${theme.general.errorColor}`,
                    },
                  }),
                },
                tooltip: {
                  sx: (theme: any) => ({
                    border: `1px solid ${theme.general.errorColor}`,
                  }),
                },
              }}
            >
              <StyledErrorIcon />
            </Tooltip>
          )}
          <StyledClearIcon onClick={() => onFileRemove(fileName)} />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {isValid && size && <div>{Math.round(size / 1000)} kb</div>}
          {isValid && progress && (
            <Box
              display="flex"
              alignItems="center"
              sx={{ width: "70%", marginLeft: "10px" }}
            >
              <LinearProgress
                sx={{ width: "80%", marginRight: "10px" }}
                variant="determinate"
                value={progress}
              />
              <Typography variant="body2" color="textSecondary">{`${Math.round(
                progress
              )}%`}</Typography>
            </Box>
          )}
        </div>
      </StyledUploadFileTextBox>
    </div>
  );
};

export default UploadFileProgressView;
