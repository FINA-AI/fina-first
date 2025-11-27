import React, { FC, useEffect, useState } from "react";
import { Box } from "@mui/system";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { useTranslation } from "react-i18next";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Tooltip from "../../common/Tooltip/Tooltip";
import { Typography } from "@mui/material";
import GhostBtn from "../../common/Button/GhostBtn";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import UploadFileErrorChart from "./Chart/UploadFileErrorChart";
import UploadFileErrorGrid from "./UploadFilesErrorGrid";
import {
  getFileDetails,
  getUploadFileImportStatuses,
} from "../../../api/services/uploadFileService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import {
  UploadFileStatusType,
  UploadFileType,
} from "../../../types/uploadFile.type";
import { BASE_URL } from "../../../util/appUtil";
import { styled } from "@mui/material/styles";

interface UploadFileErrorProps {
  fileId?: number;
  onErrorPageClose: () => void;
}

const StyledHeader = styled(Box)(({ theme }: any) => ({
  display: "flex",
  borderBottom: theme.palette.borderColor,
  borderTop: theme.palette.borderColor,
  padding: "8px 16px",
  justifyContent: "space-between",
}));

const UploadFileError: FC<UploadFileErrorProps> = ({
  fileId,
  onErrorPageClose,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [data, setData] = useState<UploadFileType>();
  const [statusData, setStatusData] = useState<UploadFileStatusType[]>([]);
  const [validationErrorCount, setValidationErrorCount] = useState(0);

  useEffect(() => {
    initData();
    initStatusData();
  }, [fileId]);

  const initData = async () => {
    try {
      if (fileId) {
        const res = await getFileDetails(fileId);
        setData(res.data);
      }
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  const initStatusData = async () => {
    try {
      if (fileId) {
        const res = await getUploadFileImportStatuses(fileId);
        setStatusData(res.data);
      }
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  const downloadErrorLog = () => {
    window.open(
      BASE_URL + `/rest/ui/v1/uploadFile/error/${data?.id}`,
      "_blank"
    );
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      data-testid={"file-error-slide"}
    >
      <StyledHeader data-testid={"header"}>
        <PrimaryBtn
          onClick={() => {
            downloadErrorLog();
          }}
          endIcon={<DownloadRoundedIcon />}
          data-testid={"export-button"}
        >
          {t("exporterrorlogs")}
        </PrimaryBtn>
        <Tooltip title={data?.fileName || ""}>
          <Typography>{data?.fileName}</Typography>
        </Tooltip>
        <GhostBtn onClick={onErrorPageClose} data-testid={"close-button"}>
          {t("close")}
          <CloseRoundedIcon style={{ marginLeft: 4 }} />
        </GhostBtn>
      </StyledHeader>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden auto",
        }}
      >
        <Box>
          <UploadFileErrorChart
            validationErrorCount={validationErrorCount}
            setValidationErrorCount={setValidationErrorCount}
            data={statusData}
          />
        </Box>
        <Box>
          <UploadFileErrorGrid data={statusData} />
        </Box>
      </Box>
    </Box>
  );
};

export default UploadFileError;
