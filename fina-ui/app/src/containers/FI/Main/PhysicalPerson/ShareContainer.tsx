import DetailForm, {
  FORM_STATE,
  FormItemProps,
} from "../../../../components/common/Detail/DetailForm";
import { useTranslation } from "react-i18next";
import React, { Fragment, useEffect, useState } from "react";
import { ITEM_TYPE } from "../../../../components/common/Detail/DetailItem";
import { useParams } from "react-router-dom";
import { updateFiPerson } from "../../../../api/services/fi/fiPersonService";
import LegalPersonLinkButton from "../../../../components/common/Button/LegalPersonLinkButton";
import { getAllLegalPersonSimple } from "../../../../api/services/fi/fiLegalPersonService";
import { useSnackbar } from "notistack";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import InfoModal from "../../../../components/common/Modal/InfoModal";
import { CheckListIcon } from "../../../../api/ui/icons/CheckListIcon";
import { SharesDataType } from "../../../../types/fi.type";
import { PhysicalPersonDataType } from "../../../../types/physicalPerson.type";
import { CountryDataTypes } from "../../../../types/common.type";
import { LegalPersonDataType } from "../../../../types/legalPerson.type";

interface ShareContainerProps {
  selectedPerson?: PhysicalPersonDataType;
  setSelectedPerson: (person: PhysicalPersonDataType) => void;
  isEditValid?: boolean;
  countries?: CountryDataTypes[];
  companies?: any[];
  textMaxWidth?: number;
}

const ShareContainer: React.FC<ShareContainerProps> = ({
  selectedPerson,
  setSelectedPerson,
  isEditValid = true,
  countries,
  companies,
  textMaxWidth,
}) => {
  const { t } = useTranslation();
  const { id } = useParams<{
    id: string;
  }>();

  const [shareFormState, setShareFormState] = useState(FORM_STATE.VIEW);
  const [shareData, setShareData] = useState<SharesDataType[]>([]);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [originalShares, setOriginalShares] = useState<SharesDataType[]>([]);
  const [companiesData, setCompaniesData] = useState<LegalPersonDataType[]>();
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();
  const [isPercentageInfoModalOpen, setPercentageInfoModalOpen] =
    useState(false);

  useEffect(() => {
    if (companies) {
      setCompaniesData([...companies]);
    } else {
      getAllLegalPersonSimple().then((resp) => {
        setCompaniesData(resp.data);
      });
    }
  }, []);

  useEffect(() => {
    if (selectedPerson && selectedPerson.shares) {
      setShareData(selectedPerson.shares.map((item) => ({ ...item })));
      setOriginalShares(selectedPerson.shares.map((item) => ({ ...item })));
    }
  }, [selectedPerson]);

  useEffect(() => {
    setShareFormState(FORM_STATE.VIEW);
  }, [selectedPerson?.id]);

  const shareFormItems: FormItemProps[] = [
    {
      name: t("company"),
      dataIndex: "company",
      type: ITEM_TYPE.COMPANIES,
      hidden: !(shareFormState === FORM_STATE.VIEW),
      data: companiesData ? companiesData : [],
      renderCell: (obj: any) => {
        return <LegalPersonLinkButton id={obj?.company?.id} />;
      },
    },
    {
      name: t("personCreateId"),
      dataIndex: "identificationNumber",
      hidden: !(shareFormState === FORM_STATE.VIEW),
      type: ITEM_TYPE.STRING,
      renderCell: (obj: any) => {
        return obj.company?.identificationNumber;
      },
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
      data: companiesData ? companiesData : [],
    },
    {
      name: t("sharePercentage"),
      dataIndex: "sharePercentage",
      type: ITEM_TYPE.PERCENTAGE,
      required: true,
    },
    {
      name: t("shareDate"),
      dataIndex: "shareDate",
      type: ITEM_TYPE.DATE,
    },
  ];

  const onCancelShare = () => {
    if (selectedPerson && selectedPerson.shares) {
      setShareData(originalShares?.map((item) => ({ ...item })));
    }
  };

  const onSaveShare = async (editedData: any) => {
    let isAllFieldValid = true;
    editedData.forEach((item: any) => {
      if (!item["errors"]) {
        item["errors"] = {};
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
      const originalShares = [...selectedPerson!.shares];
      try {
        let personResp = await updateFiPerson(id, {
          ...selectedPerson,
          shares: editedData,
        });
        selectedPerson!.shares = personResp.data.shares;
        setSelectedPerson(personResp.data);
      } catch (error: any) {
        const errorResp = error && error.response && error.response.data;
        if (errorResp && errorResp.code === "INVALID_VALUE") {
          setPercentageInfoModalOpen(true);
        } else {
          openErrorWindow(error, t("error"), true);
        }
        setShareData([...originalShares]);
      } finally {
        changeFormState(FORM_STATE.VIEW);
      }
    } else {
      setShareData([...editedData]);
      enqueueSnackbar(t("requiredFieldsAreEmpty"), { variant: "error" });
    }

    setConfirmOpen(false);
  };

  const changeFormState = (value: string) => {
    setShareFormState(value);
  };

  return (
    <Fragment>
      <DetailForm
        title={t("otherShares")}
        name={"otherShares"}
        formItems={shareFormItems}
        data={shareData}
        formState={shareFormState}
        setFormState={changeFormState}
        onCancel={onCancelShare}
        onSave={onSaveShare}
        isOpen={isConfirmOpen}
        setIsOpen={setConfirmOpen}
        isEditValid={isEditValid}
        countryData={countries}
        isCancelModalOpen={isCancelModalOpen}
        setIsCancelModalOpen={setIsCancelModalOpen}
        mainRowItemNumber={4}
        textMaxWidth={textMaxWidth}
      />
      {isPercentageInfoModalOpen && (
        <InfoModal
          bodyText={t("shareSumErrorMessage")}
          icon={<CheckListIcon />}
          onOkButtonClick={() => {
            setPercentageInfoModalOpen(false);
          }}
          isOpen={isPercentageInfoModalOpen}
          setIsOpen={setPercentageInfoModalOpen}
        />
      )}
    </Fragment>
  );
};

export default ShareContainer;
