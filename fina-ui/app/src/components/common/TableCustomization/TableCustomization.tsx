import {
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from "@mui/material";
import { DragDropContext } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import PrimaryBtn from "../Button/PrimaryBtn";
import GhostBtn from "../Button/GhostBtn";
import CheckboxBtn from "../Checkbox/CheckboxBtn";
import DoneIcon from "@mui/icons-material/Done";
import ClosableModal from "../Modal/ClosableModal";
import DraggableListContainer from "../../FI/Configuration/Common/DraggableListContainer";
import CloseBtn from "../Button/CloseBtn";
import { Box } from "@mui/system";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { DroppableTypes, GridColumnType } from "../../../types/common.type";
import {
  openTableCustomization,
  updateState,
} from "../../../redux/actions/stateActions";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

interface TableCustomizationProps {
  columns?: GridColumnType[];
  setColumns?: (columns: GridColumnType[]) => void;
  openedTableKey: string;
  setOpenedTableKey: (isOpen: string) => void;
  isDefault: boolean;
  hasColumnFreeze?: boolean;
  tableKey: string;
  setState: (state: any) => void;
  state: any;
}

const StyledRightHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  padding: 0,
  margin: 0,
});

const StyledContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flex: 1,
  overflow: "auto",
  padding: "10px",
  boxSizing: "border-box",
  width: "100%",
  height: "100%",
  background: theme.palette.mode === "dark" ? "#1F2532" : "",
}));

const StyledFooter = styled(DialogActions)(({ theme }: any) => ({
  overflow: "hidden",
  padding: "8px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  ...theme.modalFooter,
}));

const StyledSubtitle = styled(DialogContentText)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1F2532" : "",
  color: theme.palette.mode === "dark" ? "#a9b6d1" : "#687A9E",
  fontSize: "12px",
  fontWeight: "400",
  lineHeight: "20px",
  paddingLeft: "16px",
  paddingRight: "16px",
  marginTop: "0px",
  paddingBottom: "16px",
}));

const StyledColumnsLabel = styled(DialogContentText)(() => ({
  fontSize: "12px",
  fontWeight: "600",
  lineHeight: "18px",
  padding: "16px 0px 8px 16px",
}));

const StyledTitle = styled(Typography)(({ theme }: any) => ({
  ...theme.modalHeader,
}));

const StyledColumnBox = styled(DialogContent)({
  display: "flex",
  flexDirection: "column",
  width: "345px",
  overflowY: "hidden",
  overflowX: "hidden",
  paddingTop: "0px",
  paddingLeft: "0px",
  paddingRight: "0px",
});

