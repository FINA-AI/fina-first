import ClosableModal from "../../common/Modal/ClosableModal";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import GhostBtn from "../../common/Button/GhostBtn";
import PrimaryBtn from "../../common/Button/PrimaryBtn";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Grid, Typography } from "@mui/material";
import { Field, formatQuery, QueryBuilder } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import { loadAdvancedFilterParams } from "../../../api/services/ems/emsFilterService";
import useErrorWindow from "../../../hoc/ErrorWindow/useErrorWindow";
import {
  getStateFromLocalStorage,
  setStateToLocalStorage,
} from "../../../api/ui/localStorageHelper";
import { styled } from "@mui/material/styles";
import WarningIcon from "@mui/icons-material/Warning";

interface AdvancedFilterModalProps {
  advancedFilterModal: boolean;
  setAdvancedFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
  advancedFilterHandler: (query: string) => void;
  onFilterClear: () => void;
}

const StyledFooter = styled(Box)(({ theme }: any) => ({
  padding: 10,
  paddingRight: 20,
  ...theme.modalFooter,
}));
const StyledWarningIcon = styled(WarningIcon)(() => ({
  color: "#FF8D00",
  fontSize: 20,
  marginRight: 5,
}));
const StyledSecondaryText = styled(Typography)({
  color: "#98A7BC",
  fontSize: 14,
  lineHeight: "20px",
});

