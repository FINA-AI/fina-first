import { ReportParameterType } from "../Generate/ParameterTypeNames";
import {
  BaseGenerationParameter,
  BaseGenerationParameterValue,
  Iterator,
  ReportParams,
} from "../../../types/reportGeneration.type";

export const getValues = (type: ReportParameterType, selectedData: any) => {
  switch (type) {
    case ReportParameterType.BANK:
      return selectedData.bankCodes;
    case ReportParameterType.PEER:
      return selectedData.peerCodes;
    case ReportParameterType.NODE:
      return selectedData.nodeCodes;
    case ReportParameterType.PERIOD:
      return selectedData.periodIds;
    case ReportParameterType.OFFSET:
      return selectedData.offset;
    case ReportParameterType.VERSION:
      return selectedData.versionCodes;
    case ReportParameterType.VCT:
    case ReportParameterType.PLAIN_VCT: {
      return [];
    }

    default:
      return [];
  }
};

export const getParamValuesByType = (
  param: BaseGenerationParameterValue
): string[] => {
  let type = param.type;
  if (
    (param.type === ReportParameterType.VCT ||
      param.type === ReportParameterType.PLAIN_VCT) &&
    param.vctIteratorInfo != null
  ) {
    type = param.vctIteratorInfo.type;
  }

  switch (type) {
    case ReportParameterType.PERIOD:
      return param.selectedRows.map((row: any) => row.id);
    case ReportParameterType.PEER:
      return param.selectedRows
        .filter((row: any) => row.parentId !== 0)
        .map((child: any) => child.code);
    case ReportParameterType.BANK:
      const bnkCodes: string[] = [];
      param.selectedRows.forEach((f: any) => {
        f.fis.forEach((bnk: any) => bnkCodes.push(bnk.code));
      });
      return bnkCodes;
    case ReportParameterType.NODE:
    case ReportParameterType.VERSION:
      return param.selectedRows.map((n) => n.code);
    case ReportParameterType.OFFSET:
      return param.selectedRows
        .filter((offset: any) => offset.name.trim().length !== 0)
        .map((item: any) => item.name);
    default:
      return [];
  }
};

const generateVctIteratorName = (
  iter: Iterator,
  type: ReportParameterType
): string => {
  return `${iter.name}_${type}`;
};

export const constructVCTIterator = (iter: Iterator): Iterator[] => {
  const vctIters: Iterator[] = [];
  if (
    iter.type === ReportParameterType.VCT ||
    iter.type === ReportParameterType.PLAIN_VCT
  ) {
    if (iter.vctIteratorInfo) {
      if (
        iter.vctIteratorInfo.aggregateBy === "Bank" &&
        (iter.vctIteratorInfo.aggregateValues == null ||
          iter.vctIteratorInfo.aggregateValues?.length === 0)
      ) {
        vctIters.push({
          ...iter,
          vctIteratorInfo: {
            ...iter.vctIteratorInfo,
            type: ReportParameterType.BANK,
            name: iter.name,
          },
          name: generateVctIteratorName(iter, ReportParameterType.BANK),
        });
      } else if (
        iter.vctIteratorInfo.aggregateBy === "Peer" &&
        (iter.vctIteratorInfo.aggregateValues == null ||
          iter.vctIteratorInfo.aggregateValues?.length === 0)
      ) {
        vctIters.push({
          ...iter,
          vctIteratorInfo: {
            ...iter.vctIteratorInfo,
            type: ReportParameterType.PEER,
            name: iter.name,
          },
          name: generateVctIteratorName(iter, ReportParameterType.PEER),
        });
      }

      if (
        iter.vctIteratorInfo.periodParameter == null &&
        iter.vctIteratorInfo.periodParameterValues === null
      ) {
        vctIters.push({
          ...iter,
          vctIteratorInfo: {
            ...iter.vctIteratorInfo,
            type: ReportParameterType.PERIOD,
            name: iter.name,
          },
          name: generateVctIteratorName(iter, ReportParameterType.PERIOD),
        });
      }
    }
  }
  return vctIters;
};

