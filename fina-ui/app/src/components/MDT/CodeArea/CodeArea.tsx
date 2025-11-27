import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import MdtTreeSuggestion from "./MdtTreeSuggestion";
import MdtCodeSuggestion from "./MdtCodeSuggestion";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";

export interface CodeAreaProps {
  editMode: boolean;
  height: number | string;
  width?: number | string;
  validMDTCODES?: string[];
  comparison?: boolean;
  expandOption?: boolean;
  editorContent: string;
  setEditorContent: (content: string) => void;
  setHasErrors: (hasError: boolean) => void;
  isSQLEditor?: boolean;
  readOnly?: boolean;
  setLoading?: (loading: boolean) => void;
  dataTestId: string;
}

const StyledContainerBox = styled(Box)<{
  _comparison?: boolean;
  _width?: number | string;
  _lightMode: boolean;
}>(({ _width, _lightMode, _comparison }) => ({
  ...(_width && { width: _width }),
  height: " 100%",
  backgroundColor: _lightMode && _comparison ? "#FFFFFF" : "#434B59",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: 8,
}));

const StyledEditorBox = styled(Box)<{
  _lightMode: boolean;
  _comparison?: boolean;
}>(({ _lightMode, _comparison }) => ({
  boxSizing: "border-box",
  width: "100%",
  padding: 8,
  borderRadius: 4,
  outline: "none",
  color: _lightMode && _comparison ? "black" : "#FFFFFF",
  overflowY: "auto",
  "&::-webkit-scrollbar-thumb": {
    background: _lightMode ? "#353a42" : "#FFFFFF",
    borderRadius: 1,
    width: 2,
  },
  "&::-webkit-scrollbar": {
    width: 2,
    backgroundColor: "#8695B1",
  },
  "& .orange": {
    color: _lightMode ? "#FF8C00" : "#FFA500",
  },
  "& .default": {
    color: _lightMode ? "black" : "#FFFFFF",
  },
  "& .green": {
    color: _lightMode ? "#32CD32" : "#7CFC00",
  },
  "& .blue": {
    color: _lightMode ? "#0000FF" : "#1E90FF",
  },
  "& .tokenFunction": {
    fontStyle: "italic",
    fontWeight: "bold",
    color: _lightMode ? "black" : "#FFFFFF",
  },
}));

const StyledSeeMoreTypography = styled(Typography)<{ _lightMode?: boolean }>(
  ({ _lightMode }) => ({
    color: _lightMode ? "black" : "#FFFFFF",
    fontSize: 12,
    fontWeight: 400,
    padding: 2,
    borderBottom: _lightMode ? "1px solid black" : "1px solid #FFFFFF",
  })
);

const StyledCodeAreaBox = styled(Box)(() => ({
  boxSizing: "border-box",
  height: " 100%",
  paddingRight: "5px",
  outline: "none",
}));

