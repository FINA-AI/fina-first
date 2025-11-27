import React, { createContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

export const ConfigContext = createContext({});

const ConfigProvider = ({ children, config }) => {
  return <ConfigContext.Provider value={config} children={children} />;
};

const mapStateToProps = (state) => ({
  config: state.get("config").config,
  ...state,
});

const mapDispatchToProps = () => ({});

ConfigProvider.propTypes = {
  children: PropTypes.any.isRequired,
  config: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigProvider);
