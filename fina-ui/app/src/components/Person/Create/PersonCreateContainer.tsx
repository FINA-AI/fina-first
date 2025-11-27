import ClosableModal from "../../common/Modal/ClosableModal";
import PersonCreateForm from "./PersonCreateForm";
import { useTranslation } from "react-i18next";
import { createFiPerson } from "../../../api/services/fi/fiPersonService";
import { useSnackbar } from "notistack";
import { loadFirstLevel } from "../../../api/services/regionService";
import React, { useEffect, useState } from "react";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import RestoreLegalPersonModal from "../../common/Modal/RestoreLegalPersonModal";
import { restorePhysicalPerson } from "../../../api/services/personService";
import { PhysicalPersonDataType } from "../../../types/physicalPerson.type";
import { CountryDataTypes } from "../../../types/common.type";
import isEmpty from "lodash/isEmpty";

interface PersonCreateContainerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  afterSubmitSuccess?: (person: PhysicalPersonDataType) => void;
  persons: PhysicalPersonDataType[];
  setPersons: React.Dispatch<React.SetStateAction<PhysicalPersonDataType[]>>;
  countryData?: CountryDataTypes[];
  onChange: (val: any, fieldName?: string) => void;
}

export interface Person {
  citizenship: CountryDataTypes;
  identificationNumber?: string;
  name: string;
  passportNumber: string;
  residentStatus: any;
  status?: string;
  personalId?: string;
  isError?: any;
}

const PersonCreateContainer: React.FC<PersonCreateContainerProps> = ({
  isOpen,
  setIsOpen,
  afterSubmitSuccess,
  persons,
  setPersons,
  countryData,
  onChange,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [countries, setCountries] = useState<CountryDataTypes[]>([]);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restorePerson, setRestorePerson] = useState<Person>();

  const onSave = (
    personItem: Person,
    setPersonItem: (person: Person) => void
  ) => {
    if (isValid(personItem)) {
      const data = {
        name: personItem.name,
        identificationNumber: personItem.personalId,
        passportNumber: personItem.passportNumber,
        residentStatus: personItem.residentStatus.key,
        citizenship: personItem.citizenship,
        status: "ACTIVE",
      };

      createFiPerson(-1, data)
        .then((res) => {
          setPersons([res.data, ...persons]);
          onChange(res.data);
          onCancel();
          enqueueSnackbar(t("personCreateSuccess"), {
            variant: "success",
          });
          if (afterSubmitSuccess) {
            afterSubmitSuccess(res.data);
          }
        })
        .catch((err) => {
          if (err.response.data.code === "ENTITY_PROGRAMMATICALLY_DELETED") {
            setRestorePerson(data);
            setRestoreModalOpen(true);
          } else {
            openErrorWindow(err, t("error"), true);
          }
        });
    } else {
      setPersonItem({ ...personItem });
      enqueueSnackbar(t("personCreateInvalidFormData"), {
        variant: "warning",
      });
    }
  };

  const onRestorePersonClick = () => {
    restorePhysicalPerson(0, restorePerson)
      .then((resp) => {
        onCancel();
        enqueueSnackbar(t("personCreateSuccess"), {
          variant: "success",
        });
        if (afterSubmitSuccess) {
          afterSubmitSuccess(resp.data);
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  const isValid = (personItem: Person) => {
    const mandatoryFields = [
      "name",
      "personalId",
      "residentStatus",
      "citizenship",
      "passportNumber",
    ];

    mandatoryFields.forEach((field) => {
      if (isEmpty(personItem[field as keyof Person]))
        personItem.isError[field] = true;
    });

    return !Object.entries(personItem.isError).some(([_, value]) => value);
  };

  const initCountries = async () => {
    await loadFirstLevel()
      .then((resp) => {
        setCountries(resp.data);
      })
      .catch((error) => enqueueSnackbar(error, { variant: "error" }));
  };

  useEffect(() => {
    if (!countryData) {
      initCountries();
    } else {
      setCountries(countryData);
    }
  }, []);

  return (
    <ClosableModal
      onClose={onCancel}
      open={isOpen}
      width={805}
      height={380}
      title={t("personCreateTitle")}
      includeHeader={true}
      disableBackdropClick={true}
    >
      <PersonCreateForm
        onCancel={onCancel}
        onSave={onSave}
        countries={countries}
      />
      <RestoreLegalPersonModal
        setIsModalOpen={setRestoreModalOpen}
        isModalOpen={restoreModalOpen}
        onRestore={() => {
          onRestorePersonClick();
        }}
        name={restorePerson?.name}
      />
    </ClosableModal>
  );
};

export default PersonCreateContainer;
