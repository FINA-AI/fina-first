import DetailForm, {
  FORM_STATE,
} from "../../../../components/common/Detail/DetailForm";
import { useTranslation } from "react-i18next";
import { ITEM_TYPE } from "../../../../components/common/Detail/DetailItem";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { PhysicalPersonDataType } from "../../../../types/physicalPerson.type";
import { CriminalRecordDataType } from "../../../../types/fi.type";
import { LegalPersonDataType } from "../../../../types/legalPerson.type";

interface CriminalRecordContainerProps {
  selectedPerson?: PhysicalPersonDataType | LegalPersonDataType;
  setSelectedPerson: (person: PhysicalPersonDataType) => void;
  isEditValid?: boolean;
  onSaveCriminalRecordFunction: (
    data: PhysicalPersonDataType | LegalPersonDataType,
    criminalRecord: CriminalRecordDataType[],
    id: number
  ) => any;
  onModeChange?: (value: boolean) => void;
}

const CriminalRecordContainer: React.FC<CriminalRecordContainerProps> = ({
  selectedPerson,
  setSelectedPerson,
  isEditValid = true,
  onSaveCriminalRecordFunction,
  onModeChange,
}) => {
  const { t } = useTranslation();
  const { id } = useParams<{
    id: string;
  }>();

  const [criminalRecordFormState, setCriminalRecordFormState] = useState(
    FORM_STATE.VIEW
  );
  const [criminalRecordData, setCriminalRecordData] = useState<
    CriminalRecordDataType[]
  >([]);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [originalCriminalRecords, setOriginalCriminalRecords] = useState<
    CriminalRecordDataType[]
  >([]);
  const { enqueueSnackbar } = useSnackbar();

  const Currencies = [{ name: "USD" }, { name: "GEL" }, { name: "COM" }];

  useEffect(() => {
    setCriminalRecordFormState(FORM_STATE.VIEW);
    if (selectedPerson && selectedPerson.criminalRecords) {
      setCriminalRecordData(
        selectedPerson.criminalRecords.map((item) => ({ ...item }))
      );
      setOriginalCriminalRecords(
        selectedPerson.criminalRecords.map((item) => ({ ...item }))
      );
    }
  }, [selectedPerson]);

  const criminalRecordFormItems = [
    {
      name: t("courtDecisionNumber"),
      dataIndex: "courtDecisionNumber",
      type: ITEM_TYPE.STRING,
      required: true,
    },
    {
      name: t("courtDecisionDate"),
      dataIndex: "courtDecisionDate",
      type: ITEM_TYPE.DATE,
    },
    {
      name: t("courtDecision"),
      dataIndex: "courtDecision",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("punishmentStartDate"),
      dataIndex: "punishmentStartDate",
      type: ITEM_TYPE.DATE,
    },
    {
      name: t("criminalType"),
      dataIndex: "type",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("fineAmount"),
      dataIndex: "fineAmount",
      type: ITEM_TYPE.NUMBER,
    },
    {
      name: t("fiBeneficiaryCurrency"),
      dataIndex: "currency",
      type: ITEM_TYPE.AUTOCOMPLETE,
      listData: Currencies,
      displayFieldName: "name",
    },
    {
      name: t("punishmentDate"),
      dataIndex: "punishmentDate",
      type: ITEM_TYPE.DATE,
    },
  ];

  const onCancelCriminalRecord = () => {
    setCriminalRecordData(
      originalCriminalRecords?.map((item) => ({ ...item }))
    );
  };

  const onSaveCriminalRecord = async (editedData: any) => {
    let isAllFieldValid = true;
    editedData.forEach((item: any) => {
      if (!item["errors"]) {
        item["errors"] = {};
      }
      if (item.currency.name) {
        item["currency"] = item.currency.name;
      }
      if (!item.courtDecisionNumber) {
        isAllFieldValid = false;
        item["errors"]["courtDecisionNumber"] = true;
      } else {
        item["errors"]["courtDecisionNumber"] = false;
      }
    });

    if (isAllFieldValid) {
      let personResp = await onSaveCriminalRecordFunction(
        selectedPerson!,
        editedData,
        Number(id)
      );
      if (personResp) {
        setOriginalCriminalRecords(personResp.data?.criminalRecords);
        setSelectedPerson(personResp.data);
        setCriminalRecordData(personResp.data?.criminalRecords);
        selectedPerson!.criminalRecords = personResp.data.criminalRecords;
      }
      changeFormState(FORM_STATE.VIEW);
      if (onModeChange) {
        onModeChange(false);
      }
    } else {
      setCriminalRecordData([...editedData]);
      enqueueSnackbar(t("requiredFieldsAreEmpty"), {
        variant: "error",
      });
    }
    setConfirmOpen(false);
  };

  const changeFormState = (value: string) => {
    setCriminalRecordFormState(value);
  };

  return (
    <Fragment>
      <DetailForm
        title={t("criminalRecord")}
        name={"criminalRecord"}
        formItems={criminalRecordFormItems}
        data={criminalRecordData}
        formState={criminalRecordFormState}
        setFormState={changeFormState}
        onCancel={onCancelCriminalRecord}
        onSave={onSaveCriminalRecord}
        isOpen={isConfirmOpen}
        setIsOpen={setConfirmOpen}
        isEditValid={isEditValid}
        isCancelModalOpen={isCancelModalOpen}
        setIsCancelModalOpen={setIsCancelModalOpen}
        onModeChange={onModeChange}
      />
    </Fragment>
  );
};

export default CriminalRecordContainer;
