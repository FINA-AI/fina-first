import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { loadEmsFiTypes } from "../../api/services/ems/emsFisService";
import {
  deleteSanctionFine,
  loadSanctionFineType,
  postSanctionFine,
  updateSanctionFine,
} from "../../api/services/ems/emsSanctionService";

import EmsFineTypePage from "../../components/EMS/EmsFineType/EmsFineTypePage";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { GridColumnType } from "../../types/common.type";
import { FiType } from "../../types/fi.type";
import { SanctionFineType } from "../../types/sanction.type";
import { getLanguage } from "../../util/appUtil";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";

interface EmsFineTypeContainerProps {
  state: any;
}

const EmsFineTypeContainer: React.FC<EmsFineTypeContainerProps> = ({
  state,
}: EmsFineTypeContainerProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [totalResults, setTotalResults] = useState(0);
  const [fiTypes, setFiTypes] = useState<FiType[]>([]);
  const [data, setData] = useState<SanctionFineType[]>([]);
  const [currFineType, setCurrFineType] = useState<SanctionFineType | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const langCode = getLanguage();

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
    } else {
      setColumns(columnHeader);
    }
  }, [state, t]);

  useEffect(() => {
    loadFiTypeFunc();
  }, []);

  useEffect(() => {
    if (activeTab) {
      setPagingPage(1);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab) {
      loadSanctionFineTypeFunc(activeTab);
    }
  }, [activeTab, pagingLimit, pagingPage]);

  const columnHeader: GridColumnType[] = [
    {
      field: "names",
      headerName: t("description"),
      minWidth: 50,
      renderCell: (value) => {
        return value[langCode];
      },
    },
    {
      field: "rule",
      headerName: t("rule"),
      minWidth: 70,
    },
    {
      field: "article",
      headerName: t("article"),
      minWidth: 70,
    },
    {
      field: "paragraph",
      headerName: t("paragraph"),
      minWidth: 70,
    },
    {
      field: "subParagraph",
      headerName: t("subparagraph"),
      minWidth: 70,
    },
    {
      field: "price",
      headerName: t("fineprice"),
      minWidth: 70,
      renderCell: (value) => {
        const formattedPrices = value?.join(", ");
        return formattedPrices;
      },
    },
  ];

  const [columns, setColumns] = useState<GridColumnType[]>(columnHeader);

  const loadFiTypeFunc = () => {
    loadEmsFiTypes(pagingPage, pagingLimit)
      .then((resp) => {
        const data: FiType[] = resp.data;
        setFiTypes(data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const loadSanctionFineTypeFunc = (currFiType: string) => {
    setLoading(true);
    loadSanctionFineType(pagingPage, pagingLimit, currFiType)
      .then((resp) => {
        const data = resp.data.list as SanctionFineType[];
        setData(data);
        setTotalResults(resp.data.totalResults);
      })

      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoading(false));
  };

  const onSubmit = (obj: SanctionFineType) => {
    const newData = {
      ...obj,
      id: currFineType ? obj.id : 0,
      fiType: currFineType ? obj.fiType : (obj.fiType as FiType).code,
    };
    if (currFineType) {
      updateSanctionFine(newData.id, newData)
        .then((res) => {
          const updateData = data.map((item) =>
            item.id === res.data.id
              ? {
                  ...res.data,
                }
              : item
          );
          setCurrFineType(res.data);
          setData(updateData);
          enqueueSnackbar(t("edited"), { variant: "success" });
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    } else {
      postSanctionFine(newData)
        .then((res) => {
          setActiveTab(res.data.fiType);
          setData([...data, { ...res.data }]);
          enqueueSnackbar(t("saved"), { variant: "success" });
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    }
  };

  const onRefresh = (activeStep: string) => {
    loadSanctionFineTypeFunc(activeStep);
  };

  const deleteHandler = () => {
    if (currFineType) {
      deleteSanctionFine(currFineType.id, currFineType)
        .then(() => {
          const newData = data.filter((item) => item.id !== currFineType.id);
          setData(newData);
          setCurrFineType(null);
          enqueueSnackbar(t("deleted"), { variant: "success" });
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    }
  };

  const orderRowByHeader = (cellName: string, arrowDirection: string) => {
    let sortDirection = arrowDirection === "up" ? 1 : -1;

    setData((prevData) =>
      [...prevData].sort((a: any, b: any) => {
        let valueA =
          cellName === "names" ? a.names[langCode] ?? "" : a[cellName] ?? "";
        let valueB =
          cellName === "names" ? b.names[langCode] ?? "" : b[cellName] ?? "";

        return (valueA > valueB ? 1 : valueA < valueB ? -1 : 0) * sortDirection;
      })
    );
  };

  return (
    <>
      <EmsFineTypePage
        columns={columns}
        setColumns={setColumns}
        pagingPage={pagingPage}
        setPagingPage={setPagingPage}
        pagingLimit={pagingLimit}
        setPagingLimit={setPagingLimit}
        totalResults={totalResults}
        fiTypes={fiTypes}
        data={data}
        setData={setData}
        deleteHandler={deleteHandler}
        setCurrFineType={setCurrFineType}
        currFineType={currFineType}
        onRefresh={onRefresh}
        onSubmit={onSubmit}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loading={loading}
        orderRowByHeader={orderRowByHeader}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  state: state.getIn(["state", "emsFineTypesTableCustomization"]),
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmsFineTypeContainer);
