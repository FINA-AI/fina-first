import React, { useEffect, useState } from "react";
import DetailForm, {
  FORM_STATE,
} from "../../../../../common/Detail/DetailForm";
import { useTranslation } from "react-i18next";
import { ITEM_TYPE } from "../../../../../common/Detail/DetailItem";
import { useSnackbar } from "notistack";
import LegalPersonLinkButton from "../../../../../common/Button/LegalPersonLinkButton";
import { LegalPersonDataType } from "../../../../../../types/legalPerson.type";
import { SharesDataType } from "../../../../../../types/fi.type";
import { CountryDataTypes } from "../../../../../../types/common.type";

interface FILegalPersonItemShareProps {
  selectedPerson: LegalPersonDataType;
  legalPersons?: LegalPersonDataType[];
  onSaveOtherShareFunction: (
    data: LegalPersonDataType,
    shares: SharesDataType[]
  ) => void;
  openLegalPersonPage?: boolean;
  countryData?: CountryDataTypes[];
  isEditValid: boolean;
  onModeChange?: (isEditMode: boolean) => void;
}

interface ShareItemWithErrors extends SharesDataType {
  errors?: Record<string, boolean>;
}

const FILegalPersonItemShare: React.FC<FILegalPersonItemShareProps> = ({
  selectedPerson,
  legalPersons = [],
  onSaveOtherShareFunction,
  openLegalPersonPage = false,
  countryData,
  isEditValid,
  onModeChange,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [shareFormState, setShareFormState] = useState(FORM_STATE.VIEW);
  const [shareData, setShareData] = useState<SharesDataType[]>([]);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const legalPersonData = legalPersons;

  useEffect(() => {
    setShareFormState(FORM_STATE.VIEW);
    loadCurrentShares();
  }, [selectedPerson]);

  const loadCurrentShares = () => {
    if (selectedPerson && selectedPerson.shares) {
      let newShareArray = selectedPerson.shares.map((item) => ({
        id: item.id,
        company: item.company,
        companyName: item.company?.name,
        identificationNumber: item.company?.identificationNumber,
        sharePercentage: item.sharePercentage,
        shareDate: item.shareDate,
        country: item.company?.country,
      }));
      setShareData([...newShareArray]);
    }
  };

  const onCancelFunction = () => {
    loadCurrentShares();
  };

  const shareFormItems = [
    {
      name: t("companyName"),
      dataIndex: "companyName",
      type: ITEM_TYPE.STRING,
      hidden: !(shareFormState === FORM_STATE.VIEW),
      renderCell: (obj: SharesDataType) => {
        return (
          !openLegalPersonPage && <LegalPersonLinkButton id={obj.company!.id} />
        );
      },
    },
    {
      name: t("personCreateId"),
      dataIndex: "identificationNumber",
      hidden: !(shareFormState === FORM_STATE.VIEW),
      type: ITEM_TYPE.NUMBER,
    },
    {
      name: t("idAndCompanyName"),
      dataIndex: "company",
      displayFieldName: "name",
      secondaryDisplayFieldName: "identificationNumber",
      secondaryDisplayFieldLabel: t("legalPersonId"),
      type: ITEM_TYPE.COMPANIES,
      hidden: shareFormState === FORM_STATE.VIEW,
      gridItem: 6,
      data: legalPersonData,
      required: true,
    },
    {
      name: t("sharePercentage"),
      dataIndex: "sharePercentage",
      type: ITEM_TYPE.PERCENTAGE,
      required: true,
    },
    { name: t("shareDate"), dataIndex: "shareDate", type: ITEM_TYPE.DATE },
  ];

  const onSaveShare = (editedItems: SharesDataType[]) => {
    let isAllFieldValid = true;

    editedItems.forEach((item: ShareItemWithErrors) => {
      if (!item.errors) {
        item.errors = {};
      }

      if (!item.company) {
        isAllFieldValid = false;
        item["errors"]["company"] = true;
      } else {
        item["errors"]["company"] = false;
      }

      if (!item.sharePercentage) {
        isAllFieldValid = false;
        item["errors"]["sharePercentage"] = true;
      } else {
        item["errors"]["sharePercentage"] = false;
      }
    });

    if (isAllFieldValid) {
      let newArray = [];
      for (let o of editedItems) {
        if (o.company) {
          let itemObj = {
            company: o.company,
            id: o.id ? o.id : 0,
            shareDate: o.shareDate,
            sharePercentage: o.sharePercentage,
            companyName: o.company.name,
            identificationNumber: o.company.identificationNumber,
          };

          newArray.push(itemObj);
        }
      }

      let valueArr = newArray.map(function (item) {
        return item.company.identificationNumber;
      });

      if (
        (editedItems.length !== 0 && valueArr.length !== 0) ||
        editedItems.length === 0
      ) {
        if (new Set(valueArr).size !== valueArr.length) {
          enqueueSnackbar(t("duplicateRecords"), { variant: "warning" });
        } else {
          onSaveOtherShareFunction(selectedPerson, newArray);
          setShareFormState(FORM_STATE.VIEW);
          setShareData(newArray);
        }
      }
      if (onModeChange) {
        onModeChange(false);
      }
    } else {
      enqueueSnackbar(t("requiredFieldsAreEmpty"), {
        variant: "error",
      });
      setShareData(editedItems);
    }
    setConfirmOpen(false);
  };

  return (
    <>
      <DetailForm
        title={t("otherShares")}
        name={"otherShares"}
        formItems={shareFormItems}
        data={shareData ? shareData : []}
        formState={shareFormState}
        setFormState={(value) => setShareFormState(value)}
        onCancel={() => onCancelFunction()}
        onSave={onSaveShare}
        isOpen={isConfirmOpen}
        setIsOpen={setConfirmOpen}
        isEditValid={isEditValid}
        mainRowItemNumber={5}
        countryData={countryData}
        isCancelModalOpen={isCancelModalOpen}
        setIsCancelModalOpen={setIsCancelModalOpen}
        textMaxWidth={300}
        onModeChange={onModeChange}
      />
    </>
  );
};

export default FILegalPersonItemShare;
