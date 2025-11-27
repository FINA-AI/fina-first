export const MdtFinaFunctionValidator = (function () {
  var itself;

  function validate(object) {
    try {
      if (isArray(object)) {
        object.forEach(function (element) {
          validate(element);
        });
        return;
      }
      if (object) {
        if (object.arity) {
          switch (object.arity) {
            case "infix": {
              switch (object.string) {
                case "(": {
                  validateSingleFunctionCall(object);
                  break;
                }
                default: {
                  validate(object.first);
                  validate(object.second);
                  break;
                }
              }
              break;
            }
            case "prefix": {
              break;
            }
            case "suffix": {
              break;
            }
            case "function": {
              break;
            }
            case "statement": {
              if (object.hasOwnProperty("first")) {
                validate(object.first);
              }
              if (object.hasOwnProperty("block") && isArray(object.block)) {
                object.block.forEach(function (element) {
                  validate(element);
                });
              }
              break;
            }
            case "switch": {
              validate(object.first);
              validate(object.second);
              break;
            }
            case "case": {
              validate(object.second);
              break;
            }
            case "ternary": {
              validate(object.first);
              validate(object.second);
              validate(object.third);
              break;
            }
            case "regexp": {
              break;
            }
            default:
              break;
          }
        }
      }
    } catch (e) {
      console.log(e, e.message);
    }
  }

  function validateMDTCode(param) {
    var nodeList = itself.validMdtCodes;

    //Fix Internet Explorer 8 and below Version which doesn't support indexOf function
    if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function (needle) {
        for (var i = 0; i < this.length; i++) {
          if (this[i] === needle) {
            return i;
          }
        }
        return -1;
      };
    }

    if (nodeList.indexOf(param.string) < 0) {
      addError(
        param.line,
        param.from,
        param.thru,
        "Specified MDT code does not exist."
      );
    }

    // addError(
    //   param.line,
    //   param.from,
    //   param.thru,
    //   "Specified MDT code does not exist.",
    //   param.code
    // );
    // return false;
  }

  function isSimple(object) {
    return (
      (object.arity == "string" && object.string) ||
      (object.arity === "number" && object.number)
    );
  }

  function isArray(object) {
    return (
      Object.prototype.toString.call(object) ===
      Object.prototype.toString.call([])
    );
  }

  function addError(line, start, end, reason) {
    itself.errors.push({
      type: "FINA_FUNCTION_VALIDATION",
      line: line,
      start: start,
      end: end,
      reason: reason,
    });
  }

  function testParams(paramsArray, expectedSizes, argTypes) {
    //correct size
    //TODO: compare allowed and actual arguments length and throw error if not same

    // var paramsLengthValid = expectedSizes.indexOf(paramsLen) > -1;
    argTypes.forEach(function (element, index) {
      if (paramsArray.length - 1 >= index) {
        var param = paramsArray[index];
        switch (element) {
          case "MDTCODE": {
            if (param.string.trim().length === 0) {
              addError(
                param.line,
                param.from,
                param.thru,
                "Mdt Code Parameter is empty"
              );
            } else if (!isSimple(param)) {
              validate(param);
            } else {
              param.arity == "string"
                ? validateMDTCode(param)
                : addError(
                    param.line,
                    param.from,
                    param.thru,
                    "Expected MDT code string."
                  );
            }
            break;
          }
          case "string": {
            if (!isSimple(param)) {
              validate(param);
            } else if (param.arity !== "string") {
              addError(param.line, param.from, param.thru, "Expected string.");
            }
            break;
          }
          case "number": {
            if (!isSimple(param)) {
              validate(param);
            } else if (param.arity !== "number") {
              addError(param.line, param.from, param.thru, "Expected number.");
            }
            break;
          }
          default: {
            break;
          }
        }
      }
    });

    // console.log(paramsArray, expectedSizes, argTypes);
  }

  function validateSingleFunctionCall(object) {
    if (object.first.string === "." && object.first.first.string === "tree") {
      // FINA function. Validate.
      switch (object.first.second.string) {
        case "lookup": {
          testParams(object.second, [1, 2], ["MDTCODE", "string"]);
          break;
        }
        case "lookupString": {
          testParams(object.second, [1, 2], ["MDTCODE", "number"]);
          break;
        }
        case "children": {
          testParams(object.second, [2], ["MDTCODE", "string"]);
          break;
        }
        case "notrow": {
          testParams(object.second, [1], ["MDTCODE"]);
          break;
        }
        case "max": {
          testParams(object.second, [2], ["number", "number"]);
          break;
        }
        case "min": {
          testParams(object.second, [2], ["number", "number"]);
          break;
        }
        case "power": {
          testParams(object.second, [2], ["number", "number"]);
          break;
        }
        case "round": {
          testParams(object.second, [1], ["number"]);
          break;
        }
        case "squareroot": {
          testParams(object.second, [1], ["number"]);
          break;
        }
        case "sumif": {
          testParams(object.second, [3], ["MDTCODE", "string", "MDTCODE"]);
          break;
        }
        case "rowCount": {
          testParams(object.second, [3], ["MDTCODE"]);
          break;
        }
        case "sumifs": {
          testParams(object.second, [3], ["MDTCODE"]);
          break;
        }

        case "curPeriodFrom": {
          testParams(object.second, [0], []);
          break;
        }
        case "curPeriodTo": {
          testParams(object.second, [0], []);
          break;
        }

        case "lookupPeriod": {
          testParams(object.second, [3], ["MDTCODE", "string", "string"]);
          break;
        }
        case "curPeriodType": {
          testParams(object.second, [0], []);
          break;
        }
        case "values": {
          testParams(object.second, [1], ["MDTCODE"]);
          break;
        }
        case "curRowNum": {
          testParams(object.second, [0], []);
          break;
        }
        case "decimalCount": {
          testParams(object.second, [0], []);
          break;
        }
        default: {
          addError(
            object.first.second.line,
            object.first.second.from,
            object.first.second.thru,
            `Unknown function [${object.first.second.string}]`
          );
          break;
        }
      }
    } else {
      // Not FINA function. Do nothing.
    }
  }

  itself = function MdtFinaFunctionValidator(
    jsLintTree,
    errors,
    validMdtCodes
  ) {
    itself.validMdtCodes = validMdtCodes;
    itself.errors = errors;
    var oldSize = itself.errors.length;
    validate(jsLintTree);
    var newSize = itself.errors.length;
    return oldSize === newSize;
  };

  return itself;
})();
