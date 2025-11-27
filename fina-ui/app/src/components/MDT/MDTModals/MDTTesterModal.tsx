import ClosableModal from "../../common/Modal/ClosableModal";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Box, styled } from "@mui/system";
import BugReportIcon from "@mui/icons-material/BugReport";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { CircularProgress, Typography } from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  runMdtTester,
  ruNmdtTesterFix,
} from "../../../api/services/MDTService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import { MdtNode, MdtTesterCheckType } from "../../../types/mdt.type";
import WarningIcon from "@mui/icons-material/Warning";
import Tooltip from "../../common/Tooltip/Tooltip";

interface MDTTesterModalPropTypes {
  open: boolean;

  onClose(): void;

  selectedNode: MdtNode;
}

type NodeCheckResult = {
  uuid: string;
  checkType: string;
  nodeId: number;
  nodeCode: string;
  message: string;
  correctDependenciesNodeCodes: string[] | null;
  nonExistingNodeCodes: string[];
};

const StyledRootBox = styled(Box)(() => ({
  width: "100%",
  height: "354px",
  display: "flex",
  flexDirection: "column",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "20px",
  textTransform: "capitalize",
}));

const StyledProgressBar = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
}));

const StyledFooter = styled(Box)(({ theme }) => ({
  ...(theme as any).modalFooter,
  display: "flex",
  justifyContent: "space-between",
  padding: "16px",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "16px",
  textTransform: "capitalize",
  "& .MuiSvgIcon-root": {
    paddingLeft: "10px",
  },
  width: "100%",
}));

const StyledWarningIcon = styled(WarningIcon)(() => ({
  color: "#FF8D00",
}));

const MDTTesterModal: React.FC<MDTTesterModalPropTypes> = ({
  onClose,
  open,
  selectedNode,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<NodeCheckResult[]>([]);
  const [toBeFixedMdtNodeIds, setToBeFixedMdtNodeIds] = useState<number[]>([]);
  const [fixedData, setFixedData] = useState<
    {
      key: string;
      value: string[];
    }[]
  >([]);

  const MAX_FIX_NODE_SIZE = 5_000;

  useEffect(() => {
    runMDTTest();
  }, []);

  const TO_BE_FIXED_TYPE_ENUMS = [
    MdtTesterCheckType.VARIABLE_EQUATION_HAS_INCONSISTENT_DEPENDENCIES,
    MdtTesterCheckType.DUPLICATED_DEPENDENCIES,
    MdtTesterCheckType.INVALID_MDT_DEPENDENT_NODES,
  ];

  const runMDTTest = async () => {
    try {
      setIsLoading(true);
      const res = await runMdtTester(selectedNode.id);
      setData(res.data);
      let idArr: number[] = [];
      res.data.forEach((item: NodeCheckResult) => {
        if (
          TO_BE_FIXED_TYPE_ENUMS.indexOf(
            item.checkType as MdtTesterCheckType
          ) >= 0
        ) {
          idArr.push(item.nodeId);
        }
      });

      setToBeFixedMdtNodeIds(idArr);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    } finally {
      setIsLoading(false);
    }
  };

  const mdtTesterFixHandler = async () => {
    try {
      if (toBeFixedMdtNodeIds.length > MAX_FIX_NODE_SIZE) {
        return;
      }
      setIsLoading(true);
      const res = await ruNmdtTesterFix(toBeFixedMdtNodeIds);
      setFixedData(res.data);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClosableModal
      onClose={onClose}
      open={open}
      width={540}
      height={460}
      includeHeader={true}
      title={t("mdtTester")}
      titleFontWeight={"600"}
    >
      <StyledRootBox>
        <Box overflow={"auto"} padding={"20px"} style={{ height: "100%" }}>
          {isLoading ? (
            <StyledProgressBar>
              <CircularProgress />
            </StyledProgressBar>
          ) : fixedData.length > 0 ? (
            fixedData.map((item) => {
              return (
                <Box>
                  <Typography>
                    {item.key === "FIXED" ? t("fixed") : t("failedToFix")}
                  </Typography>
                  <Box display={"flex"} flexDirection={"column"}>
                    {item.value.map((node) => {
                      return <span>{node}</span>;
                    })}
                  </Box>
                </Box>
              );
            })
          ) : (
            data.map((item) => {
              return (
                <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                  {item.message}
                </pre>
              );
            })
          )}
        </Box>
      </StyledRootBox>
      <StyledFooter>
        <Box
          sx={{
            flex: "0.5",
            flexWrap: "nowrap",
            alignItems: "center",
            display: "flex",
            minWidth: 0,
            visibility:
              toBeFixedMdtNodeIds.length < MAX_FIX_NODE_SIZE
                ? "hidden"
                : "visible",
          }}
        >
          <Tooltip title={t("tooManyNodesToFixWarning")}>
            <StyledWarningIcon
              sx={{
                marginRight: "5px",
                cursor: "pointer",
              }}
            />
          </Tooltip>
          <Typography
            noWrap
            sx={{
              fontSize: 10,
              color: "red",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginRight: "5px",
            }}
          >
            {t("tooManyNodesToFixWarning")}
          </Typography>
        </Box>
        <Box
          flex={0.5}
          flexWrap={"nowrap"}
          alignItems={"center"}
          display={"flex"}
        >
          <PrimaryBtn
            onClick={() => mdtTesterFixHandler()}
            disabled={
              isLoading || toBeFixedMdtNodeIds.length >= MAX_FIX_NODE_SIZE
            }
            endIcon={<BugReportIcon />}
          >
            {t("fixInconsistentDependencies")}
          </PrimaryBtn>
        </Box>
      </StyledFooter>
    </ClosableModal>
  );
};

MDTTesterModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default MDTTesterModal;
