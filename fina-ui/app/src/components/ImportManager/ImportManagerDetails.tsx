import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/system";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { Grid, IconButton, Typography } from "@mui/material";
import ImportManagerDetailsCard from "./ImportManagerDetailsCard";
import { basicSetup, EditorView } from "codemirror";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import ClosableModal from "../common/Modal/ClosableModal";
import { loadXml } from "../../api/services/importManagerService";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import withLoading from "../../hoc/withLoading";
import { styled, useTheme } from "@mui/material/styles";
import { copyToClipboard } from "../../util/appUtil";
import { ImportedReturn, UploadFile } from "../../types/importManager.type";
import { UIEventType } from "../../types/common.type";

interface ImportManagerDetailsProps {
  setIsDetailPageOpen: (open: boolean) => void;
  list: ImportedReturn[];
  row: UploadFile;
}

const StyledRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  overflow: "hidden",
  backgroundColor: (theme as any).palette.paperBackground,
}));

const StyledGeneralInfo = styled(Box)(() => ({
  position: "sticky",
  top: 0,
  overflow: "auto",
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  height: 48,
  padding: "12px 16px",
  display: "flex",
  justifyContent: "space-between",
  borderBottom: (theme as any).palette.borderColor,
  alignItems: "center",
  boxSizing: "border-box",
}));

const StyledName = styled(Typography)(() => ({
  fontSize: 13,
  fontWeight: 600,
  lineHeight: "20px",
}));

const StyledCloseIcon = styled(DoubleArrowIcon)(() => ({
  color: "#C2CAD8",
  fontSize: 16,
}));

const StyledXmlContent = styled(Box)(({ theme }) => ({
  height: "354px",
  display: "flex",
  flexDirection: "column",
  color: (theme as any).palette.textColor,
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "20px",
}));

const StyledFooter = styled(Box)(({ theme }) => ({
  ...(theme as any).modalFooter,
  display: "flex",
  justifyContent: "flex-end",
}));

const StyledCircularProgress = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
}));

const StyledNoContentBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  height: "100%",
  justifyContent: "center",
  fontSize: "14px",
}));

const ImportManagerDetails: React.FC<ImportManagerDetailsProps> = ({
  setIsDetailPageOpen,
  list,
  row,
}) => {
  const { t } = useTranslation();
  const xmlViewContainerRef = useRef();
  const [xmlModalOpen, setXmlModalOpen] = useState(false);
  const [pReturn, setPReturn] = useState<ImportedReturn>({} as ImportedReturn);
  const [xmlData, setXmlData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    let view = new EditorView({
      extensions: [
        basicSetup,
        EditorView.contentAttributes.of({ contenteditable: "false" }),
        EditorView.theme({
          ".cm-gutters": {
            background: (theme as any).palette.paperBackground,
            color: theme.palette.mode === "light" ? "#6c6c6c" : "#eef5ff",
          },
          ".cm-activeLineGutter": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#596D89" : "#e2f2ff",
          },
          ".cm-activeLine": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#596D89" : "#cceeff44",
          },
        }),
      ],
      parent: xmlViewContainerRef.current,
      doc: xmlData,
    });
    return () => view?.destroy();
  }, [xmlData, theme.palette]);

  const showXmlClickHandler = (packageReturn: ImportedReturn) => {
    setPReturn(packageReturn);
    setIsLoading(true);
    if (packageReturn?.id) {
      loadXml(packageReturn.id).then((res) => {
        setIsLoading(false);
        setXmlData(res.data);
      });
    }
    setXmlModalOpen(true);
  };

  const onCopy = (e: UIEventType) => {
    e.stopPropagation();
    const copyText = !!xmlData ? xmlData : "";
    copyToClipboard(copyText);
  };

  return (
    <StyledRoot>
      <StyledHeader>
        <StyledName>{row.fileName}</StyledName>
        <IconButton
          onClick={() => {
            setIsDetailPageOpen(false);
            setXmlData(null);
          }}
        >
          <StyledCloseIcon />
        </IconButton>
      </StyledHeader>
      <StyledGeneralInfo>
        <Grid container>
          {list.map((item, index) => (
            <Grid item xs={12} key={index}>
              <ImportManagerDetailsCard
                packageReturn={item}
                showXmlClickHandler={showXmlClickHandler}
              />
            </Grid>
          ))}
        </Grid>
      </StyledGeneralInfo>
      {xmlModalOpen && (
        <ClosableModal
          onClose={() => {
            setPReturn({} as ImportedReturn);
            setXmlModalOpen(false);
            setIsLoading(false);
            setXmlData(null);
          }}
          open={xmlModalOpen}
          width={530}
          height={450}
          includeHeader={true}
          title={pReturn.returnCode}
        >
          <StyledXmlContent>
            {isLoading ? (
              <StyledCircularProgress>
                <CircularProgress />
              </StyledCircularProgress>
            ) : !xmlData ? (
              <StyledNoContentBox>{t("noContent")}</StyledNoContentBox>
            ) : (
              <Box
                overflow={"auto"}
                style={{
                  height: "100%",
                  width: "100%",
                  overflow: "auto",
                }}
                ref={xmlViewContainerRef}
              ></Box>
            )}
          </StyledXmlContent>
          <StyledFooter>
            <PrimaryBtn
              onClick={(event: UIEventType) => {
                onCopy(event);
              }}
            >
              {t("copy")}
            </PrimaryBtn>
          </StyledFooter>
        </ClosableModal>
      )}
    </StyledRoot>
  );
};

export default withLoading(ImportManagerDetails);
