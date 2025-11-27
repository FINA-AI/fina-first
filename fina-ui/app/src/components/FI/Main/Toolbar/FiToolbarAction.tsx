import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import VerticalAlignTopRoundedIcon from "@mui/icons-material/VerticalAlignTopRounded";
import VerticalAlignBottomRoundedIcon from "@mui/icons-material/VerticalAlignBottomRounded";
import GhostBtn from "../../../common/Button/GhostBtn";
import DeleteIcon from "@mui/icons-material/Delete";
import PrimaryBtn from "../../../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FIWizard from "../Wizard/FIWizard";
import { createFi, importFis } from "../../../../api/services/fi/fiService";
import { useSnackbar } from "notistack";
import useErrorWindow from "../../../../hoc/ErrorWindow/useErrorWindow";
import DeleteForm from "../../../common/Delete/DeleteForm";
import { Box } from "@mui/system";
import { FI_GENERAL_INFO_TABLE_KEY } from "../../../../api/TableCustomizationKeys";
import TableCustomizationButton from "../../../common/Button/TableCustomizationButton";
import { BASE_REST_URL } from "../../../../util/appUtil";
import FiErrorModal from "../../FiErrorModal";
import ToolbarIcon from "../../../common/Icons/ToolbarIcon";
import { Tooltip } from "@mui/material";
import { useDropzone } from "react-dropzone";
import webSocket from "../../../../api/websocket/webSocket";
import { GridColumnType } from "../../../../types/common.type";
import {
  FiDataType,
  FiImportEventType,
  FiImportResult,
  FiType,
  FiTypeDataType,
} from "../../../../types/fi.type";
import useConfig from "../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../api/permissions";
import { styled } from "@mui/material/styles";

interface FiToolbarActionProps {
  activeFIMainToolbar: boolean;
  onDeleteMultipleRowsClick: () => void;
  columns: GridColumnType[];
  reloadFi: (data: FiDataType) => void;
  isDefault: boolean;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  onExport: () => void;
  loadFisByTypeFunction: (id: number) => void;
  selectedFIType?: FiTypeDataType;
  setImportProgressActive: React.Dispatch<React.SetStateAction<boolean>>;
  setImportProgress: React.Dispatch<React.SetStateAction<number>>;
  cancelSelectedRows?: () => void;
  selectedRowsLen?: () => number;
}

const StyledActionBtnsContainer = styled(Box)({
  borderRadius: "10px 10px 0px 10px",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
});

const StyledIconsContainer = styled(Box)(({ theme }: any) => ({
  borderRadius: "96px",
  width: "32px",
  height: "32px",
  marginRight: "8px",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& .MuiSvgIcon-root": {
    ...theme.smallIcon,
  },
}));

