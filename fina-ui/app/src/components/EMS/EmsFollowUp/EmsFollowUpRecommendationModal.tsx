import { Box } from "@mui/system";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FollowUpRecommendationType } from "../../../types/followUp.type";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import DatePicker from "../../common/Field/DatePicker";
import Select from "../../common/Field/Select";
import TextField from "../../common/Field/TextField";
import ClosableModal from "../../common/Modal/ClosableModal";
import { EmsResultList } from "./EmsResultsList";
import { styled } from "@mui/material/styles";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface EmsFollowUpRecommendationModalProps {
  openModal: boolean;
  setOpenModal: SetState<boolean>;
  currRecommendation: FollowUpRecommendationType | null;
  saveRecommendation: (
    data: FollowUpRecommendationType,
    setOpenModal: SetState<boolean>,
    setErrorFields: SetState<{ [k: string]: boolean }>
  ) => void;
}

const StyledModalBox = styled(Box)({
  padding: "14px 16px",
  display: "flex",
  height: "100%",
  boxSizing: "border-box",
  flexDirection: "column",
  justifyContent: "space-between",
});

const EmsFollowUpRecommendationModal: React.FC<
  EmsFollowUpRecommendationModalProps
> = ({
  openModal,
  setOpenModal,
  currRecommendation,
  saveRecommendation,
}: EmsFollowUpRecommendationModalProps) => {
  const { t } = useTranslation();

  const [recommendationData, setRecommendationData] =
    useState<FollowUpRecommendationType>(
      currRecommendation
        ? currRecommendation
        : ({} as FollowUpRecommendationType)
    );
  const [errorFields, setErrorFields] = useState<{ [key: string]: boolean }>(
    {}
  );

  const onSubmitFunc = () => {
    saveRecommendation(recommendationData, setOpenModal, setErrorFields);
  };

  const onChangeValue = (key: string, v: string | number) => {
    let value;
    typeof v === "string" ? (value = v.trim()) : (value = v);

    setRecommendationData({
      ...recommendationData,
      [key]: value,
    });

    errorFields[key] = false;
  };

  return (
    <ClosableModal
      open={openModal}
      height={450}
      width={500}
      title={"add"}
      onClose={() => {
        setOpenModal(false);
      }}
    >
      <StyledModalBox>
        <Box>
          <Select
            size={"small"}
            onChange={(value) => onChangeValue("status", value)}
            value={recommendationData?.status}
            isError={errorFields["status"]}
            data={[
              { label: t("inprogress"), value: "IN_PROGRESS" },
              { label: t("done"), value: "COMPLETED" },
              {
                label: t("unfulfilled"),
                value: "UNFULFILLED",
              },
              { label: t("partiallycompleted"), value: "PARTIALLY_COMPLETED" },
            ]}
            label={t("status")}
            data-testid={"status-select"}
          />
        </Box>

        <Box>
          <Select
            size={"small"}
            onChange={(value) => onChangeValue("result", value)}
            value={recommendationData?.result}
            data={EmsResultList()}
            label={t("result")}
            isError={errorFields["result"]}
            data-testid={"result-select"}
          />
        </Box>
        <Box>
          <DatePicker
            label={t("deadline")}
            value={recommendationData?.deadLine}
            onChange={(value) =>
              onChangeValue("deadLine", value && value.getTime())
            }
            size={"small"}
            isError={errorFields["deadLine"]}
            data-testid={"deadline"}
          />
        </Box>
        <Box>
          <TextField
            label={t("recommendation")}
            value={recommendationData?.recommendation}
            isError={errorFields["recommendation"]}
            onChange={(value: any) => onChangeValue("recommendation", value)}
            size={"small"}
            multiline={true}
            rows={3}
            fieldName={"recommendation"}
          />
        </Box>
        <Box>
          <TextField
            label={t("note")}
            value={recommendationData?.note}
            onChange={(value: any) => onChangeValue("note", value)}
            size={"small"}
            multiline={true}
            rows={3}
            fieldName={"note"}
          />
        </Box>

        <Box
          sx={{
            paddingTop: "10px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <GhostBtn
            style={{ marginRight: "10px" }}
            onClick={() => {
              setOpenModal(false);
            }}
            data-testid={"cancel-button"}
          >
            {t("cancel")}
          </GhostBtn>
          <PrimaryBtn
            backgroundColor={"rgb(41, 98, 255)"}
            onClick={() => onSubmitFunc()}
            data-testid={"save-button"}
          >
            {t("save")}
          </PrimaryBtn>
        </Box>
      </StyledModalBox>
    </ClosableModal>
  );
};

export default EmsFollowUpRecommendationModal;
