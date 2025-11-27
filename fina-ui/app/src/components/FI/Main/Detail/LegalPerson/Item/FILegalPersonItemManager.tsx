import React, { useEffect, useState } from "react";
import DetailForm, {
  FORM_STATE,
} from "../../../../../common/Detail/DetailForm";
import { useTranslation } from "react-i18next";
import { ITEM_TYPE } from "../../../../../common/Detail/DetailItem";
import { useSnackbar } from "notistack";
import LegalPersonLinkButton from "../../../../../common/Button/LegalPersonLinkButton";
import PhysicalPersonLinkButton from "../../../../../common/Button/PhysicalPersonLinkButton";
import { ManagersDataType } from "../../../../../../types/fi.type";
import { LegalPersonDataType } from "../../../../../../types/legalPerson.type";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";

interface FILegalPersonItemManagerProps {
  selectedPerson: LegalPersonDataType;
  onSaveManagerFunction: (
    data: LegalPersonDataType,
    managers: ManagersDataType[]
  ) => void;
  physicalPerson?: PhysicalPersonDataType[];
  openLegalPersonPage?: boolean;
  isEditValid: boolean;
  onModeChange?: (isOpen: boolean) => void;
}

const FILegalPersonItemManager: React.FC<FILegalPersonItemManagerProps> = ({
  selectedPerson,
  onSaveManagerFunction,
  physicalPerson = [],
  openLegalPersonPage = false,
  isEditValid,
  onModeChange,
}) => {
  const [managerFormState, setManagerFormState] = useState(FORM_STATE.VIEW);
  const [managerData, setManagerData] = useState<ManagersDataType[]>([]);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const { t } = useTranslation();
  const legalPersonData = physicalPerson;
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setManagerFormState(FORM_STATE.VIEW);
    loadCurrentManager();
  }, [selectedPerson]);

  const loadCurrentManager = () => {
    if (selectedPerson?.managers) {
      const newShareArray = selectedPerson.managers.map(
        (item: ManagersDataType) => ({
          id: item.id,
          position: item.position,
          name: item.person?.name,
          identificationNumber: item.person?.identificationNumber
            ? Number(item.person.identificationNumber)
            : undefined,
          manager: item.person,
        })
      );
      setManagerData(newShareArray);
    }
  };

  const onCancelFunction = () => {
    loadCurrentManager();
  };

  const shareFormItems = [
    {
      name: t("position"),
      dataIndex: "position",
      type: ITEM_TYPE.STRING,
      required: true,
    },
    {
      name: t("name"),
      dataIndex: "name",
      hidden: !(managerFormState === FORM_STATE.VIEW),
      type: ITEM_TYPE.STRING,
      renderCell: (obj: any) => {
        return openLegalPersonPage ? (
          <LegalPersonLinkButton id={obj?.manager?.id} />
        ) : (
          <PhysicalPersonLinkButton id={obj?.manager?.id} />
        );
      },
    },
    {
      name: t("physAndLegalPersonId"),
      dataIndex: "identificationNumber",
      hidden: !(managerFormState === FORM_STATE.VIEW),
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("idAndManagerName"),
      dataIndex: "manager",
      displayFieldName: "name",
      secondaryDisplayFieldName: "identificationNumber",
      secondaryDisplayFieldLabel: t("legalPersonId"),
      hidden: managerFormState === FORM_STATE.VIEW,
      type: ITEM_TYPE.PERSONSELECT,
      size: "default",
      gridItem: 6,
      listData: legalPersonData,
      required: true,
    },
  ];

  const onSave = (editedItems: any[]) => {
    let isAllFieldValid = true;
    editedItems.forEach((item) => {
      if (!item["errors"]) {
        item["errors"] = {};
      }
      if (!item.manager) {
        isAllFieldValid = false;
        item["errors"]["manager"] = true;
      } else {
        item["errors"]["manager"] = false;
      }

      if (!item.position) {
        isAllFieldValid = false;
        item["errors"]["position"] = true;
      } else {
        item["errors"]["position"] = false;
      }
    });

    if (isAllFieldValid) {
      let newArray: any = [];
      for (let o of editedItems) {
        if (o.manager && o.position) {
          let itemObj = {
            id: o.id ? o.id : 0,
            company: selectedPerson,
            person: o.manager,
            position: o.position,
            name: o.manager?.name,
            identificationNumber: o.manager?.identificationNumber,
          };
          newArray.push(itemObj);
        }
      }

      let valueArr = newArray.map(function (item: any) {
        return item?.person.identificationNumber;
      });

      if (new Set(valueArr).size !== valueArr.length) {
        enqueueSnackbar(t("duplicateRecords"), { variant: "warning" });
      } else {
        onSaveManagerFunction(selectedPerson, newArray);
        setManagerFormState(FORM_STATE.VIEW);
        setManagerData(newArray);
      }

      if (onModeChange) {
        onModeChange(false);
      }
    } else {
      setManagerData([...editedItems]);
      enqueueSnackbar(t("requiredFieldsAreEmpty"), {
        variant: "error",
      });
    }

    setConfirmOpen(false);
  };

  return (
    <>
      <DetailForm
        title={t("branchFieldmanager")}
        name={"branchFieldmanager"}
        formItems={shareFormItems}
        data={managerData ? managerData : []}
        formState={managerFormState}
        setFormState={(value) => setManagerFormState(value)}
        onCancel={() => onCancelFunction()}
        onSave={onSave}
        isOpen={isConfirmOpen}
        setIsOpen={setConfirmOpen}
        isEditValid={isEditValid}
        mainRowItemNumber={5}
        isCancelModalOpen={isCancelModalOpen}
        setIsCancelModalOpen={setIsCancelModalOpen}
        onModeChange={onModeChange}
      />
    </>
  );
};

export default FILegalPersonItemManager;
