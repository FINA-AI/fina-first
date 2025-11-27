import React from "react";
import SimpleLoadMask from "../components/common/SimpleLoadMask";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

const StyledRoot = styled('div')({
  width: "100%",
  height: "100%",
  position: "relative",
})

const withLoading = (Component) => {
  const WithLoadingComponent = ({ loading = false, ...props }) => {
    return (
      <StyledRoot >
        <SimpleLoadMask loading={loading} />
        <Component {...props} />
      </StyledRoot>
    );
  };

  WithLoadingComponent.propTypes = {
    loading: PropTypes.bool,
  };

  return WithLoadingComponent;
};

export default withLoading;
