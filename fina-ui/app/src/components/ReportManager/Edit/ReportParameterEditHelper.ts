import { loadFiTree } from "../../../api/services/fi/fiService";
import { Parameter } from "../../../types/reportGeneration.type";
import { ReportParameterType } from "../Generate/ParameterTypeNames";
import {
  load as loadFiStructure,
  loadAll as loadFiStructureChildren,
} from "../../../api/services/fi/fiStructureService";
import { FiGroupModel } from "../../../types/fi.type";
import {
  moveDown,
  moveUp,
} from "../Generate/ReportGenerationWizardHelpers/ReportGenerationWizardHelper";

export const loadReportParameterData = async (parameter: Parameter) => {
  const resultData: any = {
    source: null,
    destination: parameter.values,
  };

  switch (parameter.type) {
    case ReportParameterType.BANK:
      {
        const res = await loadFiTree();
        let parents = [];
        for (let fi of res.data) {
          parents.push(fi.parent);
        }
        resultData.source = res.data;

        const selectedParents = res.data.filter((d: any) =>
          parameter.values.some((pb) => pb.fiTypeModel.id === d.parent.id)
        );

        const destinationData = [];
        for (let fiTreeData of selectedParents) {
          const filtered = fiTreeData.fis.filter((fi: any) =>
            parameter.values.some((pb) => pb.id === fi.id)
          );
          destinationData.push({
            parent: fiTreeData.parent,
            fis: filtered,
          });
        }

        resultData.destination = destinationData ? destinationData : [];
      }

      break;
    case ReportParameterType.PEER:
      {
        const response = await loadFiStructure();
        let result: FiGroupModel[] = [];
        let root: FiGroupModel[] = response.data.map((item: FiGroupModel) => {
          return { ...item, level: 0, leaf: false };
        });

        const children = await loadFiStructureChildren();

        let childrenArr = children.data.map((item: FiGroupModel) => {
          return {
            ...item,
            level: 1,
            leaf: true,
            id: item.id + "_child",
          };
        });

        const parentChildrenMap = new Map();
        for (let row of root) {
          let children = childrenArr.filter(
            (item: FiGroupModel) => item.parentId === row.id
          );

          let item = { ...row, children: children };
          if (children.length == 0) {
            continue;
          } else {
            result.push(item);
          }
          result = result.concat(children);
          parentChildrenMap.set(row.id, children);
        }

        resultData.source = result;

        const destination = [];
        for (let row of root) {
          const children = parameter.values.filter(
            (p) => p.parentId === row.id
          );
          if (children.length > 0) {
            const childArray = children.map((item: FiGroupModel) => {
              return {
                ...item,
                level: 1,
                leaf: true,
                id: item.id + "_child",
              };
            });
            const tmp = { ...row, expanded: true };
            destination.push({ ...tmp, children: childArray });
          }
        }
        resultData.destination = destination;
      }

      break;
  }

  return resultData;
};

export const getDestinationData = (
  parameter: Parameter,
  existingData: any[],
  selectedData: any[],
  sourceData: any[]
) => {
  const result: any[] = existingData;
  switch (parameter.type) {
    case ReportParameterType.NODE:
    case ReportParameterType.PERIOD:
    case ReportParameterType.VERSION:
      {
        for (let row of selectedData) {
          if (!existingData.some((d) => d.id === row.id)) {
            result.push(row);
          }
        }
      }
      break;
    case ReportParameterType.PEER:
      {
        for (let row of selectedData) {
          const selectedParent = existingData.find(
            (d) => d.id === row.parentId
          );

          if (selectedParent) {
            const exists = selectedParent.children.some(
              (d: any) => d.id === row.id
            );
            if (!exists) {
              selectedParent.children.push(row);
            }
          } else {
            const selectedSource = sourceData.find(
              (r) => r.id === row.parentId && r.level === 0
            );
            const clone = { ...selectedSource, expanded: true };
            existingData.push({ ...clone, children: [row] });
          }
        }
      }
      break;

    case ReportParameterType.BANK: {
      for (let row of selectedData) {
        const selectedParent = existingData.find(
          (d) => d.parent.id === row.parentId
        );

        if (selectedParent) {
          const exists = selectedParent.fis.some((d: any) => d.id === row.id);
          if (!exists) {
            selectedParent.fis.push(row);
          }
        } else {
          const selectedSource = sourceData.find(
            (r) => r.parent.id === row.parentId
          );
          existingData.push({ ...selectedSource, fis: [row] });
        }
      }
    }
  }

  return result;
};

