import FILicenseMainPage from "../../../../components/FI/Main/Detail/License/Main/FILicenseMainPage";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  deleteLicense,
  loadLicenses,
  saveLicense,
} from "../../../../api/services/licenseService";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import { FiDataType, LicensesDataType } from "../../../../types/fi.type";

interface FILicenseContainerProps {
  tabName: string;
  fi: FiDataType;
  fiId: number;
}

export interface FILicenseFilterType {
  active: boolean;
  inactive: boolean;
  dateFrom: string | null;
  dateTo: string | null;
}

const FILicenseContainer: React.FC<FILicenseContainerProps> = ({
  tabName,
  fi,
  fiId,
}) => {
  const [licenses, setLicenses] = useState<LicensesDataType[]>([]);
  const [filteredLicenses, setFilteredLicenses] = useState<LicensesDataType[]>(
    []
  );
  const [licenseLength, setLicenseLength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const history = useHistory();
  // let { id } = useParams();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();

  const updateDefaultLicense = async (data: LicensesDataType) => {
    try {
      await saveLicense(data);
      const updatedLicense = licenses.map((item) => {
        if (item.id === data.id) {
          return { ...item, default: data.default };
        } else if (item.default === true) {
          return { ...item, default: false };
        }
        return item;
      });
      setFilteredLicenses(updatedLicense);
    } catch (e) {
      openErrorWindow(e, t("error"), true);
    }
  };

  const initLicenses = async () => {
    setLoading(true);
    await loadLicenses(undefined, undefined, "", fiId)
      .then((resp) => {
        let data = resp.data;
        if (data) {
          setLicenses(data.list);
          setLicenseLength(data.totalResults ? data.totalResults : 0);
          setFilteredLicenses(data.list);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        openErrorWindow(error, t("error"), true);
      });
  };

  useEffect(() => {
    initLicenses();
  }, [fiId]);

  const onSearchClick = (searchValue: string) => {
    const value = searchValue.trim();

    if (!value) setFilteredLicenses(licenses);

    if (value.length <= 2) return;

    const filteredLicenses = licenses.filter((license) =>
      license.code.toLowerCase().includes(searchValue.toLowerCase())
    );

    setFilteredLicenses(filteredLicenses);
  };

  const onClearFunc = () => {
    setFilteredLicenses([...licenses]);
  };

  const onDeleteFunction = async (licenseItem: LicensesDataType) => {
    await deleteLicense(licenseItem.id)
      .then(() => {
        const newLicenses = [
          ...licenses.filter((item) => item.id !== licenseItem.id),
        ];
        setLicenses(newLicenses);
        setFilteredLicenses(newLicenses);
        setLicenseLength(licenseLength - 1);
        setIsDeleteModalOpen(false);
        enqueueSnackbar(t("deleted"), { variant: "success" });
      })
      .catch((error) => {
        openErrorWindow(error, t("error"), true);
      });
  };

  const onLicenseItemClick = (licenseItem: LicensesDataType) => {
    history.push(`/fi/${fiId}/${tabName}/${licenseItem.id}`);
  };

  const onFilterClick = (filters: FILicenseFilterType) => {
    let newLicenses: LicensesDataType[] = licenses.filter((item) =>
      filters.active
        ? item.licenceStatus === "ACTIVE"
        : filters.inactive
        ? item.licenceStatus !== "ACTIVE"
        : true
    );

    newLicenses = filters.dateFrom
      ? newLicenses.filter(
          (item) =>
            new Date(new Date(item.dateOfChange!).toDateString()) >=
            new Date(new Date(parseInt(filters.dateFrom!)).toDateString())
        )
      : newLicenses;
    newLicenses = filters.dateTo
      ? newLicenses.filter(
          (item) =>
            new Date(new Date(item.dateOfChange!).toDateString()) <=
            new Date(new Date(parseInt(filters.dateTo!)).toDateString())
        )
      : newLicenses;
    setFilteredLicenses(newLicenses);
  };

  return (
    <FILicenseMainPage
      fi={fi}
      licenseLength={licenseLength}
      loading={loading}
      onFilterClick={onFilterClick}
      onDeleteFunction={onDeleteFunction}
      onLicenseItemClick={onLicenseItemClick}
      isDeleteModalOpen={isDeleteModalOpen}
      setIsDeleteModalOpen={setIsDeleteModalOpen}
      licenses={filteredLicenses}
      setLicenses={(val) => {
        setLicenses(val);
        setFilteredLicenses(val);
      }}
      updateDefaultLicense={updateDefaultLicense}
      onSearchClick={onSearchClick}
      onClearFunc={onClearFunc}
    />
  );
};

const mapStateToProps = (state: any) => ({
  fi: state.getIn(["fi", "fi"]),
});

const dispatchToProps = () => ({});

export default connect(mapStateToProps, dispatchToProps)(FILicenseContainer);
