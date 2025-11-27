import React, { useEffect, useState } from "react";
import ReleaseMDTPage from "../../components/Tools/ReleaseMDT/ReleaseMDTPage";
import { useSnackbar } from "notistack";
import {
  loadToolFiTypes,
  saveReleaseMdt,
} from "../../api/services/toolsService";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { ReleaseMDTFiType } from "../../types/tools.type";
import { DroppableTypes } from "../../types/common.type";

interface DragLocation {
  droppableId: string;
  index: number;
}

export interface OnDragEndProps {
  source: DragLocation;
  destination: DragLocation;
}

const ReleaseMdtContainer = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [originalItems, setOriginalItems] = useState<ReleaseMDTFiType[]>([]);
  const [items, setItems] = useState<ReleaseMDTFiType[]>([]);
  const [displayColumns, setDisplayColumns] = useState<ReleaseMDTFiType[]>(
    [] as ReleaseMDTFiType[]
  );
  const [mask, setMask] = useState(true);

  useEffect(() => {
    loadToolFiTypes()
      .then((res) => {
        const dataMDT = res.data;
        if (dataMDT) {
          changeItemFunction(dataMDT);
        }
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      })
      .finally(() => {
        setMask(false);
      });
  }, []);

  const save = () => {
    let data = displayColumns.map((item) => item.code);
    if (data.length !== 0) {
      setMask(true);
      saveReleaseMdt(data)
        .then(() => {
          enqueueSnackbar(t("mdtReleasedSuccessfully"), { variant: "success" });
          setDisplayColumns([]);
          setItems([
            ...originalItems.map((item) => {
              return { ...item, isSelected: false };
            }),
          ]);
        })
        .catch((error) => {
          openErrorWindow(error, t("error"), true);
        })
        .finally(() => {
          setMask(false);
        });
    }
  };

  const changeItemFunction = (data: ReleaseMDTFiType[]) => {
    let fiData: ReleaseMDTFiType[] = [
      ...data
        .map((element, index) => {
          return {
            ...element,
            id: "destination-" + element.id,
            isSelected: false,
            sequence: index,
            index: index,
            headerName: element.code + " | " + element.name,
          };
        })
        .sort((a: any, b: any) => a.isSelected - b.isSelected),
    ];
    setItems([...fiData]);
    setOriginalItems([...fiData]);
  };

  const reorder = (
    list: ReleaseMDTFiType[] = [],
    startIndex: number,
    endIndex: number
  ) => {
    const result = list;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    result.map((r, index) => {
      r.sequence = index;
      return r;
    });

    return result;
  };

  const handleTransfer = (item: ReleaseMDTFiType, sequence?: number) => {
    const isSource = !item.isSelected;
    let cols: ReleaseMDTFiType[] = items.sort(
      (a, b) => a.sequence - b.sequence
    );
    const index = items.findIndex(
      (c) => c.id.split("-")[1] === item.id.split("-")[1]
    );
    cols[index].isSelected = !cols[index].isSelected;

    if (isSource) {
      const tmp: ReleaseMDTFiType[] = [...displayColumns];
      tmp.push(cols[index]);

      cols = reorder(items, index, items.length - 1);

      const destCols = [
        ...(sequence && sequence >= 0
          ? reorder(tmp, tmp.length - 1, sequence)
          : tmp),
      ].map((c) =>
        c.id === item.id
          ? { ...item, id: "source-" + item.id.split("-")[1] }
          : c
      );
      setDisplayColumns(destCols);
    } else {
      displayColumns.splice(
        displayColumns.findIndex(
          (dc) => dc.id.split("-")[1] === item.id.split("-")[1]
        ),
        1
      );

      setDisplayColumns([...displayColumns]);
    }
    setItems(cols);
  };

  const onDragEnd = (data: OnDragEndProps) => {
    const { destination, source, draggableId }: any = data;
    // dropped outside the list
    if (!destination) return;

    const sInd = source.droppableId;
    const dInd = destination.droppableId;

    if (sInd === DroppableTypes.DESTINATION_LIST) {
      source.index = displayColumns.findIndex(
        (item) => item.id === draggableId
      );
    }
    if (dInd === DroppableTypes.DESTINATION_LIST) {
      source.index = items.findIndex((item) => item.id === draggableId);
    }

    // In Same List
    if (sInd === dInd) {
      const newItems = reorder(
        sInd === DroppableTypes.SOURCE_LIST ? items : displayColumns,
        source.index,
        destination.index
      );

      if (sInd === DroppableTypes.SOURCE_LIST) {
        setItems(newItems);
      } else {
        setDisplayColumns(newItems);
      }
    } else {
      //From Source To Destination
      if (sInd === DroppableTypes.SOURCE_LIST) {
        handleTransfer(items[source.index], destination.index);
      } else {
        //From Destination to source
        handleTransfer(displayColumns[source.index]);
      }
    }
  };

  const handleSwitch = (from: number) => {
    let newDisplayColumns = displayColumns;
    newDisplayColumns[from].fixed = !newDisplayColumns[from].fixed;
    setDisplayColumns([...newDisplayColumns]);
  };

  return (
    <ReleaseMDTPage
      data={items}
      handleTransfer={handleTransfer}
      handleSwitch={handleSwitch}
      onDragEnd={onDragEnd}
      displayColumns={displayColumns}
      save={save}
      loading={mask}
    />
  );
};

export default ReleaseMdtContainer;
