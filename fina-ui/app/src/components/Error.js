import React from "react";
import MuiAlert from "@mui/material/Alert";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const StyledRoot = styled("div")(({ theme }) => ({
  width: "100%",
  "& > * + *": {
    marginTop: theme.spacing(2),
  },
}));

const Error = ({ message }) => {
  return (
    <StyledRoot>
      <Alert severity="error">{message}</Alert>
    </StyledRoot>
  );
};

export default Error;

Error.propTypes = {
  message: PropTypes.string.isRequired,
};
