import { Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import DatePicker from "../../common/Field/DatePicker";
import TextField from "../../common/Field/TextField";
import React, { useEffect, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import useConfig from "../../../hoc/config/useConfig";
import { Box } from "@mui/system";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { useDropzone } from "react-dropzone";
import SelectorBtn from "../../common/Button/SelectorBtn";
import LegislativeDocChooser from "./LegislativeDocChooser";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import Tooltip from "../../common/Tooltip/Tooltip";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import {
  CatalogCreateLegislativeDoc,
  CatalogCreateMeta,
} from "../../../types/catalog.type";

interface CatalogCreateMetaDataInfoProps {
  editMode: boolean;
  metaInfoRef: Partial<CatalogCreateMeta>;
  activeStep: number;
  onMetaInfoChange(key: string, value: any): void;
}

const FILE_NAME_PATTER = "^.*\\.(xlsx|XLSX|pdf|docx)$";

const StyledRoot = styled(Grid)(() => ({
  padding: 16,
  overflowX: "hidden",
  paddingLeft: "32px",
}));

const StyledTypography = styled(Typography)(({ theme }: any) => ({
  marginLeft: "10px",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  maxWidth: "600px !important",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  color: theme.palette.secondaryTextColor,
}));

const StyledFooter = styled(Grid)({
  display: "flex",
  alignItems: "flex-end",
  paddingLeft: "0px !important",
  justifyContent: "space-between",
  width: "100%",
});

const StyledAttachmentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(52, 66, 88, 1)" : "#e9ebef",
  borderRadius: 8,
  padding: "0px 10px",
  height: "37px",
  maxWidth: "260px",
  flex: 1,
}));

const StyledAttachmentIcon = styled(TextSnippetIcon)(({ theme }) => ({
  "& .MuiSvgIcon-root": {
    width: "14px",
    height: "14px",
  },
  color: theme.palette.primary.main,
  marginLeft: "14px",
}));

const StyledAttachmentBoxItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  flex: 1,
});

const StyledDiv = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  width: "calc(100% - 45%)",
  alignItems: "center",
});

const CatalogCreateMetaDataInfo: React.FC<CatalogCreateMetaDataInfoProps> = ({
  editMode,
  onMetaInfoChange,
  metaInfoRef,
  activeStep,
}) => {
  const { getDateFormat } = useConfig();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [metaInfo, setMetaInfo] = useState<Partial<CatalogCreateMeta>>();
  const [file, setFile] = useState<File | null | string>();

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    disabled: false,
    noKeyboard: true,
    maxFiles: 1,
  });

  useEffect(() => {
    addFile(acceptedFiles);
  }, [acceptedFiles]);

  useEffect(() => {
    setMetaInfo(
      metaInfoRef
        ? metaInfoRef
        : {
            replacesCatalog: "",
            validTill: null,
            legislativeDocument: { fileName: "", id: null },
            formData: null,
            file: null,
            format: getDateFormat(true),
          }
    );
    setFile(editMode && hasFile() ? metaInfoRef?.file?.file?.name : null);
  }, [editMode, activeStep]);

  const hasFile = () => {
    return metaInfo?.file?.file?.name;
  };

  const uploadFile = (formData: FormData, file: any) => {
    onMetaInfoChange("formData", formData);
    onMetaInfoChange("file", file);
    setMetaInfo({ ...metaInfo, formData: formData, file: file });
  };

  const removeFile = () => {
    onMetaInfoChange("file", null);
    setMetaInfo({ ...metaInfo, formData: null, file: null });
    setFile(null);
  };

  const setValueFunction = (value: CatalogCreateLegislativeDoc) => {
    onMetaInfoChange("legislativeDocument", value);
    setMetaInfo({ ...metaInfo, legislativeDocument: value });
  };

  const onFileUpload = async (currentFile: any) => {
    if (currentFile.isValid) {
      setFile(currentFile);
      let formData = new FormData();
      formData.append("file", currentFile.file);
      try {
        uploadFile(formData, currentFile);
      } catch (error) {
        openErrorWindow(error);
      }
    } else {
      enqueueSnackbar("Invalid File", { variant: "error" });
    }
  };

  const validateName = (name: string) => {
    for (let p of [FILE_NAME_PATTER]) {
      if (new RegExp(`^${p}$`).test(name)) {
        return { isValid: true, invalidText: "" };
      }
    }
    return { isValid: false, invalidText: t("invalidFileName") };
  };

  const addFile = (f: File[]) => {
    if (!f || f.length === 0) {
      return;
    }

    let tmpFile = { id: f[0].name, file: f[0], ...validateName(f[0].name) };
    onFileUpload(tmpFile);
  };

  return (
    <StyledRoot
      container
      direction={"row"}
      spacing={2}
      data-testid={"meta-data-container"}
    >
      <Box
        sx={{
          width: "100%",
          "& .MuiGrid-item": {
            marginTop: "12px",
          },
        }}
      >
        <Grid xs={12} item key={"ancestorCatalogInfo"} marginTop={"14px"}>
          <TextField
            label={t("replacesCatalog")}
            value={metaInfo?.replacesCatalog}
            onChange={(value: string) =>
              onMetaInfoChange("replacesCatalog", value)
            }
            size={"default"}
            fieldName={"replaces-catalog"}
          />
        </Grid>
        <Grid
          xs={12}
          item
          key={"validTill"}
          sx={{
            "& .MuiIconButton-root": {
              marginRight: "0px !important",
            },
          }}
        >
          <DatePicker
            label={t("validTill")}
            value={metaInfo?.validTill}
            onChange={(value) => onMetaInfoChange("validTill", value)}
            format={metaInfo?.format}
            size={"default"}
            data-testid={"valid-till"}
          />
        </Grid>
        <Grid xs={12} item key={"legislativeBasisFile"}>
          <LegislativeDocChooser
            metaInfo={metaInfo}
            setValueFunction={setValueFunction}
          />
        </Grid>
      </Box>
      <StyledFooter xs={12} item key={"addFile"}>
        <StyledDiv>
          <Box style={{ display: "flex", flex: "1" }}>
            <Box {...getRootProps()}>
              <input {...getInputProps()} data-testid={"attachment-input"} />
              <Box
                display={"flex"}
                justifyContent={"center"}
                width={"fit-content"}
                flexDirection={"column"}
              >
                <Box display={"flex"} justifyContent={"center"}>
                  <Box>
                    <SelectorBtn
                      label={t("browseFile")}
                      isDisabled={Boolean(file)}
                      onClick={open}
                      style={{ maxWidth: "120px" }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          {metaInfo && metaInfo?.file?.file?.name && (
            <StyledAttachmentBox>
              <StyledAttachmentBoxItem>
                <StyledAttachmentIcon />
              </StyledAttachmentBoxItem>

              <Tooltip title={metaInfo.file?.file?.name}>
                <StyledTypography>{metaInfo.file?.file?.name}</StyledTypography>
              </Tooltip>
              <StyledAttachmentBoxItem justifyContent={"flex-end"}>
                <CloseRoundedIcon
                  style={{ cursor: "pointer", marginLeft: "2px" }}
                  onClick={() => removeFile()}
                />
              </StyledAttachmentBoxItem>
            </StyledAttachmentBox>
          )}
        </StyledDiv>
      </StyledFooter>
    </StyledRoot>
  );
};

export default CatalogCreateMetaDataInfo;
