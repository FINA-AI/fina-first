import { getAllMDTCode } from "../../../../api/services/MDTService";
import { load, loadAll } from "../../../../api/services/fi/fiStructureService";
import { getFilteredPeriods } from "../../../../api/services/periodDefinitionsService";
import { getVersions } from "../../../../api/services/versionsService";
import { getPeriodTypes } from "../../../../api/services/periodTypesService";
import { ReportParameterType } from "../ParameterTypeNames";
import { loadFiTree } from "../../../../api/services/fi/fiService";

export const filterUniqueFiSelectedRows = (
  leftToRight,
  sourceSelectedRows,
  currentSelectedRows
) => {
  if (leftToRight) {
    let result = [...currentSelectedRows];
    for (const sourceNode of sourceSelectedRows) {
      const nodeIdToFind = sourceNode.parent.id;

      const existingNodeIndex = result.findIndex(
        (item) => item.parent.id === nodeIdToFind
      );

      const existingNode = result[existingNodeIndex];

      if (!existingNode) {
        result.push(sourceNode);
      } else {
        const combinedRows = [...sourceNode.fis, ...existingNode?.fis];
        const uniqueRowIds = Array.from(
          new Set(combinedRows.map((row) => row.id))
        );
        let nonDuplicatedRows = uniqueRowIds.map((uniqueId) =>
          combinedRows.find((row) => row.id === uniqueId)
        );
        result[existingNodeIndex] = {
          ...sourceNode,
          fis: [...nonDuplicatedRows],
        };
      }
    }
    return result;
  } else {
    let result = [];
    for (let i = 0; i < sourceSelectedRows.length; i++) {
      let filteredRows = sourceSelectedRows[i]
        ? sourceSelectedRows[i].fis.filter(
            (row) =>
              !currentSelectedRows.some(
                (currentRow) => currentRow.id === row.id
              )
          )
        : [];
      if (filteredRows.length === 0) continue;
      result.push({ ...sourceSelectedRows[i], fis: [...filteredRows] });
    }
    return result;
  }
};

export const getCurrentDataByActiveStep = (
  isParam,
  selectedItem,
  selectedParameters,
  selectedIterators
) => {
  let currSelectedRows;
  if (isParam) {
    currSelectedRows = Boolean(
      selectedParameters.current &&
        selectedParameters.current[selectedItem.name]
    )
      ? selectedParameters.current[selectedItem.name].selectedRows
      : [];
  } else {
    currSelectedRows = Boolean(
      selectedIterators.current && selectedIterators.current[selectedItem.name]
    )
      ? selectedIterators.current[selectedItem.name].selectedRows
      : [];
  }
  return currSelectedRows;
};
export const onDataMoveHelper = (
  leftToRight,
  sourceTable,
  destinationTable,
  isParam,
  selectedParameters,
  selectedIterators
) => {
  const type = sourceTable.type;
  if (leftToRight) {
    let selectedRows = sourceTable.selectedRows ? sourceTable.selectedRows : [];
    let currentSelectedRows = getCurrentDataByActiveStep(
      isParam,
      sourceTable,
      selectedParameters,
      selectedIterators
    );
    let nonDuplicatedRows;
    if (type === "Bank") {
      nonDuplicatedRows = filterUniqueFiSelectedRows(
        leftToRight,
        selectedRows,
        currentSelectedRows
      );
    } else {
      if (type === ReportParameterType.PEER) {
        if (currentSelectedRows.length === 0) {
          return selectedRows;
        }
        let arr = [];
        let parents = [...selectedRows.filter((item) => item.parentId === 0)];
        for (let row of parents) {
          if (row.parentId === 0) {
            let children = [
              ...row.children,
              ...currentSelectedRows.filter(
                (child) => child.parentId === row.id
              ),
            ];
            children = Array.from(
              new Set(children.map((child) => child.id))
            ).map((id) => children.find((child) => child.id === id));
            row.children = children;
            arr.push(row);
            arr = arr.concat(children);
          }
        }
        nonDuplicatedRows = arr;
      } else if (type === ReportParameterType.OFFSET) {
        nonDuplicatedRows = selectedRows;
      } else {
        // Combine both arrays
        let combinedRows = selectedRows.concat(currentSelectedRows);
        // Create a Set to remove duplicates based on the 'id' property
        let uniqueRows = Array.from(new Set(combinedRows.map((row) => row.id)));
        // Retrieve the non-duplicated objects
        nonDuplicatedRows = uniqueRows.map((uniqueId) =>
          combinedRows.find((row) => row.id === uniqueId)
        );
      }
    }
    return nonDuplicatedRows;
  } else {
    let currentSelectedRowsArr = getCurrentDataByActiveStep(
      isParam,
      destinationTable,
      selectedParameters,
      selectedIterators
    );
    let filteredRows;
    if (type === ReportParameterType.BANK) {
      filteredRows = filterUniqueFiSelectedRows(
        leftToRight,
        currentSelectedRowsArr,
        destinationTable.selectedRows
      );
    } else {
      filteredRows = currentSelectedRowsArr.filter(
        (row) =>
          !destinationTable.selectedRows.some(
            (currentRow) => currentRow.id === row.id
          )
      );

      if (type === ReportParameterType.PEER) {
        let arr = [];
        for (let row of filteredRows) {
          if (row.parentId === 0) {
            if (filteredRows.find((child) => child.parentId === row.id)) {
              arr.push(row);
            }
          } else {
            arr.push(row);
          }
        }
        filteredRows = arr;
      }
    }
    return filteredRows;
  }
};
export const onDataSequenceChangeBank = (
  up,
  data,
  isParam,
  selectedParameters,
  selectedIterators
) => {
  let currRow = data.selectedRows[0];
  let currSelectedRows = getCurrentDataByActiveStep(
    isParam,
    data,
    selectedParameters,
    selectedIterators
  );
  let arr = currSelectedRows.find(
    (fi) => fi.parent.id === currRow.parentId
  ).fis;
  let index = arr.findIndex((item) => item.id === currRow.id);
  up ? moveUp(arr, index) : moveDown(arr, index);
  let result = [];
  for (let fi of currSelectedRows) {
    if (fi.parent.id === currRow.parentId) {
      result.push({ fis: [...arr], parent: fi.parent });
    } else {
      result.push(fi);
    }
  }
  return result;
};

