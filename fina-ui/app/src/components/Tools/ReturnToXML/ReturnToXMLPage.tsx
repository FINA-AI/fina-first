import { Box } from "@mui/system";
import { Grid, Typography } from "@mui/material";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ReturnToXMLBody from "./ReturnToXMLBody";
import withLoading from "../../../hoc/withLoading";
import { styled } from "@mui/material/styles";
import { ReturnToXMLData } from "../../../types/tools.type";

const StyledRoot = styled(Box)(({ theme }: any) => ({
  ...theme.pageContent,
}));

const StyledGridContainer = styled(Grid)({
  overflow: "hidden",
  height: "100%",
  padding: "12px 8px",
});

const StyledToolbar = styled(Grid)(({ theme }: any) => ({
  ...theme.pageToolbar,
  padding: "9px 16px",
  justifyContent: "flex-end",
  borderBottom: theme.palette.borderColor,
}));

const StyledTypography = styled(Typography)({
  marginLeft: 8,
  color: "#2C3644",
  fontWeight: 600,
  fontSize: 14,
  lineHeight: "21px",
  marginBottom: 14,
});

const ReturnToXMLPage = ({
  convertReturnToXML,
}: {
  convertReturnToXML(data?: ReturnToXMLData): void;
}) => {
  const { t } = useTranslation();

  const [data, setData] = useState<ReturnToXMLData>();

  return (
    <StyledRoot>
      <StyledToolbar>
        <PrimaryBtn
          onClick={() => {
            convertReturnToXML(data);
          }}
          data-testid={"convert-button"}
        >
          {t("convert")}
        </PrimaryBtn>
      </StyledToolbar>
      <StyledGridContainer>
        <StyledTypography>{t("convertReturnToXML")}</StyledTypography>
        <ReturnToXMLBody data={data} setData={setData} />
      </StyledGridContainer>
    </StyledRoot>
  );
};

export default withLoading(ReturnToXMLPage);
