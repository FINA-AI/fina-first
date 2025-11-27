import CEMSSanctionInnerPage from "../../components/CEMS/Sanction/CEMSSanctionInnerPage";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useHistory, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import {
  deleteSanctions,
  loadSingleSanction,
  saveSanction,
} from "../../api/services/CEMSSanctionService";
import { loadInspection } from "../../api/services/CEMSInspectionsService";
import { CEMS_BASE_PATH } from "../../components/CEMS/CEMSRouter";

const CEMSSanctionDetailContainer = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const { inspectionId, sanctionId } = useParams();

  const [originalData, setOriginalData] = useState();
  const [isEditMode, setIsEditMode] = useState(false);
  const [inspectionData, setInspectionData] = useState();

  const sanctionDetailsRef = useRef({});

  useEffect(() => {
    loadInspectionData();
    if (sanctionId > 0) {
      loadSanction();
    } else {
      setIsEditMode(true);
      const emptyObj = {
        measureReasonCatalog: [],
        measureOfInfluence: [],
        sanctionedEmployees: [],
        regulations: [],
        inspection: {},
      };
      setOriginalData(emptyObj);
      sanctionDetailsRef.current = emptyObj;
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

  const onChangeData = (object) => {
    sanctionDetailsRef.current = {
      ...sanctionDetailsRef.current,
      ...object,
    };
  };

  const loadSanction = () => {
    loadSingleSanction(sanctionId)
      .then((res) => {
        let data = res.data;
        sanctionDetailsRef.current = data;
        setOriginalData({ ...data });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {});
  };

  const onSave = () => {
    let result = sanctionDetailsRef.current;

    if (!result.id) {
      result.id = 0;
    }

    if (result.status && typeof result.status === "object") {
      result.status = result.status["key"];
    }
    if (!result.status) {
      enqueueSnackbar(t("statusIsRequired"), {
        variant: "warning",
      });
      return;
    }

    result.regulations = result.regulations.filter((v) => v.regulationCatalog);

    result.sanctionedEmployees = result.sanctionedEmployees.filter(
      (v) => v.employeeName
    );

    saveSanction(inspectionId, result)
      .then((res) => {
        setOriginalData(res.data);
        enqueueSnackbar(t("saved"), {
          variant: "success",
        });
        sanctionDetailsRef.current = { ...res.data };
        setIsEditMode(false);
        history.push(
          `/${CEMS_BASE_PATH}/inspection/${inspectionId}/sanction/${res.data.id}`
        );
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const deleteSanctionData = () => {
    deleteSanctions([sanctionId])
      .then(() => {
        history.push(`/${CEMS_BASE_PATH}/inspection/${inspectionId}/sanction`);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  return (
    originalData &&
    inspectionData && (
      <CEMSSanctionInnerPage
        data={sanctionDetailsRef.current}
        originalData={originalData}
        onDelete={deleteSanctionData}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        onChangeData={onChangeData}
        onSave={onSave}
        fi={inspectionData.fi}
      />
    )
  );
};

export default CEMSSanctionDetailContainer;
