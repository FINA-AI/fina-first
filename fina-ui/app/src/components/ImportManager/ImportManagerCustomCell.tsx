import { Box } from "@mui/system";
import React from "react";
import { styled } from "@mui/material/styles";
import { UploadFile } from "../../types/importManager.type";

interface ImportManagerCustomCellProps {
  row: UploadFile;
}

const StyledRoot = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

const StyledCellWrapper = styled(Box)(() => ({
  borderRadius: "50%",
  width: 22,
  height: 22,
  marginRight: 5,
}));

const StyledCellIcon = styled("span")(() => ({
  fontSize: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#FFF",
  height: "inherit",
}));

const ImportManagerCustomCell: React.FC<ImportManagerCustomCellProps> = ({
  row,
}) => {
  const getFileExtension = () => {
    let arr = row["fileNameSafe"].split(".");
    let currentExtension = arr[arr.length - 1];
    let backgroundColor = "";
    switch (currentExtension) {
      case "xlsx":
      case "xlsm":
      case "xls":
        backgroundColor = "#2962FF";
        break;
      case "mnl":
        backgroundColor = "#FF8D00";
        break;
      default:
        backgroundColor = "#D0E3CC";
        break;
    }

    return (
      <StyledCellWrapper style={{ backgroundColor: backgroundColor }}>
        <StyledCellIcon> {currentExtension} </StyledCellIcon>
      </StyledCellWrapper>
    );
  };

  return <StyledRoot>{getFileExtension()}</StyledRoot>;
};

export default ImportManagerCustomCell;
