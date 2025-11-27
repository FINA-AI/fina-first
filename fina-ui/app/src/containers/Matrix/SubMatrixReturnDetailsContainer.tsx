import React, { useEffect, useMemo, useState } from "react";
import SubMatrixDefinitionTablePage from "../../components/Matrix/SubMatrixDefinitionTable/SubMatrixDefinitionTablePage";
import { DefinitionTableDataType } from "../../types/matrix.type";
import {
  deleteDefinitionTableData,
  deleteDefinitionTableMultiData,
  getDefinitionTableData,
  moveNodeMappingItem,
  saveDefinitionTableData,
} from "../../api/services/matrixService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import throttle from "lodash/throttle";

const initDeleteModalState = {
  open: false,
  row: {} as DefinitionTableDataType,
  index: 0,
  loading: false,
};

const SubMatrixReturnDetailsContainer = () => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<DefinitionTableDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showLoadingMask, setShowLoadingMask] = useState<boolean>(false);
  const { tableId }: { tableId: string } = useParams();
  const [scrollToIndex, setScrollToIndex] = useState<number>(0);
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    row: DefinitionTableDataType;
    index?: number;
    loading: boolean;
  }>(initDeleteModalState);
  const [contextMenuLoader, setContextMenuLoader] = useState(false);

  useEffect(() => {
    loadDefinitionTableData(setLoading);
  }, []);

  const handlePaste = (event: any) => {
    event.preventDefault();

    const text = event.clipboardData.getData("text");

    let rows = text
      .trim()
      .split("\r\n")
      .map((row: DefinitionTableDataType) => row.split("\t"));

    const output = rows.map((row: DefinitionTableDataType) => ({
      id: -Math.random(),
      mdtNodeId: 0,
      mdtNodeCode: row[0],
      cell: row[2],
      mdtNodeDescription: row[1],
      dataType: row[3] && row[3].trim().length ? row[3].trim() : null,
      isDirty: true,
    }));

    const pastedData = output.filter(
      (item: DefinitionTableDataType) =>
        item.mdtNodeCode !== "code" && item.mdtNodeDescription !== "desc"
    );

    setData([...data, ...pastedData]);
  };

  const loadDefinitionTableData = (
    setLoadingState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setLoadingState(true);
    getDefinitionTableData(Number(tableId))
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => setLoadingState(false));
  };

  const emptyRow: DefinitionTableDataType = {
    id: -Math.random(),
    mdtNodeCode: "",
    cell: "",
    dataType: null,
    mdtNodeDescription: "",
    mdtNodeId: 0,
    isDirty: true,
    sequence: 0,
  };

  const dataTypeCell = [
    { label: "STRING", value: "STRING" },
    { label: "DATE", value: "DATE" },
    { label: "DATETIME", value: "DATETIME" },
  ];

  const onSave = (pasteData?: DefinitionTableDataType[]) => {
    const saveData = data.filter(
      (item: DefinitionTableDataType) => item.isDirty
    );

    let payload = pasteData?.length ? pasteData : saveData;
    payload = payload.map((row) => ({ ...row, id: row.id < 0 ? 0 : row.id }));

    setShowLoadingMask(true);
    saveDefinitionTableData(Number(tableId), payload)
      .then(() => {
        loadDefinitionTableData(setShowLoadingMask);
        setIsSaveDisabled(true);
        enqueueSnackbar(t("saved"), { variant: "success" });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const addNew = () => {
    onAdd();
  };

  const onAdd = useMemo(
    () =>
      throttle(
        function () {
          setData([...data, emptyRow]);

          setScrollToIndex(data.length);
        },
        50,
        { leading: false }
      ),
    [data]
  );

  const updateRow = () => {
    setData([...data]);
  };

  const onDelete = (row: DefinitionTableDataType, rowIndex?: number) => {
    if (row) {
      if (row.id < 0) {
        setData(data.filter((_, index) => index !== rowIndex));
        setDeleteModal(initDeleteModalState);
        enqueueSnackbar(t("deleted"), {
          variant: "success",
        });
      } else {
        deleteDefinitionTableData(row.id)
          .then(() => {
            setData(data.filter((item) => item.id !== row.id));
            enqueueSnackbar(t("deleted"), {
              variant: "success",
            });
          })
          .catch((err) => {
            openErrorWindow(err, t("error"), true);
          })
          .finally(() => setDeleteModal(initDeleteModalState));
      }
    }
  };

  const onDeleteMulti = (checkedRows: Map<number, DefinitionTableDataType>) => {
    const IdsArr = Array.from(checkedRows.keys());

    const isUnsaved = IdsArr.every((id) => id < 0);

    if (isUnsaved) {
      enqueueSnackbar(t("deleted"), { variant: "success" });
      setData(data.filter((item) => !IdsArr.includes(item.id)));
      setDeleteModal(initDeleteModalState);
    } else {
      const positiveIds = IdsArr.filter((id) => id > 0);

      deleteDefinitionTableMultiData(positiveIds)
        .then(() => {
          enqueueSnackbar(t("deleted"), { variant: "success" });
          setData(data.filter((item) => !IdsArr.includes(item.id)));
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        })
        .finally(() => setDeleteModal(initDeleteModalState));
    }
  };

  const onMoveUpOrDownFunction = (
    moveDirection: string,
    selectedRow: DefinitionTableDataType
  ) => {
    const selectedRowIndex = data.findIndex(
      (row) => row.id === selectedRow?.id
    );
    if (
      (selectedRowIndex === 0 && moveDirection === "up") ||
      (selectedRowIndex === data.length - 1 && moveDirection === "down")
    ) {
      return;
    }
    setContextMenuLoader(true);
    const moveUp = moveDirection === "up";
    if (!Number.isInteger(selectedRow.id)) {
      moveRowManually(selectedRowIndex, moveUp);
      return;
    }
    moveNodeMappingItem(selectedRow.id, moveUp)
      .then(() => moveRowManually(selectedRowIndex, moveUp))
      .catch((err) => openErrorWindow(err, t("error"), true))
      .finally(() => setContextMenuLoader(false));
  };

  const moveRowManually = (selectedRowIndex: number, moveUp: boolean) => {
    const adjacentRowIndex = moveUp
      ? selectedRowIndex - 1
      : selectedRowIndex + 1;
    [data[selectedRowIndex], data[adjacentRowIndex]] = [
      data[adjacentRowIndex],
      data[selectedRowIndex],
    ];
    setData([...data]);
    setContextMenuLoader(false);
  };

  return (
    <SubMatrixDefinitionTablePage
      data={data}
      onSave={onSave}
      addNew={addNew}
      onDelete={onDelete}
      updateRow={updateRow}
      loading={loading}
      showLoadingMask={showLoadingMask}
      dataTypeCell={dataTypeCell}
      scrollToIndex={scrollToIndex}
      handlePaste={handlePaste}
      setIsSaveDisabled={setIsSaveDisabled}
      isSaveDisabled={isSaveDisabled}
      onDeleteMulti={onDeleteMulti}
      deleteModal={deleteModal}
      setDeleteModal={setDeleteModal}
      onMoveUpOrDownFunction={onMoveUpOrDownFunction}
      contextMenuLoader={contextMenuLoader}
    />
  );
};

export default SubMatrixReturnDetailsContainer;
