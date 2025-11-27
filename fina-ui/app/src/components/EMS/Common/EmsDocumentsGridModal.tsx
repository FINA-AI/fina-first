import { useTranslation } from "react-i18next";
import ClosableModal from "../../common/Modal/ClosableModal";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { GridColumnType } from "../../../types/common.type";
import { Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDropzone } from "react-dropzone";
import SaveIcon from "@mui/icons-material/Save";
import ActionBtn from "../../common/Button/ActionBtn";
import DeleteIcon from "@mui/icons-material/Delete";
import GridTable from "../../common/Grid/GridTable";
import { styled } from "@mui/material/styles";

interface EmsUploadFileModalProps {
  isOpen: boolean;
  setIsOpen: (isShow: boolean) => void;
  setDocuments: (doc: any) => void;
}

const StyledFooter = styled(Box)(({ theme }: any) => ({
  ...theme.modalFooter,
  padding: 10,
  paddingRight: 20,
}));

const StyledContentGrid = styled(Grid)({
  padding: 15,
  height: "350px",
  display: "flex",
  flexWrap: "nowrap",
});

const EmsDocumentsGridModal: React.FC<EmsUploadFileModalProps> = ({
  isOpen,
  setIsOpen,
  setDocuments,
}) => {
  const { t } = useTranslation();

  const [rows, setRows] = useState<File[]>([]);

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    disabled: false,
    noKeyboard: true,
    accept: [".xlsx"],
  });

  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setRows([...rows, ...acceptedFiles]);
    }
  }, [acceptedFiles]);

  const deleteDocument = (index: number) => {
    const remainingDocuments = rows.filter((_, i) => i !== index);
    setRows(remainingDocuments);
  };

  const UploadColumns: GridColumnType[] = [
    {
      field: "path",
      headerName: t("name"),
      hideCopy: true,
      flex: 1,
    },
    {
      field: "size",
      headerName: t("size"),
      hideCopy: true,
      flex: 1,
      renderCell: (val: number) => {
        return <Box>{(val / 1024).toFixed(1)} KB</Box>;
      },
    },
  ];

  let actionButtons = (row: any, index: number) => {
    return (
      <>
        <ActionBtn
          onClick={() => deleteDocument(index)}
          children={<DeleteIcon />}
          color={"#FF735A"}
          rowIndex={index}
          buttonName={"delete"}
        />
      </>
    );
  };

  return (
    <ClosableModal
      onClose={() => {
        setIsOpen(false);
      }}
      open={isOpen}
      includeHeader={true}
      title={t("upload")}
      width={600}
      disableBackdropClick={true}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box display={"flex"} flex={1}>
          <StyledContentGrid container spacing={2} direction={"column"}>
            <Grid item>
              <Box {...getRootProps()}>
                <input {...getInputProps()} data-testid={"attachment-input"} />
                <PrimaryBtn
                  onClick={open}
                  startIcon={<AddIcon />}
                  data-testid={"add-file-button"}
                  children={
                    <>
                      {t("add")} {t("file")}
                    </>
                  }
                />
              </Box>
            </Grid>

            <Grid item overflow={"auto"} height={"100%"}>
              <Box height={"100%"}>
                <GridTable
                  columns={UploadColumns}
                  rows={rows}
                  selectedRows={[]}
                  actionButtons={actionButtons}
                  loading={false}
                  size={"small"}
                />
              </Box>
            </Grid>
          </StyledContentGrid>
        </Box>

        <StyledFooter
          display={"flex"}
          justifyContent={"end"}
          alignItems={"center"}
        >
          <GhostBtn
            onClick={() => {
              setIsOpen(false);
            }}
            style={{ marginRight: "10px" }}
            data-testid={"cancel-button"}
          >
            {t("cancel")}
          </GhostBtn>
          <PrimaryBtn
            onClick={() => {
              setDocuments((prev: File[]) => [...rows, ...prev]);
              setIsOpen(false);
            }}
            backgroundColor={"rgb(40, 158, 32)"}
            endIcon={
              <SaveIcon sx={{ width: 16, height: 14, marginLeft: "5px" }} />
            }
            data-testid={"submit-button"}
          >
            {t("submit")}
          </PrimaryBtn>
        </StyledFooter>
      </Box>
    </ClosableModal>
  );
};

export default EmsDocumentsGridModal;
