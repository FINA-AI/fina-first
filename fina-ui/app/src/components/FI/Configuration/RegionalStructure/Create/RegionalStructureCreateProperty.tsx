import ClosableModal from "../../../../common/Modal/ClosableModal";
import { Box, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "../../../../common/Field/TextField";
import GhostBtn from "../../../../common/Button/GhostBtn";
import PrimaryBtn from "../../../../common/Button/PrimaryBtn";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { RegionPropertiesType } from "../../../../../containers/FI/Configuration/RegionalStructure/RegionalStructureContainer";

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

const StyledFooter = styled(Box)(({ theme }: any) => ({
  padding: "10px",
  float: "right",
  ...theme.modalFooter,
}));

interface RegionalStructureCreatePropertyProps {
  title: string;
  open: boolean;
  handClose: (value?: boolean) => void;
  onSaveClick: (item: RegionPropertiesType) => void;
  selectedItem?: RegionPropertiesType;
  regionProperties: RegionPropertiesType[];
  editMode: boolean;
  setSelectedItem: (item: RegionPropertiesType | undefined) => void;
}

const RegionalStructureCreateProperty: React.FC<
  RegionalStructureCreatePropertyProps
> = ({
  title,
  handClose,
  onSaveClick,
  open,
  selectedItem,
  regionProperties,
  editMode,
  setSelectedItem,
}) => {
  const { t } = useTranslation();
  const [item, setItem] = useState(
    selectedItem ? selectedItem : { name: "", id: 0, level: "" }
  );

  const handleSave = () => {
    onSaveClick(item);
    handClose(false);
    setSelectedItem(undefined);
  };

  const getLevelValue = () => {
    if (regionProperties.length === 1) {
      return "Level 1";
    } else {
      if (editMode) {
        return selectedItem?.level;
      } else {
        let lastItem = regionProperties[regionProperties.length - 1].level;
        return selectedItem ? lastItem : `Level ${regionProperties.length}`;
      }
    }
  };

  return (
    <ClosableModal
      onClose={() => handClose}
      open={open}
      width={700}
      height={300}
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
                onChange={() => {}}
                value={getLevelValue()}
                fieldName={"level"}
                label={t("level")}
                isDisabled={true}
                size={"default"}
              />
            </Grid>
            <Grid item>
              <TextField
                onChange={(value: string) => setItem({ ...item, name: value })}
                value={selectedItem?.name}
                fieldName={"name"}
                label={t("name")}
                minLength={1}
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
            disabled={!Boolean(item.name)}
            endIcon={<DoneAllIcon style={{ width: 16, height: 14 }} />}
            children={<>{t("save")} &#160;</>}
          />
        </StyledFooter>
      </Box>
    </ClosableModal>
  );
};

export default RegionalStructureCreateProperty;
