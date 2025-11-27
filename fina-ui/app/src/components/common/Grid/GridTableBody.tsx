/* eslint-disable react/prop-types */

import TableBody from "@mui/material/TableBody";
import GridTableBodyRow from "./GridTableBodyRow";
import { FC, memo, useEffect, useRef, useState } from "react";
import { getRowHeight } from "./util/gridUtils";
import { Box } from "@mui/system";
import VirtualizedRowsV2 from "./VirtualizedRowsV2";
import { styled } from "@mui/material/styles";
import { Droppable } from "react-beautiful-dnd";

interface GridTableBodyProps {
  bodyRows: any[];
  selectedRows: any[];
  checkedRows: any[];
  onRowClick: any;
  onCheckboxClick: any;
  columns: any[];
  scrollRef: any;
  checkboxEnabled: boolean;
  singleRowSelect: boolean;
  actionButtons: any;
  size?: string;
  onCellValueChange: any;
  virtualized: boolean;
  cellRefs: any;
  headerColumnRefs: any;
  draggable: boolean;
  headerRefs: any;
  tableContainerRef: any;
  viewMode: boolean;
  rowStyleSetter: any;
  tableRef: any;
  headerRef: any;
  scrollToIndex: any;
}

const rootDivAndTableBodyCommonStyles = () => ({
  height: "100%",
  overflow: "auto",
  // display: "flex",
  // backgroundColor: theme.palette.paperBackground,
  "& .MuiTableCell-root": {
    // boxShadow: "0px 1px 0px #EAEBF0",
    // color: "#2C3644",
    fontWeight: 400,
    fontStyle: "normal",
    fontFeatureSettings: "'tnum' on, 'lnum' on",
    borderBottom: "none !important",
    borderTop: "none !important",
    overflow: "hidden",
    padding: "4px 0px 4px 10px",
    background: "inherit",
  },
});

const StyledTableBody = styled(TableBody)(() => ({
  ...rootDivAndTableBodyCommonStyles(),
}));

const StyledRootDiv = styled("div")(() => ({
  ...rootDivAndTableBodyCommonStyles(),
}));

