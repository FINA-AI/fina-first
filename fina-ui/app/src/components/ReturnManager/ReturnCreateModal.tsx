import ClosableModal from "../common/Modal/ClosableModal";
import { Box } from "@mui/system";
import GhostBtn from "../common/Button/GhostBtn";
import PrimaryBtn from "../common/Button/PrimaryBtn";
import { useTranslation } from "react-i18next";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import GridTable from "../common/Grid/GridTable";
import { FilterTypes, getFormattedDateValue } from "../../util/appUtil";
import useConfig from "../../hoc/config/useConfig";
import React, { useEffect, useRef, useState } from "react";
import { loadSchedules } from "../../api/services/scheduleService";
import MiniPaging from "../common/Paging/MiniPaging";
import { IconButton, Skeleton, ToggleButton } from "@mui/material";
import {
  createReturns,
  getReturnDefinitions,
  getReturnTypes,
} from "../../api/services/returnsService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import SimpleLoadMask from "../common/SimpleLoadMask";
import { useSnackbar } from "notistack";
import PeriodTypeFilter from "../common/Filter/PeriodTypeFilter";
import ReturnDefinitionFilter from "../common/Filter/ReturnDefinitionFilter";
import FiFilter from "../common/Filter/FIFilter";
import { getPeriodTypes } from "../../api/services/periodTypesService";
import { loadFiTree } from "../../api/services/fi/fiService";
import ReturnTypeAutocompleteFilter from "../common/Filter/ReturnTypeAutocompleteFilter";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import CloseBtn from "../common/Button/CloseBtn";
import ClearIcon from "@mui/icons-material/Clear";
import { ReturnVersion } from "../../types/importManager.type";
import {
  ReturnDefinitionType,
  ReturnType,
} from "../../types/returnDefinition.type";
import { FiType } from "../../types/fi.type";
import { ScheduleType } from "../../types/schedule.type";
import { FilterType } from "../../types/common.type";
import { PeriodType } from "../../types/period.type";

interface ReturnCreateModalProps {
  onClose: VoidFunction;
  returnVersions: ReturnVersion[];
  init: VoidFunction;
}

const StyledFooter = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.pagePaging({ size: "default" }),
  justifyContent: "space-evenly",
}));

const StyledScheduleContainer = styled(Box)({
  overflow: "auto",
  width: "100%",
  height: "100%",
});

const StyledToggleButton = styled(ToggleButton)({
  height: 25,
  width: "fit-content",
  padding: "4px 8px",
  color: "#596D89!important",
  fontSize: 12,
  fontWeight: 500,
  lineHeight: "16px",
  textTransform: "capitalize",
  border: "1px solid #EAEBF0",
  borderRadius: 13,
  marginRight: 8,
});

const StyledHeader = styled(Box)(({ theme }: { theme: any }) => ({
  ...theme.modalHeader,
  display: "flex",
  alignItems: "center",
  position: "relative",
}));

const StyledTitleWrapper = styled("span")<{ titleFontWeight: string }>(
  ({ titleFontWeight, theme }) => ({
    width: "100%",
    fontWeight: titleFontWeight ? titleFontWeight : "600",
    fontSize: "13px",
    lineHeight: "20px",
    textTransform: "capitalize",
    ...(theme as any).modalTitle,
  })
);

const StyledHeaderButtonsBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  marginLeft: "auto",
}));

const StyledSelectedRowsBox = styled(Box)(({ theme }) => ({
  fontWeight: 100,
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.palette.mode === "light" ? "#eaecf0" : "#3c4d68",
  color: "#2D3747",
  padding: "0px 0px 0px 8px",
  borderRadius: "4px",
  position: "absolute",
  left: "50%",
  transform: "translate(-50%)",
}));

const StyledSelectedText = styled("span")(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
}));

const StyledDivider = styled("span")(({ theme }) => ({
  width: 1,
  height: "15px",
  backgroundColor: theme.palette.mode === "light" ? "#98A7BC" : "#5D789A",
  marginLeft: "10px",
}));

const StyledClearIconBtn = styled(IconButton)(() => ({
  padding: "0px",
  marginLeft: "4px",
}));

