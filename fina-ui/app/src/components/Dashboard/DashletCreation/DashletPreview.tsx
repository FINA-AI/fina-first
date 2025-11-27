import { Box, Typography } from "@mui/material";
import TextField from "../../common/Field/TextField";
import CodeArea from "../../MDT/CodeArea/CodeArea";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import GridTable from "../../common/Grid/GridTable";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DashletDataType, DashletType } from "../../../types/dashboard.type";
import { GridColumnType } from "../../../types/common.type";
import { styled } from "@mui/material/styles";

interface DashletPreviewProps {
  previewData: DashletDataType[];
  generateColumns: () => GridColumnType[];
  isCurrStepValid: () => boolean;
  dashletData: DashletType;
  setErrorFields: React.Dispatch<React.SetStateAction<string[]>>;
  errorFields: string[];
  setPreviewData: (data: DashletDataType[]) => void;
}

const StyledRoot = styled(Box)({
  height: "100%",
  overflow: "auto",
  padding: "0 12px 0 12px",
});

const StyledPreview = styled(Typography)({
  color: "#2C3644",
  fontWeight: 500,
  fontSize: "11px",
  lineHeight: "12px",
  opacity: 0.6,
});

const StyledResult = styled(Typography)({
  fontSize: 11,
  lineHeight: "12px",
  fontWeight: 500,
  opacity: 0.6,
});

const StyledTableWrapper = styled(Box)(({ theme }: any) => ({
  borderLeft: theme.palette.borderColor,
  borderRight: theme.palette.borderColor,
}));

const DashletPreview: React.FC<DashletPreviewProps> = ({
  previewData,
  generateColumns,
  isCurrStepValid,
  dashletData,
  setErrorFields,
  errorFields,
  setPreviewData,
}) => {
  const { t } = useTranslation();

  const GetPreviewGrid = useMemo(() => {
    return (
      <GridTable
        columns={generateColumns()}
        rows={previewData}
        setRows={setPreviewData}
        selectedRows={[]}
        size={"small"}
        loading={false}
      />
    );
  }, [previewData]);

  const GetCodeArea = () => {
    return (
      <CodeArea
        editorContent={dashletData?.dataQuery}
        setEditorContent={(val) => {
          dashletData.dataQuery = val;
        }}
        editMode={true}
        isSQLEditor={true}
        height={30}
        setHasErrors={() => {}}
        dataTestId={`code-area-${dashletData?.id}`}
      />
    );
  };

  const handleErrorFields = (value: string, key: string) => {
    if (!value && !errorFields.includes(key)) {
      setErrorFields([...errorFields, key]);
    } else if (value && errorFields.includes(key)) {
      setErrorFields(errorFields.filter((f) => f !== key));
    }
  };

  return (
    <StyledRoot>
      <Box pt={"14px"} pb={"14px"}>
        <TextField
          value={dashletData?.name}
          onChange={(val: string) => {
            dashletData.name = val;
            isCurrStepValid();
            handleErrorFields(val, "name");
          }}
          label={t("name")}
          size={"small"}
          isError={errorFields.includes("name")}
          fieldName={"name"}
        />
        <TextField
          style={{ marginTop: "5px" }}
          value={dashletData?.code}
          onChange={(val: string) => {
            dashletData.code = val;
            isCurrStepValid();
            handleErrorFields(val, "code");
          }}
          label={t("code")}
          size={"small"}
          isError={errorFields.includes("code")}
          fieldName={"code"}
        />
      </Box>
      <Box p={"0 12px 0 12px"}>
        <StyledResult marginLeft={"12px"} marginBottom={"4px"}>
          {t("result")}
        </StyledResult>
        <Box>
          <GetCodeArea />
        </Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          p={
            previewData && previewData?.length > 0
              ? "14px 0 4px 12px"
              : "4px 0px 4px 9px"
          }
        >
          {previewData && previewData?.length > 0 ? (
            <StyledPreview>{`${t("preview")}: ${t("top")} 10`}</StyledPreview>
          ) : (
            <>
              <InfoRoundedIcon
                sx={{ color: "#FF8D00", width: 13, height: 13 }}
              />
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#FF8D00",
                  paddingLeft: "5px",
                }}
              >
                {t("previewTip")}
              </Typography>
            </>
          )}
        </Box>
        {previewData && previewData?.length > 0 && (
          <StyledTableWrapper width={"100%"}>
            {GetPreviewGrid}
          </StyledTableWrapper>
        )}
      </Box>
    </StyledRoot>
  );
};

export default DashletPreview;
