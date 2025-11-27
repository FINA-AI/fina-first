import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";

const StyledPermittedBtn = styled("div")<{ _permitted: boolean }>(
  ({ theme, _permitted }) => ({
    borderRadius: "1px",
    border: `1px solid ${_permitted ? theme.palette.primary.main : "#687A9E"}`,
    width: "auto",
    display: "flex",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 500,
    color: _permitted ? theme.palette.primary.main : "#687A9E",
    lineHeight: "16px",
    padding: "4px 12px",
    alignItems: "center",
    marginBottom: 12,
  })
);

const PermitButton = ({ permitted }: { permitted: boolean }) => {
  const { t } = useTranslation();
  return (
    <StyledPermittedBtn _permitted={permitted} data-testid={"permitted-Button"}>
      {permitted ? t("permitted") : t("nonPermitted")}
    </StyledPermittedBtn>
  );
};

PermitButton.propTypes = {
  permitted: PropTypes.bool.isRequired,
};

export default PermitButton;
