import { Box, Grid } from "@mui/material";
import FiInput from "../../../../Common/FiInput";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { FieldType } from "../../../../util/FiUtil";
import CurrencyList from "../../../../../common/List/CurrencyList";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FIBeneficiaryItemDetails from "./FIBeneficiaryItemDetails";
import React from "react";
import { useTranslation } from "react-i18next";
import { BeneficiariesDataType } from "../../../../../../types/fi.type";
import { PhysicalPersonDataType } from "../../../../../../types/physicalPerson.type";
import { FinalBeneficiaryType } from "./FIBeneficiaryItem";
import { LegalPersonDataType } from "../../../../../../types/legalPerson.type";

interface FIBeneficiaryDetailsProps {
  share: number | null | string;
  generalInfoEditMode: boolean;
  setShare: (share: number) => void;
  setCurrency: (currency: string) => void;
  currency: string | null;
  shareNominal: number | null | string;
  setShareNominal: (shareNominal: string) => void;
  date?: number;
  setDate: (date: number) => void;
  selectedBeneficiary?: BeneficiariesDataType;
  selectedTypeItem?: LegalPersonDataType | PhysicalPersonDataType;
  physicalPersons: PhysicalPersonDataType[];
  finallBeneficiaryData: FinalBeneficiaryType[];
  setFinallBeneficiaryData: (data: FinalBeneficiaryType[]) => void;
  saveGeneral: (beneficiaries: FinalBeneficiaryType[] | null) => void;
  personType: string | null;
  finallBeneficiaryFormState: string;
  setFinallBeneficiaryFormState: (state: string) => void;
}

const FIBeneficiaryDetails: React.FC<FIBeneficiaryDetailsProps> = ({
  share,
  generalInfoEditMode,
  setShare,
  setCurrency,
  currency,
  shareNominal,
  setShareNominal,
  date,
  setDate,
  selectedBeneficiary,
  physicalPersons,
  finallBeneficiaryData,
  setFinallBeneficiaryData,
  saveGeneral,
  personType,
  finallBeneficiaryFormState,
  setFinallBeneficiaryFormState,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      style={{
        overflowY: "auto",
        height: `100%`,
      }}
    >
      <Grid container p={"8px 12px"}>
        <Grid item xs={12} lg={3}>
          <div style={{ padding: "4px" }}>
            <FiInput
              title={t("sharePercentage")}
              name={"share"}
              value={share}
              icon={<FingerprintIcon />}
              onValueChange={(value) => setShare(value)}
              editMode={generalInfoEditMode}
              inputTypeProp={{ inputType: FieldType.PERCENTAGE }}
              width={"100%"}
              error={share === null ? false : !share}
            />
          </div>
        </Grid>
        <Grid item xs={12} lg={3}>
          <div style={{ padding: "4px" }}>
            <CurrencyList
              setCurrency={setCurrency}
              generalInfoEditMode={generalInfoEditMode}
              currency={currency ?? ""}
              error={currency === null ? false : !currency}
            />
          </div>
        </Grid>
        <Grid item xs={12} lg={3}>
          <div style={{ padding: "4px" }}>
            <FiInput
              title={t("shareNominal")}
              name={"shareNominal"}
              value={shareNominal}
              icon={<ImportContactsIcon />}
              onValueChange={(value) => setShareNominal(value)}
              editMode={generalInfoEditMode}
              inputTypeProp={{
                inputType: FieldType.NUMBER,
                format: "#,##0.##########",
              }}
              width={"100%"}
              pattern={/^\d*\.?\d*$/}
            />
          </div>
        </Grid>
        <Grid item xs={12} lg={3}>
          <div style={{ padding: "4px" }}>
            <FiInput
              title={t("date")}
              name={"date"}
              value={date}
              icon={<CalendarTodayIcon />}
              onValueChange={(value) => setDate(value)}
              editMode={generalInfoEditMode}
              inputTypeProp={{
                inputType: FieldType.DATE,
              }}
              width={"100%"}
            />
          </div>
        </Grid>
      </Grid>

      {selectedBeneficiary && (
        <FIBeneficiaryItemDetails
          selectedBeneficiary={selectedBeneficiary}
          physicalPersons={physicalPersons}
          selectedLegalPerson={selectedBeneficiary?.legalPerson}
          selectedPhysicalPerson={selectedBeneficiary?.physicalPerson}
          finallBeneficiaryData={finallBeneficiaryData}
          setFinallBeneficiaryData={setFinallBeneficiaryData}
          saveGeneral={saveGeneral}
          personType={personType}
          finallBeneficiaryFormState={finallBeneficiaryFormState}
          setFinallBeneficiaryFormState={setFinallBeneficiaryFormState}
        />
      )}
    </Box>
  );
};

export default FIBeneficiaryDetails;
