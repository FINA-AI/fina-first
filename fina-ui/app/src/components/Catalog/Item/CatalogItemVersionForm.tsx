import ClosableModal from "../../common/Modal/ClosableModal";
import GridTable from "../../common/Grid/GridTable";
import { Box } from "@mui/system";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { useTranslation } from "react-i18next";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { styled } from "@mui/material/styles";
import React from "react";
import { CatalogItemHistory } from "../../../types/catalog.type";
import { GridColumnType } from "../../../types/common.type";

interface CatalogItemVersionFormProps {
  catalogItemVersionModal: boolean;
  handClose: VoidFunction;
  catalogItemHistory: CatalogItemHistory[];
  catalogVersionColumns: GridColumnType[];
  setCatalogItemHistory: React.Dispatch<
    React.SetStateAction<CatalogItemHistory[]>
  >;
  setCatalogItemVersionModal: (open: boolean) => void;
  versionLoading: boolean;
}

const StyledFooter = styled(Box)(({ theme }: any) => ({
  display: "flex",
  padding: "8px 16px",
  justifyContent: "flex-end",
  ...theme.modalFooter,
}));

const StyledTableWrapper = styled(Box)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

const CatalogItemVersionForm: React.FC<CatalogItemVersionFormProps> = ({
  catalogItemVersionModal,
  handClose,
  catalogItemHistory,
  catalogVersionColumns,
  setCatalogItemHistory,
  setCatalogItemVersionModal,
  versionLoading,
}) => {
  const { t } = useTranslation();
  return (
    <ClosableModal
      onClose={handClose}
      open={catalogItemVersionModal}
      width={852}
      height={500}
      includeHeader={true}
      padding={0}
      title={t("versions")}
      titleFontWeight={"700"}
    >
      <StyledTableWrapper>
        <GridTable
          columns={catalogVersionColumns}
          rows={catalogItemHistory}
          setRows={setCatalogItemHistory}
          selectedRows={[]}
          rowOnClick={() => {}}
          loading={versionLoading}
        />
        <StyledFooter>
          <Box>
            <PrimaryBtn
              onClick={() => setCatalogItemVersionModal(false)}
              endIcon={<CheckRoundedIcon />}
            >
              {t("okay")}
            </PrimaryBtn>
          </Box>
        </StyledFooter>
      </StyledTableWrapper>
    </ClosableModal>
  );
};

export default CatalogItemVersionForm;
