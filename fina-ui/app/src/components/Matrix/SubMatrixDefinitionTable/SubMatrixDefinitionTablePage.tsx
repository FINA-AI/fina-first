import React, { FC, useEffect, useRef, useState } from "react";
import SubMatrixDefinitionTableToolbar from "./SubMatrixDefinitionTableToolbar";
import { Box, Grid } from "@mui/material";
import SubMatrixDefinitionTableRow from "./SubMatrixDefinitionTableRow";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from "react-virtualized";
import { useTranslation } from "react-i18next";
import { DefinitionTableDataType } from "../../../types/matrix.type";
import DeleteForm from "../../common/Delete/DeleteForm";
import SubMatrixDefinitionTableSkeleton from "./SubMatrixDefinitionTableSkeleton";
import Checkbox from "@mui/material/Checkbox";
import ContextMenuItem from "../../common/ContextMenu/ContextMenuItem";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import ContextMenu from "../../common/ContextMenu/ContextMenu";
import SimpleLoadMask from "../../common/SimpleLoadMask";
import { styled } from "@mui/material/styles";
import { ContextMenuInfo } from "../../../types/common.type";

export const StyledRoot = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.pageContent,
  width: "100%",
  borderRadius: "8px",
  boxSizing: "border-box",
}));

export const StyledBody = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

export const StyledListHeaderCell = styled(Box)({
  display: "flex",
  alignItems: "center",
  padding: "5px 10px",
  overflow: "hidden",
  height: "30px",
  flex: 1,
});

export const StyledListHeader = styled(Box)(({ theme }: { theme: any }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexDirection: "row",
  border: theme.palette.borderColor,
  borderTop: "none",
  height: "40px",
  background: "#80808014",
}));

export const StyledAutoSizerWrapper = styled("div")({
  width: "100%",
  height: "100%",
});

export const StyledCheckBoxRoot = styled(Checkbox)({
  padding: "0",
  display: "block !important",
  color: "#C2CAD8",
  "& .MuiSvgIcon-root": {
    display: "block !important",
    width: "20px",
    height: "20px",
  },
  "& .MuiDivider-root": {
    display: "block !important",
  },
  width: "fit-content",
});

interface SubMatrixReturnDetailsPageProps {
  loading: boolean;
  showLoadingMask: boolean;
  data: DefinitionTableDataType[];
  onSave: () => void;
  addNew: () => void;
  onDelete: (row: DefinitionTableDataType, rowIndex?: number) => void;
  updateRow: () => void;
  dataTypeCell: { label: string; value: string }[];
  scrollToIndex: number;
  handlePaste: (event: any) => void;
  setIsSaveDisabled: (value: boolean) => void;
  isSaveDisabled: boolean;
  deleteModal: {
    open: boolean;
    row: DefinitionTableDataType;
    index?: number;
    loading: boolean;
  };
  setDeleteModal: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      row: DefinitionTableDataType;
      index?: number;
      loading: boolean;
    }>
  >;
  onMoveUpOrDownFunction: (
    moveDirection: string,
    selectedRow: DefinitionTableDataType
  ) => void;
  contextMenuLoader: boolean;
  onDeleteMulti(checkedRows: Map<number, DefinitionTableDataType>): void;
}

