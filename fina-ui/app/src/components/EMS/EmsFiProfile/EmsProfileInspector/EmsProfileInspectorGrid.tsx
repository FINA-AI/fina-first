import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import Box from "@mui/system/Box";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import GridTable from "../../../common/Grid/GridTable";
import ActionBtn from "../../../common/Button/ActionBtn";
import DeleteIcon from "@mui/icons-material/Delete";
import EmsProfileInspectorPopover from "./EmsProfileInspectorPopover";
import { InspectorDataType } from "../../../../types/emsFiProfile.type";
import { styled } from "@mui/material/styles";

interface EmsProfileInspectorGridProps {
  viewMode: boolean;
  inspectors: InspectorDataType[];
  selectedInspectionRow: any;
  selectedInspectorsRef: any;
}

const StyledHeader = styled(Box)(({ theme }: any) => ({
  padding: "0px 15px",
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.primary.main : "#157fcc",
  color: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: "5px",
  height: 33,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  border: "none",
  height: 22,
  width: 22,
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.action.hover : "#d4e3ff2b",
  },
}));

const EmsProfileInspectorGrid: React.FC<EmsProfileInspectorGridProps> = ({
  viewMode,
  inspectors,
  selectedInspectionRow,
  selectedInspectorsRef,
}) => {
  const { t } = useTranslation();
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [selectedInspectors, setSelectedInspectors] = useState<
    InspectorDataType[]
  >([]);

  useEffect(() => {
    inspectorsRowsHandler();
  }, []);

  const inspectorsRowsHandler = () => {
    if (selectedInspectionRow?.inspectors.length > 0) {
      setSelectedInspectors(selectedInspectionRow.inspectors);
    }
  };

  const handleAddClick = (event: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  const deleteInspector = (rowItem: any, rowIndex: number) => {
    setSelectedInspectors((prevSelectedInspectors) => {
      const remainingRows = prevSelectedInspectors.filter(
        (_, index) => index !== rowIndex
      );
      selectedInspectorsRef.current = remainingRows;
      return remainingRows;
    });
  };

  const inspectorSelectionHandler = (
    checked: boolean,
    inspectorItem: InspectorDataType
  ) => {
    const updatedInspectors = checked
      ? [...selectedInspectors, inspectorItem]
      : selectedInspectors.filter(
          (inspector) =>
            inspector.login !== inspectorItem.login &&
            inspector.description !== inspectorItem.description
        );

    setSelectedInspectors(updatedInspectors);
    selectedInspectorsRef.current = updatedInspectors;
  };

  const columns = [
    {
      field: "login",
      headerName: t("username"),
      hideCopy: true,
      flex: 1,
      renderCell: (value: string, row: any) => {
        return <span>{`${value} (${row.description})`}</span>;
      },
    },
  ];

  let actionButtons = (row: any, rowIndex: number) => {
    return (
      <>
        {!viewMode && (
          <ActionBtn
            onClick={() => deleteInspector(row, rowIndex)}
            children={<DeleteIcon />}
            color={"#FF735A"}
            buttonName={"delete"}
            rowIndex={rowIndex}
          />
        )}
      </>
    );
  };

  return (
    <Box
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
      data-testid={"inspectors-grid"}
    >
      <StyledHeader data-testid={"header"}>
        <span style={{ fontSize: "14px" }}>{t("inspectors")}</span>
        <StyledIconButton
          onClick={handleAddClick}
          disabled={viewMode}
          data-testid={"add-button"}
        >
          <AddIcon
            sx={{ color: viewMode ? "#8DAFD3" : "#fff" }}
            fontSize={"small"}
          />
        </StyledIconButton>
      </StyledHeader>

      <EmsProfileInspectorPopover
        anchorEl={popoverAnchor}
        onClose={handlePopoverClose}
        inspectorSelectionHandler={inspectorSelectionHandler}
        selectedInspectors={selectedInspectors}
        inspectors={inspectors}
      />

      <Box height={"200px"}>
        <GridTable
          columns={columns}
          rows={selectedInspectors}
          setRows={setSelectedInspectors}
          size={"small"}
          actionButtons={actionButtons}
          loading={false}
          virtualized={true}
        />
      </Box>
    </Box>
  );
};

export default EmsProfileInspectorGrid;
