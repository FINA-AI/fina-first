import ClosableModal from "../../common/Modal/ClosableModal";
import FILegalPersonCreateForm from "./FILegalPersonCreateForm";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { loadFirstLevel } from "../../../api/services/regionService";
import React, { useEffect, useState } from "react";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import RestoreLegalPersonModal from "../../common/Modal/RestoreLegalPersonModal";
import {
  createLegalPerson,
  restoreLegalPerson,
} from "../../../api/services/legalPersonService";
import { LegalPersonDataType } from "../../../types/legalPerson.type";
import { PhysicalPersonDataType } from "../../../types/physicalPerson.type";
import { CountryDataTypes } from "../../../types/common.type";

interface FILegalPersonCreateContainerProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onCancelFunction: VoidFunction;
  legalPersons: LegalPersonDataType[] | PhysicalPersonDataType[];
  setLegalPersons: (data: LegalPersonDataType[]) => void;
  onChange: (val: any, fieldName?: any) => void;
  submitSuccess?(legalPersonItem: LegalPersonDataType): void;
}

const FILegalPersonCreateContainer: React.FC<
  FILegalPersonCreateContainerProps
> = ({
  isModalOpen,
  setIsModalOpen,
  submitSuccess,
  onCancelFunction,
  legalPersons,
  setLegalPersons,
  onChange,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [countryData, setCountryData] = useState<CountryDataTypes[]>([]);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restorePerson, setRestorePerson] = useState<LegalPersonDataType>();

  useEffect(() => {
    initCountries();
  }, []);

  const initCountries = async () => {
    await loadFirstLevel()
      .then((resp) => {
        setCountryData(resp.data);
      })
      .catch((error) => enqueueSnackbar(error, { variant: "error" }));
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  const onSave = (legalPerson: any) => {
    if (legalPerson) {
      const data = {
        name: legalPerson.name,
        id: legalPerson.id,
        identificationNumber: legalPerson.identificationNumber,
        registrationNumber: legalPerson.registrationNumber,
        country: legalPerson.country,
        metaInfo: legalPerson.metaInfo,
        residentStatus: legalPerson?.residentStatus?.value,
        isError: legalPerson.isError,
      };

      createLegalPerson(data)
        .then((res) => {
          onCancel();
          enqueueSnackbar(t("personCreateSuccess"), {
            variant: "success",
          });
          onCancelFunction();
          onChange(res.data);
          setLegalPersons([res.data, ...legalPersons]);
        })
        .catch((err) => {
          if (err.response.data.code === "ENTITY_PROGRAMMATICALLY_DELETED") {
            setRestorePerson(legalPerson);
            setRestoreModalOpen(true);
          } else {
            openErrorWindow(err, t("error"), true);
          }
        });
    } else {
      enqueueSnackbar(t("personCreateInvalidFormData"), {
        variant: "warning",
      });
    }
  };

  const onRestorePersonClick = () => {
    const result = {
      country: restorePerson?.country,
      identificationNumber: restorePerson?.identificationNumber,
      name: restorePerson?.name,
    };
    restoreLegalPerson(0, result)
      .then((resp) => {
        if (submitSuccess) {
          submitSuccess(resp.data);
        }
        onCancelFunction();
        enqueueSnackbar(t("personCreateSuccess"), {
          variant: "success",
        });
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  return (
    <ClosableModal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      width={805}
      height={580}
      padding={10}
    >
      <FILegalPersonCreateForm
        onSave={onSave}
        onCancel={onCancel}
        countryData={countryData}
      />
      <RestoreLegalPersonModal
        setIsModalOpen={setRestoreModalOpen}
        isModalOpen={restoreModalOpen}
        onRestore={onRestorePersonClick}
        name={restorePerson?.name}
      />
    </ClosableModal>
  );
};

export default FILegalPersonCreateContainer;
