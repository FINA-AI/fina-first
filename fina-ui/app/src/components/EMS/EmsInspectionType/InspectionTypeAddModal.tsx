import ClosableModal from "../../common/Modal/ClosableModal";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "../../common/Field/TextField";
import React, { useState } from "react";
import GhostBtn from "../../common/Button/GhostBtn";
import CheckIcon from "@mui/icons-material/Check";
import { EmsInspectionType } from "../../../types/inspection.type";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { styled } from "@mui/material/styles";

interface ModalProps {
  currInspectionType: EmsInspectionType | null;
  showAddModal: boolean;
  setShowAddModal: (isShow: boolean) => void;
  onSubmitHandler: (inspectionType: {
    id?: number;
    names: string;
    descriptions: string;
  }) => void;
}

const StyledFooter = styled(Box)(({ theme }: any) => ({
  padding: 10,
  paddingRight: 20,
  ...theme.modalFooter,
}));

const InspectionTypeAddModal: React.FC<ModalProps> = ({
  currInspectionType,
  showAddModal,
  setShowAddModal,
  onSubmitHandler,
}) => {
  const { t } = useTranslation();
  const [inspectionType, setInspectionType] = useState(
    currInspectionType ?? { names: "", descriptions: "" }
  );

  const onChangeValue = (key: string, value: string) => {
    setInspectionType({
      ...inspectionType,
      [key]: value,
    });
  };

  return (
    <ClosableModal
      onClose={() => {
        setShowAddModal(false);
      }}
      open={showAddModal}
      includeHeader={true}
      width={400}
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
            <Grid item>
              <TextField
                label={t("name")}
                value={inspectionType?.names}
                onChange={(value: string) => onChangeValue("names", value)}
                size={"small"}
                isDisabled={currInspectionType}
                fieldName={"name"}
              />
            </Grid>
            <Grid item>
              <TextField
                label={t("description")}
                value={inspectionType?.descriptions}
                onChange={(value: string) =>
                  onChangeValue("descriptions", value)
                }
                size={"small"}
                multiline={true}
                rows={2}
                fieldName={"description"}
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
            onClick={() => {
              setShowAddModal(false);
            }}
            style={{ marginRight: "10px" }}
            data-testid={"cancel-button"}
          >
            {t("cancel")}
          </GhostBtn>
          <PrimaryBtn
            onClick={() => {
              onSubmitHandler(inspectionType);
              setShowAddModal(false);
            }}
            backgroundColor={"rgb(41, 98, 255)"}
            disabled={
              !inspectionType.names.length ||
              !inspectionType.descriptions.length
            }
            endIcon={
              <CheckIcon
                sx={{
                  width: 16,
                  height: 14,
                }}
              />
            }
            data-testid={"save-button"}
          >
            {t("save")}
          </PrimaryBtn>
        </StyledFooter>
      </Box>
    </ClosableModal>
  );
};

export default InspectionTypeAddModal;
