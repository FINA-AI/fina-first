import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import EmsEntityHistoryModal from "../../../components/EMS/EmsFiProfile/EmsEntityHistoryModal";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { GridColumnType } from "../../../types/common.type";
import { EmsInspectionStatusHistoryType } from "../../../types/inspection.type";
import CustomEmsHistoryStatusCell from "../../../components/EMS/EmsFiProfile/CustomEmsHistoryStatusCell";
import { getFormattedDateTimeValue } from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import { EmsSanctionStatusHistoryType } from "../../../types/sanction.type";
import { AxiosResponse } from "axios";

interface EmsInspectionStatusHistoryModalContainerProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  entityId: number;
  additionalColumns?: GridColumnType[];
  loadFunction: (
    page: number,
    limit: number,
    entityId: number
  ) => Promise<AxiosResponse>;
}

const EmsEntityHistoryContainer: React.FC<
  EmsInspectionStatusHistoryModalContainerProps
> = ({
  openModal,
  setOpenModal,
  entityId,
  additionalColumns = [],
  loadFunction,
}: EmsInspectionStatusHistoryModalContainerProps) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const { openErrorWindow } = useErrorWindow();
  const [columns, setColumns] = useState<GridColumnType[]>([]);
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<
    EmsInspectionStatusHistoryType[] | EmsSanctionStatusHistoryType[]
  >([]);
  const initialColumns: GridColumnType[] = [
    {
      field: "type",
      headerName: t("type"),
      minWidth: 200,
      renderCell: (value: string) => {
        return <CustomEmsHistoryStatusCell val={value} />;
      },
    },
    {
      field: "note",
      headerName: t("note"),
      minWidth: 200,
    },
    {
      field: "time",
      headerName: t("time"),
      minWidth: 200,
      renderCell: (value: number) => {
        return (
          <span>{getFormattedDateTimeValue(value, getDateFormat(true))}</span>
        );
      },
    },
    {
      field: "userId",
      headerName: t("user"),
      minWidth: 200,
    },
  ];

  useEffect(() => {
    if (additionalColumns && additionalColumns.length > 0) {
      initialColumns.splice(1, 0, ...additionalColumns);
    }
    setColumns(initialColumns);
  }, [t, additionalColumns]);

  useEffect(() => {
    init();
  }, [t]);

  const init = () => {
    if (entityId) {
      setLoading(true);
      loadFunction(pagingPage, pagingLimit, entityId)
        .then((resp) => {
          setRows(resp.data.list);
          setTotalResults(resp.data.totalResults);
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <EmsEntityHistoryModal
      columns={columns}
      pagingPage={pagingPage}
      setPagingPage={setPagingPage}
      pagingLimit={pagingLimit}
      setPagingLimit={setPagingLimit}
      totalResults={totalResults}
      loading={loading}
      rows={rows}
      openModal={openModal}
      setOpenModal={setOpenModal}
    />
  );
};

export default EmsEntityHistoryContainer;