const ReturnCreateModal: React.FC<ReturnCreateModalProps> = ({
  onClose,
  returnVersions,
  init,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useConfig();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();

  const [rows, setRows] = useState<ScheduleType[]>([]);
  const [selectedRows, setSelectedRows] = useState<ScheduleType[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fis, setFis] = useState([]);
  const [returns, setReturns] = useState([]);
  const [returnTypes, setReturnTypes] = useState([]);
  const [periodTypes, setPeriodTypes] = useState([]);
  const [filter, setFilter] = useState<FilterType>({
    page: 1,
    limit: 25,
    sortField: "id",
    sortDirection: "desc",
  });

  const allSelectedRowsRef = useRef<ScheduleType[]>([]);

  useEffect(() => {
    loadFiTypesFunction();
    getReturns();
    loadReturnTypes();
    loadPeriodTypes();
  }, []);

  useEffect(() => {
    loadScheduleData(filter);
  }, [filter]);

  const updateSelectedRowsState = (
    currentRows: ScheduleType[],
    selectedRows: ScheduleType[]
  ) => {
    const mergedRows: ScheduleType[] = currentRows
      .filter((currRow) =>
        selectedRows.some((selRow) => selRow.id === currRow.id)
      )
      .map((currRow) => {
        const matchingRow = selectedRows.find(
          (selRow) => selRow.id === currRow.id
        );
        return { ...currRow, ...matchingRow };
      });

    setSelectedRows(mergedRows);
  };

  const updateAllSelectedRowsRef = (selectedRows: ScheduleType[]) => {
    setRows((prevRows) => {
      const currentSelectedRowsIds = selectedRows.map((row) => row.id);
      const currentRowsIds = prevRows.map((row) => row.id);

      const commonIds = currentSelectedRowsIds.filter((id) =>
        currentRowsIds.includes(id)
      );
      const unCommonIds = currentRowsIds.filter(
        (id) => !currentSelectedRowsIds.includes(id)
      );

      let allSelectedRows = allSelectedRowsRef.current;
      const newSelectedRows = prevRows.filter((row) =>
        commonIds.includes(row.id)
      );

      const differenceRows = newSelectedRows.filter(
        (currRow) => !allSelectedRows.some((selRow) => selRow.id === currRow.id)
      );

      allSelectedRows = [...allSelectedRows, ...differenceRows];
      allSelectedRowsRef.current = allSelectedRows.filter(
        (row) => !unCommonIds.includes(row.id)
      );

      return prevRows;
    });
  };

  const onPageChange = (number: number) =>
    setFilter({ ...filter, page: number });

  const [columnHeaders] = useState([
    {
      field: "returnDefinition.code",
      headerName: t("code"),
      width: 150,
    },
    {
      field: "period.fromDate",
      headerName: t("periodFrom"),
      width: 150,
      renderCell: (date: number) => {
        return getFormattedDateValue(date, getDateFormat(true));
      },
    },
    {
      field: "period.toDate",
      headerName: t("periodTo"),
      width: 150,
      renderCell: (value: number) => {
        return getFormattedDateValue(value, getDateFormat(true));
      },
    },
    {
      field: "returnDefinition.name",
      headerName: t("definitionName"),
      width: 150,
    },
    {
      field: "fi.code",
      headerName: t("fiCode"),
      width: 150,
    },
    {
      field: "fi.name",
      headerName: t("fiName"),
      width: 150,
    },
    {
      field: "returnDefinition.returnType.code",
      headerName: t("returnType"),
      width: 150,
    },
    {
      field: "delay",
      headerName: t("dueDate"),
      width: 150,
    },
    {
      field: "delayHour",
      headerName: t("dueHour"),
      width: 150,
    },
    {
      field: "delayMinute",
      headerName: t("dueMinute"),
      width: 150,
    },
    {
      field: "comment",
      headerName: t("comment"),
      width: 150,
    },
  ]);

  const columnFilterConfig = [
    {
      field: "returnDefinition.code",
      type: FilterTypes.fis,
      name: "return",
      renderFilter: (
        columnsFilter: FilterType[],
        onFilterClick: (result: ReturnDefinitionType | {}) => void,
        onClear: VoidFunction
      ) => {
        return (
          <ReturnDefinitionFilter
            onClickFunction={onFilterClick}
            data={returns}
            label={t("returnDefinition")}
            closeFilter={onClear}
            defaultValue={
              columnsFilter.find((el) => el.name === "return")?.value
            }
            loading={false}
            singleSelect={true}
            isGrid={false}
          />
        );
      },
    },
    {
      field: "period.fromDate",
      type: FilterTypes.datePicker,
      name: "periodFrom",
    },
    {
      field: "period.toDate",
      type: FilterTypes.datePicker,
      name: "periodTo",
    },
    {
      field: "period.periodType.code",
      type: FilterTypes.fis,
      name: "periodType",
      value: [],
      renderFilter: (
        columnsFilter: FilterType[],
        onFilterClick: (result?: PeriodType | {}) => void,
        onClear: VoidFunction
      ) => {
        return (
          <PeriodTypeFilter
            onClickFunction={onFilterClick}
            data={periodTypes}
            label={t("periodType")}
            closeFilter={onClear}
          />
        );
      },
    },
    {
      field: "fi.code",
      type: FilterTypes.fis,
      name: "fiIds",
      renderFilter: (
        columnsFilter: FilterType[],
        onFilterClick: (result: FiType | {}) => void,
        onClear: VoidFunction
      ) => {
        return (
          <FiFilter
            label={t("nameOfBank")}
            onClickFunction={onFilterClick}
            defaultValue={
              columnsFilter.find((el) => el.name === "fiIds")?.value
            }
            closeFilter={onClear}
            data={fis}
          />
        );
      },
    },
    {
      field: "returnDefinition.returnType.code",
      type: FilterTypes.fis,
      name: "returnType",
      renderFilter: (
        columnsFilter: ReturnType[],
        onFilterClick: (result: FiType | {}) => void,
        onClear: VoidFunction,
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
      field: "delay",
      type: FilterTypes.number,
      name: "delay",
    },
    {
      field: "delayHour",
      type: FilterTypes.number,
      name: "delayHour",
    },
    {
      field: "delayMinute",
      type: FilterTypes.number,
      name: "delayMinute",
    },
    {
      field: "comment",
      type: FilterTypes.string,
      name: "comment",
    },
  ];

  const loadFiTypesFunction = () => {
    loadFiTree()
      .then((res) => {
        setFis(res.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const getReturns = () => {
    getReturnDefinitions()
      .then((resp) => {
        setReturns(resp.data);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const loadReturnTypes = () => {
    getReturnTypes()
      .then((res) => {
        setReturnTypes(res.data);
      })
      .catch((e) => {
        openErrorWindow(e, t("error"), true);
      });
  };

  const loadPeriodTypes = () => {
    getPeriodTypes()
      .then((res) => {
        setPeriodTypes(res.data);
      })
      .catch((e) => {
        openErrorWindow(e, t("error"), true);
      });
  };

  const [versionId, setVersionId] = useState<number>();

  const loadScheduleData = async (filteredData: FilterType) => {
    setLoading(true);
    let gridFilters = {
      ...filteredData,
      sortField: filter.sortField,
      sortDirection: filter.sortDirection,
    };
    const response = await loadSchedules(
      filter.page,
      filter.limit,
      gridFilters
    );
    setRows(response.data.list);
    setLoading(false);
    updateSelectedRowsState(response.data.list, allSelectedRowsRef.current);
  };

  const onSave = async () => {
    if (
      versionId &&
      (versionId <= 0 || allSelectedRowsRef.current.length <= 0)
    ) {
      onClose();
      return;
    }
    setSaving(true);

    createReturns(versionId, allSelectedRowsRef.current)
      .then(() => {
        enqueueSnackbar("Return(s) Created", { variant: "success" });
        init();
        onClose();
      })
      .catch((error) => {
        const errorLength = error.response.data.message.length > 60;
        openErrorWindow(error, t("error"), !errorLength);
      })
      .finally(() => setSaving(false));
  };

  const getValueFromArray = (arr: any[], fieldName: string, key: string) => {
    let obj = arr.find((item) => item.name === fieldName);
    if (obj) {
      if (fieldName === "returnType") {
        return obj.value?.id;
      } else if (obj.type === FilterTypes.fis && obj.value) {
        return obj.value[0]?.[key];
      }

      return obj[key];
    }

    return null;
  };

  const filterOnChangeFunction = (obj: any) => {
    let columnFilters = {
      fiIDs: obj.find((item: any) => item.name === "fiIds")
        ? obj
            .find((item: any) => item.name === "fiIds")
            .value?.map((item: any) => item.id)
        : null,
      rdId: obj.find((item: any) => item.name === "return")
        ? obj.find((item: any) => item.name === "return").value?.id
        : "",
      returnTypeId: getValueFromArray(obj, "returnType", "id"),
      periodTypeId: getValueFromArray(obj, "periodType", "id"),
      periodFrom: getValueFromArray(obj, "periodFrom", "date"),
      periodTo: getValueFromArray(obj, "periodTo", "date"),
      delay: getValueFromArray(obj, "delay", "value"),
      delayHour: getValueFromArray(obj, "delayHour", "value"),
      delayMinute: getValueFromArray(obj, "delayMinute", "value"),
      comment: getValueFromArray(obj, "comment", "value"),
    };

    const filteredObj = Object.fromEntries(
      Object.entries(columnFilters).filter(([_, value]) => Boolean(value))
    );

    let result = { page: 1, limit: filter.limit, ...filteredObj };

    setFilter(result);
  };

  const versionToggleButtonContainer = () => {
    return (
      <Box display={"flex"} data-testid={"versions-container"}>
        {!returnVersions ? (
          <Skeleton height={40} />
        ) : (
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Scrollable Versions Tabs"
            TabIndicatorProps={{ style: { display: "none" } }}
            value={versionId || false}
            sx={{
              maxWidth: "280px",
              display: "flex",
              alignItems: "center",
              overflowX: "auto",
              "& .MuiTabs-scrollButtons": {
                display: "inline-flex",
              },
              "& .MuiTabScrollButton-root": {
                width: "25px",
              },
            }}
          >
            {returnVersions.map((item, index) => (
              <StyledToggleButton
                value={item.id}
                key={index}
                selected={versionId === item.id}
                onClick={() => {
                  setVersionId(item.id);
                }}
                data-testid={"item-" + index}
              >
                {item.code}
              </StyledToggleButton>
            ))}
          </Tabs>
        )}
      </Box>
    );
  };

  const isSaveDisabled = () => {
    return (
      !versionId || versionId < 0 || allSelectedRowsRef.current.length <= 0
    );
  };

  const clearAllSelectedRowsRef = () => {
    allSelectedRowsRef.current = [];
    setSelectedRows([]);
  };

  return (
    <ClosableModal
      onClose={onClose}
      open={true}
      width={900}
      height={600}
      includeHeader={false}
      padding={"10 20"}
    >
      {saving ? <SimpleLoadMask loading={saving}></SimpleLoadMask> : <></>}
      <Box
        display={"flex"}
        width={"100%"}
        height={"100%"}
        flexDirection={"column"}
      >
        <StyledHeader flex={0} data-testid={"header"}>
          <Box display={"flex"}>
            <StyledTitleWrapper titleFontWeight={"700"}>
              {t("createReturn")}
            </StyledTitleWrapper>
          </Box>
          {allSelectedRowsRef.current.length > 0 && (
            <StyledSelectedRowsBox>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <StyledSelectedText>{t("selected")}</StyledSelectedText>
                <StyledSelectedText data-testid={"selected-rows-amount"}>
                  {allSelectedRowsRef.current.length}
                </StyledSelectedText>
              </Box>
              <StyledDivider />
              <StyledClearIconBtn
                onClick={clearAllSelectedRowsRef}
                data-testid={"clear-button"}
              >
                <ClearIcon />
              </StyledClearIconBtn>
            </StyledSelectedRowsBox>
          )}
          <StyledHeaderButtonsBox>
            <CloseBtn onClick={onClose} />
          </StyledHeaderButtonsBox>
        </StyledHeader>
        <StyledScheduleContainer flex={1}>
          <Box display={"flex"} flexDirection={"column"} height={"100%"}>
            <GridTable
              size={"small"}
              columns={columnHeaders}
              columnFilterConfig={columnFilterConfig}
              loading={loading}
              rows={rows}
              setRows={setRows}
              selectedRows={selectedRows}
              onCheckboxClick={(
                currRow: ScheduleType,
                selectedRows: ScheduleType[]
              ) => {
                updateAllSelectedRowsRef(selectedRows);
                setSelectedRows(selectedRows);
              }}
              rowOnClick={() => {}}
              filterOnChangeFunction={filterOnChangeFunction}
              checkboxEnabled={true}
            />
          </Box>
        </StyledScheduleContainer>
        <StyledFooter display={"flex"} justifyContent={"space-evenly"}>
          <Box flex={1}>{versionToggleButtonContainer()}</Box>
          <Box display={"flex"} flex={1} justifyContent={"center"}>
            <MiniPaging
              onPageChange={onPageChange}
              numberOfRowsOnPage={rows.length}
              isInfinitePaging={true}
              initialedPage={filter.page}
              initialRowsPerPage={filter.limit}
            />
          </Box>
          <Box display={"flex"} justifyContent={"flex-end"} flex={1}>
            <GhostBtn
              style={{ marginRight: "10px" }}
              onClick={onClose}
              data-testid={"cancel-button"}
            >
              {t("cancel")}
            </GhostBtn>

            <PrimaryBtn
              onClick={onSave}
              disabled={isSaveDisabled()}
              endIcon={<CheckRoundedIcon />}
              data-testid={"save-button"}
            >
              {t("save")}
            </PrimaryBtn>
          </Box>
        </StyledFooter>
      </Box>
    </ClosableModal>
  );
};

export default ReturnCreateModal;