export const getMultiReportGenerationParameter = (
  parameter: BaseGenerationParameter
) => {
  const values: BaseGenerationParameterValue[] = Object.values(parameter);
  const fis = values.find(
    (v) => v.type === ReportParameterType.BANK
  )?.selectedRows;
  const periods = values.find(
    (v) => v.type === ReportParameterType.PERIOD
  )?.selectedRows;
  const nodes = values.find(
    (v) => v.type === ReportParameterType.NODE
  )?.selectedRows;
  const versions = values.find(
    (v) => v.type === ReportParameterType.VERSION
  )?.selectedRows;
  const offsets = values.find(
    (v) => v.type === ReportParameterType.OFFSET
  )?.selectedRows;
  const peers = values.find(
    (v) => v.type === ReportParameterType.PEER
  )?.selectedRows;

  const vctIter = values.find((v) => v.type === ReportParameterType.VCT);

  const plainVct = values.find((v) => v.type === ReportParameterType.PLAIN_VCT);

  const selectedParametersData: any = {
    bankCodes: [],
    nodeCodes: [],
    versionCodes: [],
    periodIds: [],
    peerCodes: [],
    offset: null,
    vctAggregateValues: [],
    vctPeriodValues: [],
    plainVctAggregateValues: [],
    plainVctPeriodValues: [],
  };

  if (vctIter) {
    setVctParamValues(vctIter, values, selectedParametersData);
  }

  if (plainVct) {
    setVctParamValues(plainVct, values, selectedParametersData);
  }

  if (fis) {
    fis.forEach((f: any) => {
      f.fis.forEach((bnk: any) =>
        selectedParametersData.bankCodes.push(bnk.code)
      );
    });
  }
  if (periods) {
    selectedParametersData.periodIds = periods.map((p) => p.id);
  }
  if (nodes) {
    selectedParametersData.nodeCodes = nodes.map((n) => n.code);
  }
  if (versions) {
    selectedParametersData.versionCodes = versions.map((v) => v.code);
  }

  if (peers) {
    selectedParametersData.peerCodes = peers
      .filter((row: any) => row.parentId !== 0)
      .map((child: any) => child.code);
  }

  if (offsets) {
    selectedParametersData.offset = offsets
      .filter((offset: any) => offset.name.trim().length !== 0)
      .map((item: any) => item.name);
  }

  return selectedParametersData;
};

const setVctParamValues = (
  vctIter: Iterator,
  parameters: BaseGenerationParameterValue[],
  selectedParametersData: any
) => {
  if (vctIter && vctIter.vctIteratorInfo) {
    if (
      vctIter.vctIteratorInfo.aggregateValues == null ||
      vctIter.vctIteratorInfo.aggregateValues.length === 0
    ) {
      const aggrType =
        vctIter.vctIteratorInfo.aggregateBy === "Bank"
          ? ReportParameterType.BANK
          : ReportParameterType.PEER;
      const tmp = parameters.find(
        (p2) => `${vctIter.vctIteratorInfo?.name}_${aggrType}` === p2.name
      )?.selectedRows;
      let data: any[] = [];

      switch (aggrType) {
        case ReportParameterType.BANK:
          tmp?.forEach((f: any) => {
            f.fis.forEach((bnk: any) => data.push(bnk.code));
          });
          break;
        case ReportParameterType.PEER:
          tmp
            ?.filter((row: any) => row.parentId !== 0)
            .forEach((child) => data.push(child.code));
      }

      vctIter.values = data || [];

      if (vctIter.type === ReportParameterType.PLAIN_VCT) {
        selectedParametersData.plainVctAggregateValues = data;
      } else {
        selectedParametersData.vctAggregateValues = data;
      }
    }

    if (
      vctIter.vctIteratorInfo.periodParameter == null &&
      vctIter.vctIteratorInfo.periodParameterValues == null
    ) {
      const tmp =
        parameters.find(
          (p2) =>
            `${vctIter.vctIteratorInfo?.name}_${ReportParameterType.PERIOD}` ===
            p2.name
        )?.selectedRows || [];

      vctIter.vctIteratorInfo.periodParameterValues =
        tmp?.map((row: any) => row.id) || [];

      if (vctIter.type === ReportParameterType.PLAIN_VCT) {
        selectedParametersData.plainVctPeriodValues =
          vctIter.vctIteratorInfo.periodParameterValues;
      } else {
        selectedParametersData.vctPeriodValues =
          vctIter.vctIteratorInfo.periodParameterValues;
      }
    }
  }
};

export const setParameterValues = (
  parameterValues: BaseGenerationParameterValue[],
  isIterator: boolean,
  selectedReports: ReportParams[]
) => {
  if (selectedReports) {
    parameterValues.forEach(
      (parameter) => (parameter.values = getParamValuesByType(parameter))
    );

    const selectedReportParameter = selectedReports[0];
    if (isIterator) {
      selectedReportParameter.iterators.forEach((p1) => {
        if (
          p1.type === ReportParameterType.PLAIN_VCT ||
          p1.type === ReportParameterType.VCT
        ) {
          if (p1.vctIteratorInfo) {
            if (
              p1.vctIteratorInfo.aggregateParameter === null &&
              p1.vctIteratorInfo.aggregateValues === null
            ) {
              const aggrType =
                p1.vctIteratorInfo.aggregateBy === "Bank"
                  ? ReportParameterType.BANK
                  : ReportParameterType.PEER;
              const tmp = parameterValues.find(
                (p2) => `${p1.name}_${aggrType}` === p2.name
              )?.values;

              p1.values = tmp || [];
            }

            if (
              p1.vctIteratorInfo.periodParameter == null &&
              p1.vctIteratorInfo.periodParameterValues == null
            ) {
              p1.vctIteratorInfo.periodParameterValues =
                parameterValues.find(
                  (p2) => `${p1.name}_${ReportParameterType.PERIOD}` === p2.name
                )?.values || [];
            }
          }
        } else {
          p1.values =
            parameterValues.find((p2) => p1.name === p2.name)?.values || [];
        }
      });
    } else {
      selectedReportParameter.parameters.forEach((p1) => {
        p1.values =
          parameterValues.find((p2) => p1.name === p2.name)?.values || [];
      });
    }
  }
};
