import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import Grid from "@mui/material/Grid";
import { Paper, Slide, Typography } from "@mui/material";
import ToolbarIcon from "../common/Icons/ToolbarIcon";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import AddIcon from "@mui/icons-material/Add";
import GridTable from "../common/Grid/GridTable";
import Paging from "../common/Paging/Paging";
import React, { useEffect, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import ActionBtn from "../common/Button/ActionBtn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MDTNodeComparisonsCard from "../MDT/MDTNodeComparisons/MDTNodeComparisonsCard";
import DeleteForm from "../common/Delete/DeleteForm";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import TableCustomizationButton from "../common/Button/TableCustomizationButton";
import { COMPARISONS_RULES_TABLE_KEY } from "../../api/TableCustomizationKeys";
import { styled } from "@mui/material/styles";
import withLoading from "../../hoc/withLoading";
import {
  columnFilterConfigType,
  GridColumnType,
} from "../../types/common.type";
import { FilterObjectType } from "../../containers/ComparisonsRules/ComparisonsRulesContainer";
import { MdtNode } from "../../types/mdt.type";
import { Comparison } from "../../types/comparison.type";
import useConfig from "../../hoc/config/useConfig";
import { PERMISSIONS } from "../../api/permissions";

const StyledMainLayout = styled(Box)(({ theme }: { theme: any }) => ({
  padding: "16px",
  width: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "4px",
  ...theme.mainLayout,
}));
const StyledContentContainer = styled(Grid)(({ theme }: { theme: any }) => ({
  backgroundColor: theme.palette.paperBackground,
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
  paddingBottom: 150,
}));
const StyledTitleContainer = styled(Grid)(() => ({
  borderRadius: "8px",
  height: "100%",
  boxSizing: "border-box",
  paddingTop: "8px",
  paddingBottom: "12px",
}));
const StyledMainTitleText = styled(Typography)(({ theme }: { theme: any }) => ({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "24px",
  color: theme.palette.textColor,
  display: "inline",
}));
const StyledToolbar = styled(Box)(({ theme }: { theme: any }) => ({
  padding: theme.toolbar.padding,
  maxHeight: theme.toolbar.height,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
}));

const StyledAddNewBtn = styled(Box)({
  "& .MuiSvgIcon-root": {
    paddingLeft: "10px",
  },
});

const StyledPagingContainer = styled(Box)(({ theme }: { theme: any }) => ({
  boxShadow: "3px -20px 8px -4px #BABABA1A",
  position: "relative",
  height: theme.general.footerHeight,
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  borderBottomLeftRadius: "4px",
  borderBottomRightRadius: "4px",
}));

const StyledComparisonTitle = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 16px",
  color: "#2C3644",
});

const StyledGridContainer = styled(Grid)({
  marginTop: 0,
  paddingTop: 0,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  height: "100%",
});
const StyledGridItem = styled(Grid)({
  paddingTop: 0,
  height: "100%",
  width: "100%",
});

const StyledPaper = styled(Paper)({
  width: "100%",
  height: "100%",
  boxShadow: "none",
});

const StyledCard = styled(Paper)(({ theme }: { theme: any }) => ({
  height: "100%",
  width: 700,
  zIndex: theme.zIndex.drawer - 2,
  borderLeft: theme.palette.borderColor,
  backgroundColor: theme.palette.paperBackground,
  overflow: "auto",
  right: 0,
  top: 0,
  position: "absolute",
  borderTop: theme.palette.borderColor,
}));
const StyledIcon = styled(DoubleArrowIcon)(({ theme }: { theme: any }) => ({
  color: "#C2CAD8",
  ...theme.smallIcon,
}));

const StyledEditIcon = styled(EditIcon)(({ theme }: { theme: any }) => ({
  color: "#C2CAD8",
  ...theme.smallIcon,
}));

const StyledCustomizationButton = styled("span")({
  paddingRight: "8px",
});
const StyledDetailsTitle = styled(Typography)(({ theme }: { theme: any }) => ({
  fontWeight: 600,
  color: theme.palette.textColor,
}));