const StyledMakeDefaultLabel = styled(Box)({
  fontSize: "14px",
  fontWeight: "400",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const TableCustomization: React.FC<TableCustomizationProps> = ({
  columns,
  setColumns,
  openedTableKey,
  setOpenedTableKey,
  isDefault,
  hasColumnFreeze = false,
  tableKey,
  setState,
  state,
}) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<GridColumnType[]>([]);
  const [displayColumns, setDisplayColumns] = useState<GridColumnType[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<GridColumnType[]>([]);
  const [makeDefault, setMakeDefault] = useState(isDefault);

  useEffect(() => {
    if (openedTableKey === tableKey) {
      initConfig();
    }
  }, [openedTableKey]);

  const initConfig = () => {
    let colsArray = [
      ...(columns ?? [])
        .map((element, index) => {
          return {
            ...element,
            isSelected: !element.hidden,
            sequence: index,
            index: index,
            id: element.field,
          };
        })
        .sort((a, b) => (a.isSelected ? 1 : b.isSelected ? -1 : 0)),
    ];

    setItems([...colsArray]);

    setDisplayColumns([
      ...colsArray
        .filter((c) => c.isSelected)
        .sort((a, b) => a.sequence - b.sequence),
    ]);

    setHiddenColumns([
      ...colsArray
        .filter((c) => !c.isSelected)
        .sort((a, b) => a.sequence - b.sequence),
    ]);
  };

  const updateColumnsSequences = (columns: GridColumnType[]) => {
    return [
      ...columns.map((col, index) => {
        return { ...col, sequence: index };
      }),
    ];
  };

  const handleTransfer = (
    item: GridColumnType,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const isSource = !item.isSelected;

    let fromColumns = isSource ? hiddenColumns : displayColumns;
    let toColumns = isSource ? displayColumns : hiddenColumns;

    const startIndex =
      sourceIndex !== undefined
        ? sourceIndex
        : fromColumns.findIndex((col) => col.field === item.field);
    let endIndex =
      destinationIndex !== undefined ? destinationIndex : toColumns.length;

    // checking if destination index is above fixed column
    if (isSource && toColumns[destinationIndex]?.fixed) {
      endIndex = displayColumns.length;
    }

    const [removed] = fromColumns.splice(startIndex, 1);
    removed.isSelected = !removed.isSelected;
    removed.hidden = !removed.hidden;
    removed.fixed = false;
    toColumns.splice(endIndex, 0, removed);

    const updatedFromColumns = updateColumnsSequences(fromColumns);
    const updatedToColumns = updateColumnsSequences(toColumns);

    // From Hidden To Display
    if (isSource) {
      setHiddenColumns(updatedFromColumns);
      setDisplayColumns(updatedToColumns);
    } else {
      setDisplayColumns(updatedFromColumns);
      setHiddenColumns(updatedToColumns);
    }

    setItems([...updatedFromColumns, ...updatedToColumns]);
  };

  const onDragEnd = ({ destination, source, draggableId }: any) => {
    // dropped outside the list
    if (!destination) return;

    const sInd = source.droppableId;
    const dInd = destination.droppableId;

    if (sInd === DroppableTypes.DESTINATION_LIST) {
      source.index = displayColumns.findIndex(
        (item) => item.id === draggableId
      );
    }
    if (dInd === DroppableTypes.DESTINATION_LIST) {
      source.index = hiddenColumns.findIndex((item) => item.id === draggableId);
    }

    // In the same list
    if (sInd === dInd) {
      if (sInd === "source-list") {
        const [removed] = hiddenColumns.splice(source.index, 1);
        hiddenColumns.splice(destination.index, 0, removed);

        setHiddenColumns(updateColumnsSequences(hiddenColumns));
      } else {
        // checking if destination index is above fixed column & fixed index is below column index
        const invalidIndex =
          (displayColumns[destination.index].fixed &&
            !displayColumns[source.index].fixed) ||
          (displayColumns[source.index].fixed &&
            !displayColumns[destination.index].fixed);

        if (invalidIndex) return;

        const [removed] = displayColumns.splice(source.index, 1);
        displayColumns.splice(destination.index, 0, removed);

        setDisplayColumns(updateColumnsSequences(displayColumns));
      }

      setItems([...hiddenColumns, ...displayColumns]);
    } else {
      // From Source To Destination
      if (sInd === "source-list") {
        handleTransfer(
          hiddenColumns[source.index],
          source.index,
          destination.index
        );
      } else {
        // From Destination to source
        handleTransfer(
          displayColumns[source.index],
          source.index,
          destination.index
        );
      }
    }
  };

  const sortColumns = (columns: GridColumnType[]) => {
    const fixedVisibleColumns = columns.filter(
      (element) => element.fixed && !element.hidden
    );
    const nonFixedVisibleColumns = columns.filter(
      (element) => !element.fixed && !element.hidden
    );
    const hiddenColumns = columns.filter((element) => element.hidden);
    return fixedVisibleColumns.concat(nonFixedVisibleColumns, hiddenColumns);
  };

  const handleSwitch = (from: number) => {
    let newDisplayColumns = [...displayColumns];
    const tmp = items.filter((c) => !c.isSelected);
    newDisplayColumns[from].fixed = !newDisplayColumns[from].fixed;
    newDisplayColumns = sortColumns(newDisplayColumns);
    setDisplayColumns([...newDisplayColumns]);
    setItems([...tmp, ...newDisplayColumns]);
  };

  const onCloseModal = () => {
    setOpenedTableKey("");
    initConfig();
  };

  const onFilter = (searchValue: string, items: any) => {
    return !searchValue
      ? []
      : items.filter((item: any) =>
          item?.headerName?.toLowerCase().includes(searchValue)
        );
  };

  return openedTableKey ? (
    <ClosableModal
      open={openedTableKey === tableKey}
      onClose={onCloseModal}
      width={770}
      height={450}
      padding={0}
      includeHeader={false}
    >
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        height="100%"
        component={Paper}
      >
        <StyledTitle>
          {t("tableCustomizationTitle")}
          <CloseBtn onClick={onCloseModal} />
        </StyledTitle>
        <StyledContent>
          <DragDropContext onDragEnd={onDragEnd}>
            <StyledColumnBox
              data-hidden={true}
              data-testid={"hidden-columns-container"}
            >
              <StyledColumnsLabel>{t("hiddenColumns")}</StyledColumnsLabel>
              <DraggableListContainer
                data={hiddenColumns}
                isSourceColumn={true}
                handleTransfer={handleTransfer}
                idProperty="id"
                onFilter={onFilter}
              />
            </StyledColumnBox>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ margin: "42px 16px 20px 16px" }}
            />

            <StyledColumnBox
              data-hidden={false}
              data-testid={"visible-columns-container"}
            >
              <StyledRightHeader>
                <StyledColumnsLabel>{t("visibleColumns")}</StyledColumnsLabel>
              </StyledRightHeader>
              <DraggableListContainer
                data={displayColumns}
                isSourceColumn={false}
                handleTransfer={handleTransfer}
                idProperty="id"
                handleSwitch={handleSwitch}
                hasColumnFreeze={hasColumnFreeze}
                margin="0px 10px 0px 0px"
                onFilter={onFilter}
              />
            </StyledColumnBox>
          </DragDropContext>
        </StyledContent>
        <StyledSubtitle>{t("tableCustomizationSubtitle")}</StyledSubtitle>
        <StyledFooter>
          <StyledMakeDefaultLabel>
            <CheckboxBtn
              onClick={() => setMakeDefault(!makeDefault)}
              checked={makeDefault}
              size="small"
              padding="0px"
              data-tsetid={"make-default-checkbox"}
            />
            <span style={{ marginLeft: "8px" }}>{t("makeDefault")}</span>
          </StyledMakeDefaultLabel>
          <div>
            <GhostBtn
              onClick={onCloseModal}
              width={84}
              data-testid={"cancel-button"}
            >
              {t("cancel")}
            </GhostBtn>
            &nbsp;
            <PrimaryBtn
              onClick={() => {
                items[items.length - 1].fixed = false;
                if (tableKey) {
                  setColumns?.(items);
                  if (makeDefault) {
                    if (state && state[tableKey]) {
                      setState({
                        key: tableKey,
                        updatedState: {
                          ...state[tableKey],
                          columns: items,
                        },
                      });
                    } else {
                      setState({
                        key: tableKey,
                        updatedState: {
                          columns: items,
                        },
                      });
                    }
                  }
                }
                setOpenedTableKey("");
              }}
              endIcon={<DoneIcon />}
              data-testid={"done-button"}
            >
              {t("done")}
            </PrimaryBtn>
          </div>
        </StyledFooter>
      </Box>
    </ClosableModal>
  ) : null;
};

const mapStateToProps = (state: any) => ({
  openedTableKey: state.getIn(["state", "openedTableKey"]),
  state: state.get("state"),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setState: bindActionCreators(updateState, dispatch),
  setOpenedTableKey: bindActionCreators(openTableCustomization, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(TableCustomization));
