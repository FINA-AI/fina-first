import { Box } from "@mui/system";
import TextField from "../../common/Field/TextField";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import ClosableModal from "../../common/Modal/ClosableModal";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { styled } from "@mui/material/styles";
import { FeedbackCategoryType } from "../../../types/feedback.type";

const StyledModalBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  height: "100%",
  boxSizing: "border-box",
  flexDirection: "column",
});

const StyledFooter = styled(Box)(({ theme }: any) => ({
  paddingTop: "10px",
  display: "flex",
  justifyContent: "flex-end",
  ...theme.modalFooter,
}));

interface EditCategoryModalProps {
  setIsAddNewOpen: React.Dispatch<
    React.SetStateAction<{ isOpen: boolean; card: FeedbackCategoryType }>
  >;
  isAddNewOpen: { isOpen: boolean; card: FeedbackCategoryType };
  editCategoryHandler: (newFeedback: FeedbackCategoryType) => void;
  saveCategoryHandler: (newFeedback: FeedbackCategoryType) => Promise<void>;
  currItem: FeedbackCategoryType;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  setIsAddNewOpen,
  isAddNewOpen,
  editCategoryHandler,
  saveCategoryHandler,
  currItem,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [name, setName] = useState(currItem?.name);

  useEffect(() => {
    if (currItem?.name) {
      setName(currItem.name);
    } else {
      setName("");
    }
  }, []);

  const addItemHandler = () => {
    if (name) {
      if (!currItem.id) {
        saveCategoryHandler({ id: 0, nameStrId: 0, name: name });
      } else {
        editCategoryHandler({ ...currItem, name: name });
      }
      setIsAddNewOpen({
        isOpen: false,
        card: { id: 0, name: "", nameStrId: 0 },
      });
    } else {
      enqueueSnackbar(t("requiredFieldsAreEmpty"), {
        variant: "error",
      });
    }
  };

  return (
    <ClosableModal
      onClose={() => {
        setIsAddNewOpen({
          isOpen: false,
          card: { id: 0, name: "", nameStrId: 0 },
        });
      }}
      open={isAddNewOpen.isOpen}
      title={!currItem?.id ? t("addFeedbackCategory") : t("editFeedback")}
      width={500}
      height={300}
    >
      <StyledModalBox>
        <Box padding={"14px 16px"}>
          <TextField
            value={name}
            label={t("name")}
            onChange={(val: string) => setName(val)}
            fieldName={"name"}
          />
        </Box>
        <StyledFooter>
          <GhostBtn
            style={{ marginRight: "10px" }}
            onClick={() => {
              setIsAddNewOpen({
                isOpen: false,
                card: { id: 0, name: "", nameStrId: 0 },
              });
            }}
            data-testid={"cancel-button"}
          >
            {t("cancel")}
          </GhostBtn>
          <PrimaryBtn onClick={addItemHandler} data-testid={"confirm-button"}>
            {!currItem?.id ? t("save") : t("edit")}
          </PrimaryBtn>
        </StyledFooter>
      </StyledModalBox>
    </ClosableModal>
  );
};

export default EditCategoryModal;
