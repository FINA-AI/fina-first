import ClosableModal from "../../common/Modal/ClosableModal";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import GhostBtn from "../../common/Button/GhostBtn";
import DoneIcon from "@mui/icons-material/Done";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import TextField from "../../common/Field/TextField";
import DashletsDraggableChooser from "./DashletsDraggableChooser";
import { useSnackbar } from "notistack";
import { getDashlets } from "../../../api/services/dashboardService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import CloseIcon from "@mui/icons-material/Close";
import Select from "../../common/Field/Select";
import {
  DashboardColumnType,
  DashboardType,
  DashletType,
  UpdateDashboardType,
} from "../../../types/dashboard.type";
import { styled } from "@mui/material/styles";

interface SelectedLayoutType {
  id: number;
  name: string;
  len: number;
}

interface CreateDashboardModalProps {
  open: boolean;
  setOpen: ({ open, editMode }: { open: boolean; editMode: boolean }) => void;
  onSaveDashboard: (dashboard: UpdateDashboardType) => void;
  onEditDashboard: (dashboard: UpdateDashboardType) => void;
  editMode: boolean;
  selectedDashboard: DashboardType;
}

const StyledRoot = styled(Box)({
  display: "flex",
  width: "100%",
  height: "100%",
  flexDirection: "column",
});

const StyledBody = styled(Box)({
  display: "flex",
  height: "100%",
  padding: "14px 12px 56px 12px",
  flexDirection: "column",
  "& .MuiFormControl-root": {
    width: "100%",
    marginBottom: "15px",
  },
  overflow: "hidden",
});

const StyledHeader = styled(Box)(({ theme }: any) => ({
  ...theme.modalHeader,
  padding: "14px 24px",
  fontWeight: 600,
  fontSize: "13px",
  lineHeight: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const StyledFooter = styled(Box)(({ theme }: any) => ({
  ...theme.modalFooter,
  height: "55px",
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: "8px 0px",
}));

const StyledCloseIcon = styled(CloseIcon)({
  color: "#9AA7BE",
  width: "20px",
  height: "20px",
  padding: "2px",
  cursor: "pointer",
});

const CreateDashboardModal: React.FC<CreateDashboardModalProps> = ({
  open,
  setOpen,
  onSaveDashboard,
  onEditDashboard,
  editMode,
  selectedDashboard,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedLayout, setSelectedLayout] = useState<SelectedLayoutType>();
  const [dashlets, setDashlets] = useState<DashletType[]>([]);
  const [dashboardName, setDashboardName] = useState<string>("");
  const [dashboardCode, setDashboardCode] = useState<string>("");
  const [columns, setColumns] = useState<DashboardColumnType>({});
  const { openErrorWindow } = useErrorWindow();
  const layoutOptions = [
    { id: 1, name: "1", len: 1 },
    { id: 2, name: "2", len: 2 },
    { id: 3, name: "3", len: 3 },
  ];

  const initDashlets = () => {
    getDashlets(-1, -1)
      .then((resp) => {
        let data: DashletType[] = resp.data.list;
        if (data) {
          if (editMode) {
            setDashlets(
              data.filter(
                (initItem: DashletType) =>
                  !selectedDashboard?.dashletList?.some(
                    (selectedItem: DashletType) =>
                      selectedItem.id === initItem.id
                  )
              )
            );
          } else {
            setDashlets(data);
          }
        }
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });

    if (editMode) {
      setSelectedLayout({
        id: selectedDashboard.dashboardLayout,
        name: `${selectedDashboard.dashboardLayout}`,
        len: selectedDashboard.dashboardLayout,
      });
      setDashboardName(selectedDashboard.name);
      setDashboardCode(selectedDashboard.code);
      setColumns(selectedDashboard.dashlets);
    } else {
      setSelectedLayout({ id: 1, name: "1", len: 1 });
    }
  };

  useEffect(() => {
    initDashlets();
  }, []);

  const saveOrEditDashboard = () => {
    if (!dashboardName || dashboardName.trim().length < 0) {
      enqueueSnackbar(t("dashboardNameWarning"), { variant: "warning" });
      return;
    }

    if (!dashboardCode || dashboardCode.trim().length < 0) {
      enqueueSnackbar(t("codeIsRequired"), { variant: "warning" });
      return;
    }

    if (!selectedLayout) {
      enqueueSnackbar(t("dashboardLayoutWarning"), { variant: "warning" });
      return;
    }

    let isColumnsEmpty = false;

    Object.values(columns).forEach((column) => {
      if (column.list.length > 0) isColumnsEmpty = true;
    });

    if (!isColumnsEmpty) {
      enqueueSnackbar(t("dashboardColumnsWarning"), { variant: "warning" });
      return;
    } else {
      let obj = {
        dashboardName: dashboardName,
        layout: selectedLayout,
        dashlets: columns,
        code: dashboardCode,
      };
      editMode
        ? onEditDashboard({ ...obj, id: selectedDashboard.id })
        : onSaveDashboard(obj);
      setOpen({ open: false, editMode: false });
    }
  };

  return (
    <ClosableModal
      onClose={() => setOpen({ open: false, editMode: false })}
      open={open}
      width={850}
      height={600}
      includeHeader={false}
    >
      <StyledRoot>
        <StyledHeader>
          {t("createDashboard")}
          <StyledCloseIcon
            onClick={() => setOpen({ open: false, editMode: false })}
          />
        </StyledHeader>
        <StyledBody>
          <TextField
            size={"default"}
            label={t("dashboardName")}
            onChange={(value: string) => setDashboardName(value)}
            value={dashboardName}
            fieldName={"dashboardName"}
          />
          <TextField
            size={"default"}
            label={t("code")}
            onChange={(value: string) => setDashboardCode(value)}
            value={dashboardCode}
            fieldName={"code"}
          />
          <Select
            size={"default"}
            label={t("numberOfColumns")}
            data={layoutOptions.map((item) => {
              return { id: item.id, label: item.name, value: item.len };
            })}
            value={selectedLayout && selectedLayout.len}
            onChange={(val) => {
              const option = layoutOptions.find((item) => item.len === +val);
              setSelectedLayout(option);
            }}
            data-testid={"number-of-columns-select"}
          />
          {selectedLayout && (
            <DashletsDraggableChooser
              selectedLayout={selectedLayout}
              dashlets={dashlets}
              setDashlets={setDashlets}
              columns={columns}
              setColumns={setColumns}
            />
          )}
        </StyledBody>
        <StyledFooter>
          <GhostBtn
            onClick={() => setOpen({ open: false, editMode: false })}
            style={{ marginRight: "12px" }}
            height={32}
            data-testid={"cancel-button"}
          >
            {t("cancel")}
          </GhostBtn>
          <PrimaryBtn
            onClick={() => saveOrEditDashboard()}
            style={{
              background: "#289E20",
              height: "32px",
              marginRight: "16px",
            }}
            endIcon={<DoneIcon />}
            data-testid={"save-button"}
          >
            {t("save")}
          </PrimaryBtn>
        </StyledFooter>
      </StyledRoot>
    </ClosableModal>
  );
};

export default CreateDashboardModal;
