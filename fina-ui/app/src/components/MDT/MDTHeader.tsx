import { Grid, IconButton, Typography } from "@mui/material";
import GhostBtn from "../common/Button/GhostBtn";
import { Box, styled } from "@mui/system";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import TabUnselectedRoundedIcon from "@mui/icons-material/TabUnselectedRounded";
import SmartButtonRoundedIcon from "@mui/icons-material/SmartButtonRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popover from "@mui/material/Popover";
import React, { useEffect, useState } from "react";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import PestControlRoundedIcon from "@mui/icons-material/PestControlRounded";
import { useTranslation } from "react-i18next";
import Tooltip from "../common/Tooltip/Tooltip";
import MDTTesterModal from "./MDTModals/MDTTesterModal";
import MDTGeneratorModal from "./MDTModals/MDTGeneratorModal";
import LoopIcon from "@mui/icons-material/Loop";
import ToolbarIcon from "../common/Icons/ToolbarIcon";
import {
  loadCurrentUserRootNodes,
  mdtImport,
  mdtImportTranslation,
} from "../../api/services/MDTService";
import MdtErrorModal from "./MDTErrorModal";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import webSocket from "../../api/websocket/webSocket";
import { ping } from "../../api/services/configService";
import { MdtNode, MDTNodeDataType, MDTNodeType } from "../../types/mdt.type";
import { UIEventType } from "../../types/common.type";

interface MDTHeaderProps {
  collapseAll?: () => void;
  currentNode: MdtNode;
  onExport?: () => void;
  setItems: (items: MdtNode[]) => void;
  onRefreshClick: () => void;
  selectedNodes: MdtNode[];
  onSave?: (node: MdtNode, setData?: any) => void;
  isExpanding: boolean;
  hasAmendPermission?: boolean;
  setLoadMask: (value: boolean) => void;
}

const StyledRootGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 12px",
  boxShadow: theme.palette.mode === "dark" ? "unset !important" : "",
}));

const StyledButtonContainerBox = styled(Box)(() => ({
  marginLeft: 5,
  marginRight: 5,
}));