const CodeArea: React.FC<CodeAreaProps> = ({
  height,
  width,
  editMode,
  validMDTCODES,
  comparison,
  expandOption,
  editorContent,
  readOnly = false,
  setEditorContent,
  setHasErrors = () => {},
  isSQLEditor = false,
  setLoading,
  dataTestId,
}) => {
  const theme = useTheme();
  const lightMode = theme.palette.mode === "light";
  const { t } = useTranslation();

  const [esLinter, setEsLinter] = useState<any>(null);
  const [codeMirror, setCodeMirror] = useState<any>(null);
  const [customLinter, setCustomLinter] = useState<any>(null);

  const editorContainerRef = useRef<any>(null);
  const viewContainerRef = useRef<any>();

  const [expanded, setExpanded] = useState(!expandOption);
  let editModeContentHeight =
    editorContainerRef.current?.children[0]?.clientHeight;

  const metadata = [
    { name: "lookup", argumentTypes: ["MDTCODE"] },
    { name: "lookup", argumentTypes: ["MDTCODE", "String"] },
    { name: "lookupString", argumentTypes: ["MDTCODE"] },
    { name: "notrow", argumentTypes: ["MDTCODE"] },
    { name: "sumif", argumentTypes: ["MDTCODE", "String", "MDTCODE"] },
    { name: "sumifs", argumentTypes: ["MDTCODE", "VARARGS"] },
    { name: "rowCount", argumentTypes: ["MDTCODE"] },
    { name: "curPeriodFrom", argumentTypes: [] },
    { name: "curPeriodTo", argumentTypes: [] },
    { name: "lookupPeriod", argumentTypes: ["MDTCODE", "String", "String"] },
    { name: "curPeriodType", argumentTypes: [] },
    { name: "curRowNum", argumentTypes: [] },
    { name: "decimalCount", argumentTypes: [] },
    // { name: "children", argumentTypes: ["MDTCODE", "String"] },
    // { name: "max", argumentTypes: ["Number", "Number"] },
    // { name: "min", argumentTypes: ["Number", "Number"] },
    // { name: "power", argumentTypes: ["Number", "Number"] },
    // { name: "round", argumentTypes: ["Number"] },

    // { name: "squareroot", argumentTypes: ["Number"] },

    // { name: "values", argumentTypes: ["MDTCODE", "String"] },
    // { name: "values", argumentTypes: ["MDTCODE"] },
  ];

  const getPrismjsClassNames = () => {
    const { HighlightStyle, tag } = codeMirror;
    if (HighlightStyle && tag) {
      return HighlightStyle.define([
        { tag: [tag.keyword, tag.null], class: "orange" },
        { tag: [tag.name], class: "default" },
        { tag: [tag.propertyName], class: "default" },
        {
          tag: [tag.typeName, tag.className, tag.tagName],
          class: "orange",
        },
        { tag: [tag.operator], class: "default" },
        { tag: [tag.punctuation], class: "orange" },
        { tag: [tag.squareBracket], class: "default" },
        { tag: [tag.string], class: "green" },
        { tag: [tag.angleBracket], class: "default" },
        { tag: [tag.regexp], class: "green" },
        { tag: [tag.comment], class: "green" },
        { tag: [tag.number], class: "blue" },
        { tag: [tag.bool], class: "blue" },
        { tag: [tag.atom], class: "default" },
        {
          tag: [tag.function(tag.variableName), tag.function(tag.propertyName)],
          class: "tokenFunction",
        },
      ]);
    }
  };

  const getEditorStyle = () => {
    const { EditorView } = codeMirror;
    if (EditorView) {
      return EditorView.theme({
        "&": { maxHeight: "inherit" },
        ".cm-scroller": {
          "& .cm-foldGutter": {
            display: "none !important",
          },
          "& .cm-gutter-lint": {
            width: "auto",
          },
          "&::-webkit-scrollbar-thumb": {
            background: lightMode ? "#434B59" : "#FFFFFF",
            width: 2,
          },
          "&::-webkit-scrollbar": {
            width: 2,
            backgroundColor: "#8695B1",
            borderRadius: 1,
          },
        },
        ".cm-gutters": {
          border: "none !important",
          backgroundColor: lightMode ? "#FFFFFF" : "#434B59",
        },
        ".cm-activeLine": {
          backgroundColor: lightMode ? "#FFFFFF" : "#434B59",
          opacity: 0.6,
        },
        ".cm-content": { border: "none !important" },
        ".cm-editor": {
          border: "none",
          outline: "none",
        },
        ".cm-selectionBackground": {
          background: lightMode ? "#FFFFFF" : "#434B59",
        },
        ".cm-selectionLayer": {
          background: lightMode ? "#FFFFFF" : "#434B59",
        },
        ".cm-diagnostic": {
          fontSize: "12px !important",
          color: "black",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        },
        ".cm-tooltip": {
          // position: "unset !important",
          width: "fit-content !important",
          zIndex: 99999,
          overflow: "auto",
          "&::-webkit-scrollbar-thumb": {
            background: "#434B59",
          },
          "&::-webkit-scrollbar": {
            backgroundColor: "#8695B1",
          },
          borderRadius: "4px !important",
          border: "none",
        },
        ".cm-cursor": {
          borderLeft: lightMode
            ? "1.5px solid black !important"
            : "1.5px solid white !important",
        },

        ".cm-line": { background: lightMode ? "#cceeff44" : "#cceeff00" },
        ".cm-lineNumbers": { color: lightMode ? "black" : "#FFFFFF" },
        ".cm-activeLineGutter": {
          backgroundColor: lightMode ? "#e2f2ff" : "#6c758c",
          color: lightMode ? "black" : "#FFFFFF",
        },
        "&.cm-focused .cm-selectionBackground ::selection": {
          backgroundColor: lightMode ? "#afc1d0" : "#afc1d0",
        },
        ".cm-gutter": { backgroundColor: lightMode ? "#FFFFFF" : "#434B59" },
        ".cm-tooltip-autocomplete": {
          backgroundColor: lightMode ? "#d2d6dc" : "#7c7f88",
        },
      });
    }
  };

  const getMethodInsertion = (item: {
    name: string;
    argumentTypes: string[];
  }) => {
    let result = `.${item.name}(`;
    item.argumentTypes?.forEach((type, index) => {
      if (type === "MDTCODE" || type === "String") result += `""`;
      else result += "0";
      if (index !== item.argumentTypes.length - 1) result += ",";
    });
    result += ")";
    return result;
  };

  const eslintConfig = {
    parserOptions: {
      ecmaVersion: 2019,
      ecmaFeatures: {
        globalReturn: true,
      },
    },
    env: {
      es6: true,
    },
    globals: {
      tree: "writable",
    },
    rules: {
      semi: ["error"],
      "no-unused-vars": [
        "error",
        // { vars: "all", args: "after-used", ignoreRestSiblings: false },
        // { varsIgnorePattern: "tree" },
      ],
      "no-undef": "error",
      "no-unreachable": "error",
      "no-extra-semi": "error",
    },
  };

  const loadCodeMirrorDependencies = async () => {
    const [
      codeMirrorCore,
      codeMirrorView,
      codeMirrorLangJS,
      codeMirrorLanguage,
      codeMirrorAutoComplete,
      codeMirrorCommands,
      codeMirrorSearch,
      codeMirrorLint,
      codeMirrorLangSQL,
      lezerHighlight,
    ] = await Promise.all([
      import("codemirror"),
      import("@codemirror/view"),
      import("@codemirror/lang-javascript"),
      import("@codemirror/language"),
      import("@codemirror/autocomplete"),
      import("@codemirror/commands"),
      import("@codemirror/search"),
      import("@codemirror/lint"),
      import("@codemirror/lang-sql"),
      import("@lezer/highlight"),
    ]);

    return {
      basicSetup: codeMirrorCore.basicSetup,
      EditorView: codeMirrorCore.EditorView,
      drawSelection: codeMirrorView.drawSelection,
      highlightActiveLine: codeMirrorView.highlightActiveLine,
      highlightActiveLineGutter: codeMirrorView.highlightActiveLineGutter,
      keymap: codeMirrorView.keymap,
      lineNumbers: codeMirrorView.lineNumbers,
      esLint: codeMirrorLangJS.esLint,
      javascript: codeMirrorLangJS.javascript,
      bracketMatching: codeMirrorLanguage.bracketMatching,
      HighlightStyle: codeMirrorLanguage.HighlightStyle,
      syntaxHighlighting: codeMirrorLanguage.syntaxHighlighting,
      closeBrackets: codeMirrorAutoComplete.closeBrackets,
      closeBracketsKeymap: codeMirrorAutoComplete.closeBracketsKeymap,
      completionKeymap: codeMirrorAutoComplete.completionKeymap,
      defaultKeymap: codeMirrorCommands.defaultKeymap,
      history: codeMirrorCommands.history,
      historyKeymap: codeMirrorCommands.historyKeymap,
      indentWithTab: codeMirrorCommands.indentWithTab,
      highlightSelectionMatches: codeMirrorSearch.highlightSelectionMatches,
      searchKeymap: codeMirrorSearch.searchKeymap,
      linter: codeMirrorLint.linter,
      lintGutter: codeMirrorLint.lintGutter,
      sql: codeMirrorLangSQL.sql,
      tag: lezerHighlight.tags,
    };
  };

  const initEditor = async () => {
    const cmDeps = await loadCodeMirrorDependencies();
    const { CustomLinter } = await import("./CustomLinter");

    setCodeMirror(cmDeps);
    setCustomLinter(() => CustomLinter);
  };

  useEffect(() => {
    initEditor();
  }, []);

  useEffect(() => {
    if (!editorContainerRef || !codeMirror || !customLinter) return;
    const {
      sql,
      javascript,
      basicSetup,
      EditorView,
      syntaxHighlighting,
      highlightActiveLineGutter,
      highlightSelectionMatches,
      highlightActiveLine,
      bracketMatching,
      drawSelection,
      defaultKeymap,
      closeBrackets,
      indentWithTab,
      linter,
      historyKeymap,
      lintGutter,
      searchKeymap,
      completionKeymap,
      keymap,
      closeBracketsKeymap,
      history,
      lineNumbers,
      esLint,
    } = codeMirror;

    if (!esLinter) {
      import("eslint-linter-browserify").then((eslint) => {
        const linterInstance = new eslint.Linter();
        setEsLinter(linterInstance);
      });
    }

    let defaultExtensions = [
      isSQLEditor ? sql() : javascript(),
      basicSetup,
      setEditorContent &&
        EditorView.updateListener.of((update: any) => {
          if (update.docChanged) {
            setEditorContent(update.state.doc.toString());
          }
        }),
      EditorView.lineWrapping,
      syntaxHighlighting(getPrismjsClassNames()),
      bracketMatching(),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      drawSelection(),
      closeBrackets(),
      history(),
      highlightSelectionMatches(),
      lineNumbers(),
      getEditorStyle(),
      lintGutter(),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...closeBracketsKeymap,
        ...searchKeymap,
        indentWithTab,
        ...completionKeymap,
      ]),
      EditorView.editable.of(!readOnly || editMode), // Set the editor to read-only
    ];

    defaultExtensions = defaultExtensions.filter((extension) => !!extension);

    if (!isSQLEditor && esLinter && customLinter) {
      //add javascript extensions
      defaultExtensions = defaultExtensions.concat([
        MdtTreeSuggestion(metadata),
        MdtCodeSuggestion(validMDTCODES),
        customLinter(
          metadata,
          validMDTCODES,
          getMethodInsertion,
          setHasErrors,
          setLoading
        ),
        linter(esLint(esLinter, eslintConfig)),
      ]);
    }

    let view = new EditorView({
      extensions: defaultExtensions,
      parent: editorContainerRef.current,
      doc: editorContent,
    });

    return () => view?.destroy();
  }, [editorContainerRef, editMode, esLinter, theme.palette, codeMirror]);

  return (
    <StyledContainerBox
      _width={width}
      _lightMode={lightMode}
      _comparison={comparison}
      data-testid={dataTestId}
    >
      <StyledCodeAreaBox>
        {editMode ? (
          <StyledEditorBox
            height={
              expanded && typeof height === "number" ? height + 80 : height
            }
            _lightMode={lightMode}
            ref={editorContainerRef}
          ></StyledEditorBox>
        ) : readOnly ? (
          <StyledEditorBox
            _lightMode={lightMode}
            height={
              expandOption && expanded && typeof height === "number"
                ? height + 80
                : height
            }
            ref={editorContainerRef}
          />
        ) : (
          <StyledEditorBox
            _lightMode={lightMode}
            height={
              expandOption && expanded && typeof height === "number"
                ? height + 80
                : height
            }
          >
            <pre
              style={{
                margin: 0,
                paddingLeft: 10,
              }}
              ref={viewContainerRef}
            >
              {editorContent?.split("\n").map((line, index) => (
                <span
                  key={index}
                  style={{
                    font: "13px monospace",
                    fontSize: "100%",
                    lineHeight: 1.4,
                  }}
                >
                  {index + 1 + "     " + line + "\n"}
                </span>
              ))}
            </pre>
          </StyledEditorBox>
        )}
      </StyledCodeAreaBox>
      {(viewContainerRef.current?.clientHeight > height ||
        editModeContentHeight > height) &&
        expandOption && (
          <Box
            onClick={() => setExpanded(!expanded)}
            padding={4}
            marginRight={8}
            display={"flex"}
            justifyContent={"flex-end"}
          >
            <StyledSeeMoreTypography>
              {expanded ? t("seeLess") : t("seeMore")}
            </StyledSeeMoreTypography>
          </Box>
        )}
    </StyledContainerBox>
  );
};

export default CodeArea;
