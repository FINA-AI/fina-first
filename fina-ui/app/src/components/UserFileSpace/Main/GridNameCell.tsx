import React from "react";
import { Box, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { UserFile } from "../../../types/userFileSpace.type";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import { FileIcon } from "../../../api/ui/icons/FileIcon";

interface GridNameCellProps {
  value: string | number;
  innerPage?: boolean;
  downloadUserFileHandler?: (
    val: UserFile,
    e:
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
      | React.MouseEvent<HTMLSpanElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  row?: UserFile;
}

const StyledWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "innerPage",
})<{ innerPage: boolean }>(({ innerPage }) => ({
  display: "flex",
  alignItems: "center",
  textDecoration: innerPage ? "underline" : "none",
  color: innerPage ? "blue" : "inherit",
}));

const StyledText = styled(Typography)({
  fontSize: "12px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const iconBaseStyle = {
  height: 18,
  marginRight: "2px",
};

const getFileIcon = (fileName: string, innerPage: boolean) => {
  if (!innerPage) {
    return (
      <FolderOpenRoundedIcon sx={{ ...iconBaseStyle, color: "#FF8D00" }} />
    );
  }

  const extension = fileName?.split(".").pop()?.toLowerCase();

  return <FileIcon extension={extension} iconStyles={iconBaseStyle} />;
};

const GridNameCell: React.FC<GridNameCellProps> = ({
  value,
  innerPage = false,
  downloadUserFileHandler,
  row,
}) => {
  const stringValue = String(value);

  return (
    <StyledWrapper innerPage={innerPage}>
      {getFileIcon(stringValue, innerPage)}
      {downloadUserFileHandler && row ? (
        <Link
          component="button"
          display="flex"
          onClick={(event) => downloadUserFileHandler(row, event)}
          data-testid={"download-link"}
        >
          {stringValue}
        </Link>
      ) : (
        <StyledText>{stringValue}</StyledText>
      )}
    </StyledWrapper>
  );
};

export default GridNameCell;
