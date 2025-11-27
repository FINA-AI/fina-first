import DetailForm, {
  FORM_STATE,
} from "../../../../components/common/Detail/DetailForm";
import { useTranslation } from "react-i18next";
import { ITEM_TYPE } from "../../../../components/common/Detail/DetailItem";
import React, { Fragment, useEffect, useState } from "react";
import { updateFiPerson } from "../../../../api/services/fi/fiPersonService";
import { useParams } from "react-router-dom";
import LegalPersonLinkButton from "../../../../components/common/Button/LegalPersonLinkButton";
import { getAllLegalPersonSimple } from "../../../../api/services/fi/fiLegalPersonService";
import { useSnackbar } from "notistack";
import { PhysicalPersonDataType } from "../../../../types/physicalPerson.type";
import { LegalPersonDataType } from "../../../../types/legalPerson.type";
import { PositionDataType } from "../../../../types/fi.type";

interface PositionContainerProps {
  selectedPerson?: PhysicalPersonDataType;
  setSelectedPerson: (person: PhysicalPersonDataType) => void;
  isEditValid?: boolean;
  companies?: LegalPersonDataType[];
  textMaxWidth?: number;
}

const PositionContainer: React.FC<PositionContainerProps> = ({
  selectedPerson,
  setSelectedPerson,
  isEditValid = true,
  companies,
  textMaxWidth,
}) => {
  const { t } = useTranslation();
  const { id } = useParams<{
    id: string;
  }>();

  const [positionFormState, setPositionFormState] = useState(FORM_STATE.VIEW);
  const [positionData, setPositionData] = useState<PositionDataType[]>([]);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [originalPositionData, setOriginalPositionData] = useState<
    PositionDataType[]
  >([]);
  const [companiesData, setCompaniesData] = useState<LegalPersonDataType[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (companiesData?.length === 0) {
      if (companies && companies.length > 0) {
        setCompaniesData(companies);
      } else {
        getAllLegalPersonSimple().then((resp) => {
          setCompaniesData(resp.data);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (selectedPerson && selectedPerson.positions) {
      setPositionData(selectedPerson.positions.map((item) => ({ ...item })));
      setOriginalPositionData(
        selectedPerson.positions.map((item) => ({ ...item }))
      );
    }
  }, [selectedPerson]);

  const positionsFormItems = [
    {
      name: t("company"),
      dataIndex: "company",
      type: ITEM_TYPE.COMPANIES,
      hidden: !(positionFormState === FORM_STATE.VIEW),
      data: companiesData,
      renderCell: (obj: any) => {
        return <LegalPersonLinkButton id={obj.company?.id} />;
      },
    },
    {
      name: t("personCreateId"),
      type: ITEM_TYPE.STRING,
      hidden: !(positionFormState === FORM_STATE.VIEW),
      renderCell: (obj: any) => {
        return obj.company?.identificationNumber;
      },
      dataIndex: "personCreateId",
    },
    {
      name: t("idAndCompanyName"),
      dataIndex: "company",
      displayFieldName: "name",
      secondaryDisplayFieldName: "identificationNumber",
      secondaryDisplayFieldLabel: t("legalPersonId"),
      type: ITEM_TYPE.COMPANIES,
      hidden: positionFormState === FORM_STATE.VIEW,
      gridItem: 6,
      data: companiesData,
      required: true,
    },
    {
      name: t("position"),
      dataIndex: "position",
      type: ITEM_TYPE.STRING,
    },
    {
      name: t("electionDate"),
      dataIndex: "electionDate",
      type: ITEM_TYPE.DATE,
    },
  ];

  const onCancelPosition = async () => {
    setPositionData(originalPositionData?.map((item) => ({ ...item })));
  };

  const onSavePosition = async (editedData: any) => {
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
    });

    if (isAllFieldValid) {
      let personResp = await updateFiPerson(id, {
        ...selectedPerson,
        positions: editedData,
      });
      selectedPerson!.positions = personResp.data.positions;
      setSelectedPerson(personResp.data);
      setPositionData(personResp.data?.positions);
      setOriginalPositionData(personResp.data?.positions);
      changeFormState(FORM_STATE.VIEW);
    } else {
      enqueueSnackbar(t("requiredFieldsAreEmpty"), {
        variant: "error",
      });
      setPositionData([...editedData]);
    }
    setConfirmOpen(false);
  };

  const changeFormState = (value: string) => {
    setPositionFormState(value);
  };

  return (
    <Fragment>
      <DetailForm
        title={t("positionInOtherCompanies")}
        name={"positionInOtherCompanies"}
        formItems={positionsFormItems}
        data={positionData}
        formState={positionFormState}
        setFormState={changeFormState}
        onCancel={onCancelPosition}
        onSave={onSavePosition}
        isOpen={isConfirmOpen}
        setIsOpen={setConfirmOpen}
        isEditValid={isEditValid}
        isCancelModalOpen={isCancelModalOpen}
        setIsCancelModalOpen={setIsCancelModalOpen}
        textMaxWidth={textMaxWidth}
      />
    </Fragment>
  );
};

export default PositionContainer;
