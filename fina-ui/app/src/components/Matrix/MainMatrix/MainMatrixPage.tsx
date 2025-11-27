import { Box, Grid, Tooltip } from "@mui/material";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import CardGridSkeleton from "../../FI/Skeleton/Configuration/CardGridSkeleton";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import NoRecordIndicator from "../../common/NoRecordIndicator/NoRecordIndicator";
import MainMatrixCard from "./MainMatrixCard";
import { FiTypeDataType } from "../../../types/fi.type";
import { PeriodDefinitionType } from "../../../types/period.type";
import { returnVersionDataType } from "../../../types/returnVersion.type";
import MainMatrixAddModal from "./MainMatrixAddModal";
import DeleteForm from "../../common/Delete/DeleteForm";
import ToolbarIcon from "../../common/Icons/ToolbarIcon";
import { MainMatrixDataType } from "../../../types/matrix.type";
import { importMatrix } from "../../../api/services/matrixService";
import { useSnackbar } from "notistack";
import { downloadErrorLogHandler } from "../../../util/appUtil";
import SimpleLoadMask from "../../common/SimpleLoadMask";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { styled } from "@mui/material/styles";
import VerticalAlignBottomRoundedIcon from "@mui/icons-material/VerticalAlignBottomRounded";

export const StyledRoot = styled(Box)(({ theme }: any) => ({
  boxSizing: "border-box",
  background: theme.palette.paperBackground,
  borderRadius: "8px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  overflow: "hidden",
}));

export const StyledHeader = styled(Box)(({ theme }: any) => ({
  boxSizing: "border-box",
  padding: theme.toolbar.padding,
  margin: 0,
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  borderBottom: theme.palette.borderColor,
}));

export const StyledBody = styled(Grid)(({ loading }: { loading: boolean }) => ({
  boxSizing: "border-box",
  position: "relative",
  height: "100%",
  padding: "8px 12px",
  margin: 0,
  overflow: loading ? "hidden" : "auto",
}));

interface MainMatrixPageProps {
  loading: boolean;
  data: MainMatrixDataType[];
  fiTypes: FiTypeDataType[];
  periodTypes: PeriodDefinitionType[];
  returnVersions: returnVersionDataType[];
  onSave: (data: MainMatrixDataType) => void;
  deleteMainMatrix: (id: number) => void;
  loadMatrixData: () => void;
  isAddModalOpen: { open: boolean; data?: MainMatrixDataType | undefined };
  setIsAddModalOpen: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      data?: MainMatrixDataType | undefined;
    }>
  >;
}

const MainMatrixPage: React.FC<MainMatrixPageProps> = ({
  loading,
  data,
  fiTypes,
  periodTypes,
  returnVersions,
  onSave,
  deleteMainMatrix,
  loadMatrixData,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const { t } = useTranslation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<{
    open: boolean;
    id?: number;
  }>({ open: false });

  const [loadMask, setLoadMask] = useState<Boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();

  const handleMatrixImport = () => {
    setLoadMask(true);
    importMatrix()
      .then((res) => {
        loadMatrixData();
        if (res && res.data.length === 0) {
          enqueueSnackbar(t("success"), { variant: "success" });
        } else {
          downloadErrorLogHandler(res.data);
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setLoadMask(false);
      });
  };

  return (
    <StyledRoot>
      <StyledHeader>
        <Tooltip title={t("export")} arrow>
          <Box style={{ marginRight: "8px" }}>
            <ToolbarIcon
              onClickFunction={handleMatrixImport}
              Icon={<VerticalAlignBottomRoundedIcon />}
              isSquare={true}
            />
          </Box>
        </Tooltip>
        <PrimaryBtn
          onClick={() => setIsAddModalOpen({ open: true })}
          endIcon={<AddIcon />}
        >
          {t("addNew")}
        </PrimaryBtn>
      </StyledHeader>

      <StyledBody loading={loading}>
        {!loading && data.length === 0 && <NoRecordIndicator />}
        {loading ? (
          <CardGridSkeleton cardNumber={data.length} fiType={true} />
        ) : (
          <Grid container item xs={12} direction={"row"} wrap={"wrap"}>
            {data.map((item, index: number) => (
              <MainMatrixCard
                key={index}
                details={item}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                setIsAddModalOpen={setIsAddModalOpen}
              />
            ))}
          </Grid>
        )}
      </StyledBody>
      {isAddModalOpen.open && (
        <MainMatrixAddModal
          fiTypes={fiTypes}
          periodTypes={periodTypes}
          returnVersions={returnVersions}
          onSave={onSave}
          selectedMatrix={isAddModalOpen.data}
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
        />
      )}
      {isDeleteModalOpen.open && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("mainmatrix")}
          isDeleteModalOpen={isDeleteModalOpen.open}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          onDelete={() => {
            if (typeof isDeleteModalOpen?.id === "number") {
              deleteMainMatrix(isDeleteModalOpen.id);
            }
            setIsDeleteModalOpen({ open: false });
          }}
          showConfirm={false}
        />
      )}

      {loadMask && (
        <SimpleLoadMask
          loading={true}
          message={"Working, Please Wait..."}
          color={"primary"}
        />
      )}
    </StyledRoot>
  );
};

export default MainMatrixPage;
