import React, { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getFormattedDateValue } from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import { ScheduleType } from "../../../types/schedule.type";
import GridTable from "../../common/Grid/GridTable";

interface ExistingScheduleModalProps {
  data: ScheduleType[];
}

interface GridDataType {
  code: string;
  fromDate: number;
  toDate: number;
  periodTypeCode: string;
  periodTypeName: string;
  returnDefinitionName: string;
  fiCode: string;
  fiName: string;
  returnDefinitionReturnTypeCode: string;
  delay: number;
  delayHour: number;
  delayMinute: number;
  comment: string | undefined;
}

const ExistingScheduleGrid: FC<ExistingScheduleModalProps> = ({ data }) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const [gridData, setGridData] = React.useState<GridDataType[]>([]);

  useEffect(() => {
    let tmp = data.map((item: ScheduleType) => {
      return {
        code: item.returnDefinition.code,
        fromDate: item.period.fromDate,
        toDate: item.period.toDate,
        periodTypeCode: item.period.periodType.code,
        periodTypeName: item.period.periodType.name,
        returnDefinitionName: item.returnDefinition.name,
        fiCode: item.fi.code,
        fiName: item.fi.name,
        returnDefinitionReturnTypeCode: item.returnDefinition.returnType.code,
        delay: item.delay,
        delayHour: item.delayHour,
        delayMinute: item.delayMinute,
        comment: item?.comment,
      };
    });
    setGridData(tmp);
  }, [data.length]);

  const columns = [
    {
      field: "code",
      headerName: t("code"),
    },
    {
      field: "fromDate",
      headerName: t("periodFrom"),
      renderCell: (obj: any) => {
        return getFormattedDateValue(obj, getDateFormat(true));
      },
    },
    {
      field: "toDate",
      headerName: t("periodTo"),
      renderCell: (obj: any) => {
        return getFormattedDateValue(obj, getDateFormat(true));
      },
    },
    {
      field: "periodTypeCode",
      headerName: t("periodTypeCode"),
    },
    {
      field: "periodTypeName",
      headerName: t("periodTypeName"),
    },
    {
      field: "returnDefinitionName",
      headerName: t("definitionName"),
    },
    {
      field: "fiCode",
      headerName: t("fiCode"),
    },
    {
      field: "fiName",
      headerName: t("fiName"),
    },
    {
      field: "returnDefinitionReturnTypeCode",
      headerName: t("returnType"),
    },
    {
      field: "delay",
      headerName: t("dueDate"),
    },
    {
      field: "delayHour",
      headerName: t("dueHour"),
    },
    {
      field: "delayMinute",
      headerName: t("dueMinute"),
    },
    {
      field: "comment",
      headerName: t("comment"),
    },
  ];
  return (
    <GridTable
      columns={columns}
      rows={gridData}
      setRows={() => {}}
      selectedRows={[]}
      rowOnClick={() => {}}
      checkboxEnabled={false}
      virtualized={true}
      actionButtons={() => {}}
      loading={false}
    />
  );
};
export default ExistingScheduleGrid;
