import { Box } from "@mui/system";
import { IconButton, Paper, Slide, Typography } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { BASE_REST_URL, getFormattedDateValue } from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import {
  getReportInfo,
  getReportStatistic,
  updateParameterData,
} from "../../../api/services/reportService";
import { useHistory } from "react-router-dom";
import ReportMDetailsHeader from "./ReportMDetailsHeader";
import ReportDetailsTable from "../ReportDetailsTable";
import { styled } from "@mui/material/styles";
import {
  Report,
  ReportStatistic,
  StoredReportGridData,
} from "../../../types/report.type";
import { Iterator, Parameter } from "../../../types/reportGeneration.type";

interface ReportManagerDetailsProps {
  data: Report;
  isDetailPageOpen: boolean;
  setIsDetailPageOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isReportManager: boolean;
}

const StyledRoot = styled(Paper)(({ theme }: { theme: any }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: `700px !important`,
  position: "absolute",
  top: 0,
  right: 0,
  zIndex: theme.zIndex.modal,
  borderBottom: theme.palette.borderColor,
  borderTop: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
  borderLeft: theme.palette.borderColor,
  "&.MuiPaper-root": {
    transition: "width 0.5s ease-in-out !important",
  },
}));

const StyledDotDivider = styled("span")(({ theme }: { theme: any }) => ({
  height: 4,
  width: 4,
  borderRadius: 50,
  backgroundColor: theme.palette.paperBackground,
  margin: "0 10px",
}));

const StyledDownloadIconButton = styled(IconButton)({
  color: "#AEB8CB",
  marginLeft: 16,
  padding: "5px !important",
});

const StyledReportInfoTypo = styled(Typography)(
  ({ theme }: { theme: any }) => ({
    fontSize: 12,
    fontWeight: 550,
    color: theme.palette.secondaryText,
  })
);

const StyledFlexBox = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const StyledDetailsBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: "0px",
});

const StyledLinkText = styled(Typography)(({ theme }) => ({
  textDecoration: "underline",
  fontSize: 12,
  color: theme.palette.primary.main,
  cursor: "pointer",
}));

const StyledReportStatisticContent = styled(Typography)(
  ({ theme }: { theme: any }) => ({
    fontSize: "12px",
    color: theme.palette.textColor,
  })
);

const StyledReportStatisticBox = styled(Box)(({ theme }: { theme: any }) => ({
  backgroundColor: theme.palette.paperBackground,
  borderBottom: theme.palette.borderColor,
}));

const ReportManagerDetails: React.FC<ReportManagerDetailsProps> = ({
  data,
  isDetailPageOpen,
  setIsDetailPageOpen,
  isReportManager = false,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  const history = useHistory();
  const [gridData, setGridData] = useState<StoredReportGridData[]>([]);
  const [statistic, setStatistic] = useState<ReportStatistic[]>([]);
  const containerRef = React.useRef(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      generateGridData();
    }
  }, [data]);

  const generateGridData = () => {
    getReportStatistic(data.id).then((res) => {
      setStatistic(res.data);
    });

    setLoading(true);
    getReportInfo(data.id)
      .then((res) => {
        if (res.data) {
          let demArray = res.data.iterators
            .sort((a: Parameter, b: Parameter) =>
              a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
            )
            .map((item: StoredReportGridData) => {
              return { ...item, dimensionType: "iterator" };
            });
          let paramsArray = res.data.parameters
            .sort((a: Iterator, b: Iterator) =>
              a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
            )
            .map((item: StoredReportGridData) => {
              return { ...item, dimensionType: "parameter" };
            });
          setGridData([...paramsArray, ...demArray]);
        }
      })
      .finally(() => setLoading(false));
  };

  const updateParameter = async (
    parameterBody: Parameter,
    paramName: string,
    reportId: number,
    isIterator: boolean
  ) => {
    const response = await updateParameterData(
      reportId,
      encodeURIComponent(paramName),
      parameterBody,
      isIterator
    );

    if (response.status === 200) {
      generateGridData();
      return true;
    }

    return false;
  };
  const getDate = (item: ReportStatistic) => {
    const date = new Date(item.generateDate);

    return (
      <StyledReportStatisticContent pl={"5px"}>
        {` ${getFormattedDateValue(item.generateDate, getDateFormat(true))} | ${
          date.getHours() + ":" + date.getMinutes()
        }`}
      </StyledReportStatisticContent>
    );
  };

  const downloadFile = (report: ReportStatistic) => {
    window.open(
      BASE_REST_URL +
        `/report/stored/review/${report.id}/XLSX/${report.hashcode}/${report.langId}?reportName=${data.description}`,
      "_blank"
    );
  };

  return (
    <Slide
      direction="left"
      in={isDetailPageOpen}
      container={containerRef.current}
      timeout={600}
    >
      <StyledRoot sx={{ width: isMinimized ? `40px !important` : "" }}>
        <StyledDetailsBox>
          <ReportMDetailsHeader
            code={data?.code}
            isMinimized={isMinimized}
            setIsMinimized={setIsMinimized}
            setIsDetailPageOpen={setIsDetailPageOpen}
          />
          {isReportManager && !isMinimized && (
            <StyledReportStatisticBox p={"10px"}>
              <StyledReportStatisticContent>
                {t("generateReportByLanguage")}
              </StyledReportStatisticContent>
              {statistic?.map((item, index) => {
                return (
                  <StyledFlexBox key={index} justifyContent={"space-between"}>
                    <StyledFlexBox>
                      <StyledFlexBox>
                        <StyledReportInfoTypo>
                          {t("userName")}:
                        </StyledReportInfoTypo>
                        <StyledReportStatisticContent pl={"5px"}>
                          {item.userName}
                        </StyledReportStatisticContent>
                      </StyledFlexBox>
                      <StyledDotDivider />
                      <StyledFlexBox>
                        <StyledReportInfoTypo>
                          {t("generateCount")}:
                        </StyledReportInfoTypo>
                        <StyledReportStatisticContent pl={"5px"}>
                          {item.count}
                        </StyledReportStatisticContent>
                      </StyledFlexBox>
                      <StyledDotDivider />
                      <StyledFlexBox>
                        <StyledReportInfoTypo>
                          {t("date")}:
                        </StyledReportInfoTypo>
                        {getDate(item)}
                      </StyledFlexBox>
                      <StyledFlexBox>
                        <StyledDownloadIconButton
                          onClick={() => downloadFile(item)}
                        >
                          <DownloadRoundedIcon
                            fontSize={"small"}
                            style={{ fontSize: 16 }}
                          />
                        </StyledDownloadIconButton>
                      </StyledFlexBox>
                    </StyledFlexBox>
                  </StyledFlexBox>
                );
              })}
              <StyledFlexBox justifyContent={"flex-end"}>
                <StyledLinkText
                  onClick={() => history.push(`/reports/storedreportmanager`)}
                  data-testid={"all-reports-link"}
                >
                  {t("allReports")}
                </StyledLinkText>
              </StyledFlexBox>
            </StyledReportStatisticBox>
          )}

          {!isMinimized && (
            <StyledDetailsBox>
              <ReportDetailsTable
                editable={true}
                gridData={gridData}
                setGridData={setGridData}
                reportId={data.id}
                updateParameter={updateParameter}
                loading={loading}
              />
            </StyledDetailsBox>
          )}
        </StyledDetailsBox>
      </StyledRoot>
    </Slide>
  );
};

export default memo(ReportManagerDetails);