const FiToolbarAction: React.FC<FiToolbarActionProps> = ({
  activeFIMainToolbar,
  onDeleteMultipleRowsClick,
  columns,
  reloadFi,
  isDefault,
  setColumns,
  onExport,
  loadFisByTypeFunction,
  selectedFIType,
  setImportProgressActive,
  setImportProgress,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { openErrorWindow } = useErrorWindow();
  const { hasPermission } = useConfig();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [fiErrorModalIsOpen, setFiErrorModalIsOpen] = useState(false);
  const [errorData, setErrorData] = useState<FiImportResult>({
    exceptionMessages: [],
    exceptions: undefined,
    importedFis: [],
    modifiedFis: [],
    nonExistentGroups: [],
    nonExistentLanguages: [],
    nonExistentLicenseTypes: [],
    nonExistentLicenses: [],
    nonExistentManagements: [],
    nonExistentRegions: [],
    nonExistentTypes: [],
    notImportedFis: [],
  });
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    disabled: false,
    noKeyboard: true,
    multiple: true,
    accept: [".xml"],
  });

  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileUpload();
    }
  }, [acceptedFiles]);

  useEffect(() => {
    const ws = webSocket("ws/fi", (message: string) => {
      const progressMessage = JSON.parse(message);
      handleFiImportEvent(progressMessage);
    });

    return () => {
      setImportProgress(-1);
      ws.close();
    };
  }, [selectedFIType]);

  const onAddNewCLick = () => {
    setWizardOpen(true);
  };

  const handleFiImportEvent = (progressMessage: FiImportEventType) => {
    const { importResult } = progressMessage.fiImportWrapper;
    setImportProgress(progressMessage.fiImportWrapper.percentage);

    if (importResult) {
      setImportProgressActive(false);
      setImportProgress(-1);

      const data = importResult;
      const errors: (keyof FiImportResult)[] = [
        "exceptionMessages",
        "nonExistentGroups",
        "nonExistentLanguages",
        "nonExistentLicenseTypes",
        "nonExistentLicenses",
        "nonExistentManagements",
        "nonExistentRegions",
        "nonExistentTypes",
        "notImportedFis",
      ];

      const hasErrors = errors.some((prop) => {
        const propValue = data[prop];
        return propValue !== undefined && propValue.length > 0;
      });

      if (hasErrors) {
        setErrorData(data);
        setFiErrorModalIsOpen(true);
        if (data.notImportedFis.length === 0 && selectedFIType) {
          loadFisByTypeFunction(selectedFIType.id);
        }
      } else {
        setFiErrorModalIsOpen(false);
        if (selectedFIType) {
          loadFisByTypeFunction(selectedFIType.id);
          enqueueSnackbar(t("Upload Successfully"), {
            variant: "success",
          });
        }
      }
    }
  };

  const onSaveFi = (fiModel: FiType) => {
    if (fiModel.code && fiModel.code.length > 12) {
      enqueueSnackbar(
        t("maxCharacters", {
          key: t("code"),
          charactersLength: 12,
        }),
        { variant: "warning" }
      );
      return;
    }

    createFi(fiModel)
      .then((res) => {
        setWizardOpen(false);
        enqueueSnackbar(t("fiCreated"), { variant: "success" });
        reloadFi(res.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const onFileUpload = () => {
    const formData = new FormData();
    for (let item of acceptedFiles) {
      formData.append("attachment", item);
    }
    setImportProgressActive(true);
    importFis(formData);
  };

  const printFis = () => {
    window.open(BASE_REST_URL + `/fi/print`, "_blank");
  };

  return (
    <>
      <StyledActionBtnsContainer style={{ minWidth: "560px" }}>
        <Tooltip title={t("print")} arrow>
          <StyledIconsContainer data-testid={"fi-print-btn"}>
            <ToolbarIcon
              onClickFunction={() => printFis()}
              Icon={<PrintRoundedIcon />}
              isSquare={true}
              data-testid={"print-button"}
            />
          </StyledIconsContainer>
        </Tooltip>
        {hasPermission(PERMISSIONS.FI_AMEND) && (
          <Tooltip title={t("import")} arrow>
            <Box
              style={{ marginRight: "8px" }}
              {...getRootProps()}
              data-testid={"fi-import-btn"}
            >
              <input {...getInputProps()} />
              <ToolbarIcon
                onClickFunction={open}
                Icon={<VerticalAlignTopRoundedIcon />}
                isSquare={true}
              />
            </Box>
          </Tooltip>
        )}
        <Tooltip title={t("export")} arrow>
          <StyledIconsContainer data-testid={"fi-export-btn"}>
            <ToolbarIcon
              onClickFunction={() => {
                onExport();
              }}
              Icon={<VerticalAlignBottomRoundedIcon />}
              isSquare={true}
              data-testid={"export-button"}
            />
          </StyledIconsContainer>
        </Tooltip>
        <span style={{ marginLeft: "8px" }}>
          <TableCustomizationButton
            columns={columns}
            setColumns={setColumns}
            isDefault={isDefault}
            hasColumnFreeze={true}
            tableKey={FI_GENERAL_INFO_TABLE_KEY}
          />
        </span>
        <GhostBtn
          data-testid={"delete-btn"}
          hidden={!activeFIMainToolbar}
          onClick={() => setIsDeleteConfirmOpen(true)}
          height={32}
          style={{ marginLeft: "15px" }}
          endIcon={<DeleteIcon />}
        >
          {t("delete")}
        </GhostBtn>
        <span />
        {hasPermission(PERMISSIONS.FI_AMEND) && (
          <Box marginLeft={"10px"}>
            <PrimaryBtn
              data-testid={"addNewBtn"}
              hidden={activeFIMainToolbar}
              height={32}
              onClick={onAddNewCLick}
              endIcon={<AddIcon />}
            >
              {t("addNew")}
            </PrimaryBtn>
          </Box>
        )}
      </StyledActionBtnsContainer>
      {wizardOpen && (
        <FIWizard
          onSave={onSaveFi}
          setIsOpen={setWizardOpen}
          isOpen={wizardOpen}
        />
      )}
      <DeleteForm
        headerText={t("delete")}
        bodyText={t("deleteWarning")}
        additionalBodyText={t("fi")}
        isDeleteModalOpen={isDeleteConfirmOpen}
        setIsDeleteModalOpen={setIsDeleteConfirmOpen}
        onDelete={() => {
          onDeleteMultipleRowsClick();
          setIsDeleteConfirmOpen(false);
        }}
        showConfirm={false}
      />
      {fiErrorModalIsOpen && (
        <FiErrorModal
          fiErrorModalIsOpen={fiErrorModalIsOpen}
          setFiErrorModalIsOpen={setFiErrorModalIsOpen}
          errorData={errorData}
        />
      )}
    </>
  );
};

export default FiToolbarAction;