const GridTableBody: FC<GridTableBodyProps> = memo(
  ({
    bodyRows,
    selectedRows,
    checkedRows = [],
    onRowClick,
    onCheckboxClick,
    columns,
    scrollRef,
    checkboxEnabled,
    actionButtons,
    size = "default",
    onCellValueChange,
    virtualized,
    cellRefs,
    headerRefs,
    draggable,
    tableContainerRef,
    viewMode,
    rowStyleSetter,
    tableRef,
    headerRef,
    scrollToIndex,
  }) => {
    const ref: any = useRef(null);
    const [editableCellIds, setEditableCellIds] = useState<number[]>([]);

    useEffect(() => {
      scrollHandler();
    }, [scrollToIndex]);

    useEffect(() => {
      if (headerRef.current) {
        ref.current.scrollLeft = headerRef.current.scrollLeft;
      }
    }, []);

    useEffect(() => {
      const handleClickOutside = (event: any) => {
        if (
          ref.current &&
          !ref.current.contains(event.target) &&
          editableCellIds.length > 0
        ) {
          setEditableCellIds([]);
        }
      };
      document.addEventListener("click", handleClickOutside, true);
      return () => {
        document.removeEventListener("click", handleClickOutside, true);
      };
    }, [editableCellIds]);

    const scrollHandler = () => {
      if (scrollToIndex !== undefined && scrollToIndex !== null) {
        let height = size === "small" ? 40 : 48;
        ref.current.scrollTop = scrollToIndex * height;
      } else if (virtualized) {
        ref.current.scrollTop = 1;
      }
    };
    const onScroll = (event: any) => {
      headerRef.current.scrollLeft = event.target.scrollLeft;
    };

    const rowHeight = getRowHeight(size);
    const virtualGridBodyHeight = (bodyRows.length - 1) * rowHeight;

    const isGridFlexible = columns.some((col) => !col.width && !col.fixed);

    const VirtualizedBody = () => {
      return (
        <>
          <VirtualizedRowsV2
            windowHeight={
              tableRef.current?.clientHeight === 0
                ? 900
                : tableRef.current?.clientHeight
            }
            bodyRef={ref}
            headerRef={headerRef}
            size={size}
          >
            {bodyRows.map((item, index) => (
              <GridTableBodyRow
                key={`${index}-${item.id}`}
                row={item}
                rowIndex={index}
                isSelected={selectedRows.some((row) => item.id === row.id)}
                isChecked={checkedRows.some((row) => item.id === row.id)}
                onRowClick={onRowClick}
                onCheckboxClick={onCheckboxClick}
                columns={columns}
                scrollRef={scrollRef}
                checkboxEnabled={checkboxEnabled}
                actionButtons={actionButtons}
                size={size}
                editableCellIds={editableCellIds}
                setEditableCellIds={setEditableCellIds}
                onCellValueChange={onCellValueChange}
                virtualized={true}
                cellRefs={cellRefs}
                headerRefs={headerRefs}
                draggable={draggable}
                viewMode={viewMode}
                rowStyleSetter={rowStyleSetter}
                tableRef={tableRef}
                isDraggableRow={false}
              />
            ))}
          </VirtualizedRowsV2>
        </>
      );
    };

    const BodyRows = () => {
      return (
        <>
          {bodyRows.map((row, index) => (
            <GridTableBodyRow
              key={index}
              row={row}
              rowIndex={index}
              isSelected={selectedRows.some((item) => item.id === row.id)}
              isChecked={checkedRows.some((item) => item.id === row.id)}
              onRowClick={onRowClick}
              onCheckboxClick={onCheckboxClick}
              columns={columns}
              scrollRef={scrollRef}
              checkboxEnabled={checkboxEnabled}
              actionButtons={actionButtons}
              size={size}
              editableCellIds={editableCellIds}
              setEditableCellIds={setEditableCellIds}
              onCellValueChange={onCellValueChange}
              cellRefs={cellRefs}
              draggable={draggable}
              headerRefs={headerRefs}
              virtualized={virtualized}
              viewMode={viewMode}
              rowStyleSetter={rowStyleSetter}
              tableRef={tableRef}
              isDraggableRow={false}
            />
          ))}
        </>
      );
    };

    return draggable ? (
      <Droppable
        droppableId="droppable"
        mode={virtualized ? "virtual" : "standard"}
        renderClone={(provided, snapshot, rubric) => (
          <StyledRootDiv
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={{
              ...provided.draggableProps.style,
              maxWidth: `${tableContainerRef.current.offsetWidth}px`,
              overflow: "hidden",
            }}
          >
            <GridTableBodyRow
              key={rubric.source.index}
              row={bodyRows[rubric.source.index]}
              rowIndex={rubric.source.index}
              isSelected={selectedRows.some(
                (item) => item.id === bodyRows[rubric.source.index].id
              )}
              isChecked={checkedRows.some(
                (item) => item.id === bodyRows[rubric.source.index].id
              )}
              onRowClick={onRowClick}
              onCheckboxClick={onCheckboxClick}
              columns={columns}
              scrollRef={scrollRef}
              checkboxEnabled={checkboxEnabled}
              actionButtons={actionButtons}
              size={size}
              editableCellIds={editableCellIds}
              setEditableCellIds={setEditableCellIds}
              onCellValueChange={onCellValueChange}
              cellRefs={cellRefs}
              draggable={false}
              headerRefs={headerRefs}
              isDraggableRow={true}
              virtualized={virtualized}
              rowStyleSetter={rowStyleSetter}
              tableRef={tableRef}
              viewMode={viewMode}
            />
          </StyledRootDiv>
        )}
      >
        {(provided) => (
          <StyledTableBody
            data-testid={"grid-table-body"}
            ref={(instance) => {
              provided.innerRef(instance);
              ref.current = instance;
            }}
            {...provided.droppableProps}
            style={
              virtualized
                ? {
                    width: "100%",
                    position: "sticky",
                    top: 0,
                  }
                : {}
            }
            onScroll={onScroll}
          >
            <Box
              data-testid={"grid-table-row-wrapper"}
              height={virtualized ? `${virtualGridBodyHeight}px` : "100%"}
              width={isGridFlexible ? "100%" : "unset"}
            >
              {virtualized ? VirtualizedBody() : BodyRows()}
            </Box>
            {!virtualized && provided.placeholder}
          </StyledTableBody>
        )}
      </Droppable>
    ) : (
      <StyledTableBody
        data-testid={"grid-table-body"}
        ref={ref}
        style={
          virtualized
            ? {
                width: "100%",
                position: "sticky",
                top: 0,
              }
            : {}
        }
        onScroll={onScroll}
      >
        <Box
          data-testid={"grid-table-row-wrapper"}
          height={virtualized ? `${virtualGridBodyHeight}px` : "100%"}
          width={isGridFlexible ? "100%" : "unset"}
          style={{
            paddingBottom: virtualized ? (size === "small" ? 40 : 48) : "",
          }}
          display={"table"}
        >
          {virtualized ? VirtualizedBody() : BodyRows()}
        </Box>
      </StyledTableBody>
    );
  }
);

export default GridTableBody;
