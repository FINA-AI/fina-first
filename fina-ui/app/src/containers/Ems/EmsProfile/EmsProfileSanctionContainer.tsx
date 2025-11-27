import EmsProfileSanctionPage from "../../../components/EMS/EmsFiProfile/EmsProfileSanction/EmsProfileSanctionPage";
import { useTranslation } from "react-i18next";
import FolderIcon from "@mui/icons-material/Folder";
import { IconButton } from "@mui/material";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  deleteSanction,
  loadFineStatus,
  loadProfileSanctions,
  loadSanctionStatusTypes,
  postSanction,
  updateSanction,
  uploadSanctionDocument,
} from "../../../api/services/ems/emsProfileSanctionService";
import { useSelector } from "react-redux";
import { GridColumnType } from "../../../types/common.type";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { getFormattedDateValue, getLanguage } from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import { EmsFiProfileSanctionType } from "../../../types/emsFiProfile.type";
import {
  SanctionDataType,
  SanctionFineSubstatusModel,
} from "../../../types/sanction.type";
import CustomEmsHistoryStatusCell from "../../../components/EMS/EmsFiProfile/CustomEmsHistoryStatusCell";

interface EmsProfileSanctionContainerProps {
  fiCode: string;
  inspectionId: number | null;
  selectedSanction?: EmsFiProfileSanctionType;
  setSelectedSanction: React.Dispatch<
    React.SetStateAction<EmsFiProfileSanctionType | undefined>
  >;
  sanctionTypes: SanctionDataType[];
}

export interface EmsProfileSanctionContainerHandlers {
  updateSanctionTotalPrice(sanctionId: number, totalPrice: number): void;
}

const EmsProfileSanctionContainer = forwardRef<
  EmsProfileSanctionContainerHandlers,
  EmsProfileSanctionContainerProps
