import React from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";
import { MdtNode, MDTNodeType } from "../../../types/mdt.type";

interface MDTNodeGeneralInfoFooterPropTypes {
  data: MdtNode;
}

const StyledEquationTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#ABBACE" : "#9AA7BE",
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
}));

const StyledDataTypeTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
  color: theme.palette.mode === "dark" ? "#F5F7FA" : "#2C3644",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  minWidth: "fit-content",
}));

const MDTNodeGeneralInfoFooter: React.FC<MDTNodeGeneralInfoFooterPropTypes> = ({
  data,
}) => {
  const { t } = useTranslation();

  const getProperties = () => {
    switch (data.type) {
      case MDTNodeType.INPUT:
        return (
          <>
            <StyledDataTypeTypography>
              {t("dataType")} :
            </StyledDataTypeTypography>
            <StyledEquationTypography
              ml={"5px"}
              data-testid-={"mdt-node-data-type"}
            >
              {data.dataType}
            </StyledEquationTypography>
          </>
        );
      case MDTNodeType.NODE:
        return (
          <>
            <StyledDataTypeTypography>
              {t("evaluationMethod")} :
            </StyledDataTypeTypography>
            <StyledEquationTypography
              ml={"5px"}
              data-testid-={"mdt-node-eval-method"}
            >
              {data.evalMethod}
            </StyledEquationTypography>
          </>
        );
      case MDTNodeType.DATA:
        return (
          <>
            <StyledDataTypeTypography>{t("value")} :</StyledDataTypeTypography>
            <StyledEquationTypography
              ml={"5px"}
              data-testid-={"mdt-node-equation"}
            >
              {data.equation}
            </StyledEquationTypography>
          </>
        );
    }
  };
  return <>{getProperties()}</>;
};

export default MDTNodeGeneralInfoFooter;
