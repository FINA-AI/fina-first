import ClosableModal from "../../common/Modal/ClosableModal";
import { Box, Grid, Typography } from "@mui/material";
import TextField from "../../common/Field/TextField";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import DoneIcon from "@mui/icons-material/Done";
import React, { useState } from "react";
import { SubMatrixOptionsDataType } from "../../../types/matrix.type";
import { useTranslation } from "react-i18next";
import Select from "../../common/Field/Select";
import NumberField from "../../common/Field/NumberField";
import styled from "@mui/system/styled";

const StyledRoot = styled(Box)(() => ({
  overflow: "auto",
}));

const StyledFooter = styled(Box)(({ theme }: { theme: any }) => ({
  padding: "10px",
  paddingRight: "20px",
  ...theme.modalFooter,
}));

const StyledCheckIcon = styled(DoneIcon)(() => ({
  width: 16,
  height: 14,
}));

const StyledContent = styled(Grid)(() => ({
  padding: 30,
}));

const StyledTitle = styled(Typography)(({ theme }: { theme: any }) => ({
  fontWeight: 600,
  paddingTop: "16px",
  paddingBottom: "16px",
  color:
    theme.palette.mode === "light" ? "rgb(89, 109, 137)" : "rgb(222,219,219)",
}));

interface SubMatrixOptionsModalProps {
  setEditModalDetails: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      data?: SubMatrixOptionsDataType;
    }>
  >;
  editModalDetails: {
    open: boolean;
    id?: number;
  };
  selectedCard: SubMatrixOptionsDataType | undefined;
  onSave: (submitData: SubMatrixOptionsDataType) => void;
}

