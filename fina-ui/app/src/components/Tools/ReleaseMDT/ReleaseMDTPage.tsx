import React from "react";
import { Box, DialogContent, Typography } from "@mui/material";
import DraggableListContainer from "../../FI/Configuration/Common/DraggableListContainer";
import { DragDropContext } from "react-beautiful-dnd";
import InfoIcon from "@mui/icons-material/Info";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import { useTranslation } from "react-i18next";
import SettingsIcon from "@mui/icons-material/Settings";
import withLoading from "../../../hoc/withLoading";
import { styled } from "@mui/material/styles";
import { ReleaseMDTFiType } from "../../../types/tools.type";

interface ReleaseMDTPageProps {
  data: ReleaseMDTFiType[];
  displayColumns: ReleaseMDTFiType[];
  save: VoidFunction;
  onDragEnd: any;
  handleSwitch(from: number): void;
  handleTransfer(item: ReleaseMDTFiType, sequence?: number): void;
}

const StyledRoot = styled(Box)({
  "&.MuiBox-root": {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
});

const StyledDragAndDropBox = styled(Box)(({ theme }: any) => ({
  "&.MuiBox-root": {
    border: theme.palette.borderColor,
    borderRadius: "4px",
    display: "flex",
    height: "230px",
    overflow: "hidden",
    padding: "16px 8px",
    margin: "12px 16px 8px 16px",
    background: theme.palette.mode === "dark" ? "#1F2532" : "inherit",
  },
}));

const StyledInfoBox = styled("div")(({ theme }) => ({
  display: "flex",
  padding: "3px 8px",
  backgroundColor: theme.palette.mode === "light" ? "#FFF4E5" : "#DC6803",
  width: "fit-content",
  borderRadius: "2px",
  margin: "0px 16px",
}));

const StyledInfoText = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#FF8D00" : "#FEF0C7",
  margin: "0px",
  marginLeft: "8px",
  fontSize: "11px",
}));

const StyledInfoIcon = styled(InfoIcon)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#FF8D00" : "#FEF0C7",
  height: "18px",
}));

const StyledColumnBox = styled(DialogContent)({
  flex: 1,
  padding: "0px 8px 0px 8px !important",
});

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  ...theme.pageToolbar,
  padding: "9px 16px",
  justifyContent: "flex-end",
  borderBottom: theme.palette.borderColor,
}));

const ReleaseMDTPage: React.FC<ReleaseMDTPageProps> = ({
  onDragEnd,
  handleTransfer,
  handleSwitch,
  data = [],
  displayColumns = [],
  save,
}) => {
  const { t } = useTranslation();

  const onFilter = (searchValue: string, items: any) => {
    return !searchValue
      ? []
      : items.filter(
          (item: any) =>
            item?.code?.toLowerCase().includes(searchValue) ||
            item?.name?.toLowerCase().includes(searchValue)
        );
  };

  return (
    <StyledRoot>
      <StyledToolbar>
        <PrimaryBtn
          onClick={() => save()}
          disabled={displayColumns.length === 0}
          endIcon={<SettingsIcon />}
          data-testid={"release-button"}
        >
          {t("release")}
        </PrimaryBtn>
      </StyledToolbar>
      <StyledDragAndDropBox>
        <DragDropContext onDragEnd={onDragEnd}>
          <StyledColumnBox data-hidden={true} data-testid={"source-container"}>
            <DraggableListContainer
              data={data}
              isSourceColumn={true}
              handleTransfer={handleTransfer}
              idProperty={"id"}
              maxWidth="100%"
              padding="0px"
              onFilter={onFilter}
            />
          </StyledColumnBox>
          <StyledColumnBox
            data-hidden={false}
            data-testid={"destination-container"}
          >
            <DraggableListContainer
              data={displayColumns}
              isSourceColumn={false}
              handleTransfer={handleTransfer}
              idProperty={"id"}
              handleSwitch={handleSwitch}
              hasColumnFreeze={false}
              maxWidth="100%"
              padding="0px"
              onFilter={onFilter}
            />
          </StyledColumnBox>
        </DragDropContext>
      </StyledDragAndDropBox>
      <StyledInfoBox>
        <StyledInfoIcon />
        <StyledInfoText>
          Move FI Type(s) from left to right box and click on the 'Release'
          button
        </StyledInfoText>
      </StyledInfoBox>
    </StyledRoot>
  );
};

export default withLoading(ReleaseMDTPage);
