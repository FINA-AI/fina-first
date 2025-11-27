import React, { useEffect, useState } from "react";
import ClosableModal from "../../common/Modal/ClosableModal";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import TextField from "../../common/Field/TextField";
import { SanctionDataType } from "../../../types/sanction.type";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import CheckIcon from "@mui/icons-material/Check";
import Select from "../../common/Field/Select";
import { styled } from "@mui/material/styles";

interface EmsSanctionTypeModalProps {
  showAddModal: boolean;
  setShowAddModal: (isShow: boolean) => void;
  currSanctionType: SanctionDataType | null;
  onSubmitHandler: (sanctionType: SanctionDataType) => void;
  getSanctionTypesListHandler: () => void;
  sanctionTypesList: string[];
}

const StyledFooter = styled(Box)(({ theme }: any) => ({
  padding: 10,
  paddingRight: 20,
  ...theme.modalFooter,
}));

const EmsSanctionTypeModal: React.FC<EmsSanctionTypeModalProps> = ({
  showAddModal,
  setShowAddModal,
  currSanctionType,
  onSubmitHandler,
  getSanctionTypesListHandler,
  sanctionTypesList,
}) => {
  const { t } = useTranslation();

  const [sanctionType, setSanctionType] = useState(
    currSanctionType ?? { name: "", type: "" }
  );

  useEffect(() => {
    getSanctionTypesListHandler();
  }, []);

  const onChangeValue = (key: string, value: string) => {
    setSanctionType({
      ...sanctionType,
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
                value={sanctionType?.name}
                onChange={(value: string) => onChangeValue("name", value)}
                size={"small"}
                isDisabled={currSanctionType}
                fieldName={"name"}
              />
            </Grid>
            <Grid item>
              <Select
                data={sanctionTypesList?.map((item) => ({
                  label: t(item),
                  value: item,
                }))}
                value={currSanctionType?.type ?? ""}
                label={t("type")}
                onChange={(val: any) => onChangeValue("type", val)}
                data-testid={"type-select"}
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
              onSubmitHandler(sanctionType);
              setShowAddModal(false);
            }}
            backgroundColor={"rgb(41, 98, 255)"}
            disabled={!sanctionType.name.length}
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

export default EmsSanctionTypeModal;
