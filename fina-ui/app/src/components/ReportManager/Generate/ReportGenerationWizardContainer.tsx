import ReportGenerationWizard from "./ReportGenerationWizard";
import React, { useEffect, useRef, useState } from "react";
import {
  loadGeneratedReports,
  loadReportsParameters,
  preGenerationSet,
  saveScheduleReport,
} from "../../../api/services/reportService";
import {
  initReturnVersions,
  loadAllGroups,
  loadFis,
  loadGroupsParent,
  loadMDTCodes,
  loadPeriodDefinitions,
  loadPeriodTypes,
  onDataMoveHelper,
  onDataSequenceChangeHelper,
} from "./ReportGenerationWizardHelpers/ReportGenerationWizardHelper";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import { BASE_REST_URL } from "../../../util/appUtil";
import { ReportParameterType } from "./ParameterTypeNames";
import { Report, StoredRootReport } from "../../../types/report.type";
import {
  BaseGenerationParameter,
  Iterator,
  Parameter,
  ReportParams,
  ReportSchedule,
} from "../../../types/reportGeneration.type";
import {
  constructVCTIterator,
  getMultiReportGenerationParameter,
  getValues,
  setParameterValues,
} from "../Util/ReportParameterUtil";

interface ReportGenerationWizardContainerProps {
  handleClose: VoidFunction;
  selectedReports: Report[];
  fileType: string;
  closeWizard: VoidFunction;
  isSchedule?: boolean;
  generateWithFormula?: boolean;
}

export interface GeneratedReports {
  key?: null | string;
  storedReports: StoredRootReport[];
}

const ReportGenerationWizardContainer: React.FC<
  ReportGenerationWizardContainerProps