interface ComparisonsRulesPageProps {
  rows: Comparison[];
  columns: GridColumnType[];
  deleteRow: (row: Comparison) => void;
  rowsLen: number;
  tableLoading: boolean;
  loading: boolean;
  pagingPage: number;
  initialRowsPerPage: number;
  setActivePage: (page: number) => void;
  setRowPerPage: (rowsPerPage: number) => void;
  isCardOpen: boolean;
  setIsCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
  saveOrUpdate: (
    data: Comparison,
    selectedNode: MdtNode | null,
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<any>;
  comparisonRuleEmptyObj: Comparison;
  mdtCodes: string[];
  columnFilterConfig: columnFilterConfigType[];
  filterOnChangeFunction: (filter: FilterObjectType[]) => void;
  setColumns: React.Dispatch<React.SetStateAction<GridColumnType[]>>;
  orderRowByHeader: (sortField: string, arrowDir: string) => void;
  comparisonCardData: Comparison;
  setComparisonCardData: React.Dispatch<React.SetStateAction<Comparison>>;
  printComparisons: () => void;
  onRefresh: () => void;
}

interface DeleteModalType {
  open: boolean;
  row?: Comparison;
}

const ComparisonsRulesPage: React.FC<ComparisonsRulesPageProps> = ({
  rows,
  columns,
  deleteRow,
  rowsLen,
  tableLoading,
  loading: _loading,
  pagingPage,
  initialRowsPerPage,
  setActivePage,
  setRowPerPage,
  saveOrUpdate,
  comparisonRuleEmptyObj,
  mdtCodes,
  isCardOpen,
  setIsCardOpen,
  columnFilterConfig,
  filterOnChangeFunction,
  setColumns,
  orderRowByHeader,
  comparisonCardData,
  setComparisonCardData,
  printComparisons,
  onRefresh,
}) => {
  const { hasPermission } = useConfig();
  const { t } = useTranslation();
  const containerRef = React.useRef(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedNode, setSelectedNode] = useState<MdtNode | null>(null);
  const [deleteModal, setDeleteModal] = useState<DeleteModalType>({
    open: false,
  });
  const hasAmendPermission = hasPermission(PERMISSIONS.MDT_AMEND);

  const onNodeChange = (node: MdtNode | null) => {
    setSelectedNode(node);
  };

  useEffect(() => {
    if (!isCardOpen) {
      setSelectedNode(null);
    }
  }, [isCardOpen]);

  let actionButtons = (row: Comparison, index: number) => {
    if (!hasAmendPermission) return <></>;

    return (
      <>
        <ActionBtn
          onClick={() => {
            setIsEditMode(true);
            setComparisonCardData(row);
            setIsCardOpen(true);
            setSelectedNode(row["node"]);
          }}
          children={<EditIcon />}
          rowIndex={index}
          buttonName={"edit"}
        />

        <ActionBtn
          onClick={() => setDeleteModal({ open: true, row: row })}
          children={<DeleteIcon />}
          color={"#FF735A"}
          rowIndex={index}
          buttonName={"delete"}
        />
      </>
    );
  };

  const onEditSave = async (data: Comparison) => {
    return saveOrUpdate(data, selectedNode, setIsEditMode);
  };

  const ComparisonDetails = (
    <StyledCard elevation={1} data-testid={"details-slide"}>
      <Box>
        <StyledComparisonTitle data-testid={"header"}>
          <StyledDetailsTitle>{t("Comparison")}</StyledDetailsTitle>

          <Box display={"flex"} gap={"10px"}>
            <Box
              hidden={!hasAmendPermission || isEditMode}
              style={{ cursor: "pointer" }}
              onClick={() => setIsEditMode(true)}
              data-testid={"edit-button"}
            >
              <StyledEditIcon />
            </Box>
            <Box
              fontWeight={400}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setIsCardOpen(false);
                setIsEditMode(false);
              }}
              data-testid={"close-button"}
            >
              <StyledIcon />
            </Box>
          </Box>
        </StyledComparisonTitle>
        <MDTNodeComparisonsCard
          onDeleteFunction={() => {
            if (!selectedNode) return;
            setIsCardOpen(false);
            deleteRow({ ...comparisonCardData, node: selectedNode });
          }}
          onEditSaveFunction={(data) => onEditSave(data)}
          validMdtCodes={mdtCodes}
          data={comparisonCardData}
          setComparisonCardData={setComparisonCardData}
          index={1}
          editMode={isEditMode}
          editCancelFunction={() => {
            comparisonCardData.id === 0 && setIsCardOpen(false);
            setIsEditMode(false);
          }}
          onNodeChange={onNodeChange}
          selectedNode={selectedNode}
          isComparisonRule={true}
          disabledMdtChooser={comparisonCardData?.id > 0}
        />
      </Box>
    </StyledCard>
  );

  return (
    <StyledMainLayout ref={containerRef}>
      <Grid
        container
        spacing={0}
        overflow={"hidden"}
        height={"100%"}
        borderRadius={"4px"}
      >
        <Grid item xs={12}>
          <StyledTitleContainer item xs={12}>
            <StyledMainTitleText>{t("comparisonRules")}</StyledMainTitleText>
          </StyledTitleContainer>
        </Grid>
        <StyledContentContainer item xs={12}>
          <StyledToolbar data-testid={"toolbar"}>
            <Box display={"flex"} justifyContent={"end"}>
              <Box display={"flex"} marginRight={"5px"}>
                <Box marginRight={"5px"}>
                  <ToolbarIcon
                    onClickFunction={() => {
                      printComparisons();
                    }}
                    Icon={<PrintRoundedIcon />}
                    data-testid={"print-button"}
                  />
                </Box>
                <ToolbarIcon
                  onClickFunction={() => {
                    onRefresh();
                  }}
                  Icon={<RefreshIcon />}
                  data-testid={"refresh-button"}
                />
              </Box>
              <StyledCustomizationButton>
                <TableCustomizationButton
                  columns={columns}
                  setColumns={setColumns}
                  isDefault={false}
                  hasColumnFreeze={true}
                  tableKey={COMPARISONS_RULES_TABLE_KEY}
                />
              </StyledCustomizationButton>

              <StyledAddNewBtn hidden={!hasAmendPermission}>
                <PrimaryBtn
                  onClick={() => {
                    setIsEditMode(true);
                    setComparisonCardData(comparisonRuleEmptyObj);
                    setIsCardOpen(true);
                  }}
                  disabled={isCardOpen}
                  endIcon={<AddIcon />}
                  data-testid={"create-button"}
                >
                  {t("addNew")}
                </PrimaryBtn>
              </StyledAddNewBtn>
            </Box>
          </StyledToolbar>

          <StyledGridContainer>
            <StyledGridItem>
              <StyledPaper>
                <GridTable
                  columns={columns}
                  rows={rows}
                  rowOnClick={(row: Comparison, deselect: boolean) => {
                    setComparisonCardData(row);
                    setIsEditMode(false);
                    setIsCardOpen(!deselect);
                    setSelectedNode(row["node"]);
                  }}
                  singleRowSelect={true}
                  loading={tableLoading}
                  actionButtons={actionButtons}
                  columnFilterConfig={columnFilterConfig}
                  filterOnChangeFunction={filterOnChangeFunction}
                  orderRowByHeader={orderRowByHeader}
                />
              </StyledPaper>
              <StyledPaper>
                <Slide
                  direction="left"
                  in={isCardOpen}
                  container={containerRef.current}
                  timeout={600}
                >
                  {ComparisonDetails}
                </Slide>
              </StyledPaper>
            </StyledGridItem>
          </StyledGridContainer>
          <StyledPagingContainer>
            <Paging
              onRowsPerPageChange={(number) => setRowPerPage(number)}
              onPageChange={(number) => setActivePage(number)}
              totalNumOfRows={rowsLen}
              initialPage={pagingPage}
              initialRowsPerPage={initialRowsPerPage}
            />
          </StyledPagingContainer>
        </StyledContentContainer>
      </Grid>
      {deleteModal.open && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("comparison")}
          isDeleteModalOpen={deleteModal.open}
          setIsDeleteModalOpen={(val: boolean) => {
            setDeleteModal({ open: val });
          }}
          onDelete={() => {
            if (deleteModal.row) {
              deleteRow(deleteModal.row);
            }
            setDeleteModal({ open: false });
          }}
          showConfirm={false}
        />
      )}
    </StyledMainLayout>
  );
};

export default withLoading(ComparisonsRulesPage);
