import { Box, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GhostBtn from "../../../../common/Button/GhostBtn";
import PrimaryBtn from "../../../../common/Button/PrimaryBtn";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ClosableModal from "../../../../common/Modal/ClosableModal";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FiLegalPersonSelect from "../LegalPerson/Select/FiLegalPersonSelect";
import PercentageField from "../../../../common/Field/PercentageField";
import DatePicker from "../../../../common/Field/DatePicker";
import { useSnackbar } from "notistack";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { LegalPersonDataType } from "../../../../../types/legalPerson.type";
import { OtherSharesDataType } from "../../../../../types/fi.type";

const StyledHeader = styled(Box)(({ theme }: any) => ({
  ...theme.modalHeader,
  fontWeight: 600,
  fontSize: 13,
  lineHeight: "20px",
  "& .MuiSvgIcon-root": {
    cursor: "pointer",
    float: "right",
    ...theme.smallIcon,
    color: "rgb(158, 158, 158)",
  },
}));

const StyledFooter = styled(Box)(({ theme }: any) => ({
  padding: "10px",
  float: "right",
  ...theme.modalFooter,
}));

interface OtherShareCreateFormProps {
  handClose: () => void;
  open: boolean;
  title: string;
  handleSave: (data: ShareFormData) => void;
  legalPersons: LegalPersonDataType[];
  selectedRow?: {
    data: OtherSharesDataType | null;
    isEdit: boolean;
  };
  isEdit: boolean;
  updateShareFunction: (data: ShareFormData) => void;
}

export interface ShareFormData {
  id?: number;
  legalPerson: LegalPersonDataType | null;
  share: string | number;
  date: string | number;
}

const OtherShareCreateForm: React.FC<OtherShareCreateFormProps> = ({
  handClose,
  open,
  title,
  handleSave,
  legalPersons,
  selectedRow = {},
  isEdit = false,
  updateShareFunction,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [legalPerson, setLegalPerson] = useState<LegalPersonDataType | null>(
    null
  );
  const [share, setShare] = useState<string | number>("");
  const [date, setDate] = useState<string | number>("");

  useEffect(() => {
    if (selectedRow.data) {
      setLegalPerson(selectedRow.data.company);
    }
    if (isEdit && selectedRow.data) {
      setShare(selectedRow.data.share);
      setDate(selectedRow.data.shareDate);
    }
  }, []);

  const onSave = (isEdit: boolean) => {
    if (!legalPerson?.id || !date || !share) {
      !legalPerson && setLegalPerson(null);
      !date && setDate("");
      !share && setShare("");
      enqueueSnackbar(t("requiredFieldsAreEmpty"), { variant: "error" });
    } else {
      const obj: ShareFormData = {
        legalPerson: legalPerson,
        share: share,
        date: date,
      };

      if (isEdit) {
        if (selectedRow.data) {
          obj.id = selectedRow.data.id;
        }
        updateShareFunction(obj);
      } else {
        obj.id = 0;
        handleSave(obj);
      }
      handClose();
    }
  };

  const isFieldDisabled: boolean =
    !!isEdit &&
    !!selectedRow.data?.shares &&
    selectedRow.data.shares.length !== 0;

  return (
    <ClosableModal
      onClose={handClose}
      open={open}
      width={500}
      height={250}
      includeHeader={false}
      padding={0}
    >
      <Box
        height={"100%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box>
          <StyledHeader
            display={"flex"}
            flex={0}
            flexDirection={"row"}
            justifyContent={"space-between"}
            padding={"12px 16px"}
          >
            {title} <CloseIcon onClick={() => handClose()} />
          </StyledHeader>
        </Box>
        <Box display={"flex"} height={"100%"} component={Paper}>
          <Grid container direction={"column"}>
            <Grid item p={"12px 16px 0px 16px"}>
              <FiLegalPersonSelect
                label={t(`chooseLegalPersonAndId`)}
                data={legalPersons}
                fieldName={"name"}
                selectedItem={legalPerson}
                disabled={selectedRow?.data !== null}
                onChange={(val) => setLegalPerson(val)}
                addOption={true}
                size={"default"}
                allowInvalidInputSelection
                isError={legalPerson === undefined}
              />
            </Grid>
            <Grid item p={"12px 16px 0px 16px"}>
              <PercentageField
                size={"default"}
                isDisabled={isFieldDisabled}
                value={share}
                label={t("sharePercentage")}
                fieldName={"id"}
                format={"#.###"}
                onChange={(value) => {
                  setShare(value);
                }}
                isError={share === undefined ? false : !share}
              />
            </Grid>
            <Grid item p={"12px 16px 0px 16px"}>
              <DatePicker
                value={date}
                size={"default"}
                label={t("date")}
                onChange={(value) => {
                  setDate(value.getTime().toString());
                }}
                isDisabled={isFieldDisabled}
                isError={date === undefined ? false : !date}
              />
            </Grid>
          </Grid>
        </Box>
        <StyledFooter display={"flex"} flex={0} justifyContent={"flex-end"}>
          <GhostBtn onClick={() => handClose()}>{t("cancel")}</GhostBtn>
          &#160;&#160;
          <PrimaryBtn
            onClick={() => onSave(isEdit)}
            disabled={isFieldDisabled}
            endIcon={<DoneAllIcon style={{ width: 16, height: 14 }} />}
            children={<>{t("save")} &#160;</>}
          />
        </StyledFooter>
      </Box>
    </ClosableModal>
  );
};

export default OtherShareCreateForm;
