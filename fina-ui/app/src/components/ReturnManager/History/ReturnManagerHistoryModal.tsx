import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import ReturnXMLPage from "./ReturnXMLPage";
import ReturnStatus from "./ReturnStatus";
import { getReturnInfo } from "../../../api/services/returnsService";
import { useTranslation } from "react-i18next";
import { getFormattedDateValue } from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import { styled } from "@mui/material/styles";
import { Return } from "../../../types/return.type";

const StyledRoot = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

const StyledTitle = styled(Typography)({
  fontSize: 12,
  fontWeight: 600,
  lineHeight: "12px",
  paddingBottom: 4,
});

const StyledInfoValue = styled(Typography)({
  fontSize: 11,
  lineHeight: "16px",
});

const StyledInfoItemsWrapper = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 16px",
});

const StyledGridWrapper = styled(Grid)(({ theme }: { theme: any }) => ({
  height: "100%",
  flexWrap: "nowrap",
  boxSizing: "border-box",
  minHeight: 0,
  borderRight: theme.palette.borderColor,
}));

const StyledGridContentWrapper = styled(Box)({
  display: "flex",
  minHeight: 0,
  boxSizing: "border-box",
  paddingBottom: 8,
  height: "100%",
});

const ReturnManagerHistoryModal = ({
  selectedRows,
}: {
  selectedRows: Return[];
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  const [data, setData] = useState<Return>();

  const InfoItem = (title: string, value?: string | number | null) => {
    return (
      <Box>
        <StyledTitle>{t(title)}</StyledTitle>
        <StyledInfoValue>{value}</StyledInfoValue>
      </Box>
    );
  };

  useEffect(() => {
    initReturnInfo();
  }, []);

  const initReturnInfo = () => {
    getReturnInfo(selectedRows[0].id).then((res) => {
      setData(res.data);
    });
  };

  return (
    <StyledRoot>
      <Box
        sx={(theme) => ({
          borderBottom: theme.palette.borderColor,
        })}
      >
        <StyledInfoItemsWrapper>
          <Box>{InfoItem("returnName", data?.definitionCode)}</Box>
          <Box>{InfoItem("returnCode", data?.label)}</Box>
          <Box>{InfoItem("fiName", data?.fiDescription)}</Box>
          <Box>{InfoItem("fiCode", data?.fiCode)}</Box>
          <Box>
            {InfoItem(
              "from",
              (data?.fromDate || data?.toDate) &&
                `${getFormattedDateValue(
                  data?.fromDate,
                  getDateFormat(true)
                )} - ${getFormattedDateValue(
                  data?.fromDate,
                  getDateFormat(true)
                )}`
            )}
          </Box>
        </StyledInfoItemsWrapper>
      </Box>
      <StyledGridContentWrapper height={"100%"}>
        <StyledGridWrapper container item xs={12}>
          <Grid item xs={6}>
            <ReturnStatus selectedRows={selectedRows} />
          </Grid>
          <Grid item xs={6}>
            <ReturnXMLPage selectedRows={selectedRows} />
          </Grid>
        </StyledGridWrapper>
      </StyledGridContentWrapper>
    </StyledRoot>
  );
};

export default ReturnManagerHistoryModal;
