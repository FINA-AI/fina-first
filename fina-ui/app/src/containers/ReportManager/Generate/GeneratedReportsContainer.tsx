import useConfig from "../../../hoc/config/useConfig";
import { BASE_REST_URL, getFormattedDateValue } from "../../../util/appUtil";
import GridTable from "../../../components/common/Grid/GridTable";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "@mui/material/Link";
import { GeneratedReports } from "../../../components/ReportManager/Generate/ReportGenerationWizardContainer";
import { StoredRootReport } from "../../../types/report.type";

interface GeneratedReportsContainerProps {
  data: GeneratedReports;
  fileType: string;
}

const GeneratedReportsContainer: React.FC<GeneratedReportsContainerProps> = ({
  data,
  fileType,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  const [columns] = useState([
    {
      field: "reportCode",
      headerName: t("code"),
      hideCopy: true,
      minWidth: 100,
      renderCell: (value: string, row: StoredRootReport) => {
        return (
          <Link
            underline="hover"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(
                BASE_REST_URL +
                  `/report/generate?reportIds=${row.reportPkModel.reportId}&regenerate=false&replaceAll=true&fileType=${fileType}&reportGenerationKey=${data.key}`,
                "_blank"
              );
            }}
          >
            {value}
          </Link>
        );
      },
    },
    {
      field: "reportName",
      headerName: t("name"),
      minWidth: 150,
    },
    {
      field: "userLogin",
      headerName: t("generatedBy"),
      hideCopy: true,
      minWidth: 50,
    },
    {
      field: "storeDate",
      headerName: t("generateDate"),
      hideCopy: true,
      renderCell: (value) => {
        return <span>{getFormattedDateValue(value, getDateFormat(true))}</span>;
      },
      minWidth: 50,
    },
  ]);

  return (
    <GridTable size={"small"} columns={columns} rows={data.storedReports} />
  );
};

export default GeneratedReportsContainer;
