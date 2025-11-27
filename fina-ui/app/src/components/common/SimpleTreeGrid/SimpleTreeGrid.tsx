import React, { useState } from "react";
import { Box } from "@mui/system";
import SimpleTreeGridActionButtons from "./SimpleTreeGridActionButtons";
import { useTranslation } from "react-i18next";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CopyCellButton from "../Grid/CopyCellButton";
import { styled } from "@mui/material/styles";

interface SimpleTreeGridProps {
  rowHeight?: number;
  deleteRow: (val: any) => void;
  editRow: (val: any) => void;
  openRow: (val: any) => void;
  data: any[];
  defaultExpandedRows?: number[];
  loadChildren: (val: any) => void;
  lastLevel: number;
  selectedRow?: any;
  setSelectedRow: (val: any) => void;
  actionBtnCfg?: any;
}

const StyledRow = styled(Box)<{ isActive: boolean }>(({ theme, isActive }) => ({
  borderBottom: (theme as any).palette.borderColor,
  backgroundColor: isActive
    ? theme.palette.mode === "dark"
      ? "#2F3E71"
      : "#E1E9FF"
    : (theme as any).palette.paperBackground,
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: isActive
      ? theme.palette.mode === "dark"
        ? "#2F3E71"
        : "#E1E9FF"
      : theme.palette.mode === "dark"
      ? "#344258"
      : "#F5F5F5",
    "& #actionBtnBox": {
      display: "flex",
      alignItems: "center",
    },
    "& #copyBtn": {
      display: "flex",
    },
    "& #emptyRowEndContainer": {
      display: "none",
    },
  },
}));

const StyledActionBtnBox = styled(Box)(() => ({
  display: "none",
  marginRight: "20px",
  minWidth: "126px",
}));

const StyledAdditionInfo = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

const StyledCurrencies = styled(Box)(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.primary.main,
  fontWeight: 500,
  fontSize: "11px",
  lineHeight: "12px",
  width: "120px",
}));

const StyledInactiveCurrency = styled("span")<{ isInactive: boolean }>(
  ({ theme, isInactive }) => ({
    color: isInactive
      ? theme.palette.mode === "light"
        ? "#9AA7BE"
        : "#5D789A"
      : "",
  })
);

const StyledCode = styled(Box)(({ theme }: any) => ({
  color: theme.palette.textColor,
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "16px",
  display: "flex",
  alignItems: "center",
  height: "15px",
}));

const StyledDescription = styled(Box)(({ theme }: any) => ({
  color: theme.palette.secondaryTextColor,
  fontWeight: 400,
  fontSize: "12px",
  lineHeight: "20px",
  wordBreak: "break-all",
  textOverflow: "ellipsis!important",
  overflow: "hidden!important",
  display: "-webkit-box",
  "-webkit-box-orient": "vertical",
  "-webkit-line-clamp": 2,
  paddingTop: 4,
}));

const StyledMainText = styled(Box)(() => ({
  margin: "8px 0",
  maxHeight: "58px",
  overflow: "hidden",
}));

const StyledArrow = styled("span")(() => ({
  marginTop: "20px",
  cursor: "pointer",
  marginRight: "16px",
}));

const commonArrowStyles = () => ({
  width: 18,
  height: 18,
  color: "#98A7BC",
});

const StyledDivider = styled("span")(({ theme }) => ({
  height: "60px",
  width: 1,
  backgroundColor: theme.palette.mode === "light" ? "#98A7BC" : "#5D789A",
  marginTop: 8,
  marginLeft: 16,
  marginRight: 16,
}));

const StyledKeyboardArrowUpIcon = styled(KeyboardArrowUpIcon)(() => ({
  ...commonArrowStyles(),
}));

const StyledKeyboardArrowDownIcon = styled(KeyboardArrowDownIcon)(() => ({
  ...commonArrowStyles(),
}));

