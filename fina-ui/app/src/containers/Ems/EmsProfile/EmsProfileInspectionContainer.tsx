import React, { useEffect, useState } from "react";
import EmsProfileInspectionGrid from "../../../components/EMS/EmsFiProfile/EmsProfileInspectionGrid";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { GridColumnType } from "../../../types/common.type";
import { getFormattedDateValue, getLanguage } from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import {
  EmsInspectionType,
  InspectionColumnData,
} from "../../../types/inspection.type";
import CustomEmsHistoryStatusCell from "../../../components/EMS/EmsFiProfile/CustomEmsHistoryStatusCell";
import {
  EmsFiProfileInspectionType,
  InspectorDataType,
} from "../../../types/emsFiProfile.type";
import {
  deleteProfileInspection,
  loadInspectors,
  loadProfileInspectionStatusType,
  postProfileInspection,
  postProfileInspectionDocument,
  putProfileInspection,
} from "../../../api/services/ems/EmsProfileInspectionService";
import { FiType } from "../../../types/fi.type";
import { CheckListIcon } from "../../../api/ui/icons/CheckListIcon";
import InfoModal from "../../../components/common/Modal/InfoModal";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";

interface EmsProfileInspectionContainerProps {
  resizerRef: React.RefObject<HTMLDivElement>;
  inspectionRef: React.RefObject<HTMLDivElement>;
  sqlQuery: { query: string };
  selectedInspectionRow: any;
  setSelectedInspectionRow: React.Dispatch<React.SetStateAction<any>>;
  fis: FiType[];
  state: any;
  inspectionTypes: EmsInspectionType[];
  rows: EmsFiProfileInspectionType[];
  setRows: React.Dispatch<React.SetStateAction<EmsFiProfileInspectionType[]>>;
  rowsLen: number;
  setRowsLen: React.Dispatch<React.SetStateAction<number>>;
  pagingPage: number;
  setPagingPage: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  infoModal: boolean;
  setInfoModal: React.Dispatch<React.SetStateAction<boolean>>;
  getInspections: (inspections?: any[]) => void;
  pagingLimit: number;
  setPagingLimit: React.Dispatch<React.SetStateAction<number>>;
  inspectionColumns: InspectionColumnData[] | null;
  onInspectionExport: () => void;
}

const EmsProfileInspectionContainer: React.FC<
  EmsProfileInspectionContainerProps
