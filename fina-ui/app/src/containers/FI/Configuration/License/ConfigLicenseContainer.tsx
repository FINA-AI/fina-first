import ConfigLicenseMainPage from "../../../../components/FI/Configuration/License/Main/ConfigLicenseMainPage";
import {
  addLicenseTypes,
  deleteLicenseType,
  getLicenseTypes,
} from "../../../../api/services/licenseService";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { LicenseType } from "../../../../types/fi.type";

const ConfigLicenseContainer = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [licenses, setLicenses] = useState<LicenseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const licensesList = licenses.sort((a, b) => a.id - b.id);
  const [currentLicense, setCurrentLicense] = useState<LicenseType>(
    {} as LicenseType
  );

  useEffect(() => {
    getData();
  }, []);

  const deleteLicenseTypeHandler = async (item: LicenseType) => {
    setLoading(true);
    try {
      await deleteLicenseType(item.id);
      let tmp = [...licenses];
      tmp = tmp.filter((licenses) => licenses.id !== item.id);
      setLicenses(tmp);
      enqueueSnackbar(t("deleted"), { variant: "success" });
      setIsDeleteModalOpen(false);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      openErrorWindow(e, t("error"), true);
    }
  };

  const getData = async () => {
    setLoading(true);
    try {
      let res = await getLicenseTypes();
      setLicenses(res.data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      openErrorWindow(e, t("error"), true);
    }
  };
  const addLicenseHandler = async (data: LicenseType) => {
    setLoading(true);
    try {
      let res = await addLicenseTypes(data);
      if (data.id > 0) {
        setLicenses(
          licensesList.map((item) => (item.id === data.id ? res.data : item))
        );
      } else {
        setLicenses([...licensesList, res.data]);
      }
      setIsAddModalOpen(false);
      setCurrentLicense({} as LicenseType);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      openErrorWindow(e, t("error"), true);
    }
  };

  return (
    <ConfigLicenseMainPage
      licenses={licenses}
      addLicenseHandler={addLicenseHandler}
      isAddModalOpen={isAddModalOpen}
      setIsAddModalOpen={setIsAddModalOpen}
      deleteLicenseTypeHandler={deleteLicenseTypeHandler}
      isDeleteModalOpen={isDeleteModalOpen}
      setIsDeleteModalOpen={setIsDeleteModalOpen}
      currentLicense={currentLicense}
      setCurrentLicense={setCurrentLicense}
      loading={loading}
    />
  );
};

export default ConfigLicenseContainer;