>(
  (
    {
      fiCode,
      inspectionId,
      selectedSanction,
      setSelectedSanction,
      sanctionTypes,
    },
    ref
  ) => {
    const config = useSelector((state: any) => state.get("config").config);
    const state = useSelector((state: any) =>
      state.getIn([
        "state",
        "emsProfileSanctionsAndRecommendationsTableCustomization",
      ])
    );
    const { t } = useTranslation();
    const { openErrorWindow } = useErrorWindow();
    const { getDateFormat } = useConfig();
    const languageKey: string = config.language || "en_US";

    const [pagingPage, setPagingPage] = useState(1);
    const [pagingLimit, setPagingLimit] = useState(25);
    const [rowsLen, setRowsLen] = useState(0);
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<any[]>([]);
    const [sanctionTypeStatuses, setSanctionTypeStatuses] = useState([]);
    const [fineStatusses, setFineStatusses] = useState([]);

    const historyColumns: GridColumnType[] = [
      {
        field: "fineStatus",
        headerName: t("status"),
        minWidth: 200,
        renderCell: (value: string) => {
          return <CustomEmsHistoryStatusCell val={value} />;
        },
      },
      {
        field: "fineSubstatus",
        headerName: t("substatus"),
        minWidth: 200,
        renderCell: (fineSubStatus: SanctionFineSubstatusModel) => {
          if (fineSubStatus?.descriptions[getLanguage()]) {
            return (
              <CustomEmsHistoryStatusCell
                val={fineSubStatus.descriptions[getLanguage()]}
              />
            );
          } else {
            if (
              fineSubStatus &&
              Object.keys(fineSubStatus?.descriptions).length > 0
            ) {
              return (
                <CustomEmsHistoryStatusCell
                  val={Object.values(fineSubStatus.descriptions)[0]}
                />
              );
            }
          }
        },
      },
    ];
    useEffect(() => {
      getProfileSanctions();
    }, [inspectionId, pagingLimit, pagingPage]);

    useEffect(() => {
      getProfileStatus();
      getFineStatus();
    }, []);

    useEffect(() => {
      if (state !== undefined && state.columns.length !== 0) {
        let newCols = [];
        for (let item of state.columns) {
          let headerCell = columns.find((el) => item.field == el.field);
          if (headerCell) {
            headerCell.hidden = item.hidden;
            headerCell.fixed = item.fixed;
            newCols.push(headerCell);
          }
        }
        setColumns(newCols);
      }
    }, [state]);

    const columnHeader = [
      {
        field: "names",
        headerName: t("name"),
        hideCopy: true,
        hideSort: true,
        width: 100,
        renderCell: () => {
          return (
            <IconButton style={{ color: "#b0b0b0", padding: 2 }}>
              <FolderIcon fontSize={"small"} />
            </IconButton>
          );
        },
      },
      {
        field: "deliveryDate",
        headerName: t("deliverydate"),
        hideCopy: true,
        width: 150,
        renderCell: (value: number) =>
          getFormattedDateValue(value, getDateFormat(true)),
      },
      {
        field: "paymentDate",
        headerName: t("paymentdate"),
        hideCopy: true,
        width: 150,
        renderCell: (value: number) =>
          getFormattedDateValue(value, getDateFormat(true)),
      },
      {
        field: "dueDate",
        headerName: t("dueDate"),
        hideCopy: true,
        width: 150,
      },
      {
        field: "type",
        headerName: t("type"),
        hideCopy: true,
        width: 150,
        renderCell: (type: any) => {
          return <span>{type.names?.[languageKey]}</span>;
        },
      },
      {
        field: "status",
        headerName: t("status"),
        hideCopy: true,
        width: 150,
        renderCell: (status: any, row: any) => {
          return (
            <span>
              {row?.type?.type === "FINE" ||
              row?.type?.type === "ADMINISTRATOR_FINE"
                ? status.fineStatus
                : status.type}
            </span>
          );
        },
      },
      {
        field: "responsiblePerson",
        headerName: t("responsiblePerson"),
        hideCopy: true,
        width: 150,
      },
      {
        field: "totalPrice",
        headerName: t("totalsize"),
        hideCopy: true,
        width: 150,
      },
    ];

    const [columns, setColumns] = useState<GridColumnType[]>(columnHeader);

    const getProfileSanctions = () => {
      if (!inspectionId) {
        setRows([]);
        return;
      }

      setLoading(true);
      loadProfileSanctions(pagingPage, 0, pagingLimit, inspectionId)
        .then((res) => {
          const resData = res.data;
          setRowsLen(resData.totalResults);
          setRows(resData.list);
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        })
        .finally(() => setLoading(false));
    };

    const getProfileStatus = () => {
      loadSanctionStatusTypes(pagingPage, 0, pagingLimit)
        .then((res) => {
          const resData = res.data.list;
          setSanctionTypeStatuses(resData);
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    };

    const getFineStatus = () => {
      loadFineStatus(pagingPage, 0, pagingLimit)
        .then((res) => {
          const resData = res.data.list;
          setFineStatusses(resData);
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    };

    const submitSanction = (data: any, payload: FormData | null) => {
      const typeObject = sanctionTypes.find(
        (item: any) => item.id === data.type.id
      );

      const submitData = {
        ...data,
        status: { ...data.status, time: new Date().getTime().toString() },
        type: typeObject && {
          ...typeObject,
          names: { [languageKey]: typeObject.name },
        },
        id: selectedSanction ? data.id : 0,
        inspectionId,
      };

      if (selectedSanction) {
        updateSanction(inspectionId, submitData)
          .then((res) => {
            const resData = res.data.list[0];
            let tmp = {
              ...resData,
              status: {
                ...resData.status,
                fineSubstatus: resData.status.fineSubstatus,
              },
            };
            setSelectedSanction(tmp);
            if (payload && payload?.keys()?.next())
              submitFormData(payload, fiCode, resData.id);
            getProfileSanctions();
          })
          .catch((err) => {
            openErrorWindow(err, t("error"), true);
          });
      } else {
        postSanction(inspectionId, submitData)
          .then((res) => {
            const sanctionId = res.data.list[0].id;
            if (payload) submitFormData(payload, fiCode, sanctionId);
            getProfileSanctions();
          })
          .catch((err) => {
            openErrorWindow(err, t("error"), true);
          });
      }
    };

    const deleteProfileSanction = (id: number) => {
      deleteSanction(1, id)
        .then(() => {
          const deletedRow = rows.filter((item) => item.id !== id);
          setRows(deletedRow);
          setSelectedSanction(undefined);
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    };

    const submitFormData = (
      payload: FormData | null,
      fiCode: string,
      sanctionId: number
    ) => {
      uploadSanctionDocument(payload, fiCode, sanctionId)
        .then(() => {})
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    };

    const onRefresh = () => {
      getProfileSanctions();
      setSelectedSanction(undefined);
    };

    const onPagingLimitChange = (limit: number) => {
      setPagingPage(1);
      setPagingLimit(limit);
    };

    const orderRowByHeader = (cellName: string, arrowDirection: string) => {
      const sortDirection = arrowDirection === "up" ? 1 : -1;

      setRows((prevRow) =>
        [...prevRow].sort((a, b) => {
          let valueA, valueB;
          if (cellName === "type") {
            valueA = a.type?.names[languageKey];
            valueB = b.type?.names[languageKey];
          } else if (cellName === "status") {
            valueA = a.status?.fineStatus;
            valueB = b.status?.fineStatus;
          } else {
            valueA = a[cellName];
            valueB = b[cellName];
          }

          return (
            (valueA > valueB ? 1 : valueA < valueB ? -1 : 0) * sortDirection
          );
        })
      );
    };

    useImperativeHandle(ref, () => ({
      updateSanctionTotalPrice,
    }));

    const updateSanctionTotalPrice = (
      sanctionId: number,
      totalPrice: number
    ) => {
      setRows((prevRows) => [
        ...prevRows.map((sanction) =>
          sanction.id === sanctionId
            ? { ...sanction, totalPrice: totalPrice }
            : sanction
        ),
      ]);
    };

    return (
      <EmsProfileSanctionPage
        columns={columns}
        setCurrSanction={setSelectedSanction}
        rows={rows}
        setRows={setRows}
        loading={loading}
        setRowPerPage={onPagingLimitChange}
        setActivePage={setPagingPage}
        pagingPage={pagingPage}
        initialRowsPerPage={pagingLimit}
        rowsLen={rowsLen}
        onRefresh={onRefresh}
        sanctionTypes={sanctionTypes}
        currSanction={selectedSanction}
        sanctionTypeStatuses={sanctionTypeStatuses}
        fineStatusses={fineStatusses}
        submitSanction={submitSanction}
        deleteProfileSanction={deleteProfileSanction}
        fiCode={fiCode}
        inspectionId={inspectionId}
        setColumns={setColumns}
        additionalColumns={historyColumns}
        orderRowByHeader={orderRowByHeader}
      />
    );
  }
);

export default EmsProfileSanctionContainer;