const SubMatrixOptionsModal: React.FC<SubMatrixOptionsModalProps> = ({
  setEditModalDetails,
  editModalDetails,
  selectedCard,
  onSave,
}) => {
  const { t } = useTranslation();
  const [currData, setCurrData] = useState<SubMatrixOptionsDataType>(
    (selectedCard as SubMatrixOptionsDataType) || {}
  );
  const [vctTableEndConditions, setVctTableEndConditions] = useState(
    currData.vctTableEndConditions.length > 0
      ? currData.vctTableEndConditions.map((obj) => ({ ...obj }))
      : [
          { column: "", condition: "" },
          { column: "", condition: "" },
        ]
  );
  const onChangeValue = (
    key: keyof SubMatrixOptionsDataType,
    value: SubMatrixOptionsDataType[keyof SubMatrixOptionsDataType]
  ) => {
    setCurrData({
      ...currData,
      [key]: value,
    });
  };

  const disableSave = () => {
    let columnsValidation = vctTableEndConditions.every(
      (condition) => condition.column !== ""
    );

    if (currData.definitionTable.type) {
      if (currData.definitionTable.type === "MCT") {
        return false;
      } else {
        return Boolean(
          !(currData.startRow >= 0 && currData.startColumn && columnsValidation)
        );
      }
    } else {
      return true;
    }
  };

  return (
    <ClosableModal
      onClose={() => {
        setEditModalDetails({ open: false });
      }}
      open={editModalDetails.open}
      includeHeader={true}
      width={700}
      title={selectedCard ? t("edit") : t("Add")}
      disableBackdropClick={true}
    >
      <StyledRoot
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box display={"flex"} flex={1}>
          <StyledContent container spacing={2} direction={"row"}>
            <Grid item xs={12} display={"flex"}>
              <Grid item xs={6} display={"flex"} paddingRight={"16px"}>
                <Grid container spacing={2} direction={"column"}>
                  <Grid item>
                    <Select
                      size={"small"}
                      value={currData.definitionTable?.type}
                      data={[
                        { label: t("VCT"), value: "VCT" },
                        { label: t("MCT"), value: "MCT" },
                        { label: t("NT"), value: "NT" },
                        { label: t("UNKNOWN"), value: "UNKNOWN" },
                      ]}
                      label={t("type")}
                      disabled={!!selectedCard}
                      onChange={() => {}}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label={t("startcolumn")}
                      value={currData.startColumn}
                      onChange={(value: string) =>
                        onChangeValue("startColumn", value)
                      }
                      size={"small"}
                      isDisabled={currData.definitionTable.type === "MCT"}
                    />
                  </Grid>
                  <Grid item>
                    <NumberField
                      label={t("startrow")}
                      value={currData.startRow}
                      onChange={(value: any) =>
                        onChangeValue("startRow", value)
                      }
                      size={"small"}
                      isDisabled={currData.definitionTable.type === "MCT"}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={2} direction={"column"}>
                  <Grid item>
                    <TextField
                      label={t("vcttableheader")}
                      value={currData.vctTableHeader}
                      onChange={(value: string) =>
                        onChangeValue("vctTableHeader", value)
                      }
                      size={"small"}
                      isDisabled={currData.definitionTable.type === "MCT"}
                    />
                  </Grid>
                  <Grid item>
                    <NumberField
                      label={t("afterheaderrowAmount")}
                      value={currData.afterHeaderRowAmount}
                      onChange={(value: any) =>
                        onChangeValue("afterHeaderRowAmount", value)
                      }
                      size={"small"}
                      isDisabled={currData.definitionTable.type === "MCT"}
                    />
                  </Grid>
                  <Grid item>
                    <NumberField
                      label={t("offset")}
                      value={currData.offset}
                      onChange={(value: any) => onChangeValue("offset", value)}
                      size={"small"}
                      isDisabled={currData.definitionTable.type === "MCT"}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} display={"flex"}>
              <StyledTitle>{`${t("stopconditions")}:`}</StyledTitle>
            </Grid>
            <Grid item xs={12} display={"flex"}>
              <Grid item xs={6} paddingRight={"16px"}>
                <TextField
                  label={t("column")}
                  value={
                    vctTableEndConditions.length > 0
                      ? vctTableEndConditions[0].column
                      : ""
                  }
                  onChange={(value: string) => {
                    if (vctTableEndConditions.length > 0) {
                      vctTableEndConditions[0].column = value;
                      setVctTableEndConditions([...vctTableEndConditions]);
                    }
                  }}
                  size={"small"}
                  isDisabled={currData.definitionTable.type === "MCT"}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={t("stopcondition")}
                  value={
                    vctTableEndConditions.length > 0
                      ? vctTableEndConditions[0].condition
                      : ""
                  }
                  onChange={(value: string) => {
                    if (vctTableEndConditions.length > 0)
                      vctTableEndConditions[0].condition = value;
                    setVctTableEndConditions([...vctTableEndConditions]);
                  }}
                  size={"small"}
                  isDisabled={currData.definitionTable.type === "MCT"}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} display={"flex"}>
              <Grid item xs={6} paddingRight={"16px"}>
                <TextField
                  label={t("column")}
                  value={
                    vctTableEndConditions.length > 1
                      ? vctTableEndConditions[1].column
                      : ""
                  }
                  onChange={(value: string) => {
                    if (vctTableEndConditions.length > 1) {
                      vctTableEndConditions[1].column = value;
                      setVctTableEndConditions([...vctTableEndConditions]);
                    }
                  }}
                  size={"small"}
                  isDisabled={currData.definitionTable.type === "MCT"}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={t("stopcondition")}
                  value={
                    vctTableEndConditions.length > 1
                      ? vctTableEndConditions[1].condition
                      : ""
                  }
                  onChange={(value: string) => {
                    if (vctTableEndConditions.length > 1) {
                      vctTableEndConditions[1].condition = value;
                      setVctTableEndConditions([...vctTableEndConditions]);
                    }
                  }}
                  size={"small"}
                  isDisabled={currData.definitionTable.type === "MCT"}
                />
              </Grid>
            </Grid>
          </StyledContent>
        </Box>
        <StyledFooter
          display={"flex"}
          justifyContent={"end"}
          alignItems={"center"}
        >
          <GhostBtn
            onClick={() => {
              setEditModalDetails({ open: false });
            }}
            style={{ marginRight: "10px" }}
          >
            {t("cancel")}
          </GhostBtn>
          <PrimaryBtn
            onClick={() => {
              onSave({
                ...currData,
                id: currData.id ?? 0,
                vctTableEndConditions: vctTableEndConditions,
              });
              setEditModalDetails({ open: false });
            }}
            backgroundColor={"rgb(41, 98, 255)"}
            disabled={disableSave()}
            endIcon={<StyledCheckIcon />}
          >
            {t("save")}
          </PrimaryBtn>
        </StyledFooter>
      </StyledRoot>
    </ClosableModal>
  );
};

export default SubMatrixOptionsModal;