export const getSourceData = (
  parameter: Parameter,
  existingData: any[],
  selectedData: any[]
) => {
  const result: any[] = [];

  switch (parameter.type) {
    case ReportParameterType.NODE:
    case ReportParameterType.PERIOD:
    case ReportParameterType.VERSION:
      {
        for (let row of existingData) {
          if (!selectedData.some((d) => d.id === row.id)) {
            result.push(row);
          }
        }
      }
      break;
    case ReportParameterType.PEER: {
      for (let row of selectedData) {
        const current = existingData.find(
          (d) => d.id === row.parentId && d.level === 0
        );
        if (current) {
          current.children = current.children.filter(
            (d: any) => d.id !== row.id
          );
        }
      }
      return existingData.filter((d) => d.children.length > 0);
    }
    case ReportParameterType.BANK: {
      for (let row of selectedData) {
        const current = existingData.find((d) => d.parent.id === row.parentId);
        current.fis = current.fis.filter((d: any) => d.id !== row.id);
      }
      return [...existingData];
    }
  }

  return result;
};

export const constructParameterValues = (parameter: Parameter, data: any[]) => {
  switch (parameter.type) {
    case ReportParameterType.BANK:
      return data.map((item: any) => item.fis.map((fi: any) => fi.code)).flat();
    case ReportParameterType.PEER:
      return data
        .map((item: any) => item.children.map((peer: any) => peer.code))
        .flat();
    case ReportParameterType.NODE:
    case ReportParameterType.VERSION:
      return data.map((item: any) => item.code);
    case ReportParameterType.PERIOD:
      return data.map((item: any) => item.id);
    default:
      return parameter.values;
  }
};

export const onDataSequenceChange = (
  up: boolean,
  data: any,
  selectedItem: any,
  parameter: Parameter
) => {
  let result = [];

  switch (parameter.type) {
    case ReportParameterType.BANK:
      result = sequenceChangeBank(data, selectedItem, up);
      break;
    case ReportParameterType.PEER:
      result = sequenceChangePeer(data, selectedItem, up);
      break;
    default:
      result = sequenceChangeDefault(data, selectedItem, up);
      break;
  }

  return result;
};

const sequenceChangeBank = (data: any, selectedItem: any, up: boolean) => {
  let arr = data.find((fi: any) => fi.parent.id === selectedItem.parentId).fis;
  let index = arr.findIndex((item: any) => item.id === selectedItem.id);
  up ? moveUp(arr, index) : moveDown(arr, index);
  let result = [];
  for (let fi of data) {
    if (fi.parent.id === selectedItem.parentId) {
      result.push({ fis: [...arr], parent: fi.parent });
    } else {
      result.push(fi);
    }
  }
  return result;
};

const sequenceChangePeer = (data: any, selectedItem: any, up: boolean) => {
  let arr =
    data.find((item: any) => item.id === selectedItem.parentId)?.children || [];
  let index = arr.findIndex((item: any) => item.id === selectedItem.id);
  up ? moveUp(arr, index) : moveDown(arr, index);
  let result = [];
  for (let item of data) {
    if (item.id === selectedItem.parentId) {
      result.push({ ...item, children: [...arr] });
    } else {
      result.push(item);
    }
  }
  return result.filter((item) =>
    item.parentId === 0 ? item.children.length > 0 : true
  );
};

const sequenceChangeDefault = (data: any, selectedItem: any, up: boolean) => {
  let index = data.findIndex((item: any) => item.id === selectedItem.id);
  up ? moveUp(data, index) : moveDown(data, index);
  return data;
};

export const configureUpDownActions = (
  selectedItems: any,
  parameterData: Parameter,
  destinationData: any,
  updateActionButtonsState: (key: string, value: boolean) => void
) => {
  if (selectedItems?.length === 1) {
    const selectedItem = selectedItems[0];
    let upEnabled = false,
      downEnabled = false;

    switch (parameterData?.type) {
      case ReportParameterType.BANK:
        const findFi = destinationData.find(
          ({ parent }: any) => parent.id === selectedItem.parentId
        );
        if (findFi) {
          const selectedItemIndex = findFi.fis.findIndex(
            (item: any) => item.id === selectedItem.id
          );
          upEnabled = selectedItemIndex !== 0;
          downEnabled = selectedItemIndex !== findFi.fis.length - 1;
        }
        break;
      case ReportParameterType.PEER:
        const arr =
          destinationData.find(({ id }: any) => id === selectedItem.parentId)
            ?.children || [];
        if (arr) {
          const selectedItemIndex = arr.findIndex(
            (item: any) => item.id === selectedItem.id
          );
          upEnabled = selectedItemIndex !== 0;
          downEnabled = selectedItemIndex !== arr.length - 1;
        }
        break;
      default:
        const selectedItemIndex = destinationData.findIndex(
          (item: any) => item.id === selectedItem.id
        );
        upEnabled = selectedItemIndex !== 0;
        downEnabled = selectedItemIndex !== destinationData.length - 1;
        break;
    }
    updateActionButtonsState("upEnabled", upEnabled);
    updateActionButtonsState("downEnabled", downEnabled);
  } else {
    updateActionButtonsState("downEnabled", false);
    updateActionButtonsState("upEnabled", false);
  }
};
