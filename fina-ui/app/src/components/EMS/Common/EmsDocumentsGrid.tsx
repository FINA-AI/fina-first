import Box from "@mui/system/Box";
import { IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import EmsDocumentsGridModal from "./EmsDocumentsGridModal";
import DownloadIcon from "@mui/icons-material/Download";
import { deleteSanctionDocument } from "../../../api/services/ems/emsProfileSanctionService";
import useConfig from "../../../hoc/config/useConfig";
import { styled } from "@mui/material/styles";

interface EmsUploadDocumentProps {
  documents: any[];
  setDocuments: any;
  viewMode: boolean;
  fileExportHandler: (id: number) => void;
}

const StyledHeader = styled(Box)(({ theme }) => ({
  padding: "0px 15px",
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.primary.main : "#157fcc",
  color: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: "5px",
  height: 33,
}));

const StyledUploadContent = styled(Box)(({ theme }) => ({
  height: "70px",
  borderRadius: "5px",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  border: (theme as any).palette.borderColor,
}));

const StyledDocumentsWrapper = styled(Box)(({ theme }: any) => ({
  height: "35px",
  minHeight: "35px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: theme.palette.paperBackground,
  transition: "background 0.3s",
  "&:hover": {
    background: theme.palette.action.hover,
  },
  "&:nth-child(even)": {
    background: theme.palette.paperBackground,
    "&:hover": {
      background: theme.palette.action.hover,
    },
  },
  borderBottom: theme.palette.borderColor,
  paddingRight: "7px",
  paddingLeft: "7px",
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  border: "none",
  height: 22,
  width: 22,
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.action.hover : "#d4e3ff2b",
  },
}));

const EmsDocumentsGrid: React.FC<EmsUploadDocumentProps> = ({
  documents,
  setDocuments,
  viewMode,
  fileExportHandler,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [doc, setDoc] = useState<File[]>(documents);
  const { config } = useConfig() as any;

  let ecmEnabled = config.properties["ECM_ENABLED"];

  useEffect(() => {
    if (documents && documents.length > 0) {
      setDoc(documents);
    }
  }, [documents]);

  const deleteFile = (index: number, id: string | number) => {
    if (id) {
      deleteSanctionDocument(id).then(() => {});
    }
    const remainingDocuments = doc.filter((_, i) => i !== index);
    setDoc(remainingDocuments);
    setDocuments(remainingDocuments);
  };
  if (!ecmEnabled) {
    return null;
  }

  return (
    <>
      <Box data-testid={"documents-grid"}>
        <StyledHeader data-testid={"header"}>
          <span style={{ fontSize: "14px" }}>{t("documents")}</span>
          <StyledIconButton
            onClick={() => setIsOpen(true)}
            disabled={viewMode}
            data-testid={"upload-button"}
          >
            <CloudUploadIcon
              sx={{ color: viewMode ? "#8DAFD3" : "#fff" }}
              fontSize={"small"}
            />
          </StyledIconButton>
        </StyledHeader>

        <StyledUploadContent>
          {doc &&
            doc.map((item: any, index: number) => (
              <StyledDocumentsWrapper key={index} data-testid={"item-" + index}>
                <span style={{ fontSize: "12px" }} data-testid={"name"}>
                  {item.name}
                </span>
                <div style={{ display: "flex" }}>
                  <StyledIconButton
                    onClick={() => {
                      fileExportHandler(item.id);
                    }}
                    sx={{ display: item.id ? "flex" : "none" }}
                    data-testid={"download-button"}
                  >
                    <DownloadIcon fontSize={"medium"} />
                  </StyledIconButton>
                  {!viewMode && (
                    <StyledIconButton
                      onClick={() => deleteFile(index, item.id)}
                      data-testid={"delete-button"}
                    >
                      <DeleteIcon
                        sx={{ color: "#FF735A" }}
                        fontSize={"medium"}
                      />
                    </StyledIconButton>
                  )}
                </div>
              </StyledDocumentsWrapper>
            ))}
        </StyledUploadContent>
      </Box>
      {isOpen && (
        <EmsDocumentsGridModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setDocuments={setDocuments}
        />
      )}
    </>
  );
};

export default EmsDocumentsGrid;
