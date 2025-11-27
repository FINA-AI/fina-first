import { useEffect, useRef, useState } from "react";
import {
  deleteInspection,
  loadInspection,
  saveInspection,
} from "../../api/services/CEMSInspectionsService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import CEMSInspectionDetailsPage from "../../components/CEMS/CEMSInnerPage/CEMSInspectionDetailsPage";
import { useHistory, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { CEMS_BASE_PATH } from "../../components/CEMS/CEMSRouter";
import { loadFiTree } from "../../api/services/fi/fiService";

const CEMSInspectionDetailsContainer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const { openErrorWindow } = useErrorWindow();
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [fis, setFis] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const params = location?.pathname.split("/");
  const currentInspectionDataRef = useRef();
  const { enqueueSnackbar } = useSnackbar();
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    initData();
  }, []);

  const onChangeInspectionData = (key, object) => {
    let tmp = {};
    if (object !== null && typeof object === "object") {
      tmp = {
        [key]: { ...currentInspectionDataRef.current[key], ...object },
      };
    } else {
      tmp = {
        ...currentInspectionDataRef.current,
        [key]: object,
      };
    }

    currentInspectionDataRef.current = {
      ...currentInspectionDataRef.current,
      ...tmp,
    };
  };

  const initData = () => {
    const inspectionId = params[params.length - 1];
    if (Number(inspectionId) !== 0) {
      loadInspection(inspectionId)
        .then((resp) => {
          let data = resp.data;
          setData({ ...data, level: 1 });
          setOriginalData({ ...data });
          loadFiTypesFunction();
          currentInspectionDataRef.current = { ...data };
          setPhase(data.phase || 1); // Update phase here
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      loadFiTypesFunction();
      setData({ id: "" });
      setEditMode(true);
      currentInspectionDataRef.current = {};
    }
  };

  const loadFiTypesFunction = () => {
    if (fis.length === 0) {
      loadFiTree()
        .then((res) => {
          setLoading(true);
          setFis(res.data);
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    }
  };

  const onSaveClick = async () => {
    let result = { ...currentInspectionDataRef.current };
    if (result.fi && result.fi.id && result.type) {
      saveInspection(result)
        .then((res) => {
          const inspectionId = params[params.length - 1];
          if (Number(inspectionId) === 0) {
            history.push(`/${CEMS_BASE_PATH}/inspection/${res.data.id}`);
          }
          setOriginalData({ ...res.data });
          currentInspectionDataRef.current = { ...res.data };
          setOriginalData({ ...res.data });
          setEditMode(false);
          setData({ ...res.data });
          enqueueSnackbar(t("saved"), {
            variant: "success",
          });
        })
        .catch((err) => {
          openErrorWindow(err, t("error"), true);
        });
    } else {
      enqueueSnackbar(t("fiAndTypeAreRequired"), {
        variant: "warning",
      });
    }
  };

  const onCancelClick = () => {
    const inspectionId = params[params.length - 1];
    if (Number(inspectionId) === 0) {
      history.push(`/${CEMS_BASE_PATH}/inspection`);
    }
    setData({ ...originalData });
    currentInspectionDataRef.current = { ...originalData };
  };

  const onDeleteFunction = async () => {
    await deleteInspection([data.id])
      .then(() => {
        history.push(`/${CEMS_BASE_PATH}/inspection`);
        enqueueSnackbar(t("deleted"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  return (
    currentInspectionDataRef.current && (
      <CEMSInspectionDetailsPage
        loading={loading}
        data={currentInspectionDataRef.current}
        onSaveClick={onSaveClick}
        onCancelClick={onCancelClick}
        fis={fis}
        onChangeInspectionData={onChangeInspectionData}
        onDeleteFunction={onDeleteFunction}
        editMode={editMode}
        setEditMode={setEditMode}
        phase={phase}
        setPhase={setPhase}
      />
    )
  );
};

CEMSInspectionDetailsContainer.propTypes = {};

export default CEMSInspectionDetailsContainer;
