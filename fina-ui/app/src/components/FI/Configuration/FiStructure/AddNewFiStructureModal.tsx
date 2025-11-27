import ClosableModal from "../../../common/Modal/ClosableModal";
import { Box, Grid } from "@mui/material";
import GhostBtn from "../../../common/Button/GhostBtn";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import TextField from "../../../common/Field/TextField";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { styled } from "@mui/material/styles";
import { FiStructureDataType } from "../../../../types/fi.type";

const StyledRoot = styled(Box)({
  height: "100%",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  boxSizing: "border-box",
  paddingTop: "6px",
});

const StyledFooter = styled(Box)(({ theme }: any) => ({
  padding: "10px",
  float: "right",
  ...theme.modalFooter,
}));

interface AddNewFiStructureModalProps {
  title: string;
  open: boolean;
  handClose: () => void;
  onSaveClick: (item: FiStructureDataType) => void;
  selectedItem?: FiStructureDataType | null;
}

interface ItemValidation {
  codeValid: boolean;
  nameValid: boolean;
}

const AddNewFiStructureModal: React.FC<AddNewFiStructureModalProps> = ({
  title,
  handClose,
  onSaveClick,
  open,
  selectedItem,
}) => {
  const [item, setItem] = useState<Partial<FiStructureDataType>>(
    selectedItem ?? {}
  );
  const [itemValid, setItemValid] = useState<ItemValidation>({
    codeValid: true,
    nameValid: true,
  });

  const { t } = useTranslation();

  const validateInput = (
    value: string,
    fieldName: keyof FiStructureDataType
  ): boolean => {
    const isValid = !!value && value.trim().length > 0;
    setItemValid((prev) => ({
      ...prev,
      [`${fieldName}Valid`]: isValid,
    }));
    return isValid;
  };

  const validateItem = (): boolean => {
    const codeValid = !!item.code && item.code.trim().length > 0;
    const nameValid = !!item.name && item.name.trim().length > 0;

    setItemValid({ codeValid, nameValid });

    return codeValid && nameValid;
  };

  const handleSave = () => {
    if (validateItem()) {
      onSaveClick(item as FiStructureDataType);
    }
  };

  const handleChange = (
    value: string,
    fieldName: keyof FiStructureDataType
  ) => {
    validateInput(value, fieldName);
    setItem((prev) => ({ ...prev, [fieldName]: value }));
  };

  return (
    <ClosableModal
      onClose={handClose}
      open={open}
      width={600}
      height={250}
      includeHeader={true}
      title={title}
    >
      <StyledRoot>
        <Box display={"flex"} flex={1} padding={"8px 16px"}>
          <Grid container spacing={2} direction={"column"}>
            <Grid item>
              <TextField
                onChange={(value: string) => handleChange(value, "code")}
                value={selectedItem?.code}
                fieldName={"code"}
                label={"code"}
                isError={!itemValid.codeValid}
                size={"default"}
              />
            </Grid>
            <Grid item>
              <TextField
                onChange={(value: string) => handleChange(value, "name")}
                value={selectedItem?.name}
                fieldName={"name"}
                label={"Description"}
                isError={!itemValid.nameValid}
                size={"default"}
              />
            </Grid>
          </Grid>
        </Box>
        <StyledFooter display={"flex"} flex={0} justifyContent={"flex-end"}>
          <GhostBtn data-testid="cancelBtn" onClick={() => handClose()}>
            {t("cancel")}
          </GhostBtn>
          &#160;&#160;
          <PrimaryBtn
            data-testid={"saveBtn"}
            onClick={handleSave}
            endIcon={<DoneAllIcon style={{ width: 16, height: 14 }} />}
            children={<>Save</>}
          />
        </StyledFooter>
      </StyledRoot>
    </ClosableModal>
  );
};

export default AddNewFiStructureModal;
