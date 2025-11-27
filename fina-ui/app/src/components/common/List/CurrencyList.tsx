import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { FieldType } from "../../FI/util/FiUtil";
import React from "react";
import { useTranslation } from "react-i18next";
import FiInput from "../../FI/Common/FiInput";
import { Currencies } from "../../../util/appUtil";

interface CurrencyListProps {
  generalInfoEditMode: boolean;
  setCurrency: (value: string) => void;
  currency: string;
  error: boolean;
}

const CurrencyList: React.FC<CurrencyListProps> = ({
  setCurrency,
  generalInfoEditMode,
  currency,
  error,
}) => {
  const { t } = useTranslation();

  return (
    <FiInput
      title={t("fiBeneficiaryCurrency")}
      name={"currency"}
      value={currency}
      icon={<AttachMoneyIcon />}
      onValueChange={(value) => setCurrency(value)}
      editMode={generalInfoEditMode}
      inputTypeProp={{
        inputType: FieldType.LIST,
        listData: Currencies.map((e) => ({
          label: t(`currency${e}`),
          value: e,
        })),
      }}
      width={"100%"}
      error={error}
    />
  );
};

export default CurrencyList;