const SubMatrixDefinitionTablePage: FC<SubMatrixReturnDetailsPageProps> = ({
  loading,
  data,
  onSave,
  addNew,
  onDelete,
  updateRow,
  dataTypeCell,
  scrollToIndex,
  handlePaste,
  setIsSaveDisabled,
  isSaveDisabled,
  onDeleteMulti,
  deleteModal,
  setDeleteModal,
  onMoveUpOrDownFunction,
  contextMenuLoader,
  showLoadingMask,
}) => {
  const { t } = useTranslation();
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100,
    })
  );

  const [checkedRows, setCheckedRows] = useState<
    Map<number, DefinitionTableDataType>
  >(new Map());
  const [contextMenuInfo, setContextMenuInfo] = useState<ContextMenuInfo>(null);

  useEffect(() => {
    const handleClick = () => {
      setContextMenuInfo(null);
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [contextMenuInfo]);

  const saveValidation = (row: DefinitionTableDataType) => {
    setIsSaveDisabled(!(row.mdtNodeCode && row.cell));
  };

  const handleSingleCheckedRow = (
    row: DefinitionTableDataType,
    value: boolean
  ) => {
    if (contextMenuInfo) {
      setContextMenuInfo(null);
    }
    if (!value) {
      checkedRows.delete(row.id);
      setCheckedRows(new Map(checkedRows));
    } else {
      checkedRows.set(row.id, row);
      setCheckedRows(new Map(checkedRows));
    }
  };

  const handleCheckedAllRows = (checked: boolean) => {
    if (!checked) {
      setCheckedRows(new Map());
    } else {
      const checkedRowsMap = new Map<number, DefinitionTableDataType>();
      data.forEach((obj) => {
        checkedRowsMap.set(obj.id, obj);
      });
      setCheckedRows(checkedRowsMap);
    }
  };

  const handleDeleteModal = () => {
    setDeleteModal((prevState) => ({
      ...prevState,
      loading: true,
    }));
    if (deleteModal.row.id) {
      onDelete(deleteModal.row, deleteModal.index);
      checkedRows.delete(deleteModal.row.id);
      setCheckedRows(checkedRows);
    } else {
      onDeleteMulti(checkedRows);
      setCheckedRows(new Map());
    }
  };

  const IsIndeterminate = () => {
    return checkedRows.size > 0 && checkedRows.size < data.length;
  };

  let contextMenus = (selectedRow: DefinitionTableDataType) => {
    return (
      <div>
        <ContextMenuItem
          onClick={() => {
            onMoveUpOrDownFunction("up", selectedRow);
          }}
          name={t("moveup")}
          icon={<MoveUpIcon fontSize="small" />}
          disabled={false}
        />
        <ContextMenuItem
          onClick={() => {
            onMoveUpOrDownFunction("down", selectedRow);
          }}
          name={t("movedown")}
          icon={<MoveDownIcon fontSize="small" />}
          disabled={false}
        />
      </div>
    );
  };

  const onContextMenuHandler = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    row: DefinitionTableDataType
  ) => {
    event.preventDefault();

    const screenHeight = window.screen.height;
    const eventClientY =
      event.clientY + 300 > screenHeight ? event.clientY - 240 : event.clientY;
    setContextMenuInfo({
      x: event.clientX,
      y: eventClientY,
      target: event.currentTarget,
      row,
    });
  };

  return (
    <StyledRoot
      onPaste={(event: any) => {
        handlePaste(event);
        setIsSaveDisabled(false);
      }}
    >
      <SubMatrixDefinitionTableToolbar
        onSave={onSave}
        addNew={() => {
          addNew();
        }}
        isSaveDisabled={isSaveDisabled}
        checkedRows={checkedRows}
        setDeleteModal={setDeleteModal}
      />

      <StyledBody>
        <StyledListHeader>
          <Box sx={{ paddingLeft: "14px" }}>
            <StyledCheckBoxRoot
              checked={Boolean(checkedRows.size)}
              indeterminate={IsIndeterminate()}
              onChange={(e: any) => {
                handleCheckedAllRows(e.target.checked);
              }}
            />
          </Box>
          <StyledListHeaderCell style={{ flex: 2 }}>
            {t("code")}
          </StyledListHeaderCell>
          <StyledListHeaderCell style={{ flex: 2 }}>
            {t("description")}
          </StyledListHeaderCell>
          <StyledListHeaderCell>{t("cell")}</StyledListHeaderCell>
          <StyledListHeaderCell>{t("dataType")}</StyledListHeaderCell>
        </StyledListHeader>
        <StyledAutoSizerWrapper>
          {!loading ? (
            <AutoSizer>
              {({ width, height }) => (
                <List
                  style={{ overflowX: "hidden" }}
                  rowCount={data.length}
                  width={width}
                  height={height}
                  rowHeight={cache.current.rowHeight}
                  deferredMeasurementCache={cache.current}
                  rowRenderer={({ key, index, style, parent }) => {
                    const row = data[index];
                    return (
                      <CellMeasurer
                        key={key}
                        cache={cache.current}
                        parent={parent}
                        columnIndex={0}
                        rowIndex={index}
                      >
                        <SubMatrixDefinitionTableRow
                          key={row.id}
                          row={row}
                          style={style}
                          setDeleteModal={setDeleteModal}
                          updateRow={updateRow}
                          saveValidation={saveValidation}
                          dataTypeCell={dataTypeCell}
                          index={index}
                          isChecked={checkedRows.has(row.id)}
                          handleSingleCheckedRow={handleSingleCheckedRow}
                          onContextMenuHandler={onContextMenuHandler}
                          isSelected={contextMenuInfo?.row?.id === row.id}
                        />
                      </CellMeasurer>
                    );
                  }}
                  scrollToIndex={scrollToIndex}
                />
              )}
            </AutoSizer>
          ) : (
            <SubMatrixDefinitionTableSkeleton />
          )}
        </StyledAutoSizerWrapper>
      </StyledBody>
      {contextMenuInfo && (
        <ContextMenu
          open={true}
          contextMenuInfo={contextMenuInfo}
          handleClose={() => {
            setContextMenuInfo(null);
          }}
          contextMenus={contextMenus}
        />
      )}
      {contextMenuLoader && (
        <SimpleLoadMask
          loading={true}
          message={"Working, Please Wait..."}
          color={"primary"}
        />
      )}
      {showLoadingMask && <SimpleLoadMask loading={true} color={"primary"} />}
      {deleteModal.open && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          isDeleteModalOpen={deleteModal.open}
          setIsDeleteModalOpen={setDeleteModal}
          onDelete={() => handleDeleteModal()}
          showConfirm={false}
          loadingBtn={true}
          loading={deleteModal.loading}
        />
      )}
    </StyledRoot>
  );
};

export default SubMatrixDefinitionTablePage;