> = ({
  selectedReports,
  handleClose,
  fileType,
  closeWizard,
  isSchedule,
  generateWithFormula,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const [iterators, setIterators] = useState<Iterator[]>([]);
  const [parameters, setParameters] = useState<Partial<Parameter>[]>([]);
  const [generationStepName, setGenerationStepName] =
    useState("CHOOSE_PARAMETERS");
  const [loading, setLoading] = useState(true);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReports>({
    key: null,
    storedReports: [],
  });
  const [reportGenerationTypesData, setReportGenerationTypesData] =
    useState<any>({});
  const [
    currentSelectedDestinationSelectedRows,
    setCurrentSelectedDestinationTableRows,
  ] = useState<any>([]);

  const currentOperationName = useRef<string>();
  const selectedParameters = useRef<BaseGenerationParameter>();
  const selectedIterators = useRef<BaseGenerationParameter>();
  const reportParameterStore = useRef<ReportParams[]>();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    reportParameterStore.current = [];

    const resp = await loadReportsParameters(selectedReports.map((r) => r.id));
    const reportParamsData: ReportParams[] = resp.data;

    const hasNeededParameters = reportParamsData.some(
      (e) => e.parameters.length > 0 || e.iterators.length > 0
    );

    //if parameters and iterators should not passed by
    if (!isSchedule && !hasNeededParameters) {
      //load generated reports
      const storedReportsResponse = await loadGeneratedReports(
        reportParamsData.map((r) => r.reportId)
      );

      const storedReportsData = storedReportsResponse.data;
      //open generated reports grid
      if (storedReportsData.length > 0) {
        setGeneratedReports({ storedReports: storedReportsData });
        setLoading(false);
      } else {
        // Open Generate url

        const reportIdsQueryParam = getReportIdsQueryParam(
          reportParamsData.map((r) => r.reportId)
        );
        const folderIdQueryParam = getFolderQueryParam();

        openGenerationUrl(folderIdQueryParam, reportIdsQueryParam, true);
        closeWizard();
      }
      return;
    }

    reportParameterStore.current = reportParamsData;

    let params: Partial<Parameter>[] = [];
    let iters: Iterator[] = [];
    //more than one report is selected or folder is selected
    if (reportParamsData.length > 1) {
      //filter parameters to select only distinct types
      reportParamsData.forEach((r) => {
        //filter params
        r.parameters.forEach((rp) => {
          if (!params.some((p) => p.type === rp.type)) {
            params.push(rp);
          }
        });

        let vctIters: Iterator[] = r.iterators.filter(
          (it) =>
            it.type === ReportParameterType.VCT ||
            it.type === ReportParameterType.PLAIN_VCT
        );
        //filter iterators
        r.iterators
          .filter(
            (it) =>
              it.type !== ReportParameterType.VCT &&
              it.type !== ReportParameterType.PLAIN_VCT
          )
          .forEach((ri) => {
            if (!iters.some((it) => it.type === ri.type)) {
              iters.push(ri);
            }
          });

        const plainVctIter = vctIters.find(
          (it) => it.type === ReportParameterType.PLAIN_VCT
        );
        const vctIter = vctIters.find(
          (it) => it.type === ReportParameterType.VCT
        );
        if (vctIter) {
          iters = [...iters, ...constructVCTIterator(vctIter)];
        }

        if (plainVctIter) {
          iters = [...iters, ...constructVCTIterator(plainVctIter)];
        }
      });
    } else {
      const firstReportParamsData = reportParamsData[0];

      params = firstReportParamsData.parameters || [];
      iters = firstReportParamsData.iterators || [];

      let vctIters: Iterator[] = [];
      iters
        .filter(
          (p) =>
            p.type === ReportParameterType.VCT ||
            p.type === ReportParameterType.PLAIN_VCT
        )
        .forEach((p) => {
          vctIters = [...vctIters, ...constructVCTIterator(p)];
        });

      iters = iters.filter(
        (p) =>
          p.type !== ReportParameterType.VCT &&
          p.type !== ReportParameterType.PLAIN_VCT &&
          p.values.length === 0
      );

      iters = [...iters, ...vctIters];
    }

    params = params.filter((p) => p?.values?.length === 0);

    loadMainData(params, iters);

    setIterators([
      ...iters.map((iter, index: number) => {
        return {
          ...iter,
          generationStepName: "CHOOSE_ITERATORS",
          stepIndex: index,
          key: `${iter.name}_${iter.type}_${index}_CHOOSE_ITERATORS`,
        };
      }),
    ]);

    if (isSchedule) {
      params.unshift({
        type: ReportParameterType.SCHEDULE,
        name: "schedule",
      });
    }

    setParameters([
      ...params.map((param, index: number) => {
        return {
          ...param,
          generationStepName: "CHOOSE_PARAMETERS",
          stepIndex: index,
          key: `${param.name}_${param.type}_${index}_CHOOSE_PARAMETERS`,
        };
      }),
    ]);

    if (params.length > 0) {
      setGenerationStepName("CHOOSE_PARAMETERS");
    } else if (iters.length > 0) {
      setGenerationStepName("CHOOSE_ITERATORS");
    }

    setLoading(false);
  };

  const onFinish = async () => {
    const reportParamsData = reportParameterStore.current;

    //multi report generations
    if (reportParameterStore.current?.length !== 1) {
      const tmpParamData = getMultiReportGenerationParameter(
        selectedParameters.current || {}
      );
      const tmpIterData = getMultiReportGenerationParameter(
        selectedIterators.current || {}
      );

      reportParameterStore.current?.forEach((r) => {
        r.parameters.forEach((rp) => {
          rp.values = getValues(rp.type, tmpParamData);
        });

        r.iterators.forEach((rp) => {
          if (
            rp.type === ReportParameterType.VCT ||
            rp.type === ReportParameterType.PLAIN_VCT
          ) {
            if (rp.vctIteratorInfo) {
              if (
                rp.vctIteratorInfo.aggregateValues == null ||
                rp.vctIteratorInfo.aggregateValues?.length === 0
              ) {
                rp.values =
                  rp.type === ReportParameterType.VCT
                    ? tmpIterData.vctAggregateValues
                    : tmpIterData.plainVctAggregateValues;
              }

              if (
                rp.vctIteratorInfo.periodParameter == null ||
                rp.vctIteratorInfo.periodParameterValues == null ||
                rp.vctIteratorInfo.periodParameterValues.length === 0
              ) {
                if (rp.type === ReportParameterType.VCT) {
                  rp.vctIteratorInfo.periodParameterValues =
                    rp.type === ReportParameterType.VCT
                      ? tmpIterData.vctPeriodValues
                      : tmpIterData.plainVctPeriodValues;
                }
              }
            }
          } else {
            rp.values = getValues(rp.type, tmpIterData);
          }
        });
      });
    } else {
      //single report generations
      setParameterValues(
        Object.values(selectedParameters.current || []),
        false,
        reportParameterStore.current ? reportParameterStore.current : []
      );
      setParameterValues(
        Object.values(selectedIterators.current || []),
        true,
        reportParameterStore.current ? reportParameterStore.current : []
      );
    }

    setLoading(true);

    if (isSchedule) {
      let schedules: any = selectedParameters?.current?.schedule;
      let data = {
        ...schedules,
        selectedRows: [],
        reportParametersInfo: {
          ...(schedules && {
            reportId: schedules.reportId,
          }),
          ...reportParamsData?.[0],
        },
      };

      saveScheduleReport(data)
        .then(() => {
          setLoading(false);
          closeWizard();
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    } else {
      const preGenerationData = await preGenerationSet(reportParamsData);

      setLoading(false);
      if (preGenerationData.data.storedReports.length > 0) {
        setGeneratedReports(preGenerationData.data);
      } else {
        const reportIdsQueryParam = getReportIdsQueryParam(
          (reportParamsData ?? []).map((r) => r.reportId)
        );
        const folderIdQueryParam = getFolderQueryParam();

        openGenerationUrl(
          folderIdQueryParam,
          reportIdsQueryParam,
          true,
          `&reportGenerationKey=${preGenerationData.data.key}`
        );
        closeWizard();
      }
    }
  };

  // returns folder id if only one folder is selected
  const getFolderQueryParam = () => {
    if (
      selectedReports &&
      selectedReports.length === 1 &&
      selectedReports[0].type === 1
    ) {
      const folderId = selectedReports[0].id;
      return folderId ? `&folderId=${folderId}` : "";
    }
    return "";
  };
  const setSchedules = (obj: ReportSchedule) => {
    let res = {
      ...obj,
      repositoryFolderName: obj?.repositoryFolder[0]?.name,
      repositoryNodeId: obj?.repositoryFolder[0]?.id,
      reportId: selectedReports[0].id,
      type: "-1",
    };
    selectedParameters.current = {
      ...selectedParameters.current,
      schedule: res as any,
    };
    if (obj.onDemand || obj.scheduleTime) {
      setCurrentSelectedDestinationTableRows([res]);
      selectedParameters.current.schedule.selectedRows = [res];
    } else {
      setCurrentSelectedDestinationTableRows([]);
      selectedParameters.current.schedule.selectedRows = [];
    }
  };

  const getReportIdsQueryParam = (reportIds: number[]) => {
    let result = "";
    reportIds.forEach((id) => (result += `&reportIds=${id}&`));
    return result;
  };

  const openGenerationUrl = (
    folderIdQueryParam: string,
    reportIdsQueryParam: string,
    regenerate: boolean,
    reportGenerationKeyQueryParam = ""
  ) => {
    window.open(
      BASE_REST_URL +
        `/report/generate?regenerate=${regenerate}&replaceAll=${!generateWithFormula}&fileType=${fileType}${folderIdQueryParam}${reportGenerationKeyQueryParam}${reportIdsQueryParam}`,
      "_blank"
    );
  };

  const loadMainData = async (
    params: Partial<Parameter>[],
    iters: Iterator[]
  ) => {
    let types = [
      ...params.map((param) => param.type),
      ...iters.map((iter) =>
        (iter.type === ReportParameterType.PLAIN_VCT ||
          iter.type === ReportParameterType.VCT) &&
        iter.vctIteratorInfo !== null
          ? iter.vctIteratorInfo.type
          : iter.type
      ),
    ];

    const uniqueArray = Array.from(new Set(types));

    for (let type of uniqueArray) {
      switch (type) {
        case ReportParameterType.BANK:
          loadFis()
            .then((data) => {
              reportGenerationTypesData[ReportParameterType.BANK] = data;
              setReportGenerationTypesData({
                ...reportGenerationTypesData,
                Bank: data,
              });
            })
            .catch((err) => {
              openErrorWindow(err, t("error"), true);
            });
          break;
        case ReportParameterType.NODE:
          loadMDTCodes()
            .then((data) => {
              reportGenerationTypesData[ReportParameterType.NODE] = data;
              setReportGenerationTypesData({
                ...reportGenerationTypesData,
                Node: data,
              });
            })
            .catch((err) => {
              openErrorWindow(err, t("error"), true);
            });
          break;
        case ReportParameterType.PERIOD:
          loadPeriodDefinitions()
            .then((periods) => {
              loadPeriodTypes()
                .then((types) => {
                  reportGenerationTypesData[ReportParameterType.PERIOD] = {
                    periods,
                    types,
                  };
                  setReportGenerationTypesData({
                    ...reportGenerationTypesData,
                    Period: { periods, types },
                  });
                })
                .catch((err) => {
                  openErrorWindow(err, t("error"), true);
                });
            })
            .catch((err) => {
              openErrorWindow(err, t("error"), true);
            });

          break;
        case ReportParameterType.OFFSET:
          break;
        case ReportParameterType.VERSION:
          initReturnVersions()
            .then((data) => {
              reportGenerationTypesData[ReportParameterType.VERSION] = data;
              setReportGenerationTypesData({
                ...reportGenerationTypesData,
                Version: data,
              });
            })
            .catch((err) => {
              openErrorWindow(err, t("error"), true);
            });
          break;
        case ReportParameterType.PEER:
          loadGroupsParent()
            .then((parent) => {
              loadAllGroups()
                .then((children) => {
                  reportGenerationTypesData[ReportParameterType.PEER] = {
                    parent,
                    children,
                  };
                  setReportGenerationTypesData({
                    ...reportGenerationTypesData,
                    Peer: { parent, children },
                  });
                })
                .catch((err) => {
                  openErrorWindow(err, t("error"), true);
                });
            })
            .catch((err) => {
              openErrorWindow(err, t("error"), true);
            });
          break;
        default:
          break;
      }
    }
  };

  const onReviewOrReGenerate = (
    reportIds: number[],
    regenate: boolean,
    key: string
  ) => {
    const folderIdQueryParam = getFolderQueryParam();
    const reportIdsQueryParam = getReportIdsQueryParam(reportIds);

    openGenerationUrl(
      folderIdQueryParam,
      reportIdsQueryParam,
      regenate,
      `&reportGenerationKey=${key}`
    );
    closeWizard();
  };

  const onDataMove = (
    leftToRight: boolean,
    sourceTable: any,
    destinationTable: any,
    isParam: boolean
  ) => {
    if (!sourceTable) {
      sourceTable = destinationTable;
    }

    currentOperationName.current = "move";
    let result = onDataMoveHelper(
      leftToRight,
      sourceTable,
      destinationTable,
      isParam,
      selectedParameters,
      selectedIterators
    );
    setCurrentSelectedDestinationTableRows(result);
    if (leftToRight) {
      if (isParam) {
        selectedParameters.current = {
          ...selectedParameters.current,
          [sourceTable.name]: {
            ...sourceTable,
            selectedRows: result,
          },
        };
      } else {
        selectedIterators.current = {
          ...selectedIterators.current,
          [sourceTable.name]: {
            ...sourceTable,
            selectedRows: result,
          },
        };
      }
    } else {
      if (isParam) {
        selectedParameters.current = {
          ...selectedParameters.current,
          [destinationTable.name]: {
            ...destinationTable,
            selectedRows: result,
          },
        };
      } else {
        selectedIterators.current = {
          ...selectedIterators.current,
          [destinationTable.name]: {
            ...destinationTable,
            selectedRows: result,
          },
        };
      }
    }
  };

  const onDataSequenceChange = (up: boolean, data: any, isParam: boolean) => {
    currentOperationName.current = "sequence";
    let result = onDataSequenceChangeHelper(
      up,
      data,
      isParam,
      selectedParameters,
      selectedIterators
    );

    setCurrentSelectedDestinationTableRows([...result]);
    if (isParam) {
      selectedParameters.current = {
        ...selectedParameters.current,
        [data.name]: {
          ...data,
          selectedRows: result,
        },
      };
    } else {
      selectedIterators.current = {
        ...selectedIterators.current,
        [data.name]: {
          ...data,
          selectedRows: result,
        },
      };
    }
  };

  return (
    <ReportGenerationWizard
      handleClose={handleClose}
      iterators={iterators}
      parameters={parameters}
      generationStepName={generationStepName}
      onDataMove={onDataMove}
      selectedParameters={selectedParameters}
      selectedIterators={selectedIterators}
      currentSelectedDestinationSelectedRows={
        currentSelectedDestinationSelectedRows
      }
      setCurrentSelectedDestinationTableRows={
        setCurrentSelectedDestinationTableRows
      }
      setGenerationStepName={setGenerationStepName}
      onDataSequenceChange={onDataSequenceChange}
      currentOperationName={currentOperationName}
      loading={loading}
      reportGenerationTypesData={reportGenerationTypesData}
      onReviewOrReGenerate={onReviewOrReGenerate}
      generatedReports={generatedReports}
      onFinish={onFinish}
      fileType={fileType}
      setSchedules={setSchedules}
      isReportScheduller={isSchedule}
    />
  );
};

export default ReportGenerationWizardContainer;
