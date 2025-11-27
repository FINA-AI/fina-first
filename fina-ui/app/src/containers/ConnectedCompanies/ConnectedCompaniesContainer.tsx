import ConnectedCompaniesPage from "../../components/ConnectedCompanies/ConnectedCompaniesPage";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import {
  loadConnectionInfo,
  saveConnectionInfo,
} from "../../api/services/legalPersonService";
import { useSnackbar } from "notistack";
import { loadFiTypes } from "../../api/services/fi/fiTypesService";
import { FiTypeDataType } from "../../types/fi.type";
import {
  ConnectedCompaniesDataType,
  GraphEdgeType,
} from "../../types/connectedCompanies.type";

const ConnectedCompaniesContainer = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();

  const [selectedItem, setSelectedItem] =
    useState<ConnectedCompaniesDataType | null>(null);
  const [fiTypes, setFiTypes] = useState<FiTypeDataType[]>();

  useEffect(() => {
    loadFITypes();
  }, []);

  const getEdgeInformation = (edge: GraphEdgeType) => {
    if (!edge.data) return;
    loadConnectionInfo(edge.source, edge.target, edge.data.connectionType)
      .then((resp) => {
        setSelectedItem(resp.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const saveConnectionDetails = (connection: ConnectedCompaniesDataType) => {
    saveConnectionInfo(connection)
      .then((resp) => {
        setSelectedItem((prev) =>
          prev
            ? {
                ...prev,
                id: resp.data.id,
                businessActivity: resp.data.businessActivity,
                strategicPlan: resp.data.strategicPlan,
              }
            : prev
        );
        enqueueSnackbar(t("saved"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const loadFITypes = () => {
    loadFiTypes()
      .then((res) => {
        const data = res.data;
        if (data) {
          setFiTypes(
            data
              .map((item: FiTypeDataType) => item.code)
              .sort((a: FiTypeDataType, b: FiTypeDataType) => a.id - b.id)
          );
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };
  return (
    <>
      {fiTypes && (
        <ConnectedCompaniesPage
          getEdgeInformation={getEdgeInformation}
          saveConnectionDetails={saveConnectionDetails}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          fiTypes={fiTypes}
        />
      )}
    </>
  );
};

export default ConnectedCompaniesContainer;