> = ({
  resizerRef,
  inspectionRef,
  selectedInspectionRow,
  setSelectedInspectionRow,
  fis,
  state,
  inspectionTypes,
  rows,
  setRows,
  rowsLen,
  pagingPage,
  setPagingPage,
  loading,
  setLoading,
  infoModal,
  setInfoModal,
  getInspections,
  pagingLimit,
  setPagingLimit,
  inspectionColumns,
  onInspectionExport,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();

  const [statusTypes, setStatusTypes] = useState<string[]>([]);
  const [inspectors, setInspectors] = useState<InspectorDataType[]>([]);

  useEffect(() => {
    getProfileInspectionStatusType();
    getInspectors();
  }, []);

  useEffect(() => {
    if (state !== undefined && state.columns.length !== 0) {
      let newCols = [];
      for (let item of state.columns) {
        let newColumns: GridColumnType[] = generateColumns();
        let headerCell = newColumns.find((el) => item.field == el.field);
        if (headerCell) {
          headerCell.hidden = item.hidden;
          headerCell.fixed = item.fixed;
          newCols.push(headerCell);
        }
      }
      setColumns(newCols);
    } else if (inspectionColumns) {
      setColumns(generateColumns());
    }
  }, [state, inspectionColumns]);

  const init = (): void => {
    setLoading(true);
    getInspections();
  };

  const getInspectors = () => {
    loadInspectors()
      .then((res) => {
        const data = [...res.data.list];
        setInspectors(data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const calculateDaysDifference = (
    millis1: number,
    millis2: number
  ): number => {
    const timeDifference = Math.abs(millis2 - millis1);
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };

  const generateColumns = () => {
    let initColumns = [
      {
        field: "fiName",
        headerName: t("fiName"),
        width: 150,
      },
      {
        field: "fiCode",
        headerName: t("fiCode"),
        width: 150,
      },
      {
        field: "reclamationLetterNumber",
        headerName: t("reclamationletternumber"),
        width: 150,
      },
      {
        field: "reclamationLetterDate",
        headerName: t("reclamationletterdate"),
        width: 150,
        hideCopy: true,
        format: getDateFormat(true),
        renderCell: (value: any, row: any) => {
          if (row.reclamationLetterDate) {
            return (
              <span>
                {getFormattedDateValue(
                  row.reclamationLetterDate,
                  getDateFormat(true)
                )}
              </span>
            );
          }
        },
      },
      {
        field: "inspectionPeriodStart",
        headerName: t("inspectionperiodstart"),
        width: 150,
        hideCopy: true,
        format: getDateFormat(true),
        renderCell: (value: any, row: any) => {
          if (row.inspectionPeriodStart) {
            return (
              <span>
                {getFormattedDateValue(
                  row.inspectionPeriodStart,
                  getDateFormat(true)
                )}
              </span>
            );
          }
        },
      },
      {
        field: "inspectionPeriodEnd",
        headerName: t("inspectionperiodend"),
        width: 150,
        hideCopy: true,
        format: getDateFormat(true),
        renderCell: (value: any, row: any) => {
          if (row.inspectionPeriodEnd) {
            return (
              <span>
                {getFormattedDateValue(
                  row.inspectionPeriodEnd,
                  getDateFormat(true)
                )}
              </span>
            );
          }
        },
      },
      {
        field: "inspectedPeriodStart",
        headerName: t("inspectedperiodstart"),
        width: 150,
        hideCopy: true,
        format: getDateFormat(true),
        renderCell: (value: any, row: any) => {
          if (row.inspectedPeriodStart) {
            return (
              <span>
                {getFormattedDateValue(
                  row.inspectedPeriodStart,
                  getDateFormat(true)
                )}
              </span>
            );
          }
        },
      },
      {
        field: "inspectedPeriodEnd",
        headerName: t("inspectedperiodend"),
        width: 150,
        hideCopy: true,
        format: getDateFormat(true),
        renderCell: (value: any, row: any) => {
          if (row.inspectedPeriodEnd) {
            return (
              <span>
                {getFormattedDateValue(
                  row.inspectedPeriodEnd,
                  getDateFormat(true)
                )}
              </span>
            );
          }
        },
      },
      {
        field: "decreeNumber",
        headerName: t("decreenumber"),
        width: 150,
      },
      {
        field: "decreeDate",
        headerName: t("decreedate"),
        width: 150,
        hideCopy: true,
        format: getDateFormat(true),
        renderCell: (value: any, row: any) => {
          if (row.decreeDate) {
            return (
              <span>
                {getFormattedDateValue(row.decreeDate, getDateFormat(true))}
              </span>
            );
          }
        },
      },
      {
        field: "types",
        headerName: t("types"),
        width: 150,
        renderCell: (value: any, row: any) => {
          let types: string[] = [];
          let currLanguageCode = getLanguage();
          if (row.types?.length > 0)
            row.types.forEach((item: { names: { [key: string]: string } }) => {
              if (item.names[currLanguageCode])
                types.push(item.names[currLanguageCode]);
            });
          return types.join(", ");
        },
      },
      {
        field: "recommendationMailSent",
        headerName: t("recommendationmailsent"),
        width: 150,
        renderCell: (value: any, row: any) => {
          return row.recommendationMailSent ? <div></div> : <div></div>;
        },
      },
      {
        field: "onGoing",
        headerName: t("ongoing"),
        width: 150,
        renderCell: (value: any, row: any) => {
          let date = new Date();
          let start = row.inspectionPeriodStart;
          let end = row.inspectionPeriodEnd
            ? row.inspectionPeriodEnd
            : date.getTime();
          return start
            ? !row.inspectionPeriodEnd
              ? ` ${calculateDaysDifference(start, end) - 1} ${t("days")}`
              : `0 ${t("day")}`
            : "";
        },
      },
      {
        field: "totalPrice",
        headerName: t("totalsize"),
        width: 150,
        renderCell: (value: any, row: any) => {
          return row.totalPrice;
        },
      },
      {
        field: "status",
        headerName: t("status"),
        width: 150,
        renderCell: (value: any, row: any) => {
          return <CustomEmsHistoryStatusCell val={row.status?.type ?? ""} />;
        },
      },
    ];

    if (inspectionColumns) {
      let currLanguageCode = getLanguage();
      inspectionColumns.forEach((col, index) => {
        let item: any = {
          field: `column${index + 1}`,
          headerName: col.names[currLanguageCode],
          width: 150,
          hideCopy: false,
          renderCell: (value: string, row: any) => {
            const cellValue = row[`column${col.columnId}`];
            if (col.type !== "DATETIME") {
              return cellValue;
            } else {
              return (
                <span>
                  {getFormattedDateValue(cellValue, getDateFormat(true))}
                </span>
              );
            }
          },
        };
        if (item) {
          initColumns.push(item);
        }
      });
    }

    return initColumns;
  };

  const [columns, setColumns] = useState<GridColumnType[]>(generateColumns());

  const getProfileInspectionStatusType = async () => {
    try {
      const res = await loadProfileInspectionStatusType();
      const resData = [...res.data.list];
      setStatusTypes(resData);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  const saveProfileInspection = async (
    data: EmsFiProfileInspectionType,
    payLoad: FormData | null
  ) => {
    try {
      const submitData: any = {
        ...data,
        fiCode: data.fi ? data.fi.code : data.fiCode,
        fiId: data.fi ? data.fi.id : data.fiId,
        status: {
          ...data.status,
          time: new Date().getTime().toString(),
          inspectionId: selectedInspectionRow ? data.id : 0,
        },
        types: data.types,
      };

      if (submitData.id) {
        await putProfileInspection(submitData.id, submitData);
        if (payLoad && payLoad?.keys()?.next()) {
          await postProfileInspectionDocument(
            submitData.fiCode,
            submitData.id,
            payLoad
          );
        }
        enqueueSnackbar(t("edited"), { variant: "success" });
        setSelectedInspectionRow(null);
        init();
      } else {
        const res = await postProfileInspection(submitData);
        const inspectionId = res.data.list[0].id;
        if (payLoad && Array.from(payLoad.entries()).length > 0) {
          await postProfileInspectionDocument(
            submitData.fiCode,
            inspectionId,
            payLoad
          );
        }

        setSelectedInspectionRow(null);
        init();
        enqueueSnackbar(t("saved"), { variant: "success" });
      }
    } catch (err: any) {
      openErrorWindow(err, t("error"), true);
    }
  };

  const deleteInspectionHandler = (id: number) => {
    deleteProfileInspection(id)
      .then(() => {
        const remainingInsp = rows.filter((item) => item.id !== id);
        setRows(remainingInsp);
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((err: any) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onRefresh = () => {
    setSelectedInspectionRow(null);
    init();
  };

  const onGoingCellOrderValue = (row: EmsFiProfileInspectionType) => {
    let date = new Date();
    let start = row.inspectionPeriodStart;
    let end = row.inspectionPeriodEnd
      ? row.inspectionPeriodEnd
      : date.getTime();
    return start
      ? !row.inspectionPeriodEnd
        ? calculateDaysDifference(start, end) - 1
        : 0
      : "";
  };

  const typesCellOrderValue = (row: EmsFiProfileInspectionType) => {
    let types: string[] = [];
    let currLanguageCode = getLanguage();
    if (row.types?.length > 0)
      row.types.forEach((item: { names: { [key: string]: string } }) => {
        if (item.names[currLanguageCode])
          types.push(item.names[currLanguageCode]);
      });
    return types.join(", ");
  };

  const orderRowByHeader = (cellName: string, arrowDirection: string) => {
    let sortDirection = arrowDirection === "up" ? 1 : -1;
    setRows((prevState) =>
      [...prevState].sort((a, b) => {
        let valueA, valueB;

        switch (cellName) {
          case "status": {
            valueA = a?.status?.type;
            valueB = b?.status?.type;
            break;
          }
          case "onGoing": {
            valueA = onGoingCellOrderValue(a);
            valueB = onGoingCellOrderValue(b);

            const isEmpty = (val: number | string) => val === "";

            if (isEmpty(valueA) && isEmpty(valueB)) return 0;
            if (isEmpty(valueA)) return sortDirection === 1 ? -1 : 1;
            if (isEmpty(valueB)) return sortDirection === 1 ? 1 : -1;
            break;
          }
          case "types": {
            valueA = typesCellOrderValue(a);
            valueB = typesCellOrderValue(b);
            break;
          }
          case "reclamationLetterNumber":
          case "decreeNumber": {
            valueA = Number(a[cellName as keyof EmsFiProfileInspectionType]);
            valueB = Number(b[cellName as keyof EmsFiProfileInspectionType]);
            break;
          }
          default: {
            valueA = a[cellName as keyof EmsFiProfileInspectionType];
            valueB = b[cellName as keyof EmsFiProfileInspectionType];
          }
        }

        return (valueA > valueB ? 1 : valueA < valueB ? -1 : 0) * sortDirection;
      })
    );
  };

  return (
    <>
      <EmsProfileInspectionGrid
        loading={loading}
        rowsLen={rowsLen}
        setPagingPage={setPagingPage}
        setPagingLimit={setPagingLimit}
        pagingLimit={pagingLimit}
        pagingPage={pagingPage}
        rows={rows}
        setRows={setRows}
        columns={columns}
        resizerRef={resizerRef}
        inspectionRef={inspectionRef}
        selectedInspectionRow={selectedInspectionRow}
        setSelectedInspectionRow={setSelectedInspectionRow}
        fis={fis}
        statusTypes={statusTypes}
        onRefresh={onRefresh}
        saveProfileInspection={saveProfileInspection}
        deleteInspectionHandler={deleteInspectionHandler}
        inspectionColumns={inspectionColumns}
        inspectionTypes={inspectionTypes}
        inspectors={inspectors}
        setColumns={setColumns}
        onInspectionExport={onInspectionExport}
        orderRowByHeader={orderRowByHeader}
      />
      <InfoModal
        bodyText={t("nodatafound")}
        icon={<CheckListIcon />}
        onOkButtonClick={() => {
          setInfoModal(false);
        }}
        isOpen={infoModal}
        setIsOpen={setInfoModal}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "emsProfileInspectionsTableCustomization"]),
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmsProfileInspectionContainer);
