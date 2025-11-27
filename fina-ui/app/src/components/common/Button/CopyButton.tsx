import { Box, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import React, { useState } from "react";
import Tooltip from "../Tooltip/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import DoneIcon from "@mui/icons-material/Done";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";
import { copyToClipboard } from "../../../util/appUtil";

interface IconProps {
  props: {
    width: number;
    height: number;
  };
}

const StyledDoneIcon = styled(DoneIcon)<IconProps>(({ props }) => ({
  width: props.width,
  height: props.height,
}));

const StyledCopyIconButton = styled(IconButton)<IconProps>(({ props }) => ({
  background: "inherit",
  border: "inherit",
  padding: 5,
  height: 24,
  "& .MuiCircularProgress-root": {
    width: `${props.width}px !important`,
    height: `${props.height}px !important`,
  },
}));

const StyledContentCopyIcon = styled(ContentCopyIcon)<IconProps>(
  ({ props }) => ({
    width: props.width,
    height: props.height,
  })
);

interface CopyButtonProps {
  text?: string;
  width?: number;
  height?: number;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  width = 13,
  height = 15,
  onLoadStart,
  onLoadEnd,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onLoadStart) {
      onLoadStart();
    }
    setLoading(true);
    e.stopPropagation();
    copyToClipboard(text);

    await delay(500);
    setLoading(false);
    setReady(true);

    await delay(500);
    setReady(false);

    if (onLoadEnd) {
      onLoadEnd();
    }
  };

  return (
    <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
      <StyledCopyIconButton
        props={{ width: width, height: height }}
        color={"primary"}
        onClick={(e) => onClick(e)}
        size="large"
        data-testid={"copy-button"}
      >
        {ready ? (
          <Tooltip arrow title={t("copied")} placement="top" open={true}>
            <StyledDoneIcon
              color={"primary"}
              props={{ width: width, height: height }}
            />
          </Tooltip>
        ) : loading ? (
          <CircularProgress color="inherit" />
        ) : (
          <StyledContentCopyIcon props={{ width: width, height: height }} />
        )}
      </StyledCopyIconButton>
    </Box>
  );
};

export default CopyButton;
