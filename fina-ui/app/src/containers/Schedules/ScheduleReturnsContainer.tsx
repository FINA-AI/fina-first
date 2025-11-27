import { useTranslation } from "react-i18next";
import ReturnsGrid from "../../components/Schedules/AddNew/ReturnsGrid";
import React, { FC, useEffect, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { getReturnDefinitions } from "../../api/services/returnsService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Box, styled } from "@mui/system";
import { FilterTypes } from "../../util/appUtil";
import ReturnDefinitionFilter from "../../components/common/Filter/ReturnDefinitionFilter";
import { FieldSize, GridColumnType } from "../../types/common.type";
import ReturnTypeAutocompleteFilter from "../../components/common/Filter/ReturnTypeAutocompleteFilter";
import {
  ReturnDefinitionType,
  ReturnType,
} from "../../types/returnDefinition.type";

const StyledInputBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  flex: 1,
  marginLeft: 25,
}));

interface ScheduleReturnsContainerProps {
  onNewScheduleChange: (key: string, value: ReturnDefinitionType[]) => void;
  data: ReturnDefinitionType[];
  checkedRows?: ReturnDefinitionType[];
  singleSelect?: boolean;
  returnTypes?: ReturnType[];
}

const ScheduleReturnsContainer: FC<ScheduleReturnsContainerProps> = ({
  onNewScheduleChange,
  data,
  checkedRows,
  singleSelect = false,
  returnTypes = [],
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const [selectedRows, setSelectedRows] = useState<ReturnDefinitionType[]>([]);
  const [rows, setRows] = useState<ReturnDefinitionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [columnFilterConfig, setColumnFilterConfig] = useState<
    GridColumnType[]
  >([]);
  const [returnDefinitionFilterData, setReturnDefinitionFilterData] = useState<
    ReturnDefinitionType[]
  >([]);

  const getFilters = () => {
    return [
      {
        field: "code",
        name: "FILTER_CODE",
        type: FilterTypes.fis,
        renderFilter: (
          columnsFilter: ReturnDefinitionType[],
          onFilterClick: () => void,
          onClear: () => void,
          value: ReturnDefinitionType[]
        ) => {
          return (
            <ReturnDefinitionFilter
              onClickFunction={onFilterClick}
              data={returnDefinitionFilterData}
              label={t("returnDefinition")}
              closeFilter={onClear}
              defaultValue={value}
              loading={false}
              singleSelect={true}
              isGrid={false}
            />
          );
        },
      },
      {
        field: "returnType.name",
        type: FilterTypes.fis,
        name: "FILTER_RETURN_TYPE_ID",
        value: [],
        renderFilter: (
          columnsFilter: ReturnType[],
          onFilterClick: () => void,
          onClear: () => void,
          value: ReturnType
        ) => {
          return (
            <ReturnTypeAutocompleteFilter
              onClickFunction={onFilterClick}
              data={returnTypes}
              label={t("returnTypes")}
              closeFilter={onClear}
              defaultValue={value}
            />
          );
        },
      },
      {
        field: "manualInput",
        type: FilterTypes.list,
        name: "FILTER_MANUAL_INPUT_ONLY",
        filterArray: [
          { label: t("yes"), value: "true" },
          { label: t("no"), value: "false" },
        ],
      },
    ];
  };

  const [columns] = useState([
    {
      field: "code",
      headerName: t("code"),
      flex: 1,
      hideCopy: true,
    },
    {
      field: "name",
      headerName: t("description"),
      flex: 1,
      hideCopy: true,
    },
    {
      field: "returnType.name",
      headerName: t("returnType"),
      flex: 1,
      hideCopy: true,
    },
    {
      field: "manualInput",
      headerName: t("manualInput"),
      flex: 1,
      hideCopy: true,
      renderCell: (val: string) => {
        return (
          <StyledInputBox>
            {val ? (
              <CheckCircleOutlineIcon style={{ color: "#289E20" }} />
            ) : (
              <RemoveCircleOutlineIcon
                style={{ color: "#ff0600", opacity: 0.8 }}
              />
            )}
          </StyledInputBox>
        );
      },
    },
  ]);

  useEffect(() => {
    setColumnFilterConfig(getFilters());
  }, [rows, returnTypes]);

  useEffect(() => {
    if (data && data.length > 0) {
      setRows([...data]);
      setReturnDefinitionFilterData([...data]);
      setLoading(false);
    } else {
      loadData({});
    }

    if (checkedRows) {
      setSelectedRows([...checkedRows]);
    }
  }, [data]);

  const onCheck = (row: ReturnDefinitionType, rows: ReturnDefinitionType[]) => {
    setSelectedRows(rows ? rows : [row]);
    onNewScheduleChange("definitions", rows ? rows.map((r) => r) : [row]);
  };

  const loadData = (filters: any) => {
    setLoading(true);
    getReturnDefinitions({ ...filters, FILTER_LOAD_All: false })
      .then((resp) => {
        setRows(resp.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const filterOnChangeFunction = (filteredData: any) => {
    let filters: any = {};
    for (let filter of filteredData) {
      if (filter.name === "FILTER_CODE" && filter.value) {
        filters["FILTER_CODE"] = filter.value.code;
      } else if (filter.name === "FILTER_RETURN_TYPE_ID" && filter.value) {
        filters["FILTER_RETURN_TYPE_ID"] = filter.value.id;
      } else {
        filters[filter.name] = filter.value;
      }
    }
    loadData(filters);
  };

  return (
    <ReturnsGrid
      columns={columns}
      loading={loading}
      rows={rows}
      setRows={setRows}
      selectedRows={selectedRows}
      onCheck={onCheck}
      singleSelect={singleSelect}
      columnFilterConfig={columnFilterConfig}
      filterOnChangeFunction={filterOnChangeFunction}
      size={FieldSize.SMALL}
    />
  );
};

export default ScheduleReturnsContainer;