const SimpleTreeGrid: React.FC<SimpleTreeGridProps> = ({
  data = [],
  defaultExpandedRows = [],
  rowHeight,
  deleteRow,
  editRow,
  openRow,
  loadChildren,
  lastLevel,
  selectedRow,
  setSelectedRow,
  actionBtnCfg,
}) => {
  const [expandedRow, setExpandedRows] = useState([...defaultExpandedRows]);
  let treeRowIndex = 0;

  const { t } = useTranslation();

  const changeRowExpand = (type: string, row: any) => {
    type === "out"
      ? setExpandedRows(expandedRow.filter((rowId) => rowId !== row.id))
      : setExpandedRows([...expandedRow, row.id]);
    if (!("children" in row)) {
      loadChildren(row);
    }
  };

  const SimpleTreeGridRow = (data: any) => {
    return (
      <>
        {data &&
          data.map((row: any, index: number) => {
            let expanded = expandedRow.some((item) => item === row.id);
            return (
              <React.Fragment key={index}>
                <StyledRow
                  isActive={selectedRow?.id === row.id}
                  height={rowHeight && rowHeight}
                  onClick={() => setSelectedRow(row)}
                  data-testid={`SimpleTreeGrid-row-${treeRowIndex++}`}
                >
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    marginLeft={`${16 * row.level}px`}
                  >
                    <StyledArrow>
                      {row.level < lastLevel ? (
                        <>
                          {expanded ? (
                            <StyledKeyboardArrowUpIcon
                              onClick={(event) => {
                                event.stopPropagation();
                                changeRowExpand("out", row);
                              }}
                            />
                          ) : (
                            <StyledKeyboardArrowDownIcon
                              onClick={(event) => {
                                event.stopPropagation();
                                changeRowExpand("in", row);
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <div style={{ marginLeft: "10px" }} />
                      )}
                    </StyledArrow>
                    <StyledMainText>
                      <StyledCode>
                        <Box display={"flex"} alignItems={"center"}>
                          {t("code")} - {row.code}
                          <span style={{ display: "none" }} id={"copyBtn"}>
                            <CopyCellButton text={row.code} />
                          </span>
                        </Box>
                      </StyledCode>
                      <StyledDescription>{row.description}</StyledDescription>
                    </StyledMainText>
                  </Box>
                  <StyledAdditionInfo>
                    {(row.nationalCurrency || row.foreignCurrency) && (
                      <StyledDivider />
                    )}
                    {"foreignCurrency" in row && row.level !== 3 ? (
                      <StyledCurrencies>
                        <Box display={"flex"} flexDirection={"column"}>
                          <StyledInactiveCurrency
                            isInactive={!row.nationalCurrency}
                            style={{
                              paddingBottom: !row.nationalCurrency ? 12 : "",
                            }}
                          >
                            {t("nationalCurrency")}
                          </StyledInactiveCurrency>
                          <StyledInactiveCurrency
                            isInactive={!row.foreignCurrency}
                            style={{
                              paddingTop: !row.foreignCurrency ? 12 : "",
                            }}
                          >
                            {t("foreignCurrency")}
                          </StyledInactiveCurrency>
                        </Box>
                      </StyledCurrencies>
                    ) : (
                      <StyledCurrencies />
                    )}
                    <div
                      style={{ width: "146px" }}
                      id={"emptyRowEndContainer"}
                    />
                    <StyledActionBtnBox id={"actionBtnBox"}>
                      {actionBtnCfg &&
                        !actionBtnCfg.hideOnLevel.find(
                          (item: any) => item.level === row.level
                        )?.hideAll && (
                          <SimpleTreeGridActionButtons
                            deleteRow={deleteRow}
                            openRow={openRow}
                            editRow={editRow}
                            row={row}
                            actionBtnCfg={actionBtnCfg.hideOnLevel.find(
                              (item: any) => item.level === row.level
                            )}
                          />
                        )}
                    </StyledActionBtnBox>
                  </StyledAdditionInfo>
                </StyledRow>
                {expanded && SimpleTreeGridRow(row.children)}
              </React.Fragment>
            );
          })}
      </>
    );
  };

  return <Box>{SimpleTreeGridRow(data)}</Box>;
};

export default SimpleTreeGrid;
