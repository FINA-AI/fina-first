import ClosableModal from "../../../../common/Modal/ClosableModal";
import { Box, Grid } from "@mui/material";
import GhostBtn from "../../../../common/Button/GhostBtn";
import PrimaryBtn from "../../../../common/Button/PrimaryBtn";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "../../../../common/Field/TextField";
import { styled } from "@mui/material/styles";
import { CountryItemType } from "../../../../../containers/FI/Configuration/RegionalStructure/RegionalStructureContainer";

const StyledFooter = styled(Box)(({ theme }: any) => ({
  float: "right",
  ...theme.modalFooter,
}));

const StyledHeader = styled(Box)(({ theme }: any) => ({
  fontWeight: "500",
  height: 40,
  fontSize: 14,
  "& .MuiSvgIcon-root": {
    cursor: "pointer",
    float: "right",
  },
  ...theme.modalHeader,
}));

interface Props {
  title: string;
  open: boolean;
  handClose: () => void;
  onSaveClick: (data: CountryItemType) => void;
  selectedItem: CountryItemType | null;
  editMode: boolean;
  isCountryItem: boolean;
  getFieldLevelName?: () => string;
}

const RegionalStructureCreateCountry: React.FC<Props> = ({
  title,
  handClose,
  onSaveClick,
  open,
  selectedItem,
  editMode,
  isCountryItem,
  getFieldLevelName,
}) => {
  const { t } = useTranslation();
  const [item, setItem] = useState<CountryItemType>(
    editMode && selectedItem
      ? selectedItem
      : {
          code: "",
          name: "",
          parentId: isCountryItem && selectedItem ? selectedItem.id : 0,
          id: 0,
          countryLevel:
            selectedItem?.countryLevel ?? selectedItem?.level ?? undefined,
          level: selectedItem?.level ?? 0,
        }
  );
  const [fieldsError, setFieldsError] = useState({ code: false, name: false });

  const handleSave = () => {
    if (item && item.name.length !== 0 && item.code.length !== 0) {
      onSaveClick(item);
      handClose();
    } else {
      if (item)
        setFieldsError({
          code: item.code.length === 0,
          name: item.name.length === 0,
        });
    }
  };

  return (
    <ClosableModal
      onClose={handClose}
      open={open}
      width={500}
      height={270}
      includeHeader={false}
    >
      <Box
        height={"100%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <StyledHeader
          display={"flex"}
          flex={0}
          flexDirection={"row"}
          justifyContent={"space-between"}
        >
          {title} <CloseIcon onClick={() => handClose()} />
        </StyledHeader>
        <Box display={"flex"} flex={1}>
          <Grid
            container
            spacing={2}
            direction={"column"}
            style={{ padding: 20 }}
          >
            <Grid item>
              <TextField
                onChange={(value: string) => setItem({ ...item, name: value })}
                value={item?.name}
                fieldName={"name"}
                label={getFieldLevelName ? getFieldLevelName() : t("country")}
                minLength={1}
                isError={fieldsError.name}
                size={"default"}
              />
            </Grid>
            <Grid item>
              <TextField
                onChange={(value: string) => setItem({ ...item, code: value })}
                value={item?.code}
                fieldName={"code"}
                label={t("identificationNumber")}
                minLength={1}
                isError={fieldsError.code}
                size={"default"}
              />
            </Grid>
          </Grid>
        </Box>
        <StyledFooter display={"flex"} flex={0} justifyContent={"flex-end"}>
          <GhostBtn onClick={() => handClose()}>{t("cancel")}</GhostBtn>
          &#160;&#160;
          <PrimaryBtn
            onClick={handleSave}
            endIcon={<DoneAllIcon style={{ width: 16, height: 14 }} />}
            children={<>{t("save")} &#160; </>}
          />
        </StyledFooter>
      </Box>
    </ClosableModal>
  );
};

export default RegionalStructureCreateCountry;
