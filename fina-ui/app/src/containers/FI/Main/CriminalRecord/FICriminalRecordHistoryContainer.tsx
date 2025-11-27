import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import FICriminalRecordHistoryModal from "../../../../components/FI/Main/Detail/CriminalRecord/History/FICriminalRecordHistoryModal";
import { useTranslation } from "react-i18next";
import {
  loadCriminalRecordHistory,
  loadFiCriminalRecordHistory,
} from "../../../../api/services/fi/FiHistoryService";
import useConfig from "../../../../hoc/config/useConfig";
import { getFormattedDateValue } from "../../../../util/appUtil";
import RevisionTypeColumnField from "../../../../components/common/History/RevisionTypeColumnField";
import { FICriminalRecordHistoryDataType } from "../../../../types/fi.type";
import { GridColumnType } from "../../../../types/common.type";

interface FICriminalRecordHistoryContainerProps {
  state: any;
  onCloseHistoryClick: () => void;
  fiId?: number;
  criminalRecordId?: number;
}

const FICriminalRecordHistoryContainer: React.FC<
  FICriminalRecordHistoryContainerProps
> = ({ state, onCloseHistoryClick, fiId, criminalRecordId }) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const [data, setData] = useState<FICriminalRecordHistoryDataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    setLoading(true);
    let data: FICriminalRecordHistoryDataType[];
    if (fiId) {
      const response = await loadFiCriminalRecordHistory(fiId);
      data = response.data.list;
      data = data.map((r) => {
        if (r.revisionType === "DEL") {
          r.entity =
            data.find(
              (d) => d.entity.id === r.entity.id && d.revisionType !== "DEL"
            )?.entity ?? r.entity;
        }
        return r;
      });
    } else {
      const response = await loadCriminalRecordHistory(criminalRecordId);
      data = response.data.list;
    }
    try {
    } finally {
      setLoading(false);
    }

    setData(data);
  };

  let columns: GridColumnType[] = [
    {
      field: "modifiedAt",
      headerName: t("modifiedAt"),
      width: 130,
      renderCell: (value) => getFormattedDateValue(value, getDateFormat(false)),
    },
    {
      field: "revisionType",
      headerName: t("changeType"),
      width: 130,
      hideCopy: true,
      renderCell: (value) => {
        return (
          <div style={{ width: "100px" }}>
            <RevisionTypeColumnField value={value} />
          </div>
        );
      },
    },
    {
      headerName: t("courtDecision"),
      field: "entity.courtDecision",
      width: 130,
    },
    {
      headerName: t("courtDecisionNumber"),
      field: "entity.courtDecisionNumber",
      width: 130,
    },
    {
      headerName: t("fineAmount"),
      field: "entity.fineAmount",
      width: 150,
    },
    {
      headerName: t("fiBeneficiaryCurrency"),
      field: "entity.currency",
      width: 100,
    },
    {
      headerName: t("courtDecisionDate"),
      field: "entity.courtDecisionDate",
      width: 130,

      renderCell: (value) => getFormattedDateValue(value, getDateFormat(true)),
    },
    {
      headerName: t("punishmentStartDate"),
      field: "entity.punishmentStartDate",
      width: 130,
      renderCell: (value) => getFormattedDateValue(value, getDateFormat(true)),
    },
    {
      headerName: t("typeOfViolation"),
      field: "entity.type",
      width: 130,
    },
    {
      headerName: t("punishmentDate"),
      field: "entity.punishmentDate",
      width: 130,
      renderCell: (value) => getFormattedDateValue(value, getDateFormat(true)),
    },
  ];

  const [historyColumns, setHistoryColumns] = useState(columns);

  useEffect(() => {
    if (state && state.columns) {
      let stateCols = state.columns.map((s: any) => {
        return s.field;
      });
      let headerCols = historyColumns.map((s) => {
        return s.field;
      });
      if (
        state.columns.length !== 0 &&
        stateCols.every((element: any) => {
          return headerCols.includes(element);
        })
      ) {
        let newCols = [];
        for (let item of state.columns) {
          let headerCell = columns.find((el) => item.field === el.field);
          if (headerCell) {
            headerCell.hidden = item.hidden;
            headerCell.fixed = item.fixed;
            newCols.push(headerCell);
          }
        }
        setHistoryColumns(newCols);
      } else {
        setHistoryColumns(columns);
      }
    }
  }, [state]);

  return (
    <FICriminalRecordHistoryModal
      onCloseHistoryClick={onCloseHistoryClick}
      columns={historyColumns}
      data={data}
      loading={loading}
      setColumns={setHistoryColumns}
    />
  );
};

const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "FICriminalRecordHistory"]),
});

export default connect(mapStateToProps, {})(FICriminalRecordHistoryContainer);
