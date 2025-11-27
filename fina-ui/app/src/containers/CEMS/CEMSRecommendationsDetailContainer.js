import CEMSRecommendationsInnerPage from "../../components/CEMS/CEMSRecommendationsInnerPage/CEMSRecommendationsInnerPage";
import { useEffect, useRef, useState } from "react";
import {
  deleteCEMSRecommendations,
  loadRecommendationsHistory,
  loadSingleCEMSRecommendation,
  saveRecommendation,
} from "../../api/services/CEMSRecommendationsService";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useSnackbar } from "notistack";
import { loadInspection } from "../../api/services/CEMSInspectionsService";
import { CEMS_BASE_PATH } from "../../components/CEMS/CEMSRouter";

const CEMSRecommendationsDetailContainer = () => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  let { recommendationId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { inspectionId } = useParams();
  const history = useHistory();

  const [data, setData] = useState({});
  const [originalData, setOriginalData] = useState();
  const [isEditMode, setIsEditMode] = useState(false);
  const [recommendationHistory, setRecommendationHistory] = useState();
  const [inspectionData, setInspectionData] = useState();

  const emsRecommendationDetails = useRef({});

  useEffect(() => {
    loadInspectionData();
    if (recommendationId != 0) {
      initRecommendation();
    } else {
      setIsEditMode(true);
    }
  }, []);

  const loadInspectionData = () => {
    loadInspection(inspectionId)
      .then((res) => {
        const data = res.data;
        setInspectionData({ ...data });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onChangeEmsRecommendationDetails = (object) => {
    emsRecommendationDetails.current = {
      ...emsRecommendationDetails.current,
      ...object,
    };
  };

  const updateChild = (index, key, value) => {
    onChangeEmsRecommendationDetails({
      fiResponsiblePersons: [
        ...emsRecommendationDetails.current.fiResponsiblePersons.map(
          (p, currIndex) => {
            return currIndex === index ? {...p, [key]:value} : p;
          }
        ),
      ],
    });
    data.fiResponsiblePersons = [
      ...emsRecommendationDetails.current.fiResponsiblePersons.map(
        (p, currIndex) => {
          return currIndex === index ? {...p, [key]: value} : p;
        }
      ),
    ];
  };

  const initRecommendation = () => {
    loadSingleCEMSRecommendation(recommendationId)
      .then((res) => {
        let data = res.data;
        data.fiResponsiblePersons.sort((a, b) => b.id - a.id);
        emsRecommendationDetails.current = data;
        setData({ ...data });
        setOriginalData({ ...data });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {});
  };

  const onRecommendationSave = () => {
    let result = emsRecommendationDetails.current;
    if (!result.status || !result.type) {
      enqueueSnackbar(t("statusAndTypeAreRequired"), {
        variant: "warning",
      });
      return;
    }
    saveRecommendation(inspectionId, result)
      .then((res) => {
        setData(res.data);
        setOriginalData(res.data);
        enqueueSnackbar(t("saved"), {
          variant: "success",
        });
        emsRecommendationDetails.current = res.data;
        setIsEditMode(false);
        history.push(
          `/${CEMS_BASE_PATH}/inspection/${inspectionId}/recommendation/${res.data.id}`
        );
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const deleteRecommendation = () => {
    deleteCEMSRecommendations([recommendationId])
      .then(() => {
        history.push(
          `/${CEMS_BASE_PATH}/inspection/${inspectionId}/recommendation`
        );
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const getRecommendationHistory = () => {
    loadRecommendationsHistory(recommendationId)
      .then((res) => {
        setRecommendationHistory(res.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  return (
    inspectionData && (
      <CEMSRecommendationsInnerPage
        data={data}
        setData={setData}
        onRecommendationSave={onRecommendationSave}
        emsRecommendationDetails={emsRecommendationDetails}
        updateChild={updateChild}
        onChangeEmsRecommendationDetails={onChangeEmsRecommendationDetails}
        originalData={originalData}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        deleteRecommendation={deleteRecommendation}
        getRecommendationHistory={getRecommendationHistory}
        recommendationHistory={recommendationHistory}
        fi={inspectionData.fi}
      />
    )
  );
};

export default CEMSRecommendationsDetailContainer;
