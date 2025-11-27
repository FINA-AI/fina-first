import ClosableModal from "../../common/Modal/ClosableModal";
import Wizard from "../../Wizard/Wizard";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
  createDashlet,
  getDashletPrev,
} from "../../../api/services/dashboardService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import DashletPreview from "./DashletPreview";
import DashletSelection from "./DashletSelection";
import { useSnackbar } from "notistack";
import { getRandomFillAndStrokeColor } from "../../common/Chart/chartUtil";
import {
  DashletDataType,
  DashletStyleType,
  DashletType,
} from "../../../types/dashboard.type";
import { GridColumnType } from "../../../types/common.type";

interface DashletCreationWizardProps {
  isAddDashletOpen: boolean;
  setIsAddDashletOpen: (value: boolean) => void;
  setData: (value: DashletType[]) => void;
  data: DashletType[];
  selectedItem: DashletType | null;
  onCloseModal: () => void;
  onDashletEdit(data: DashletType): void;
}

const DashletCreationWizard: React.FC<DashletCreationWizardProps> = ({
  isAddDashletOpen,
  setIsAddDashletOpen,
  setData,
  data,
  selectedItem,
  onCloseModal,
  onDashletEdit,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [previewData, setPreviewData] = useState<DashletDataType[]>();
  const [isValidPreview, setIsValidPreview] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("TABLE");
  const [selectedChart, setSelectedChart] = useState<string>("PIECHART");
  const [dashletData, setDashletData] = useState<DashletType>(
    {} as DashletType
  );
  const [chartColors, setChartColors] = useState<DashletStyleType>(
    {} as DashletStyleType
  );
  const [activeStep, setActiveStep] = useState<number>(0);
  const [loading, setLaoding] = useState(false);
  const [errorFields, setErrorFields] = useState<string[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (selectedItem) {
      const obj = JSON.parse(selectedItem.metaInfoJson);
      setSelectedType(obj.selectedType);
      setSelectedChart(obj.selectedType !== "TABLE" && obj.selectedChart);
      setDashletData({ ...selectedItem });
    }
  }, []);

  useEffect(() => {
    const colors = getRandomFillAndStrokeColor();
    setChartColors({ stroke: colors.stroke, fill: colors?.fill });
  }, [selectedChart]);

  const getDashboardPrev = () => {
    getDashletPrev({
      name: dashletData?.name,
      dataQuery: dashletData?.dataQuery,
      metaInfoJson: "",
    })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const response = res.data.map((item: DashletType, index: number) => ({
            ...item,
            id: index + 1,
          }));
          setIsValidPreview(true);
          setPreviewData(response);
        }
      })
      .catch((e) => {
        openErrorWindow(e, "error", true);
      });
  };

  const createDashlethandler = () => {
    if (!dashletData.code || dashletData.code.trim().length === 0) {
      enqueueSnackbar(t("codeIsRequired"), { variant: "warning" });
      return;
    }

    if (!dashletData.name || dashletData.name.trim().length === 0) {
      enqueueSnackbar(t("nameIsRequired"), {
        variant: "warning",
      });
    } else {
      setLaoding(true);
      createDashlet({
        id: dashletData?.id && dashletData.id,
        name: dashletData?.name,
        dataQuery: dashletData.dataQuery,
        metaInfoJson: JSON.stringify({
          selectedType: selectedType,
          selectedChart: selectedChart,
        }),
        code: dashletData?.code,
      })
        .then((res) => {
          if (data?.length > 0) {
            let newArr = data.map((item) => {
              if (item.id === res.data.id) {
                return res.data;
              }
              return item;
            });
            setData(dashletData?.id ? newArr : [...data, res.data]);
            onDashletEdit(res.data);
          }
          setIsAddDashletOpen(false);
          onCloseModal();
          enqueueSnackbar(
            !dashletData.id ? t("addedsuccessfully") : t("editedsuccessfully"),
            { variant: "success" }
          );
        })
        .catch((e) => {
          openErrorWindow(e, "error", true);
        })
        .finally(() => {
          setLaoding(false);
        });
    }
  };

  const onPrevClick = () => {
    getDashboardPrev();
  };

  const onClose = () => {
    setIsAddDashletOpen(false);
    if (onCloseModal) {
      onCloseModal();
    }
  };

  const generateColumns = () => {
    let cols: GridColumnType[] = [];
    if (previewData && previewData?.length > 0) {
      const keys = Object.keys(previewData[0]);
      keys.forEach((item) => {
        let column = {
          field: item,
          headerName: item,
          width: keys.length > 5 ? 150 : undefined,
        };
        cols.push(column);
      });
    }
    return cols;
  };

  const isCurrStepValid = () => {
    return dashletData?.dataQuery?.trim().length > 0 && isValidPreview;
  };

  const handleOnNext = () => {
    const validStep = dashletData.name && dashletData.code;

    if (validStep) return true;

    const emptyFields = [];
    !dashletData.name && emptyFields.push("name");
    !dashletData.code && emptyFields.push("code");

    setErrorFields(emptyFields);
    return false;
  };

  return (
    <ClosableModal
      open={isAddDashletOpen}
      width={850}
      height={600}
      includeHeader={false}
      disableBackdropClick={true}
      onClose={() => {}}
    >
      <Wizard
        steps={[t("newDashlat"), t("preview")]}
        onCancel={onClose}
        onSubmit={() => {
          createDashlethandler();
        }}
        onNext={handleOnNext}
        activeStepCallBack={(page: number) => {
          setActiveStep(page);
        }}
        hasPreview={true}
        onPrevClick={onPrevClick}
        isCurrStepValid={isCurrStepValid()}
        isNextStepValid={!!previewData}
      >
        <DashletPreview
          previewData={previewData ? previewData : []}
          generateColumns={generateColumns}
          isCurrStepValid={isCurrStepValid}
          dashletData={dashletData}
          errorFields={errorFields}
          setErrorFields={setErrorFields}
          setPreviewData={setPreviewData}
        />
        {activeStep === 1 ? (
          <DashletSelection
            generateColumns={generateColumns}
            previewData={previewData ? previewData : []}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedChart={selectedChart}
            setSelectedChart={setSelectedChart}
            dashletData={dashletData}
            chartColors={chartColors}
            loading={loading}
            setPreviewData={setPreviewData}
          />
        ) : (
          <></>
        )}
      </Wizard>
    </ClosableModal>
  );
};

export default DashletCreationWizard;
