import React, { useEffect, useState } from "react";
import { Box, styled } from "@mui/system";
import TextField from "../../common/Field/TextField";
import { useTranslation } from "react-i18next";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDropzone } from "react-dropzone";
import SelectionChip from "../../common/Chip/SelectionChip";
import {
  CategoryAttachmentType,
  CategoryType,
  LegislativeDocumentType,
  UploadDataType,
} from "../../../types/legislativeDocument.type";
import FileAttachmentBox from "../../Messages/Chat/FileAttachmentBox";
import { MAX_ALLOWED_FILE_SIZE } from "../../../util/appUtil";

interface UploadModalProps {
  onFileUpload: (category: CategoryType, uploadData: UploadDataType) => void;
  setIsUploadModalOpen: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      row: CategoryAttachmentType | CategoryType | null;
    }>
  >;
  row: CategoryAttachmentType | CategoryType | null;
  data: LegislativeDocumentType[];
}

const StyledRootBox = styled(Box)(() => ({
  height: "100%",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  boxSizing: "border-box",
}));

const StyledUploadContainer = styled(Box)(({ theme }: { theme: any }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 4,
  padding: 10,
  background:
    theme.palette.mode === "light" ? "rgba(240, 244, 255, 0.5)" : "#3c4d6896",
  border: "1px dashed #2962FF",
  marginTop: 8,
}));

const StyledFooter = styled(Box)(({ theme }: { theme: any }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 16px",
  ...theme.modalFooter,
}));

const StyledUploadText = styled(Typography)({
  color: "#98A7BC",
  fontWeight: 500,
  fontSize: 13,
  lineHeight: "16px",
  width: "fit-content",
  display: "flex",
  justifyContent: "center",
  padding: 6,
});

const StyledBrowseButton = styled(Box)({
  display: "flex",
  justifyContent: "center",
  width: 156,
  margin: 4,
});

const UploadModal: React.FC<UploadModalProps> = ({
  onFileUpload,
  setIsUploadModalOpen,
  row,
  data,
}) => {
  const { t } = useTranslation();
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    disabled: false,
    noKeyboard: true,
    // maxFiles: 1,
  });

  const [files, setFiles] = useState<File[] | []>([]);
  const [description, setDescription] = useState<string>("");
  const [sendNotification, setSendNotification] = useState<boolean>(false);
  const [signDocument, setSignDocument] = useState<boolean>(false);
  const [category, setCategory] = useState<CategoryType>();

  useEffect(() => {
    if (row && row.level === 2) {
      setDescription((row as CategoryAttachmentType).description);
      setSendNotification((row as CategoryAttachmentType).notify);
      setSignDocument((row as CategoryAttachmentType).sign);
      getCategory();
    }
  }, []);

  useEffect(() => {
    if (acceptedFiles) {
      setFiles((prevFiles) => [...(prevFiles || []), ...acceptedFiles]);
    }
  }, [acceptedFiles]);

  const removeFile = (indexToRemove: number) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const getCategory = () => {
    data.forEach((parent: LegislativeDocumentType) => {
      parent.children.forEach((category) => {
        if (
          category.children?.find(
            (categoryAttach) => categoryAttach.id === row?.id
          )
        ) {
          setCategory(category);
        }
      });
    });
  };

  const onSave = () => {
    const submitFiles = [
      ...files.filter((file) => !(file.size > MAX_ALLOWED_FILE_SIZE)),
    ];
    if (submitFiles) {
      let data: UploadDataType = {
        description,
        file: submitFiles,
        notify: sendNotification,
        sign: signDocument,
        id: row?.level === 2 ? (row.id as number) : 0,
      };
      if (row?.level === 2 && category) {
        onFileUpload(category, data);
      } else {
        onFileUpload(row as CategoryType, data);
      }
      setIsUploadModalOpen({ isOpen: false, row: null });
    }
  };

  return (
    <StyledRootBox>
      <Box
        sx={{
          overflow: "auto",
        }}
      >
        <Box sx={{ padding: "10px 16px" }}>
          <TextField
            onChange={(val: string) => {
              setDescription(val);
            }}
            value={description}
            multiline={true}
            rows={4}
            label={t("description")}
            fieldName={"description"}
          />
        </Box>
        <Box sx={{ padding: "8px 16px", paddingTop: 0 }}>
          <StyledUploadContainer {...getRootProps()} sx={{ height: 128 }}>
            <input {...getInputProps()} />
            <Box
              display={"flex"}
              justifyContent={"center"}
              width={"fit-content"}
              flexDirection={"column"}
            >
              <Box display={"flex"} justifyContent={"center"}>
                <StyledUploadText>
                  {`${t("dropToUpload")} ${t("or")}`}
                </StyledUploadText>
              </Box>
              <Box display={"flex"} justifyContent={"center"}>
                <StyledBrowseButton>
                  <PrimaryBtn
                    onClick={open}
                    startIcon={<AddIcon />}
                    children={<>{t("browseFiles")}</>}
                    disabled={row?.level === 2}
                    data-testid={"file-input-button"}
                  />
                </StyledBrowseButton>
              </Box>
            </Box>
          </StyledUploadContainer>
        </Box>

        {files && files.length > 0 && (
          <Box sx={{ marginTop: "12px", padding: "0px 16px" }}>
            <FileAttachmentBox files={files} open={true} remove={removeFile} />
          </Box>
        )}
      </Box>

      <StyledFooter>
        <Box display={"flex"} gap={"4px"} data-testid={"chips-container"}>
          <SelectionChip
            value={sendNotification}
            editMode={row?.level !== 2}
            title={"sendNotification"}
            setValue={setSendNotification}
          />
          <SelectionChip
            value={signDocument}
            editMode={row?.level !== 2}
            title={"signDocument"}
            setValue={setSignDocument}
          />
        </Box>
        <Box display={"flex"} gap={"4px"}>
          <GhostBtn
            onClick={() => {
              setIsUploadModalOpen({ isOpen: false, row: null });
            }}
            data-testid={"cancel-button"}
          >
            {t("cancel")}
          </GhostBtn>
          <PrimaryBtn
            disabled={
              row?.level === 2
                ? (row as CategoryAttachmentType).description === description
                : !files.length
            }
            onClick={onSave}
            data-testid={"save-button"}
          >
            {t("save")}
          </PrimaryBtn>
        </Box>
      </StyledFooter>
    </StyledRootBox>
  );
};

export default UploadModal;
