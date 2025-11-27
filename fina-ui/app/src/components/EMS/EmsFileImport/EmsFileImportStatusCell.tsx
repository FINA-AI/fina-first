import { Box } from "@mui/system";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { BASE_URL } from "../../../util/appUtil";

interface EmsFileImportStatusCellProps {
  value: string;
  fileId?: number;
}

const StyledStatusBox = styled(Box)<{ isError: boolean }>(
  ({ isError, theme }) => ({
    width: "80px",
    fontWeight: 500,
    fontSize: "12px",
    lineHeight: "16px",
    display: "flex",
    alignItems: "center",
    color:
      theme.palette.mode === "dark"
        ? isError
          ? "#FEE4E2"
          : "#ABEFC6"
        : isError
        ? "#FF4128"
        : "#289E20",
    background:
      theme.palette.mode === "dark"
        ? isError
          ? "#B42318"
          : "#079455"
        : isError
        ? "#FFECE9"
        : "#E9F5E9",
    justifyContent: "center",
    borderRadius: "2px",
    padding: "4px",
    cursor: isError ? "pointer" : "default",
    pointerEvents: !isError ? "none" : "auto",
  })
);

const EmsFileImportStatusCell: React.FC<EmsFileImportStatusCellProps> = ({
  value,
  fileId,
}) => {
  const { t } = useTranslation();

  const openNewTab = () => {
    window.open(
      BASE_URL + `/rest/ems/v1/file/import/error/${fileId}`,
      "_blank"
    );
  };

  return (
    <StyledStatusBox isError={value === "ERROR"} onClick={openNewTab}>
      <Typography width={"100%"} display={"flex"} justifyContent={"center"}>
        {value === "ERROR" ? t("error") : t("done")}
      </Typography>
    </StyledStatusBox>
  );
};

export default EmsFileImportStatusCell;
