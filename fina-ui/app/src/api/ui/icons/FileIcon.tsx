import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import ExplicitRoundedIcon from "@mui/icons-material/ExplicitRounded";
import React from "react";
import { PowerPointIcon } from "./PowerPointIcon";

export const FileIcon = ({
  extension,
  iconStyles,
}: {
  extension?: string;
  iconStyles?: object;
}) => {
  const styles = { width: 20, height: 20, ...iconStyles };

  switch (extension) {
    case "pdf":
      return <PictureAsPdfRoundedIcon sx={{ ...styles, color: "#D32F2F" }} />;
    case "doc":
    case "docx":
      return <ArticleRoundedIcon sx={{ ...styles, color: "#1976D2" }} />;
    case "pptx":
      return <PowerPointIcon style={{ ...styles }} />;
    case "xls":
    case "xlsx":
    case "xlsm":
    default:
      return <ExplicitRoundedIcon sx={{ ...styles, color: "#2E7D32" }} />;
  }
};
