import React, { MutableRefObject, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import Box from "@mui/system/Box";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import GridTable from "../../../common/Grid/GridTable";
import DeleteIcon from "@mui/icons-material/Delete";
import { ViolationType } from "../../../../types/emsFiProfile.type";
import DatePicker from "../../../common/Field/DatePicker";
import TextField from "../../../common/Field/TextField";
import { styled } from "@mui/material/styles";

interface EmsProfileInspectionViolationGridProps {
  data: ViolationType[];
  violationsRef: MutableRefObject<ViolationType[]>;
  isViewMode: boolean;
}

const StyledHeader = styled(Box)(({ theme }: any) => ({
  padding: "0px 15px",
  background:
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

const EmsProfileInspectionViolationGrid: React.FC<
  EmsProfileInspectionViolationGridProps
> = ({ data, violationsRef, isViewMode }) => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<ViolationType[]>([]);

  useEffect(() => {
    if (violationsRef.current && violationsRef.current.length !== 0) {
      setRows([...violationsRef.current, ...data]);
    } else {
      setRows([...data]);
    }

    violationsRef.current = data;
  }, [data]);

  const onDataChange = (key: string, value: any, id: number): void => {
    violationsRef.current = violationsRef.current.map((item) =>
      item.id === id ? { ...item, [key]: value } : item
    );
    setRows(violationsRef.current);
  };

  const [columns] = useState([
    {
      field: "violation",
      headerName: t("violation"),
      hideCopy: true,
      flex: 1,
      renderCell: (v: string, row: any) => {
        return (
          <TextField
            key={row.id}
            value={row.violation}
            onChange={(value: string) =>
              onDataChange("violation", value, row.id)
            }
            size={"small"}
            isDisabled={isViewMode}
            fieldName={"violation"}
          />
        );
      },
    },
    {
      field: "violationDate",
      headerName: t("date"),
      hideCopy: true,
      flex: 1,
      renderCell: (v: string, row: any) => {
        return (
          <Box
            key={row.id}
            height={"100%"}
            sx={{
              "& .MuiOutlinedInput-root": {
                paddingRight: "0px",
                "& .MuiInputAdornment-root": {
                  width: "65px",
                },
              },
            }}
          >
            <DatePicker
              value={row.violationDate}
              onChange={(value: any) =>
                onDataChange("violationDate", value, row.id)
              }
              size={"small"}
              isDisabled={isViewMode}
              data-testid={"violation-date"}
            />
          </Box>
        );
      },
    },
    {
      field: "comment",
      headerName: t("comment"),
      hideCopy: true,
      flex: 1,
      renderCell: (v: string, row: any) => {
        return (
          <TextField
            key={row.id}
            value={row.comment}
            onChange={(value: string) => onDataChange("comment", value, row.id)}
            size={"small"}
            isDisabled={isViewMode}
            fieldName={"comment"}
          />
        );
      },
    },
    {
      field: "",
      headerName: "",
      hideCopy: true,
      width: 30,
      hideSort: true,
      renderCell: (v: string, row: any) => {
        return (
          <Box onClick={() => onDeleteRow(row)} data-testid={"delete-button"}>
            <DeleteIcon sx={{ color: "#FF735A", cursor: "pointer" }} />
          </Box>
        );
      },
    },
  ]);

  const onAddRow = (): void => {
    let newRow = { violation: "", id: (rows.length + 1) * -1 };
    let updatedRows = rows.map((item) => {
      let obj = violationsRef.current.find((child) => child.id === item.id);
      if (obj) {
        return {
          id: obj.id,
          violation: obj.violation,
          violationDate: obj.violationDate,
          comment: obj.comment,
        };
      }
    });
    setRows([
      newRow,
      ...(updatedRows.filter((item) => item !== undefined) as ViolationType[]),
    ]);
    violationsRef.current.unshift(newRow);
  };

  const onDeleteRow = (row: ViolationType): void => {
    setRows((prevRows) => prevRows.filter((item) => item.id !== row.id));
    violationsRef.current = violationsRef.current.filter(
      (item) => item.id !== row.id
    );
  };

  const onRowSetter = (): object => {
    return {
      "& .MuiTableCell-root": {
        "& div": {
          width: "100% ",
        },
      },
    };
  };

  return (
    <Box
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
      paddingTop={"16px"}
      data-testid={"inspection-violation-grid"}
    >
      <StyledHeader data-testid={"header"}>
        <span style={{ fontSize: "14px" }}>{t("violations")}</span>
        <StyledIconButton
          onClick={() => onAddRow()}
          disabled={isViewMode}
          data-testid={"add-button"}
        >
          <AddIcon
            sx={{ color: isViewMode ? "#8DAFD3" : "#fff" }}
            fontSize={"small"}
          />
        </StyledIconButton>
      </StyledHeader>

      <Box height={"200px"}>
        <GridTable
          columns={columns}
          rows={rows}
          setRows={setRows}
          size={"small"}
          selectedRows={[]}
          disableRowSelection={true}
          checkboxEnabled={false}
          loading={false}
          rowStyleSetter={onRowSetter}
        />
      </Box>
    </Box>
  );
};

export default EmsProfileInspectionViolationGrid;