const StyledTooltipItem = styled(Box, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<{ _disabled?: boolean }>(({ _disabled }) => ({
  height: "26px",
  padding: "4px",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "16px",
  color: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  textTransform: "capitalize",
  textJustify: "auto",
  cursor: _disabled ? "default" : "pointer",
  "&:hover": {
    background: !_disabled && "rgba(255, 255, 255, 0.1)",
  },
  opacity: !_disabled ? 1 : 0.6,
  pointerEvents: _disabled ? "none" : "auto",
}));

const MDTHeader: React.FC<MDTHeaderProps> = ({
  collapseAll,
  currentNode,
  onExport,
  setItems,
  onRefreshClick,
  selectedNodes,
  onSave,
  isExpanding,
  hasAmendPermission,
  setLoadMask,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [mdtTesterModalOpen, setMdtTesterModalOpen] = useState(false);
  const [mdtGeneratorModalOpen, setMdtGeneratorModalOpen] = useState(false);

  const [error, setError] = useState({
    open: false,
    importedFileDataError: null,
    importedFileTranslationDataError: null,
  });

  const {
    getRootProps: getRootImportedFile,
    getInputProps: getInputImportedFile,
    open: openImportedFile,
    acceptedFiles: acceptedImportedFiles,
  } = useDropzone({
    noClick: true,
    disabled: false,
    noKeyboard: true,
    multiple: true,
    accept: [".xml"],
  });

  const {
    getRootProps: getRootTranslationFile,
    getInputProps: getInputTranslationFile,
    open: openTranslationFile,
    acceptedFiles: acceptedTranslationFile,
  } = useDropzone({
    noClick: true,
    disabled: false,
    noKeyboard: true,
    multiple: true,
    accept: [".xml", ".xlsx"],
  });

  useEffect(() => {
    let ws: any = null;

    if (acceptedImportedFiles && acceptedImportedFiles.length > 0) {
      mdtImportFunc();
      ws = webSocket("ws/mdt", (message: any) => {
        const eventInfo = JSON.parse(message);
        showImportResul(eventInfo[0]);
      });

      ws.onerror = (error: any) => {
        console.log(error);
        enqueueSnackbar(t("Upload Failed"), {
          variant: "error",
        });
        setLoadMask(false);
      };
    }
    //5 min
    const pingInterval = setInterval(() => {
      ping();
    }, 300_000);

    return () => {
      if (ws) {
        ws.close();
      }
      if (pingInterval) {
        clearInterval(pingInterval);
      }
    };
  }, [acceptedImportedFiles]);

  useEffect(() => {
    if (acceptedTranslationFile && acceptedTranslationFile.length > 0) {
      mdtImportTranslationFunc();
    }
  }, [acceptedTranslationFile]);

  const showImportResul = (data: any) => {
    if (
      data.codesNotFound.length > 0 ||
      data.importedCodesToFix.length > 0 ||
      data.renamedNodes.length > 0 ||
      data.message
    ) {
      if (data.importedNodeCodes.length > 0) {
        initRootNodes();
      }
      setError({
        open: true,
        importedFileDataError: data,
        importedFileTranslationDataError: null,
      });
    } else {
      setError({
        open: false,
        importedFileDataError: null,
        importedFileTranslationDataError: null,
      });
      initRootNodes();
      enqueueSnackbar(t("Upload Successfully"), {
        variant: "success",
      });
    }
    setLoadMask(false);
  };

  const onAddNewClick = (type: MDTNodeType, dataType: MDTNodeDataType) => {
    if (onSave) {
      let newNode: MdtNode = {
        ...currentNode,
        id: -1,
        parentId: currentNode?.id ?? 0,
        type: type,
        dataType: dataType,
        key: false,
        required: false,
        disabled: false,
        name: type,
        nameStrId: 0,
        code: !currentNode?.id ? "ROOT" : currentNode.code,
      } as MdtNode;
      onSave(newNode);
    }
  };

  const initRootNodes = () => {
    loadCurrentUserRootNodes().then((resp) => {
      const data: MdtNode[] = resp.data;
      const itemLength = data.length;
      setItems(
        data.map((d, index) => {
          d.level = 1;
          if (itemLength > index + 1) {
            d.nextElementId = data[index + 1].id;
          } else {
            d.nextElementId = d.id;
          }
          return d;
        })
      );
    });
  };

  const popoverOpenHandler = (event: UIEventType) => {
    setAnchorEl(event.currentTarget);
  };
  const popoverCloseHandler = () => {
    setAnchorEl(null);
  };

  const mdtImportFunc = () => {
    setLoadMask(true);

    const formData = new FormData();
    formData.append("attachment", acceptedImportedFiles[0]);
    mdtImport(formData, currentNode.id).catch(() => {
      setLoadMask(false);
      enqueueSnackbar(t("Upload Failed"), {
        variant: "error",
      });
    });
  };
  const mdtImportTranslationFunc = () => {
    const formData = new FormData();
    formData.append("attachment", acceptedTranslationFile[0]);
    mdtImportTranslation(formData)
      .then((res) => {
        let data = res.data[0];
        if (
          data?.nonExistingLanguageCodes?.length > 0 ||
          data?.nonExistingNodes?.length > 0 ||
          data?.exception?.localizedMessage?.length > 0 ||
          data?.exceptionMessage?.length > 0
        ) {
          setError({
            open: true,
            importedFileDataError: null,
            importedFileTranslationDataError: data,
          });
        } else {
          setError({
            open: false,
            importedFileDataError: null,
            importedFileTranslationDataError: null,
          });
          initRootNodes();
          enqueueSnackbar(t("Translate Successfully"), {
            variant: "success",
          });
        }
      })
      .catch(() => {
        enqueueSnackbar(t("Translate Failed"), {
          variant: "error",
        });
      });
  };

  const disableHeaderButtons = () => {
    return (
      !hasAmendPermission ||
      !(currentNode && currentNode.type === "NODE" && currentNode.id > 0) ||
      currentNode?.catalog ||
      selectedNodes.length !== 1
    );
  };

  const disableImportButton = () => {
    return (
      !hasAmendPermission ||
      selectedNodes.length !== 1 ||
      selectedNodes[0]?.type !== MDTNodeType.NODE ||
      selectedNodes[0]?.catalog
    );
  };

  const openPopover = Boolean(anchorEl);

  const GetPopover = () => {
    return (
      <Box
        sx={{ padding: "8px", width: "150px" }}
        data-testid={"more-popover-content"}
      >
        <StyledTooltipItem
          _disabled={!hasAmendPermission}
          onClick={() => {
            popoverCloseHandler();
            setMdtGeneratorModalOpen(true);
          }}
          data-testid={"mdt-generator"}
        >
          <Box display={"flex"} alignItems={"center"} pr={"5px"}>
            <SettingsRoundedIcon
              sx={{
                fontSize: 14,
              }}
            />
            <Typography pl={"5px"} fontSize={"inherit"}>
              {t("mdtGenerator")}
            </Typography>
          </Box>
        </StyledTooltipItem>
        <StyledTooltipItem
          _disabled={
            !hasAmendPermission ||
            currentNode == null ||
            currentNode.type !== MDTNodeType.NODE
          }
          onClick={() => {
            setMdtTesterModalOpen(true);
            popoverCloseHandler();
          }}
          data-testid={"mdt-tester"}
        >
          <Box display={"flex"} alignItems={"center"} pr={"5px"}>
            <PestControlRoundedIcon
              sx={{
                fontSize: 14,
              }}
            />
            <Typography pl={"5px"} fontSize={"inherit"}>
              {t("mdtTester")}
            </Typography>
          </Box>
        </StyledTooltipItem>
      </Box>
    );
  };

  return (
    <StyledRootGrid container data-testid={"mdt-header"}>
      <Grid display={"flex"} mr={"5px"} justifyContent={"flex-start"}>
        <GhostBtn
          disabled={isExpanding}
          onClick={() => {
            collapseAll?.();
          }}
          height={32}
        >
          {t("collapseAll")}
        </GhostBtn>
      </Grid>
      <Box display={"flex"} alignItems={"center"} justifyContent={"flex-end"}>
        <Tooltip title={t("import")}>
          <Box style={{ marginRight: "8px" }} {...getRootImportedFile()}>
            <input {...getInputImportedFile()} data-testid={"import-input"} />
            <ToolbarIcon
              onClickFunction={openImportedFile}
              Icon={<UploadRoundedIcon />}
              isSquare={true}
              disabled={disableImportButton()}
              data-testid={"import-button"}
            />
          </Box>
        </Tooltip>
        <Tooltip title={t("export")}>
          <Box style={{ marginRight: "8px" }}>
            <ToolbarIcon
              onClickFunction={() => onExport?.()}
              Icon={<FileDownloadRoundedIcon />}
              isSquare={true}
              disabled={selectedNodes.length !== 1}
              data-testid={"export-button"}
            />
          </Box>
        </Tooltip>
        <Tooltip title={t("translateMDT")}>
          <Box style={{ marginRight: "8px" }} {...getRootTranslationFile()}>
            <input
              {...getInputTranslationFile()}
              data-testid={"translate-input"}
            />
            <ToolbarIcon
              onClickFunction={openTranslationFile}
              Icon={<TranslateRoundedIcon />}
              isSquare={true}
              disabled={!hasAmendPermission}
              data-testid={"translate-button"}
            />
          </Box>
        </Tooltip>
        <Tooltip title={t("refresh")}>
          <ToolbarIcon
            onClickFunction={() => onRefreshClick()}
            Icon={<LoopIcon />}
            isSquare={true}
            disabled={false}
            data-testid={"refresh-button"}
          />
        </Tooltip>

        <StyledButtonContainerBox>
          <PrimaryBtn
            onClick={() => {
              onAddNewClick(MDTNodeType.NODE, MDTNodeDataType.UNKNOWN);
            }}
            disabled={
              !hasAmendPermission ||
              !(!currentNode || currentNode?.type === MDTNodeType.NODE) ||
              currentNode?.catalog ||
              selectedNodes.length > 1
            }
            data-testid={"create-node-button"}
          >
            <Box display={"flex"} alignItems={"center"} alignContent={"center"}>
              <FolderRoundedIcon />
              <Typography ml={"5px"} fontSize={12}>
                {t("newNode")}
              </Typography>
            </Box>
          </PrimaryBtn>
        </StyledButtonContainerBox>
        <StyledButtonContainerBox>
          <PrimaryBtn
            onClick={() => {
              onAddNewClick(MDTNodeType.INPUT, MDTNodeDataType.NUMERIC);
            }}
            disabled={disableHeaderButtons()}
            data-testid={"create-input-button"}
          >
            <Box display={"flex"} alignItems={"center"} alignContent={"center"}>
              <TabUnselectedRoundedIcon />
              <Typography ml={"5px"} fontSize={12}>
                {t("newInput")}
              </Typography>
            </Box>
          </PrimaryBtn>
        </StyledButtonContainerBox>
        <StyledButtonContainerBox>
          <PrimaryBtn
            onClick={() => {
              onAddNewClick(MDTNodeType.VARIABLE, MDTNodeDataType.NUMERIC);
            }}
            disabled={disableHeaderButtons()}
            data-testid={"create-variable-button"}
          >
            <Box display={"flex"} alignItems={"center"} alignContent={"center"}>
              <SmartButtonRoundedIcon />
              <Typography ml={"5px"} fontSize={12}>
                {t("newVariable")}
              </Typography>
            </Box>
          </PrimaryBtn>
        </StyledButtonContainerBox>
        <StyledButtonContainerBox>
          <PrimaryBtn
            onClick={() => {
              onAddNewClick(MDTNodeType.LIST, MDTNodeDataType.TEXT);
            }}
            disabled={disableHeaderButtons()}
            data-testid={"create-list-button"}
          >
            <Box display={"flex"} alignItems={"center"} alignContent={"center"}>
              <FormatListBulletedRoundedIcon />
              <Typography ml={"5px"} fontSize={12}>
                {t("newList")}
              </Typography>
            </Box>
          </PrimaryBtn>
        </StyledButtonContainerBox>
        <StyledButtonContainerBox>
          <PrimaryBtn
            onClick={() => {
              onAddNewClick(MDTNodeType.DATA, MDTNodeDataType.UNKNOWN);
            }}
            disabled={disableHeaderButtons()}
            data-testid={"create-data-button"}
          >
            <Box display={"flex"} alignItems={"center"} alignContent={"center"}>
              <PostAddRoundedIcon />
              <Typography ml={"5px"} fontSize={12}>
                {t("newData")}
              </Typography>
            </Box>
          </PrimaryBtn>
        </StyledButtonContainerBox>
        <IconButton
          sx={{
            border: "unset",
            background: "inherit",
            marginLeft: "8px",
            marginRight: 0,
          }}
          onClick={popoverOpenHandler}
          data-testid={"more-button"}
        >
          <MoreVertIcon />
        </IconButton>
        <Popover
          open={openPopover}
          anchorEl={anchorEl}
          onClose={popoverCloseHandler}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{
            "& .MuiPopover-paper": {
              backgroundColor: "#2A3341 !important",
            },
          }}
        >
          {GetPopover()}
        </Popover>
      </Box>
      {mdtTesterModalOpen && (
        <MDTTesterModal
          selectedNode={currentNode}
          onClose={() => {
            setMdtTesterModalOpen(false);
          }}
          open={mdtTesterModalOpen}
        />
      )}
      {mdtGeneratorModalOpen && (
        <MDTGeneratorModal
          onClose={() => {
            setMdtGeneratorModalOpen(false);
          }}
          openModal={mdtGeneratorModalOpen}
        />
      )}
      {error.open && <MdtErrorModal error={error} setError={setError} />}
    </StyledRootGrid>
  );
};

export default MDTHeader;