export const onDataSequenceChangeGroup = (
  up,
  data,
  isParam,
  selectedParameters,
  selectedIterators
) => {
  let currRow = data.selectedRows[0];
  let currSelectedRows = getCurrentDataByActiveStep(
    isParam,
    data,
    selectedParameters,
    selectedIterators
  );
  let arr = currSelectedRows.filter(
    (item) => item.parentId === currRow.parentId
  );
  let index = arr.findIndex((item) => item.id === currRow.id);
  up ? moveUp(arr, index) : moveDown(arr, index);
  let result = [];
  for (let item of currSelectedRows) {
    if (!arr.find((i) => i.id === item.id)) {
      if (item.id === currRow.parentId) {
        result.push(item);
        result = result.concat(arr);
      } else {
        result.push(item);
      }
    }
  }
  return result.filter((item) =>
    item.parentId === 0 ? item.children.length > 0 : true
  );
};

export const moveUp = (array, index) => {
  if (index === 0) {
    // Already at the top, cannot move up
    return;
  }
  const temp = array[index];
  array[index] = array[index - 1];
  array[index - 1] = temp;
};
export const moveDown = (array, index) => {
  if (index === array.length - 1) {
    // Already at the bottom, cannot move down
    return;
  }
  const temp = array[index];
  array[index] = array[index + 1];
  array[index + 1] = temp;
};
export const onDataSequenceChangeHelper = (
  up,
  data,
  isParam,
  selectedParameters,
  selectedIterators
) => {
  if (data.type === "Bank") {
    return onDataSequenceChangeBank(
      up,
      data,
      isParam,
      selectedParameters,
      selectedIterators
    );
  } else if (data.type === "Peer") {
    return onDataSequenceChangeGroup(
      up,
      data,
      isParam,
      selectedParameters,
      selectedIterators
    );
  } else {
    let currSelectedRows = getCurrentDataByActiveStep(
      isParam,
      data,
      selectedParameters,
      selectedIterators
    );
    let index = currSelectedRows.findIndex(
      (item) => item.id === data.selectedRows[0].id
    );
    up ? moveUp(currSelectedRows, index) : moveDown(currSelectedRows, index);
    return currSelectedRows;
  }
};

export const loadFis = async () => {
  return await loadFiTree().then((res) => {
    return res.data;
  });
};

export const loadMDTCodes = async () => {
  return await getAllMDTCode(true).then((resp) => {
    return resp.data;
  });
};

export const loadGroupsParent = async () => {
  return await load().then((resp) => {
    return resp.data;
  });
};

export const loadAllGroups = async () => {
  return await loadAll().then((resp) => {
    return resp.data;
  });
};

export const getCurrentYearLastDate = () => {
  return new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999).getTime();
};

export const loadPeriodDefinitions = async () => {
  const toDate = getCurrentYearLastDate();
  const filter = { toDate: toDate };

  return await getFilteredPeriods(filter).then((result) => {
    return result.data.list;
  });
};

export const loadPeriodTypes = async () => {
  return await getPeriodTypes().then((res) => {
    return res.data;
  });
};

export const initReturnVersions = () => {
  return getVersions().then((res) => {
    return res.data;
  });
};
