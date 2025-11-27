import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PropTypes from "prop-types";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import CircularProgress from "@mui/material/CircularProgress";
import DoneIcon from "@mui/icons-material/Done";
import Tooltip from "../Tooltip/Tooltip";
import { styled } from "@mui/material/styles";
import { copyToClipboard } from "../../../util/appUtil";

interface CopyCellButtonProps {
  text?: string | { length: string };
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
}

const copyCellButtonStyles = `
 .button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  background: unset;
  outline: none;
  border: unset;
  margin: 0;
  margin-left: 8px;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  text-decoration: none;
  border-radius: 50%;
  overflow: visible;
  padding: 2px;
  height: 20px;
  float: left;
  transition: background-color 0.3s ease-in-out;
}

.button:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.button .MuiCircularProgress-root {
  width: 16px !important;
  height: 16px !important;
}

.button .MuiCircularProgress-root .MuiCircularProgress-svg {
  width: 16px;
  height: 16px;
}
`;

const StyledContentCopyIcon = styled(ContentCopyIcon)(({ theme }: any) => ({
  fontSize: "16px !important",
  color: theme.palette.mode === "light" ? "#98A7BC" : "#5D789A",
}));

const StyledDoneIcon = styled(DoneIcon)(() => ({
  width: "16px",
  height: "16px",
}));

const CopyCellButton: FC<CopyCellButtonProps> = ({
  text,
  onLoadStart,
  onLoadEnd,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const onClick = async (e: React.MouseEvent) => {
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
    <>
      <style>{copyCellButtonStyles}</style>
      <button
        className={"button"}
        onClick={(e) => onClick(e)}
        data-testid={"copy-button"}
      >
        {ready ? (
          <Tooltip arrow title={t("copied")} placement="top" open={true}>
            <StyledDoneIcon color={"primary"} />
          </Tooltip>
        ) : loading ? (
          <CircularProgress color="primary" />
        ) : (
          <StyledContentCopyIcon color={"primary"} />
        )}
      </button>
    </>
  );
};

CopyCellButton.propTypes = {
  text: PropTypes.any,
  onLoadStart: PropTypes.func,
  onLoadEnd: PropTypes.func,
};

export default CopyCellButton;
