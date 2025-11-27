import ClosableModal from "../../common/Modal/ClosableModal";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import GhostBtn from "../../common/Button/GhostBtn";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React, { useState } from "react";
import NumberField from "../../common/Field/NumberField";
import DatePicker from "../../common/Field/DatePicker";
import useConfig from "../../../hoc/config/useConfig";
import Select from "../../common/Field/Select";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { PeriodSubmitDataType, PeriodType } from "../../../types/period.type";
import { styled } from "@mui/material/styles";

interface PeriodDefinitionModalProps {
  open: boolean;
  handClose: () => void;
  onSave: (val: PeriodSubmitDataType) => void;
  periodTypes: PeriodType[];
  saveLoading: boolean;
}

const StyledRoot = styled(Box)(({ theme }: any) => ({
  display: "flex",
  flexDirection: "column",
  ...theme.ModalBody,
}));

const StyledFooter = styled(Box)(({ theme }: any) => ({
  ...theme.modalFooter,
  paddingTop: "10px",
  display: "flex",
  justifyContent: "flex-end",
}));

const StyledFieldBox = styled(Box)({
  marginTop: "8px",
});

const PeriodDefinitionModal: React.FC<PeriodDefinitionModalProps> = ({
  open,
  handClose,
  onSave,
  periodTypes,
  saveLoading,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const [data, setData] = useState<PeriodSubmitDataType>({
    id: 0,
  } as PeriodSubmitDataType);
  const [selectedType, setSelectedType] = useState<string>();

  const onChangeField = (key: string, value: any) => {
    setData({ ...data, [key]: value });
  };

  let periodData = [
    ...periodTypes.map((type) => {
      return { ...type, label: type.name, value: type.code };
    }),
  ];

  const disableSave = () => {
    const commonConditions = data?.periodType?.code && data["fromDate"];
    if (data.id) {
      return !Boolean(
        commonConditions && data["toDate"] && data["periodNumber"]
      );
    }
    if (selectedType === "ANY") {
      return !Boolean(
        commonConditions &&
          data["startPeriodNumber"] &&
          data["periodNumber"] &&
          data["daysInAPeriod"] &&
          typeof data["daysBetweenPeriod"] === "number"
      );
    }
    return !Boolean(
      commonConditions && data["startPeriodNumber"] && data["periodNumber"]
    );
  };

  return (
    <ClosableModal
      onClose={handClose}
      open={open}
      width={484}
      height={selectedType === "ANY" && !data.id ? 380 : 295}
      includeHeader={true}
      padding={0}
      title={t("createPeriodDefinition")}
      titleFontWeight={"600"}
      loading={saveLoading}
    >
      <Box>
        <StyledRoot>
          <StyledFieldBox marginTop={"0px !important"}>
            <Select
              label={t(`type`)}
              data={periodData}
              value={data?.periodType?.code}
              onChange={(code) => {
                const period = periodData.find((p) => p.code === code);
                onChangeField("periodType", period);
                setSelectedType(period?.periodType);
              }}
              size={"default"}
              data-testid={"type-input"}
            />
          </StyledFieldBox>
          {!data.id && (
            <StyledFieldBox>
              <DatePicker
                format={getDateFormat(true)}
                onChange={(val) =>
                  onChangeField("fromDate", String(new Date(val).getTime()))
                }
                size={"default"}
                label={t("startPeriod")}
                value={data["fromDate"]}
                data-testid={"start-period"}
              />
            </StyledFieldBox>
          )}

          {!data.id && (
            <StyledFieldBox>
              <NumberField
                onChange={(val) => onChangeField("startPeriodNumber", val)}
                label={t("startPeriodNumber")}
                size={"default"}
                value={data["startPeriodNumber"]}
                fieldName={"start-period-number"}
              />
            </StyledFieldBox>
          )}

          <StyledFieldBox>
            <NumberField
              onChange={(val) => onChangeField("periodNumber", val)}
              label={t("periodNumber")}
              value={data["periodNumber"]}
              size={"default"}
              fieldName={"period-number"}
            />
          </StyledFieldBox>

          {Boolean(data.id) && (
            <>
              <StyledFieldBox>
                <DatePicker
                  onChange={(val) =>
                    onChangeField("fromDate", String(new Date(val).getTime()))
                  }
                  label={t("startDate")}
                  size={"default"}
                  value={data["fromDate"]}
                  data-testid={"start-date"}
                />
              </StyledFieldBox>
              <StyledFieldBox>
                <DatePicker
                  onChange={(val) =>
                    onChangeField("toDate", String(new Date(val).getTime()))
                  }
                  label={t("endDate")}
                  value={data["toDate"]}
                  size={"default"}
                  data-testid={"end-date"}
                />
              </StyledFieldBox>
            </>
          )}

          {selectedType === "ANY" && !data.id && (
            <>
              <StyledFieldBox>
                <NumberField
                  onChange={(val) => onChangeField("daysInAPeriod", val)}
                  label={t("daysInAPeriod")}
                  size={"default"}
                  value={data["daysInAPeriod"]}
                  fieldName={"days-in-a-period"}
                />
              </StyledFieldBox>
              <StyledFieldBox>
                <NumberField
                  onChange={(val) => onChangeField("daysBetweenPeriod", val)}
                  label={t("daysBetweenPeriod")}
                  value={data["daysBetweenPeriod"]}
                  size={"default"}
                  fieldName={"days-between-period"}
                />
              </StyledFieldBox>
            </>
          )}
        </StyledRoot>
      </Box>
      <StyledFooter>
        <GhostBtn
          style={{ marginRight: "10px" }}
          onClick={handClose}
          data-testid={"cancel-button"}
        >
          {t("cancel")}
        </GhostBtn>
        <PrimaryBtn
          onClick={() => onSave(data)}
          disabled={disableSave()}
          endIcon={<ChevronRightIcon />}
          data-testid={"save-button"}
        >
          {t("save")}
        </PrimaryBtn>
      </StyledFooter>
    </ClosableModal>
  );
};

export default PeriodDefinitionModal;
