import React from "react";
import { Box } from "@mui/system";
import GhostBtn from "../../common/Button/GhostBtn";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LoopIcon from "@mui/icons-material/Loop";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import { SanctionFineType } from "../../../types/sanction.type";
import TableCustomizationButton from "../../common/Button/TableCustomizationButton";
import { EMS_FINE_TYPES_TABLE_KEY } from "../../../api/TableCustomizationKeys";
import { GridColumnType } from "../../../types/common.type";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";

interface EmsFineTypeToolbarProps {
  setOpenModal: (value: boolean) => void;
  currFineType: SanctionFineType | null;
  activeTab: string | null;
  onRefresh: (value: string) => void;
  setCurrFineType: (value: SanctionFineType | null) => void;
  setShowDeleteModal: (value: boolean) => void;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  columns: GridColumnType[];
}

const EmsFineTypeToolbar: React.FC<EmsFineTypeToolbarProps> = ({
  setOpenModal,
  currFineType,
  setShowDeleteModal,
  activeTab,
  onRefresh,
  setCurrFineType,
  columns,
  setColumns,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  return (
    <>
      <Box
        display={"flex"}
        padding={"8px 8px 12px 8px"}
        data-testid={"toolbar"}
      >
        {hasPermission(PERMISSIONS.EMS_FINE_TYPES_AMEND) && (
          <>
            <Box>
              <GhostBtn
                onClick={() => {
                  setOpenModal(true);
                  setCurrFineType(null);
                }}
                style={{ marginRight: "5px", padding: "0px 8px" }}
                startIcon={<AddIcon />}
                data-testid={"create-button"}
              >
                {t("add")}
              </GhostBtn>
            </Box>
            <Box>
              <GhostBtn
                onClick={() => setOpenModal(true)}
                style={{ marginRight: "5px", padding: "0px 8px" }}
                disabled={currFineType ? false : true}
                startIcon={<EditIcon />}
                data-testid={"edit-button"}
              >
                {t("edit")}
              </GhostBtn>
            </Box>
          </>
        )}
        {hasPermission(PERMISSIONS.EMS_FINE_TYPES_DELETE) && (
          <Box>
            <GhostBtn
              onClick={() => setShowDeleteModal(true)}
              style={{ marginRight: "5px", padding: "0px 8px" }}
              disabled={currFineType ? false : true}
              startIcon={<RemoveIcon />}
              data-testid={"delete-button"}
            >
              {t("delete")}
            </GhostBtn>
          </Box>
        )}
        <Box>
          <GhostBtn
            onClick={() => onRefresh(activeTab as string)}
            style={{ marginRight: "5px", padding: "0px 8px" }}
            startIcon={<LoopIcon />}
            data-testid={"refresh-button"}
          >
            {t("refresh")}
          </GhostBtn>
          <TableCustomizationButton
            hideLabel={true}
            showTooltip={true}
            columns={columns}
            setColumns={setColumns}
            isDefault={false}
            hasColumnFreeze={true}
            tableKey={EMS_FINE_TYPES_TABLE_KEY}
          />
        </Box>
      </Box>
    </>
  );
};
export default EmsFineTypeToolbar;
