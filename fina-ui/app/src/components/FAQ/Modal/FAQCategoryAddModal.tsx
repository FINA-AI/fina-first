import { Box } from "@mui/system";
import TextField from "../../common/Field/TextField";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { FaqDataType, FaqListDataType } from "../../../types/faq.type";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";

interface FAQCategoryAddModalProps {
  data: FaqDataType | null;
  selectedListItem?: FaqListDataType;
  addQuestion: (id: number, item: FaqDataType) => void;
  setIsCategoryAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editQuestion: (id: number, item: FaqDataType) => void;
}

const StyledRoot = styled(Box)({
  height: "100%",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  boxSizing: "border-box",
});

const StyledFooter = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "flex-end",
  padding: 8,
  gap: 12,
  ...theme.modalFooter,
}));

const FAQCategoryAddModal: FC<FAQCategoryAddModalProps> = ({
  data,
  addQuestion,
  selectedListItem,
  setIsCategoryAddModalOpen,
  editQuestion,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (data) {
      setQuestion(data.question);
      setAnswer(data.answer);
    }
  }, []);

  const addFaqItem = () => {
    if (!question || !answer) {
      enqueueSnackbar(t("requiredFieldsAreEmpty"), { variant: "warning" });
      return;
    }
    if (data?.id) {
      editQuestion(data.id, {
        ...data,
        question,
        answer,
      });
    } else {
      if (selectedListItem)
        addQuestion(selectedListItem.id, {
          ...(data as FaqDataType),
          question,
          answer,
          category: { id: selectedListItem.id },
        });
    }

    setIsCategoryAddModalOpen(false);
  };

  return (
    <StyledRoot>
      <Box sx={{ padding: "12px 16px", overflow: "auto" }}>
        <TextField
          value={question}
          label={t("question")}
          onChange={(val: string) => {
            setQuestion(val);
          }}
          multiline={true}
          rows={3}
          required
          fieldName={"question"}
        />
        <Box pt={"8px"}>
          <TextField
            value={answer}
            label={t("answer")}
            onChange={(val: string) => {
              setAnswer(val);
            }}
            multiline={true}
            rows={3}
            required
            fieldName={"answer"}
          />
        </Box>
      </Box>
      <StyledFooter>
        <GhostBtn
          onClick={() => {
            setIsCategoryAddModalOpen(false);
          }}
          data-testid={"cancel-button"}
        >
          {t("cancel")}
        </GhostBtn>
        <PrimaryBtn onClick={addFaqItem} data-testid={"save-button"}>
          {t("save")}
        </PrimaryBtn>
      </StyledFooter>
    </StyledRoot>
  );
};

export default FAQCategoryAddModal;
