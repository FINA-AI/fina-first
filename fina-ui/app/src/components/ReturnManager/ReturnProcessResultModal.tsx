import ClosableModal from "../common/Modal/ClosableModal";
import { Box } from "@mui/system";
import { Grid, Typography } from "@mui/material";
import GridTable from "../common/Grid/GridTable";
import React, { useState } from "react";
import { GridColumnType } from "../../types/common.type";
import { styled } from "@mui/material/styles";
import { getStatusColumnStyle } from "../../containers/ReturnManager/ReturnManagerContainer";
import { useTranslation } from "react-i18next";
import { ProcessedResult } from "../../types/returnManager.type";

interface ReturnProcessResultModalProps {
  title: string;
  onClose: VoidFunction;
  data: ProcessedResult[];
  isOpen: boolean;
}

const StyledNoteContainer = styled(Grid)(({ theme }: { theme: any }) => ({
  borderTop: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
  padding: "10px",
}));

const StyledNoteText = styled("div")({
  fontWeight: 400,
  fontSize: 11,
  overflow: "auto",
  height: "100%",
});

const StyledProcessGrid = styled(Grid)(({ theme }: { theme: any }) => ({
  borderRight: theme.palette.borderColor,
}));

const ReturnProcessResultModal: React.FC<ReturnProcessResultModalProps> = ({
  onClose,
  title,
  data,
  isOpen,
}) => {
  const { t } = useTranslation();
  const [selectedRow, setSelectedRow] = useState<ProcessedResult>();

  let columnHeaders: GridColumnType[] = [
    {
      field: "returnDefinitionCode",
      headerName: t("code"),
      hideCopy: true,
    },
    {
      field: "status",
      headerName: t("status"),
      hideCopy: true,
      minWidth: 150,
      renderCell: (value: any) => {
        return (
          <Box
            padding={"4px"}
            fontSize={"12px"}
            fontWeight={500}
            lineHeight={"16px"}
            style={getStatusColumnStyle(value)}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            borderRadius={"4px"}
            width={100}
          >
            {t(value)}
          </Box>
        );
      },
    },
    {
      field: "processNote",
      headerName: t("note"),
      hideCopy: true,
    },
  ];
  return (
    <ClosableModal
      onClose={onClose}
      open={isOpen}
      width={748}
      height={392}
      includeHeader={true}
      padding={"10 20"}
      titleFontWeight={"700"}
      title={title}
      disableBackdropClick={true}
    >
      <Box
        display={"flex"}
        width={"100%"}
        height={"100%"}
        style={{ overflow: "hidden" }}
      >
        <Grid container>
          <StyledProcessGrid item xs={7} height={"100%"}>
            <GridTable
              size={"small"}
              columns={columnHeaders}
              rows={data}
              singleRowSelect={true}
              rowOnClick={(row: any) => {
                setSelectedRow(row);
              }}
            />
          </StyledProcessGrid>
          <StyledNoteContainer item xs={5} height={"100%"}>
            <Box height={"100%"} display={"flex"} flexDirection={"column"}>
              <div
                style={{
                  paddingBottom: 10,
                }}
              >
                <Typography
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {t("note")}
                </Typography>
              </div>
              <StyledNoteText>{selectedRow?.processNote}</StyledNoteText>
            </Box>
          </StyledNoteContainer>
        </Grid>
      </Box>
    </ClosableModal>
  );
};

export default ReturnProcessResultModal;
