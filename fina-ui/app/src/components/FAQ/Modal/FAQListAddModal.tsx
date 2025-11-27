import { Box } from "@mui/system";
import TextField from "../../common/Field/TextField";
import SelectionChip from "../../common/Chip/SelectionChip";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { FaqListDataType } from "../../../types/faq.type";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";

interface FAQListAddModalProps {
  addCategory: (data: FaqListDataType, parentRow: FaqListDataType) => void;
  setOpenListAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
  editCategory: (
    id: number,
    listItem: FaqListDataType,
    selectedRow: FaqListDataType
  ) => void;
  isAdd: boolean;
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

const FAQListAddModal: FC<FAQListAddModalProps> = ({
  addCategory,
  setOpenListAddModal,
  data,
  editCategory,
  isAdd,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [isLeaf, setIsLeaf] = useState(false);
  const [name, setName] = useState<string | null>("");

  useEffect(() => {
    if (!isAdd) {
      setName(data.name);
      setIsLeaf(data.leaf);
    }
  }, [data]);

  const addListItem = () => {
    if (!name) {
      enqueueSnackbar(t("requiredFieldsAreEmpty"), { variant: "warning" });
      setName(null);
      return;
    }

    if (isAdd) {
      addCategory(
        {
          name,
          leaf: isLeaf,
          parentId: data.id,
        } as FaqListDataType,
        data
      );
    } else {
      editCategory(
        data.id,
        {
          id: data.id,
          name,
          leaf: isLeaf,
          parentId: data.parentId,
        } as FaqListDataType,
        data
      );
    }
    setOpenListAddModal(false);
  };

  return (
    <StyledRoot>
      <Box
        sx={{
          padding: "12px 16px",
          overflow: "auto",
        }}
      >
        <TextField
          label={t("categoryName")}
          value={name ?? ""}
          onChange={(val: string) => {
            setName(val);
          }}
          isError={name === null}
          fieldName={"categoryName"}
        />
        <Box pt={"8px"}>
          <SelectionChip
            value={isLeaf}
            setValue={setIsLeaf}
            title={"leaf"}
            editMode={true}
          />
        </Box>
      </Box>
      <StyledFooter>
        <GhostBtn
          onClick={() => {
            setOpenListAddModal(false);
          }}
          data-testid={"cancel-button"}
        >
          {t("cancel")}
        </GhostBtn>
        <PrimaryBtn onClick={addListItem} data-testid={"save-button"}>
          {t("save")}
        </PrimaryBtn>
      </StyledFooter>
    </StyledRoot>
  );
};

export default FAQListAddModal;
