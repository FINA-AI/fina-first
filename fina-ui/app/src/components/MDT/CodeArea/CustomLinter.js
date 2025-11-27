import { linter } from "@codemirror/lint";
import { syntaxTree } from "@codemirror/language";
import { JSLINT } from "./jslint";
import { MdtFinaFunctionValidator } from "./MdtFinaFunctionValidator";

export const CustomLinter = (
  metadata,
  validMDTCODES,
  getMethodInsertion,
  setHasErrors,
  setLoading
) => {
  const valid8FinaFunctions = (scriptBody) => {
    var predef = [
      "tree",
      "tree.lookup",
      "tree.lookupString",
      "tree.children",
      "tree.notrow",
      "tree.max",
      "tree.min",
      "tree.power",
      "tree.round",
      "tree.squareroot",
      "tree.values",
      "tree.curRowNum",
      "tree.decimalCount",
    ];
    var option = {
      passfail: false,
      predef: predef,
      vars: true,
      eqeq: true,
      sloppy: true,
      white: true,
    };
    JSLINT(scriptBody, option);
    const errors = JSLINT.errors;

    MdtFinaFunctionValidator(JSLINT.tree.first, errors, validMDTCODES);

    return errors;
  };

  return linter((view) => {
    let diagnostics = [];
    let functions = [];
    let args = -1;
    let argScope = false;
    let semicolons = 0;
    let lastNode = { name: "", from: 0, to: 0 };
    let variableDeclaration = false;

    let lineCount = view.state.doc.lines;
    for (let i = 1; i <= lineCount; i++) {
      let lineString = view.state.doc.line(i).text;
      if (lineString.indexOf(".") !== -1) {
        let newfunc = lineString.slice(
          lineString.indexOf(".") + 1,
          lineString.indexOf("(")
        );
        let currArguments = lineString.slice(
          lineString.indexOf("(") + 1,
          lineString.indexOf(")")
        );
        functions.push({
          name: newfunc,
          currArguments: currArguments ? currArguments.split(/[,]+/) : [],
        });
      }
    }

    let funcIndex = -1;
    syntaxTree(view.state)
      .cursor()
      .iterate((node) => {
        if (
          node.type.name === "VariableDeclaration" ||
          node.type.name === "ReturnStatement"
        )
          variableDeclaration = true;
        if (node.type.name === "ArgList" || node.type.name === "ParamList") {
          argScope = true;
          args = 0;
          semicolons = 0;
        }
        if (
          node.type.name === "PropertyName" ||
          node.type.name === "PropertyDefinition"
        ) {
          funcIndex++;
          argScope = false;
        }

        if (node.type.name === ",") semicolons++;
        if (argScope) {
          if (
            node.type.name === "Number" ||
            node.type.name === "String" ||
            node.type.name === "BooleanLiteral" ||
            node.type.name === "VariableName" ||
            node.type.name === "ArrayExpression" ||
            node.type.name === "ObjectExpression"
          )
            args++;
        }

        if (node.type.name === "VariableName" && !variableDeclaration) {
          // diagnostics.push({
          //   from: lastNode.from,
          //   to: lastNode.to,
          //   severity: "error",
          //   message: "Undeclared Variable",
          // });
        }

        if (
          lastNode?.name === "." &&
          (node.type.name !== "PropertyName" ||
            (functions[funcIndex]?.name === "" &&
              functions[funcIndex].currArguments.length === 0))
        ) {
          diagnostics.push({
            from: lastNode.from,
            to: lastNode.to,
            severity: "info",
            message: "Suggested functions",
            actions: metadata.map((item) => ({
              name: item.name,
              apply(view, from, to) {
                view.dispatch({
                  changes: { from, to, insert: getMethodInsertion(item) },
                });
              },
            })),
          });
        }

        lastNode = { name: node.type.name, from: node.from, to: node.to };

        const curFunction = metadata.find(
          (item) => item.name === functions[funcIndex]?.name
        );

        if (curFunction && curFunction.argumentTypes.indexOf("VARARGS") >= 0) {
          return;
        }

        const getNumberOfArgsOfFunction = (fn) => {
          const functions = metadata.filter((item) => item.name === fn.name);
          return functions.map((f) => f.argumentTypes.length);
        };

        if (!!curFunction) {
          let num_of_args = getNumberOfArgsOfFunction(curFunction);
          if (
            argScope &&
            node.type.name === ")" &&
            funcIndex !== -1 &&
            args !== -1 &&
            num_of_args.indexOf(args) < 0
          ) {
            diagnostics.push({
              from: node.from,
              to: node.to,
              severity: "error",
              message: `Number of arguments should be ${num_of_args}`,
              actions: [
                {
                  name: "Change",
                  apply(view, from, to) {
                    view.dispatch({ changes: { from, to } });
                  },
                },
              ],
            });
          }

          if (node.type.name === ")") argScope = false;

          let currType = curFunction.argumentTypes[semicolons];

          if (
            currType === "MDTCODE" &&
            (node.type.name === "String" || node.type.name === "VariableName")
          ) {
            if (
              currType === "MDTCODE" &&
              node.type.name === "String" &&
              !!functions[funcIndex]?.currArguments
            ) {
              let val = functions[funcIndex]?.currArguments[semicolons];

              if (
                argScope &&
                !validMDTCODES.find(
                  (item) => item === val.substring(1, val.length - 1)
                )
              ) {
                diagnostics.push({
                  from: node.from,
                  to: node.to,
                  severity: "warning",
                  message: "Invalid MDT Code",
                });
              }
            }
          } else {
            if (
              argScope &&
              (node.type.name === "VariableName" ||
                node.type.name === "ArrayExpression" ||
                node.type.name === "String" ||
                node.type.name === "Number" ||
                node.type.name === "BooleanLiteral" ||
                node.type.name === "ObjectExpression") &&
              currType !== node.type.name
            ) {
              diagnostics.push({
                from: node.from,
                to: node.to,
                severity: "warning",
                message: "Incorrect type",
                actions: [
                  {
                    name: "Remove",
                    apply(view, from, to) {
                      view.dispatch({ changes: { from, to } });
                    },
                  },
                ],
              });
            }
          }
        }
      });

    if (view.state.doc.toString().trim().length === 0) {
      return diagnostics;
    }

    var errors = valid8FinaFunctions(
      "function fina2_mdt_node() { \n" +
        view.state.doc.toString().replace(/\n/g, " ") +
        "\n }"
    );

    errors
      .filter((er) => er && er.type === "FINA_FUNCTION_VALIDATION")
      .forEach((er) => {
        diagnostics.push({
          from: er.start - 1,
          to: er.end - 1,
          severity: "error",
          message: er.reason,
        });
      });
    // setEditorContent(view.state.doc.toString());
    // console.log(view.state.doc.toString());
    // diagnosticCount(view.state)

    setHasErrors(
      diagnostics.filter((d) => d.severity === "error").length > 0 ||
        errors.length > 0
    );

    if (setLoading) {
      setLoading(false);
    }

    return diagnostics;
  });
};
