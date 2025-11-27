import React from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import LoopIcon from "@mui/icons-material/Loop";
import GhostBtn from "../../common/Button/GhostBtn";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TableCustomizationButton from "../../common/Button/TableCustomizationButton";
import { EMS_FILE_IMPORT_TABLE_KEY } from "../../../api/TableCustomizationKeys";
import { GridColumnType } from "../../../types/common.type";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/material/styles";

interface EmsFileImportToolbarProps {
  onRefresh: () => void;
  setShowModal: (isShow: boolean) => void;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  columns: GridColumnType[];
}

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  padding: theme.toolbar.padding,
  maxHeight: theme.toolbar.height,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
}));

const EmsFileImportToolbar: React.FC<EmsFileImportToolbarProps> = ({
  onRefresh,
  setShowModal,
  setColumns,
  columns,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  return (
    <StyledToolbar data-testid={"toolbar"}>
      <Box display={"flex"} justifyContent={"start"}>
        <Box marginRight={"5px"}>
          <GhostBtn
            onClick={() => onRefresh()}
            startIcon={<LoopIcon />}
            data-testid={"refresh-button"}
          >
            {t("refresh")}
          </GhostBtn>
        </Box>
        {hasPermission(PERMISSIONS.EMS_IMPORT_FILE_IMPORT) && (
          <Box marginRight={"5px"}>
            <GhostBtn
              onClick={() => setShowModal(true)}
              startIcon={<CloudUploadIcon />}
              data-testid={"upload-button"}
            >
              {t("upload")}
            </GhostBtn>
          </Box>
        )}
        <TableCustomizationButton
          hideLabel={true}
          showTooltip={true}
          columns={columns}
          setColumns={setColumns}
          isDefault={false}
          hasColumnFreeze={true}
          tableKey={EMS_FILE_IMPORT_TABLE_KEY}
        />
      </Box>
    </StyledToolbar>
  );
};

export default EmsFileImportToolbar;
