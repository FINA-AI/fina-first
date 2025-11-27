import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import React from "react";
import { styled } from "@mui/system";
import Tooltip from "../Tooltip/Tooltip";

interface Committee {
  name: string;
}

export interface CommitteeBtnProps<RowType = unknown> {
  onClickFunction: (row: RowType) => void;
  row: RowType;
  value: Committee[];
}

const StyledWithComitets = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#344258" : "#FFFFFF",
  borderRadius: "100px",
  justifyContent: "center",
  font: "12px",
  fontWeight: 500,
  color: theme.palette.secondary.main,
  border: "1px solid rgb(130 151 181 / 10%)",
  cursor: "pointer",
  lineHeight: "16px",
  padding: "4px 12px",
}));

const StyledWithoutComitets = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#344258" : "#FFFFFF",
  borderRadius: "100px",
  width: "fit-content",
  display: "flex",
  justifyContent: "center",
  font: "12px",
  fontWeight: 400,
  color:
    theme.palette.mode === "dark"
      ? theme.palette.secondary.light
      : theme.palette.primary.main,
  alignItems: "center",
  border: "1px solid rgb(130 151 181 / 10%)",
  lineHeight: "16px",
  padding: "4px 12px",
  "& .MuiSvgIcon-root": {
    display: "block !important",
    width: 16,
    height: 16,
  },
}));

const StyledContainer = styled("div")(() => ({
  padding: "4px 8px",
}));

const StyledItemNameContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  paddingLeft: "4px",
  marginBottom: "4px",
}));

const StyledItemName = styled("p")(() => ({
  color: "#FFFFFF",
  fontSize: "13px",
  marginBottom: "0px !important",
  fontWeight: 400,
  lineHeight: "16px",
}));

const StyledFiberManualRecordIcon = styled(FiberManualRecordIcon)(() => ({
  width: "10px",
  height: "10px",
  marginRight: 4,
}));

const StyledAddNewIcon = styled("div")(() => ({
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#D1DDFF",
}));

const CommitteeBtn = <RowType,>({
  value,
  row,
  onClickFunction,
}: CommitteeBtnProps<RowType>): JSX.Element => {
  const { t } = useTranslation();

  const onClick = (event: React.MouseEvent<any, MouseEvent>) => {
    event.stopPropagation();
    onClickFunction(row);
  };

  const getComitetsText = () => {
    return (
      <StyledContainer>
        {(row as any).committeeList.map((item: Committee, index: number) => {
          return (
            <StyledItemNameContainer key={index}>
              <StyledFiberManualRecordIcon key={index} />

              <StyledItemName key={index}>{item.name}</StyledItemName>
            </StyledItemNameContainer>
          );
        })}
        <StyledAddNewIcon onClick={(event) => onClick(event)}>
          <Box
            display={"flex"}
            alignSelf={"center"}
            style={{ marginRight: "7px" }}
          >
            <AddIcon style={{ fontSize: 18 }} />
          </Box>
          <Box display={"flex"} alignSelf={"center"}>
            <Typography style={{ fontSize: 13, lineHeight: "16px" }}>
              {t("addNew")}
            </Typography>
          </Box>
        </StyledAddNewIcon>
      </StyledContainer>
    );
  };

  const getComitets = () =>
    value && value.length > 0 ? (
      <Tooltip arrow title={getComitetsText()}>
        <StyledWithComitets>
          {`${value.length} ${t("comitets")}`}
        </StyledWithComitets>
      </Tooltip>
    ) : (
      <StyledWithoutComitets onClick={onClick}>
        {t("addNew")} &#160; <AddIcon />
      </StyledWithoutComitets>
    );

  return getComitets();
};

export default CommitteeBtn;
