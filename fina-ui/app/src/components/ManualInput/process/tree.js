const tree = (itemsByCodesMap, currentItem, getFloatValue) => {
  const getCriterionOperation = (criterion) => {
    return criterion && criterion.length > 0 ? criterion.charAt(0) : " ";
  };

  const getCriterionValue = (criterion, operation) => {
    if (criterion && criterion.length > 0) {
      switch (operation) {
        case ">":
        case "<":
        case "=":
          return criterion.substring(1);
        default:
          return " ";
      }
    }
  };

  const match = (
    criteriaCell,
    tempValue,
    operation,
    criterionValue,
    criterionDoubleValue
  ) => {
    let match;

    switch (criteriaCell["dataType"]) {
      case "NUMERIC":
        switch (operation) {
          case ">":
            match = getFloatValue(tempValue) > criterionDoubleValue;
            break;
          case "<":
            match = getFloatValue(tempValue) < criterionDoubleValue;
            break;
          default:
            match = getFloatValue(tempValue) === criterionDoubleValue;
        }
        break;
      case "TEXT":
      case "DATE":
        if (criterionValue != null) {
          match = criterionValue.localeCompare(tempValue) === 0;
        }
        break;
      default:
        match = false;
        break;
    }

    return match;
  };

  const getSafeFloatValue = (value) => {
    try {
      return getFloatValue(value);
    } catch {
      console.error("cannot get numeric value from : " + value);
    }

    return 0;
  };

  const treeObj = {
    lookup: (code) => {
      let result = 0.0;

      const items = new Map(Object.entries(itemsByCodesMap[code]));
      if (items) {
        let item = items.values().next().value,
          value = item.value;

        if (item["tableType"] === 3) {
          if (
            currentItem["returnId"] === item["returnId"] &&
            currentItem["tableId"] === item["tableId"]
          ) {
            item = items.get(currentItem.rowNumber.toString());

            if (item == null) {
              return result;
            }

            value = item.value;
          } else {
            let res = 0.0;

            switch (item["tableEvalMethod"]) {
              case "SUM": {
                res = treeObj.evalSum(items.values());
                break;
              }
              case "AVERAGE": {
                res = treeObj.evalAverage(Array.from(items.values()));
                break;
              }
              case "MIN>": {
                res = treeObj.evalMin(items.values());
                break;
              }
              case "MAX": {
                res = treeObj.evalMax(items.values());
                break;
              }
              default:
                break;
            }

            value = "" + res;
          }
        }

        if (value != null && value !== "") {
          let d = Number.NaN;

          try {
            d = getFloatValue(value);
          } catch {}

          if (Number.isNaN(d) || !isFinite(d)) {
            result = 0.0;
          } else {
            result = d;
          }
        }
      }
      return result;
    },
    lookupRow: (code, rowNumber) => {
      let result = null;

      let items = new Map(Object.entries(itemsByCodesMap[code]));
      if (items) {
        let item = items.get(rowNumber.toString());

        if (item) {
          let value = item.value;

          if (value && value !== "") {
            let d = Number.NaN;
            try {
              d = getFloatValue(item.value);
            } catch (e) {
              console.log(e);
            }

            if (Number.isNaN(d) || !isFinite(d)) {
              result = 0.0;
            } else {
              result = d;
            }
          }
        }
      }

      return result;
    },
    lookupString: (code) => {
      let value = "";

      let items = new Map(Object.entries(itemsByCodesMap[code]));

      if (items) {
        let item = items.values().next().value;

        if (item) {
          value = item.value ? item.value : "";
        }
      }

      return value;
    },

    lookupRowString: (code, rowNumber) => {
      let value = null;

      let items = new Map(Object.entries(itemsByCodesMap[code]));

      let item = items.get(rowNumber.toString());

      if (item) {
        value = item.value;

        if (value && value.trim().length === 0) {
          value = null;
        }
      }

      return value;
    },
    notrow: (nodeCode) => {
      const vctItems = new Map(Object.entries(itemsByCodesMap[nodeCode]));
      if (vctItems) {
        let item = vctItems.values().next().value;
        const tableEvalMethod = item["tableEvalMethod"];

        switch (tableEvalMethod) {
          case "SUM": {
            return treeObj.evalSum(vctItems.values());
          }
          case "AVERAGE": {
            return treeObj.evalAverage(Array.from(vctItems.values()));
          }
          case "MIN": {
            return treeObj.evalMin(Array.from(vctItems.values()));
          }
          case "MAX": {
            return treeObj.evalMax(Array.from(vctItems.values()));
          }
          default:
            return 0;
        }
      }

      return 0;
    },
    sumif: (nodeCode, criterion, sumNodeCode) => {
      let result = 0.0;

      const comparisonItemMap = new Map(
        Object.entries(itemsByCodesMap[nodeCode])
      );
      const sumItemMap = new Map(Object.entries(itemsByCodesMap[sumNodeCode]));

      if (comparisonItemMap && sumItemMap) {
        const comparisonItems = Array.from(comparisonItemMap.values());
        const item = comparisonItems[0];

        if (item) {
          if (item["tableType"] === 3) {
            if (
              currentItem["returnId"] === item["returnId"] &&
              currentItem["tableId"] === item["tableId"]
            ) {
              const val = sumItemMap.get(
                currentItem["rowNumber"].toString()
              ).value;

              result = getFloatValue(val);
            } else {
              let operation = getCriterionOperation(criterion);

              let criterionValue = getCriterionValue(criterion, operation);

              for (const criteriaCell of comparisonItems) {
                let criterionDoubleValue = Number.NaN;
                if (criteriaCell["dataType"] === "NUMERIC") {
                  criterionDoubleValue = getFloatValue(criterionValue);
                }

                let tempValue = criteriaCell["value"];

                if (
                  match(
                    criteriaCell,
                    tempValue,
                    operation,
                    criterionValue,
                    criterionDoubleValue
                  )
                ) {
                  let temp = sumItemMap.get(
                    criteriaCell["rowNumber"].toString()
                  )["value"];
                  result += getFloatValue(temp);
                }
              }
            }
          }
        }
      }

      return result;
    },

    sumifs: (sumNodeCode, criteria) => {
      let result = 0.0;

      let sumNodeMap = new Map(Object.entries(itemsByCodesMap[sumNodeCode]));

      if (sumNodeMap && sumNodeMap.size > 0) {
        const comparisonItems = Array.from(sumNodeMap.values());
        const item = comparisonItems[0];

        //Sum values iteration
        if (item["tableType"] === 3) {
          if (
            currentItem["returnId"] === item["returnId"] &&
            currentItem["tableId"] === item["tableId"]
          ) {
            const val = sumNodeMap.get(currentItem["rowNumber"].toString())[
              "value"
            ];

            result = getFloatValue(val);
          } else if (criteria && criteria.length !== 0) {
            for (const sumNodeCell of comparisonItems) {
              let m = false;

              for (let i = 0; i < criteria.length; i = i + 2) {
                if (i === 0 || m) {
                  let nodeCode = criteria[i];

                  let nodeCriteria = null;
                  if (i + 1 < criteria.length) {
                    nodeCriteria = criteria[i + 1];
                  }

                  if (nodeCriteria != null && nodeCode != null) {
                    let operation = getCriterionOperation(nodeCriteria);

                    let criterionValue = getCriterionValue(
                      nodeCriteria,
                      operation
                    );

                    const criteriaNodeRowItems = new Map(
                      Object.entries(itemsByCodesMap[nodeCode])
                    );

                    if (criteriaNodeRowItems != null) {
                      let nodeCriteriaItem = criteriaNodeRowItems.get(
                        sumNodeCell["rowNumber"].toString()
                      );

                      if (nodeCriteriaItem) {
                        let criterionDoubleValue = Number.NaN;

                        if (nodeCriteriaItem["dataType"] === "NUMERIC") {
                          criterionDoubleValue = getFloatValue(criterionValue);
                        }

                        let tempValue = nodeCriteriaItem["value"];

                        m = match(
                          nodeCriteriaItem,
                          tempValue,
                          operation,
                          criterionValue,
                          criterionDoubleValue
                        );
                      }
                    }
                  }
                }
              }

              if (m) {
                result += getFloatValue(sumNodeCell["value"]);
              }
            }
          }
        }
      }

      return result;
    },

    rowCount: (code) => {
      let result = 0;

      let items = new Map(Object.entries(itemsByCodesMap[code]));

      if (items != null) {
        result = items.size;
      }

      return result;
    },
    evalSum: (items) => {
      let sum = 0.0;
      if (items) {
        for (const item of items) {
          if (item.value && item.value !== "") {
            try {
              let d = getFloatValue(item.value);
              sum += d;
            } catch {}
          }
        }
      }
      return sum;
    },
    evalAverage: (items) => {
      let result = 0.0;
      if (items) {
        for (const item of items) {
          if (item.value && item.value !== "") {
            try {
              let d = getFloatValue(item.value);
              result += d;
            } catch {}
          }
        }

        return result / items.length;
      }
      return result;
    },
    evalMax: (items) => {
      return Math.max(...items.map((i) => getSafeFloatValue(i.value)));
    },
    evalMin: (items) => {
      return Math.min(...items.map((i) => getSafeFloatValue(i.value)));
    },
  };

  return treeObj;
};

export default tree;
