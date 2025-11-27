import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const Iframe = ({ src, title }) => {
  const { i18n } = useTranslation();

  return (
    <iframe
      key={i18n.language}
      title={title}
      src={src}
      width={"100%"}
      height={"100%"}
    />
  );
};

Iframe.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Iframe;
