import { styled } from "@mui/material/styles";
import { Box, Tooltip } from "@mui/material";
import { getFileSize, MAX_ALLOWED_FILE_SIZE } from "../../../util/appUtil";
import CloseIcon from "@mui/icons-material/Close";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import Link from "@mui/material/Link";
import React, { ReactNode } from "react";
import { CommAttachmentType } from "../../../types/communicator.common.type";

interface FileAttachmentBoxProps {
  open: boolean;
  files: any;
  remove: (i: number, file: CommAttachmentType) => void;
  style?: any;
  children?: ReactNode;
  hideCloseIcon?: boolean;
  onFileDownload?: (fileId: number) => void;
}

const StyledRoot = styled(Box)<{ open: boolean }>(({ theme, open }) => ({
  display: `${open ? "flex" : "none"}`,
  flexDirection: "column",
  width: "100%",
  padding: "5px 0px",
  backgroundColor: theme.palette.mode === "light" ? "#F9F9F9" : "#1F2532",
  borderRadius: 4,
  marginBottom: "5px",
}));

const StyledContainer = styled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  padding: "3px 0px",
  justifyContent: "space-between",
  backgroundColor:
    theme.palette.mode === "light"
      ? "#F9F9F9 !important"
      : "#1F2532 !important",
}));

const StyledAttachmentIcon = styled(TextSnippetIcon)(({ theme }) => ({
  "& .MuiSvgIcon-root": {
    width: "14px",
    height: "14px",
  },
  color: theme.palette.mode === "dark" ? "#5D789A" : theme.palette.primary.main,
  marginLeft: "14px",
}));

const StyledFileSize = styled("span")<{ isError: boolean }>(
  ({ theme, isError }) => ({
    fontSize: "11px",
    marginBottom: "0px",
    color: isError
      ? "#cc0000"
      : theme.palette.mode === "dark"
      ? "#5D789A"
      : "#AEB8CB",
    fontWeight: 400,
    lineHeight: "16px",
  })
);

const StyledFileName = styled(Link)(({ theme }) => ({
  fontSize: "11px",
  marginBottom: "0px",
  color: (theme as any).palette.textColor,
  fontWeight: 400,
  lineHeight: "16px",
  paddingLeft: "5px",
  cursor: "pointer",
}));

const StyledCloseIcon = styled(CloseIcon)(({ theme }) => ({
  fontSize: "18px",
  cursor: "pointer",
  marginRight: "14px",
  color: theme.palette.mode === "light" ? "#AEB8CB" : "#5D789A",
  backgroundColor: theme.palette.mode === "dark" ? "#344258" : "#F1F1F1",
  borderRadius: "19px",
}));

const FileTooltip = styled(Tooltip)(() => ({
  tooltip: {
    backgroundColor: "",
  },
}));

const FileAttachmentBox: React.FC<FileAttachmentBoxProps> = ({
  files,
  remove,
  open,
  style,
  hideCloseIcon,
  children,
  onFileDownload = () => {},
}) => {
  const textSizeLimit = (text: string) => {
    return text.length > 32 ? text.substring(0, 29) + " ..." : text;
  };

  return (
    <StyledRoot open={open} data-testid={"file-attachment-box"}>
      {files.map((item: any, i: number) => {
        const isLargeFile = item.size > MAX_ALLOWED_FILE_SIZE;
        return (
          <StyledContainer
            style={style}
            key={i}
            data-testid={"attachment-" + i}
          >
            <Box display={"flex"} width={"100%"} alignItems={"center"}>
              <FileTooltip key={i} title={item.name} placement="top">
                <StyledAttachmentIcon />
              </FileTooltip>
              <StyledFileName
                underline="hover"
                onClick={() => onFileDownload(item.id)}
                data-testid={"name"}
              >
                {textSizeLimit(item.name)}{" "}
                <Tooltip arrow title={isLargeFile ? "File is too large" : ""}>
                  <StyledFileSize isError={isLargeFile}>
                    ({item.contentLength || getFileSize(item.size)})
                  </StyledFileSize>
                </Tooltip>
              </StyledFileName>
            </Box>
            <>
              {children}
              {!hideCloseIcon && (
                <StyledCloseIcon
                  onClick={() => remove(i, item)}
                  data-testid={"remove-icon"}
                />
              )}
            </>
          </StyledContainer>
        );
      })}
    </StyledRoot>
  );
};

export default FileAttachmentBox;
