import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import PrimaryBtn from "../../components/common/Button/PrimaryBtn";
import GhostBtn from "../../components/common/Button/GhostBtn";
import { useTranslation } from "react-i18next";
import { Box, IconButton, Typography } from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { styled } from "@mui/material/styles";

const StyledModal = styled(Modal)({
  zIndex: "999999999 !important",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledPaper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.paperBackground,
  minHeight: "290px",
  width: "650px",
  overflow: "overlay",
  borderRadius: "8px",
  [theme.breakpoints.down("xl")]: {
    width: "550px",
  },
  [theme.breakpoints.down("lg")]: {
    width: "500px",
  },
  [theme.breakpoints.down("md")]: {
    width: "400px",
    marginLeft: 20,
    marginRight: 20,
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.textColor,
  fontWeight: 600,
}));

const StyledBody = styled(Box)({
  overflowY: "auto",
  overflowX: "hidden",
  padding: 10,
  whiteSpace: "pre-wrap",
});

const StyledModalHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: theme.palette.borderColor,
  padding: "10px",
}));

const StyledModalFooter = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  padding: "10px",
  borderTop: theme.palette.borderColor,
}));

const StyledMessage = styled(Typography)(({ theme }) => ({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontSize: "12",
  display: "inline",
  color: theme.palette.textColor,
}));

export const WindowOpenContext = React.createContext(null);
export const WindowMessageContext = React.createContext(null);

const ErrorWindowProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState(null);

  const changeOpen = (isOpen) => {
    setOpen(isOpen);
  };

  const changeBody = (m) => {
    setBody(m);
  };

  return (
    <WindowOpenContext.Provider value={changeOpen}>
      <WindowMessageContext.Provider value={changeBody}>
        <div
          style={{
            height: "100%",
          }}
        >
          {children}
        </div>
        <StyledModal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <> {body}</>
        </StyledModal>
      </WindowMessageContext.Provider>
    </WindowOpenContext.Provider>
  );
};

export const ErrorWindowBody = ({ title, message, modalCloseHandler }) => {
  const { t } = useTranslation();

  return (
    <StyledPaper>
      <Box>
        <StyledModalHeader>
          <StyledTitle>{title}</StyledTitle>
          <IconButton size={"small"} onClick={modalCloseHandler}>
            <ClearRoundedIcon fontSize={"small"} />
          </IconButton>
        </StyledModalHeader>
        <StyledBody height={"350px"}>
          <StyledMessage>{message}</StyledMessage>
        </StyledBody>
        <StyledModalFooter>
          <PrimaryBtn
            onClick={modalCloseHandler}
            endIcon={<ChevronRightRoundedIcon fontSize={"small"} />}
          >
            <Typography fontSize={12}>{t("okay")}</Typography>
          </PrimaryBtn>
        </StyledModalFooter>
      </Box>
    </StyledPaper>
  );
};

ErrorWindowBody.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  modalCloseHandler: PropTypes.func.isRequired,
};

export const ConfirmErrorWindowBody = ({
  message,
  onPrimaryClick,
  onSecondaryClick,
}) => {
  const { t } = useTranslation();

  return (
    <StyledPaper display={"flex"} flexDirection={"column"}>
      <Box display={"flex"} justifyContent={"center"} margin={5}>
        {message}
      </Box>
      <Box
        display={"flex"}
        justifyContent={"center"}
        style={{ marginTop: "auto" }}
      >
        <PrimaryBtn onClick={onPrimaryClick}>{t("yes")}</PrimaryBtn>
        &#160;&#160;
        <GhostBtn onClick={onSecondaryClick}>{t("no")}</GhostBtn>
      </Box>
    </StyledPaper>
  );
};

ConfirmErrorWindowBody.propTypes = {
  message: PropTypes.string.isRequired,
  onPrimaryClick: PropTypes.func.isRequired,
  onSecondaryClick: PropTypes.func.isRequired,
};

ErrorWindowProvider.propTypes = {
  children: PropTypes.any.isRequired,
};

export default ErrorWindowProvider;
