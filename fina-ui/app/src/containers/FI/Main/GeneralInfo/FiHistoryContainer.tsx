import FiMainHistoryPage from "../../../../components/FI/Main/Detail/GeneralInfo/History/FiMainHistoryPage";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { FilterTypes, getFormattedDateValue } from "../../../../util/appUtil";
import useConfig from "../../../../hoc/config/useConfig";
import RevisionTypeColumnField from "../../../../components/common/History/RevisionTypeColumnField";
import Tooltip from "../../../../components/common/Tooltip/Tooltip";
import {
  columnFilterConfigType,
  GridColumnType,
} from "../../../../types/common.type";

interface FiHistoryContainerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  state: any;
  fiHistory: any;
  fiHistoryLength: any;
  setFIHistory: (data: any) => void;
  setFIHistoryLength: (length: any) => void;
  fiId: number;
}

const FiHistoryContainer: React.FC<FiHistoryContainerProps> = ({
  open,
  setOpen,
  state,
  fiHistory,
  fiHistoryLength,
  setFIHistory,
  setFIHistoryLength,
  fiId,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  const columnFilterConfig: columnFilterConfigType[] = [
    {
      field: "name",
      type: FilterTypes.string,
      name: "name",
    },
    {
      field: "code",
      type: FilterTypes.string,
      name: "code",
    },
    {
      field: "identificationCode",

      type: FilterTypes.string,
      name: "identificationCode",
    },
    {
      field: "registrationDate",
      type: FilterTypes.date,
      name: "registrationDate",
    },
    {
      field: "closeDate",
      type: FilterTypes.date,
      name: "closeDate",
    },
  ];

  const [columns, setColumns] = useState<GridColumnType[]>([
    {
      field: "modifiedAt",
      headerName: t("modifiedAt"),
      width: 140,
      renderCell: (value) => getFormattedDateValue(value, getDateFormat(true)),
    },
    {
      field: "revisionType",
      headerName: t("changeType"),
      width: 140,
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
      field: "name",
      headerName: t("name"),
      width: 100,
    },
    {
      field: "code",
      headerName: t("code"),
      width: 100,
    },
    {
      field: "shortNameString",
      headerName: t("shortName"),
      width: 100,
    },
    {
      field: "identificationCode",
      headerName: t("identificationCode"),
      width: 160,
    },
    {
      field: "swiftCode",
      headerName: t("swiftCode"),
      width: 100,
    },
    {
      field: "reorganization",
      headerName: t("reorganization"),
      width: 150,
    },
    {
      field: "registrationDate",
      headerName: t("registrationDate"),
      width: 150,
      hideCopy: true,
      renderCell: (value) => getFormattedDateValue(value, getDateFormat(true)),
    },
    {
      field: "closeDate",
      headerName: t("closeDate"),
      width: 100,
      hideCopy: true,
      renderCell: (value) => getFormattedDateValue(value, getDateFormat(true)),
    },
    {
      field: "region",
      headerName: t("region"),
      width: 100,
      renderCell: (value) => value?.name,
    },
    {
      field: "phone",
      headerName: t("phone"),
      width: 100,
    },
    {
      field: "email",
      headerName: t("email"),
      width: 100,
    },
    {
      field: "representativePerson",
      headerName: t("representative"),
      width: 130,
    },
    {
      field: "webSite",
      headerName: t("webSite"),
      width: 100,
    },
    {
      field: "addressString",
      headerName: t("address"),
      width: 100,
    },
    {
      field: "fax",
      headerName: t("fax"),
      width: 100,
    },
    {
      field: "numberOfEmploys",
      headerName: t("numberOfEmployes"),
      width: 150,
    },
    {
      field: "numberOfMobileOffices",
      headerName: t("numberOfMobileOffices"),
      width: 170,
    },
    {
      field: "legalForm",
      headerName: t("legalForm"),
      width: 100,
      renderCell: (value, row) => {
        const description =
          row?.additionalInfo?.businessEntity?.description || "";
        return (
          <Tooltip title={description}>
            <span>{description}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "legalStatusOfAnEconomicEntity",
      headerName: t("legalEntityStatus"),
      width: 250,
      renderCell: (value, row) =>
        row.additionalInfo?.economicEntity?.description || "",
    },
    {
      field: "formOfEquity",
      headerName: t("equityForm"),
      width: 150,
      renderCell: (value, row) => {
        const description = row.additionalInfo?.equityForm?.description || "";
        return (
          <Tooltip title={description}>
            <span>{description}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "formOfManagement",
      headerName: t("managementForm"),
      width: 170,
      renderCell: (value, row) => {
        const description = row.additionalInfo?.managementForm?.code || "";
        return (
          <Tooltip title={description}>
            <span>{description}</span>
          </Tooltip>
        );
      },
    },
  ]);

  useEffect(() => {
    if (state && state.columns) {
      let stateCols = state.columns.map((s: any) => {
        return s.field;
      });
      let headerCols = columns.map((s) => {
        return s.field;
      });
      if (
        !state &&
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
        setColumns(newCols);
      }
    }
  }, [state]);

  return (
    <FiMainHistoryPage
      open={open}
      setOpen={setOpen}
      columns={columns}
      columnFilterConfig={columnFilterConfig}
      setColumns={setColumns}
      fiHistory={fiHistory}
      setFIHistory={setFIHistory}
      fiHistoryLength={fiHistoryLength}
      setFIHistoryLength={setFIHistoryLength}
      fiId={fiId}
    />
  );
};

const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "fiGeneralInfoHistoryTableCustomization"]),
});

export default connect(mapStateToProps, {})(FiHistoryContainer);