const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  advancedFilterModal,
  setAdvancedFilterModal,
  advancedFilterHandler,
  onFilterClear,
}) => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const advancedFilterKey = "EmsInspectionFilter";

  const [query, setQuery] = useState<any>();
  const [fields, setFields] = useState<Field[]>([]);

  const stringOperators = [
    {
      name: "=",
      label: "=",
    },
    {
      name: "!=",
      label: "!=",
    },
    {
      name: "in",
      label: "in",
    },
    {
      name: "LIKE",
      label: "LIKE",
    },
    {
      name: "NOT LIKE",
      label: "NOT LIKE",
    },
    {
      name: "notIn",
      label: "not in",
    },
    {
      name: "beginsWith",
      label: "begins with",
    },
    {
      name: "doesNotBeginWith",
      label: "does not begin with",
    },
    {
      name: "endsWith",
      label: "ends with",
    },
    {
      name: "doesNotEndWith",
      label: "does not end with",
    },
    {
      name: "null",
      label: "is null",
    },
    {
      name: "notNull",
      label: "is not null",
    },
  ];

  const numericOperatos = [
    {
      name: "=",
      label: "=",
    },
    {
      name: "!=",
      label: "!=",
    },
    {
      name: "in",
      label: "in",
    },
    {
      name: "notIn",
      label: "not in",
    },
    {
      name: "<",
      label: "<",
    },
    {
      name: "<=",
      label: "<=",
    },
    {
      name: ">",
      label: ">",
    },
    {
      name: ">=",
      label: ">=",
    },
    {
      name: "between",
      label: "between",
    },
    {
      name: "notBetween",
      label: "not between",
    },
    {
      name: "null",
      label: "is null",
    },
    {
      name: "notNull",
      label: "is not null",
    },
  ];

  const otherOperators = [
    {
      name: "=",
      label: "=",
    },
  ];

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const res = await loadAdvancedFilterParams();
      const data = res.data
        .filter((item: any) => !["long", "map", "list"].includes(item.type))
        .map((item: any) => ({
          id: item.id,
          name: item.id,
          label: t(item.label),
          operators: getOperators(item.type),
          valueEditorType: getValueEditor(item.type),
          fieldType: item.type,
          values:
            item.type === "enum"
              ? item.options.map((item: string, index: number) => ({
                  name: index,
                  label: item,
                }))
              : null,
          inputType: item.type === "date" ? "date" : null,
        }));
      setFields(data);
      getInspectionFilterState();
    } catch (error) {
      openErrorWindow(error, t("error"), true);
    }
  };

  const getInspectionFilterState = () => {
    const inspectionFilter = getStateFromLocalStorage();
    if (inspectionFilter[advancedFilterKey]) {
      setQuery(inspectionFilter[advancedFilterKey]["advancedFilter"]);
    }
  };

  const getValueEditor = (type: string): string | null => {
    switch (type) {
      case "enum":
        return "select";
      case "boolean":
        return "checkbox";
      default:
        return null;
    }
  };

  const clearLocalStorageFilter = () => {
    setStateToLocalStorage(advancedFilterKey, "");
  };

  const onReset = () => {
    setQuery({
      combinator: "and",
      rules: [],
    });
    clearLocalStorageFilter();
  };

  const getOperators = (type: any) => {
    switch (type) {
      case "string":
        return stringOperators;
      case "double":
      case "date":
      case "int":
        return numericOperatos;

      case "enum":
      case "boolean":
        return otherOperators;
      default:
        return [];
    }
  };

  const onFilter = () => {
    setStateToLocalStorage(advancedFilterKey, {
      advancedFilter: query,
    });

    const formatData = formatQuery(query, {
      format: "sql",
      parseNumbers: true,
      valueProcessor: (field: string, operator: string, value: any) => {
        const op = operator?.toLowerCase().trim();
        const fieldDef = fields.find((f) => f.name === field);
        const type = fieldDef?.fieldType;

        if (op === "null" || op === "notnull") return "";

        if (op === "like" || op === "not like") {
          return `'%${value}%'`;
        }

        if (op === "in" || op === "notin") {
          const vals = Array.isArray(value) ? value : String(value).split(",");
          return `(${vals
            .map((v) => {
              if (type === "int" || type === "double") return v;
              if (type === "boolean") return v === "true" ? "true" : "false";
              if (type === "date") return `{d '${v}'}`;
              return `'${v}'`;
            })
            .join(", ")})`;
        }

        if (op === "between" || op === "notbetween") {
          const vals = Array.isArray(value) ? value : String(value).split(",");
          if (vals.length === 2) {
            if (type === "date") {
              return `{d '${vals[0]}'} AND {d '${vals[1]}'}`;
            }
            if (type === "boolean") {
              return `${vals[0] === "true" ? "true" : "false"} AND ${
                vals[1] === "true" ? "true" : "false"
              }`;
            }
            return `${vals[0]} AND ${vals[1]}`;
          }
          return value;
        }

        if (type === "int" || type === "double") return value;
        if (type === "boolean")
          return value === "true" || value === true ? "true" : "false";
        if (type === "date") return `{d '${value}'}`;

        return `'${value}'`;
      },
    });

    const processedQuery = formatData.replace(/\bnotIn\b/gi, "NOT IN");

    advancedFilterHandler(processedQuery);
    setAdvancedFilterModal(false);
  };

  return (
    <ClosableModal
      onClose={() => {
        setAdvancedFilterModal(false);
      }}
      open={advancedFilterModal}
      includeHeader={true}
      title={`${t("profile")} ${t("filter")}`}
      width={800}
      disableBackdropClick={true}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box display={"flex"}>
          <Grid container direction={"column"} spacing={2} padding={"15px"}>
            <Grid item style={{ height: "300px" }}>
              <Box
                sx={{
                  overflow: "auto",
                  height: "100%",
                }}
              >
                <QueryBuilder
                  fields={fields}
                  query={query}
                  onQueryChange={(q) => setQuery(q)}
                  autoSelectField={false}
                  autoSelectOperator={true}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          padding={"0 0 5px 15px"}
        >
          <Box alignItems={"center"} display={"flex"} flexDirection={"row"}>
            <StyledWarningIcon />
            <StyledSecondaryText>
              {t("gridfilterwillbecleared")}
            </StyledSecondaryText>
          </Box>
        </Box>

        <StyledFooter
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box>
            <GhostBtn
              onClick={() => {
                setAdvancedFilterModal(false);
              }}
              style={{ marginRight: "10px" }}
            >
              {t("cancel")}
            </GhostBtn>
            <GhostBtn
              onClick={() => {
                onReset();
                onFilterClear();
              }}
              style={{ marginRight: "10px" }}
            >
              {t("reset")}
            </GhostBtn>
          </Box>

          <PrimaryBtn
            onClick={() => {
              onFilter();
            }}
            backgroundColor={"rgb(41, 98, 255)"}
            endIcon={
              <FilterAltIcon
                sx={{
                  width: 16,
                  height: 14,
                  marginLeft: "5px",
                }}
              />
            }
          >
            {t("filter")}
          </PrimaryBtn>
        </StyledFooter>
      </Box>
    </ClosableModal>
  );
};

export default AdvancedFilterModal;
