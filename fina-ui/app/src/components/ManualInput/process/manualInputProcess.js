import tree from "./tree";
import format from "date-fns/format";
import {
  compileErrorMessage,
  processTemplate,
} from "./comparisonMessageTemplateUtil";
import i18n from "i18next";
import parse from "date-fns/parse";

function manualInputProcess(
  numberFormat,
  dateformat,
  currentReturn,
  getFloatValue,
  setTables
) {
  const itemsByCodesMap = currentReturn.itemsByCodesMap;
  const codeByIdMap = currentReturn.codeByIdMap;
  const tables = currentReturn.tables;

  const evalExpression = (item, table) => {
    const jstTree = tree(itemsByCodesMap, item, getFloatValue);
    const calculate = () => {
      const Tree = {
        lookup: (code, row) => {
          return row == null
            ? jstTree.lookup(code)
            : jstTree.lookupRow(code, row);
        },
        lookupString: (code, row) => {
          if (row == null && item.tableType === 3) {
            row = item.rowNumber;
          }
          return row == null
            ? jstTree.lookupString(code)
            : jstTree.lookupRowString(code, row);
        },
        notrow: (code) => {
          return jstTree.notrow(code);
        },
        sumif: (code, criterion, sumNodeCode) => {
          return jstTree.sumif(code, criterion, sumNodeCode);
        },
        rowCount: (code) => {
          return jstTree.rowCount(code);
        },
        sumifs: (code, ...criteria) => {
          return jstTree.sumifs(code, criteria);
        },
        curPeriodFrom: () => {
          return format(
            new Date(currentReturn["fromDate"]),
            dateformat,
            new Date()
          );
        },
        curPeriodTo: () => {
          const result = format(
            new Date(currentReturn["toDate"]),
            dateformat,
            new Date()
          );
          return result;
        },
        lookupPeriod: () => {
          //CAN NOT IMPLEMENT ON CLIENT SIDE
          return 0.0;
        },
        curPeriodType: () => {
          return currentReturn["periodTypeCode"];
        },
        //return vct row nume or 0
        curRowNum: () => {
          return item.rowNumber;
        },
        decimalCount: () => {
          if (item.value == null) {
            return 0;
          }
          var splitted = Number(item.value).toString().split(".");

          if (splitted.length === 2) {
            return splitted[1].length;
          }

          return 0;
        },
      };

      return ((equation, args) => {
        let vars = [];
        for (let i in args) {
          vars.push("var " + i + " = this." + i + ";");
        }
        let fn = new Function(vars + equation);
        return fn.call(args);
      })(item.equation, {
        tree: Tree,
      });
    };

    let result = calculate();
    if (result === undefined || result === null) {
      result = 0.0;
    }

    if (table) {
      const trimmedValue = result.toString().trim();
      if (!isNaN(Number(trimmedValue))) {
        item.nvalue = trimmedValue;
      }
      item.value = "" + result;
      const t = tables.find((t) => t.tableId === item.tableId);

      t.rows[item.rowNumber + 1].rowItems
        .filter((r) => r.code === item.code)
        .forEach((row) => {
          row.nvalue = item.nvalue;
          row.value = item.value;
        });

      setTables([...tables]);
    }

    return result;
  };

  const calculateSubNode = (inputItem, table) => {
    let parentId = inputItem.parentId;
    if (parentId && parentId !== 0) {
      table.rows.forEach((row) => {
        for (let i = 0; i < row["rowItems"]; i++) {
          let cell = row["rowItems"][i];
          if (cell.nodeId === parentId) {
            //Check is node and eval type isn't undefined
            if (
              cell.nodeType === 1 &&
              cell["nodeEvalMethod"] &&
              cell["nodeEvalMethod"] !== "UNKNOWN"
            ) {
              evalAggregation(cell, table);
              calculateSubNode(cell, table);
            }
          }
        }
      });
    }
  };

  const recalculateAll = () => {
    currentReturn.tables.forEach((table) => {
      let rowC = 0;
      table.rows.forEach((row) => {
        if (rowC > 0) {
          row["rowItems"].forEach((rItem) => {
            recalculate(rItem, table);
          });
        }
        rowC++;
      });
    });
  };

  const recalculate = (inputItem, table) => {
    switch (inputItem.nodeType) {
      case 3: //VARIABLE
        //Calculate variable
        evalExpression(inputItem, table);
        break;
      case 1: //NODE
        //Calculate sub nodes
        calculateSubNode(inputItem, table);
        break;
      default:
        break;
    }

    evalComparisons(inputItem);

    if (inputItem.usedByNodeIds) {
      inputItem.usedByNodeIds.forEach((nodeId) => {
        let row = new Map();
        if (itemsByCodesMap[codeByIdMap[nodeId]]) {
          row = new Map(Object.entries(itemsByCodesMap[codeByIdMap[nodeId]]));
        }

        if (row && row.size > 0) {
          let usedCell = null;

          let tmp = row.values().next().value;
          if (tmp !== null) {
            if (tmp["tableType"] === 1 || tmp["tableType"] === 2) {
              //MCT and NT
              usedCell = tmp;
            } else {
              //VCT
              usedCell = row.get(inputItem.rowNumber.toString());
            }
          }

          if (usedCell && nodeId !== inputItem.nodeId) {
            recalculate(usedCell, table);
          }
        }
      });
    }
  };

  const evalAggregation = (inputItem, table) => {
    let value = 0.0;

    let subNodes = [];

    table.rows.forEach((row) => {
      row["rowItems"].forEach((cell) => {
        if (cell.parentId === inputItem.nodeId) {
          subNodes.push(cell);
        }
      });
    });

    const jsTree = tree(itemsByCodesMap, inputItem, getFloatValue);

    switch (inputItem["nodeEvalMethod"]) {
      case "SUM": {
        value = jsTree.evalSum(subNodes);
        break;
      }
      case "AVERAGE": {
        value = jsTree.evalAverage(subNodes);
        break;
      }
      case "MAX": {
        value = jsTree.evalMax(subNodes);
        break;
      }
      case "MIN": {
        value = jsTree.evalMin(subNodes);
        break;
      }
      default:
        break;
    }

    if (value) {
      const trimmedValue = value.toString().trim();
      if (!isNaN(Number(trimmedValue))) {
        inputItem.nvalue = trimmedValue;
      }
    }
    inputItem.value = "" + value;
  };

  const evalComparisons = (inputItem) => {
    let comparisonItems = currentReturn.comparisons.filter((comp) => {
      return comp.nodeId === inputItem.nodeId;
    });

    if (comparisonItems && comparisonItems.length > 0) {
      comparisonItems.forEach((cItem) => {
        let pm = evalComparison(inputItem, cItem);
        if (pm) {
          console.warn(pm.message);
        }
      });
    }
  };

  const parseAndRound = (comparisonItem, value) => {
    let v = Number.NaN;

    if (value && value.trim().length !== 0 && value !== "undefined") {
      try {
        // NumberFormat format = this.numberFormat;
        // if (comparisonItem.numberPattern && comparisonItem.numberPattern.trim().length>0) {
        //     format = NumberFormat.getFormat(comparisonItem.getNumberPattern());
        // }
        // v = format.parse(format.format(Double.parseDouble(value)));
        v = getFloatValue(value);
      } catch (ex) {
        console.error(ex);
      }
    } else {
      v = Number.NaN;
    }
    return v;
  };

  const getProcessMessage = (inputCell) => {
    return {
      returnId: currentReturn.returnId,
      tableId: inputCell.tableId,
      rowNumber: inputCell.rowNumber,
    };
  };

  const compare = (compValue, itemValue, dataType) => {
    switch (dataType) {
      case "NUMERIC": //Number
        if (!compValue || compValue === "NaN") {
          compValue = "0";
        }

        if (!itemValue || itemValue === "NaN") {
          itemValue = "0";
        }

        let cv = getFloatValue(compValue);
        let iv = getFloatValue(itemValue);

        if (iv < cv) {
          return -1;
        } else if (iv > cv) {
          return 1;
        } else {
          return 0;
        }
      case "TEXT": //Text
        if (itemValue && compValue) {
          return itemValue.localeCompare(compValue);
        }
        break;
      case "DATE": //Date
      case "DATETIME": //Date Time
        try {
          if (itemValue && compValue) {
            let id = parse(itemValue, dateformat, new Date());
            let cd = parse(compValue, dateformat, new Date());
            if (id && cd) {
              if (id > cd) {
                return 1;
              } else if (id < cd) {
                return -1;
              } else return 0;
            }
          }
        } catch (e) {
          console.error(e);
        }
        break;
      default:
        return 0;
    }
    return 0;
  };

  const createProcessMessage = (
    returnId,
    tableId,
    column,
    row,
    nodeId,
    comparisonId,
    comparisonError
  ) => {
    return {
      returnId,
      tableId,
      column,
      row,
      nodeId,
      comparisonId,
      comparisonError,
    };
  };

  const compileComparisonError = (
    inputCell,
    itemValue,
    compValue,
    comparisonItem,
    condition,
    conditionSymbol
  ) => {
    let errorMessage;
    let comparisonTemplate = comparisonItem["messageTemplate"];
    if (comparisonTemplate && comparisonTemplate.trim().length > 0) {
      errorMessage = processTemplate(inputCell, comparisonItem, {
        itemValue: itemValue,
        compValue: compValue,
      });
    } else {
      let leftEquationPresent =
        comparisonItem.leftEquation &&
        comparisonItem.leftEquation.trim().length > 0;
      errorMessage = compileErrorMessage(
        inputCell,
        comparisonItem,
        itemValue,
        condition,
        compValue,
        leftEquationPresent,
        conditionSymbol
      );
    }
    return errorMessage;
  };

  const evalComparison = (inputItem, comparisonItem) => {
    let pm = null;

    if (comparisonItem) {
      pm = getProcessMessage(inputItem);

      let errorMessage = null;

      let tmpItem = {};
      tmpItem.equation = comparisonItem.equation;
      tmpItem.returnId = inputItem.returnId;
      tmpItem.tableId = inputItem.tableId;
      tmpItem.rowNumber = inputItem.rowNumber;
      tmpItem.tableType = inputItem.tableType;
      tmpItem.value = inputItem.value;
      tmpItem.nvalue = inputItem.nvalue;

      let compValue = null;
      try {
        compValue = "" + evalExpression(tmpItem);
      } catch {}

      let itemValue = inputItem.value;
      if (
        comparisonItem.leftEquation &&
        comparisonItem.leftEquation.trim().length !== 0
      ) {
        tmpItem = {};
        tmpItem.equation = comparisonItem.leftEquation;
        tmpItem.returnId = inputItem.returnId;
        tmpItem.tableId = inputItem.tableId;
        tmpItem.rowNumber = inputItem.rowNumber;
        tmpItem.tableType = inputItem.tableType;
        tmpItem.value = inputItem.value;
        tmpItem.nvalue = inputItem.nvalue;

        itemValue = evalExpression(tmpItem);
      }

      //checks for undefined  or null
      compValue = compValue == null ? null : compValue;
      itemValue = itemValue == null ? null : itemValue;

      let dataType = inputItem.dataType;
      if (inputItem.nodeType === 3) {
        dataType = "NUMERIC"; // Number
      }

      switch (dataType) {
        case "NUMERIC":
          if (itemValue && compValue) {
            try {
              itemValue = "" + parseAndRound(comparisonItem, "" + itemValue);
              compValue = "" + parseAndRound(comparisonItem, "" + compValue);
            } catch {}
          }
          break;
        default:
          break;
      }

      let compResult = compare(compValue, itemValue, dataType);

      pm = createProcessMessage(
        inputItem.returnId,
        inputItem.tableId,
        inputItem.column,
        inputItem.row,
        inputItem.nodeId,
        comparisonItem.id,
        true
      );

      let comparisonMessage = "Value does not match comparison rule.\r\n";

      switch (comparisonItem.condition) {
        case "EQUALS": {
          if (compResult !== 0) {
            errorMessage =
              comparisonMessage +
              compileComparisonError(
                inputItem,
                itemValue,
                compValue,
                comparisonItem,
                i18n.t("equalityMessage"),
                "="
              );
          }
          break;
        }
        case "NOT_EQUALS": {
          if (compResult === 0) {
            errorMessage =
              comparisonMessage +
              compileComparisonError(
                inputItem,
                itemValue,
                compValue,
                comparisonItem,
                i18n.t("notEqualityMessage"),
                "!="
              );
          }
          break;
        }
        case "GREATER": {
          if (compResult <= 0) {
            errorMessage =
              comparisonMessage +
              compileComparisonError(
                inputItem,
                itemValue,
                compValue,
                comparisonItem,
                i18n.t("greaterThenMessage"),
                ">"
              );
          }
          break;
        }
        case "GREATER_EQUALS": {
          if (compResult < 0) {
            errorMessage =
              comparisonMessage +
              compileComparisonError(
                inputItem,
                itemValue,
                compValue,
                comparisonItem,
                i18n.t("greaterThenOrEqualMessage"),
                ">="
              );
          }
          break;
        }
        case "LESS": {
          if (compResult >= 0) {
            errorMessage =
              comparisonMessage +
              compileComparisonError(
                inputItem,
                itemValue,
                compValue,
                comparisonItem,
                i18n.t("lessThenMessage"),
                "<"
              );
          }
          break;
        }
        case "LESS_EQUALS": {
          if (compResult > 0) {
            errorMessage =
              comparisonMessage +
              compileComparisonError(
                inputItem,
                itemValue,
                compValue,
                comparisonItem,
                i18n.t("lessThenOrEqualMessage"),
                "<="
              );
          }
          break;
        }
        default:
          break;
      }

      if (!errorMessage) {
        pm = null;
      } else {
        pm.message = errorMessage;
      }

      inputItem.processMessage = pm;
      const t = tables.find((t) => t.tableId === inputItem.tableId);
      const item = t.rows[inputItem.rowNumber + 1];
      if (item) {
        item.rowItems
          .filter((r) => r.code === inputItem.code)
          .forEach((row) => {
            row.processMessage = pm;
          });
        setTables([...tables]);
      }

      return pm;
    }

    return null;
  };

  return {
    recalculate: (inputItem, table, setTable) => {
      try {
        itemsByCodesMap[inputItem.code][inputItem.rowNumber] = inputItem;
        return recalculate(inputItem, table, setTable);
      } catch (e) {
        console.error(e);
      }
    },
    recalculateAll: () => {
      try {
        return recalculateAll();
      } catch (e) {
        console.error(e);
      }
    },
    returnCode: currentReturn.returnCode,
  };
}

export default manualInputProcess;
