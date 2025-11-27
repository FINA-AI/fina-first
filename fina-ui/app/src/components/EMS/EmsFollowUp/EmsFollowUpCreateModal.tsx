import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import ClosableModal from "../../common/Modal/ClosableModal";
import CheckIcon from "@mui/icons-material/Check";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  FollowupInspectionType,
  FollowUpType,
} from "../../../types/followUp.type";
import TextField from "../../common/Field/TextField";
import DatePicker from "../../common/Field/DatePicker";
import Select from "../../common/Field/Select";
import CustomAutoComplete from "../../common/Field/CustomAutoComplete";
import { getFormattedDateValue, getLanguage } from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import EmsTagField from "../Common/EmsTagField";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { loadFollowUpInspection } from "../../../api/services/ems/emsFollowUpService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { EmsFiProfileInspectionType } from "../../../types/emsFiProfile.type";
import { FieldSize } from "../../../types/common.type";
import { styled } from "@mui/material/styles";

interface EmsFollowUpCreateProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (note: string, data: FollowUpType) => void;
  defaultData: FollowUpType | null;
}

const StyledFooter = styled(Box)(({ theme }: any) => ({
  padding: 10,
  paddingRight: 20,
  ...theme.modalFooter,
}));

const EmsFollowUpCreateModal: React.FC<EmsFollowUpCreateProps> = ({
  isModalOpen,
  setIsModalOpen,
  onSave,
  defaultData,
}: EmsFollowUpCreateProps) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const { openErrorWindow } = useErrorWindow();
  const note = useRef("");
  const [followUpInspections, setFollowUpInspections] = useState<
    EmsFiProfileInspectionType[]
  >([]);
  const [data, setData] = useState<FollowUpType>({
    id: 0,
    inspection: {
      reclamationLetterDate: 0,
      reclamationLetterNumber: "",
      decreeNumber: "",
      decreeDate: 0,
      types: defaultData?.inspection?.types || [],
    },
    status: "",
    deadLine: 0,
    result: "",
    note: "",
    type: Object,
  });

  useEffect(() => {
    note.current = defaultData?.note ? defaultData?.note : "";
    if (defaultData) {
      setData(defaultData);
    }
    getFollowUpInspection();
  }, [defaultData]);

  const getFollowUpInspection = (): void => {
    loadFollowUpInspection()
      .then((res) => {
        setFollowUpInspections(res.data.list);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const status = [
    { label: t("inprogress"), value: "IN_PROGRESS" },
    { label: t("completed"), value: "COMPLETED" },
    {
      label: t("unfulfilled"),
      value: "UNFULFILLED",
    },
    {
      label: t("partiallycompleted"),
      value: "PARTIALLY_COMPLETED",
    },
  ];

  const results = [
    { label: t("conclusion"), value: "CONCLUSION" },
    { label: t("termextension"), value: "TERM_EXTENSION" },
    { label: t("fined"), value: "FINED" },
    { label: t("sentletter"), value: "SENT_LETTER" },
    { label: t("meeting"), value: "MEETING" },
    { label: t("onsiteinspection"), value: "ONSITE_INSPECTION" },
    { label: t("needsrespond"), value: "NEEDS_RESPOND" },
    { label: t("pending"), value: "PENDING" },
    { label: t("other"), value: "OTHER" },
    { label: t("notaccepted"), value: "NOT_ACCEPTED" },
    { label: t("done"), value: "DONE" },
  ];

  const onInspectionSelect = (
    selectedInspection: FollowupInspectionType
  ): void => {
    setData({ ...data, inspection: selectedInspection });
  };

  const isValidData = () => {
    return !Boolean(
      data?.inspection && data.status && data.result && data.deadLine
    );
  };

  const getTypesCallBack = useCallback(() => {
    const lng = getLanguage();
    if (data.inspection && data.inspection.types) {
      let types: string[] = [];
      data.inspection.types.forEach((item: any) => {
        types.push(item.descriptions[lng]);
      });

      return types;
    }
  }, [data.inspection]);

  const getSelectedInspection = () => {
    if (defaultData && defaultData.id > 0) {
      return defaultData?.inspection;
    }
  };

  const getInspectionDisplayFieldValue = (insp: EmsFiProfileInspectionType) => {
    let fiName = insp.fiName ? insp.fiName : "NONAME";
    return `${insp.fiCode} - ${fiName} - ${insp.decreeNumber}`;
  };

  return (
    <ClosableModal
      onClose={() => setIsModalOpen(false)}
      open={isModalOpen}
      includeHeader={true}
      width={600}
      title={t("Add")}
      disableBackdropClick={true}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box display={"flex"} flex={1}>
          <Grid container spacing={2} direction={"column"} padding={"30px"}>
            <Grid item data-testid={"select-inspection-container"}>
              <CustomAutoComplete
                label={`${t("selectinspection")}`}
                data={followUpInspections}
                selectedItem={getSelectedInspection()}
                displayFieldFunction={getInspectionDisplayFieldValue}
                valueFieldName={"id"}
                onChange={onInspectionSelect}
                size={FieldSize.SMALL}
                virtualized={true}
                onClear={() => {
                  setData({ ...data, inspection: undefined });
                }}
              />
            </Grid>
            <Grid item>
              <EmsTagField
                label={t("type")}
                disabled={true}
                onChange={() => {}}
                selectedOptions={getTypesCallBack() as any[]}
                size={FieldSize.SMALL}
              />
            </Grid>
            <Grid item style={{ display: "flex" }}>
              <Box paddingRight={"5px"} width={"100%"}>
                <TextField
                  label={t("decreenumber")}
                  value={data?.inspection?.decreeNumber}
                  onChange={() => {}}
                  size={FieldSize.SMALL}
                  isDisabled={true}
                  fieldName={"decree-number"}
                />
              </Box>
              <Box paddingLeft={"5px"} width={"100%"}>
                <TextField
                  label={t("decreedate")}
                  value={getFormattedDateValue(
                    data?.inspection?.decreeDate,
                    getDateFormat(true)
                  )}
                  onChange={() => {}}
                  size={FieldSize.SMALL}
                  isDisabled={true}
                  fieldName={"decree-date"}
                />
              </Box>
            </Grid>

            <Grid item style={{ display: "flex" }}>
              <Box paddingRight={"5px"} width={"100%"}>
                <TextField
                  label={t("reclamationletternumber")}
                  value={data?.inspection?.reclamationLetterNumber}
                  onChange={() => {}}
                  size={FieldSize.SMALL}
                  isDisabled={true}
                  fieldName={"reclamation-letter-number"}
                />
              </Box>
              <Box paddingLeft={"5px"} width={"100%"}>
                <TextField
                  label={t("reclamationletterdate")}
                  value={getFormattedDateValue(
                    data?.inspection?.reclamationLetterDate,
                    getDateFormat(true)
                  )}
                  onChange={() => {}}
                  size={FieldSize.SMALL}
                  isDisabled={true}
                  fieldName={"reclamation-letter-date"}
                />
              </Box>
            </Grid>
            <Grid item>
              <Select
                label={t("status")}
                value={data.status}
                size={FieldSize.SMALL}
                onChange={(selectedStatus) =>
                  data && setData({ ...data, status: selectedStatus })
                }
                data={status}
                data-testid={"status-select"}
              />
            </Grid>
            <Grid item>
              <Select
                label={t("result")}
                value={data.result}
                size={FieldSize.SMALL}
                onChange={(selectedResult) =>
                  data && setData({ ...data, result: selectedResult })
                }
                data={results}
                data-testid={"result-select"}
              />
            </Grid>
            <Grid item>
              <DatePicker
                label={t("deadline")}
                value={data?.deadLine}
                size={FieldSize.SMALL}
                onChange={(value) => {
                  data && setData({ ...data, deadLine: value.getTime() });
                }}
                data-testid={"deadline"}
              />
            </Grid>
            <Grid item>
              <TextField
                label={t("note")}
                value={data?.note}
                onChange={(value: string) => (note.current = value)}
                size={FieldSize.SMALL}
                multiline={true}
                rows={2}
                fieldName={"note"}
              />
            </Grid>
          </Grid>
        </Box>
        <StyledFooter
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <GhostBtn
            onClick={() => setIsModalOpen(false)}
            style={{ marginRight: "10px" }}
            data-testid={"cancel-button"}
          >
            {t("cancel")}
          </GhostBtn>
          <PrimaryBtn
            onClick={() => {
              data && onSave(note.current, data);
            }}
            backgroundColor={"rgb(41, 98, 255)"}
            disabled={isValidData()}
            endIcon={<CheckIcon sx={{ width: 16, height: 14 }} />}
            data-testid={"save-button"}
          >
            {t("save")}
          </PrimaryBtn>
        </StyledFooter>
      </Box>
    </ClosableModal>
  );
};

export default EmsFollowUpCreateModal;
