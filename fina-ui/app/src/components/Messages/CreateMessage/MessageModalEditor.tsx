import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { EditorState } from "draft-js";
import FormatAlignLeftRoundedIcon from "@mui/icons-material/FormatAlignLeftRounded";
import FormatAlignRightRoundedIcon from "@mui/icons-material/FormatAlignRightRounded";
import FormatAlignJustifyRoundedIcon from "@mui/icons-material/FormatAlignJustifyRounded";
import { styled } from "@mui/system";
import { CommRootCreateModalData } from "../../../types/communicator.common.type";

interface MessageModalEditorProps {
  data: CommRootCreateModalData;
}

const StyledRootBox = styled(Box)(({ theme }) => ({
  height: "100%",
  "& .rdw-editor-main a": {
    color:
      theme.palette.mode === "dark"
        ? "#53b1fd !important"
        : "#2962ff !important",
    textDecoration: "underline",
  },

  "& .rdw-link-decorator-icon": {
    width: "100%",
    height: "calc(100% + 10px)",
    left: "0%",
    opacity: 0,
  },
  "& .rdw-option-wrapper": {
    border: "none",
    height: "15px",
    padding: "2px 0px 2px 0px",
    background: "inherit",
    marginTop: "4px",
    borderRadius: "50%",
    color: "#8695B1",
    fontSize: 16,
    "& img": {
      width: "12px",
      height: "12px",
      filter:
        "invert(71%) sepia(6%) saturate(1396%) hue-rotate(181deg) brightness(82%) contrast(86%)",
    },
    "&:hover": {
      backgroundColor: "rgba(41, 98, 255, 0.1)",
      boxShadow: "none",
    },
  },
  "& .rdw-dropdown-wrapper": {
    height: "fit-content",
    background: "inherit",
    border: "unset",
    boxShadow: "unset",
    margin: "0px",
  },
  "& .rdw-fontsize-wrapper": {
    margin: "0px",
    maxHeight: "20px",
  },
  "& .rdw-editor-wrapper": {
    height: "100%",
  },
  "& .rdw-fontsize-option": {
    color: theme.palette.textColor,
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgb(78 89 110 / 93%)"
          : "rgb(240, 240, 240)",
    },
  },
  "& .rdw-dropdownoption-highlighted": {
    height: "25px",
    backgroundColor: theme.palette.mode === "dark" ? "#344258" : "#F2F4F7",
  },
  "& .rdw-dropdownoption-active": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgb(78 89 110 / 93%)"
        : "rgb(240, 240, 240)",
  },
  "& .rdw-dropdown-carettoopen": {
    borderTop: "5px solid #8695B1",
  },
  "& .rdw-dropdown-carettoclose": {
    borderBottom: "5px solid #8695B1",
  },
  "& .rdw-link-modal": {
    background: theme.palette.paperBackground,
    border: theme.palette.borderColor,
    borderRadius: 4,
    boxShadow: theme.palette.paperBoxShadow,
  },
  "& .rdw-link-modal-label": {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "24px",
    color: theme.palette.secondaryTextColor,
  },
  "& .rdw-link-modal-btn:disabled": {
    backgroundColor: "#FFF",
    transition: "300ms",
    borderRadius: 4,
    width: 80,
    pointerEvents: "none",
    "&:hover": {
      backgroundColor: "none",
    },
  },
  "& .rdw-dropdown-optionwrapper": {
    backgroundColor: theme.palette.mode === "dark" ? "#344258" : "#F2F4F7",
    border: theme.palette.borderColor,
    boxShadow: "unset",
    "&:hover": {
      backgroundColor: theme.palette.mode === "dark" ? "#344258" : "#F2F4F7",
    },
  },
  "& .rdw-link-modal-btn": {
    ...(theme as any).primaryBtn,
    border: "none",
    color: "#fff",
  },
  "& .rdw-dropdown-selectedtext": {
    color: theme.palette.mode === "light" ? "#8695B1" : "#8695B1",
    maxHeight: "20px",
  },
  "& .rdw-link-modal-buttonsection .rdw-link-modal-btn:not([disabled]):first-child":
    {
      backgroundColor: theme.palette.primary.main,
      color: "#FFF",
      "&:hover": {
        backgroundColor: theme.palette.buttons.primary.hover,
        boxShadow: "none",
      },
    },
  "& .rdw-link-modal-target-option": {
    fontSize: 12,
    fontWeight: 500,
    fontFamily: "Inter",
    fontStyle: "normal",
    display: "flex",
    alignItems: "center",
    accentColor: theme.palette.primary.main,
    color: theme.palette.secondaryTextColor,
    '& input[type="checkbox"]:not(:checked)': {
      appearance: "none",
      width: 13,
      height: 13,
      borderRadius: 2,
      backgroundColor: "inherit",
      border: theme.palette.borderColor,
    },
  },
  "& .rdw-link-modal-input": {
    backgroundColor: theme.palette.paperBackground,
    border: theme.palette.borderColor,
  },
  "& #linkTitle, & #linkTarget": {
    color: theme.palette.textColor,
  },

  "& .toolbar": {
    margin: 0,
    display: "flex",
    alignItems: "center",
    border: "none !important",
    borderRadius: 4,
    background: theme.palette.mode === "dark" ? "#344258" : "#F2F4F7",
    padding: 8,
    paddingLeft: 10,
    "& .MuiSvgIcon-root": {
      cursor: "pointer",
      color: "#8695B1",
      fontSize: 16,
      marginRight: 8,
      "&:hover": {
        backgroundColor: "rgba(41, 98, 255, 0.1)",
        borderRadius: 37,
      },
    },
    "& p": {
      cursor: "pointer",
      color: "#8695B1",
      fontSize: 13,
      marginRight: 8,
      "&:hover": {
        backgroundColor: "rgba(41, 98, 255, 0.1)",
        borderRadius: 50,
      },
    },
  },

  "& .toolbarButtons": {
    height: "15px !important",
    background: theme.palette.mode === "dark" ? "#344258" : "#F2F4F7",
    border: "none!important",
    borderRadius: "50% !important",
    padding: "2px 0px 2px 0px !important",
    "&:hover": {
      boxShadow: "none !important",
      backgroundColor: "rgba(41, 98, 255, 0.1)",
    },
    "& img": {
      filter:
        "invert(71%) sepia(6%) saturate(1396%) hue-rotate(181deg) brightness(82%) contrast(86%) !important",
      height: "12px",
    },
  },

  "& .fontSizeCustomButton": {
    height: "15px !important",
    background: theme.palette.mode === "dark" ? "#344258" : "#F2F4F7",
    border: "none!important",
    borderRadius: "50% !important",
    padding: "2px 0px 2px 0px !important",
    "&:hover": {
      boxShadow: "none !important",
      background: "inherit ",
    },
  },

  "& .editor": {
    padding: "10px 8px",
    maxHeight: "120px",
    height: "100%",
    "& .public-DraftStyleDefault-block": {
      margin: "0px",
    },
    "& .public-DraftEditor-content": {
      lineBreak: "anywhere",
    },
    margin: "0px",
    lineHeight: "20px",
    "& h1": {
      fontSize: "22px !important",
      fontWeight: 400,
      color: ({ textColor }: { textColor: string }) => textColor,
    },
    "& h2": {
      fontSize: "18px !important",
      fontWeight: 400,
      color: ({ textColor }: { textColor: string }) => textColor,
    },
    "& h3": {
      fontSize: "14px !important",
      fontWeight: 400,
      color: ({ textColor }: { textColor: string }) => textColor,
    },
  },
}));

const MessageModalEditor: React.FC<MessageModalEditorProps> = ({ data }) => {
  const editor = useRef<any>();
  const [content, setContent] = useState(() => EditorState.createEmpty());

  useEffect(() => {
    if (data) {
      if (Object.keys(data).length > 0) {
        setContent(data.content);
      }
    }
  }, [data?.content]);

  const inlineButtons = ({ onChange, currentState }: any) => {
    return (
      <Box display={"flex"}>
        <FormatBoldIcon
          onClick={() => {
            onChange("bold", !currentState["bold"]);
          }}
        />
        <FormatItalicIcon
          onClick={() => {
            onChange("italic", !currentState["italic"]);
          }}
        />
        <FormatUnderlinedIcon
          onClick={() => {
            onChange("underline", !currentState["underline"]);
          }}
        />
      </Box>
    );
  };

  const BlockTypeToolbarButton = (editor: any) => {
    const toggle = (prop: any) => {
      editor.onChange(
        editor.currentState["blockType"] !== prop ? prop : "Normal"
      );
    };

    return (
      <Box display={"flex"}>
        <Typography
          onClick={() => {
            toggle("H1");
          }}
        >
          {"H1"}
        </Typography>
        <Typography
          onClick={() => {
            toggle("H2");
          }}
        >
          {"H2"}
        </Typography>
        <Typography
          onClick={() => {
            toggle("H3");
          }}
        >
          {"H3"}
        </Typography>
      </Box>
    );
  };

  const ListToolbarButton = (editor: any) => {
    const toggle = (prop: any) => {
      editor.onChange(editor.currentState !== prop ? prop : undefined);
    };

    return (
      <Box display={"flex"}>
        <FormatListBulletedIcon
          onClick={() => {
            toggle("unordered");
          }}
        />

        <FormatListNumberedIcon
          onClick={() => {
            toggle("ordered");
          }}
        />
      </Box>
    );
  };

  const GetTextAlign = (editor: any) => {
    const toggle = (prop: any) => {
      editor.onChange(editor.currentState !== prop ? prop : undefined);
    };

    return (
      <Box display={"flex"}>
        <FormatAlignLeftRoundedIcon
          onClick={() => {
            toggle("left");
          }}
        />
        <FormatAlignJustifyRoundedIcon
          onClick={() => {
            toggle("center");
          }}
        />
        <FormatAlignRightRoundedIcon
          onClick={() => {
            toggle("right");
          }}
        />
      </Box>
    );
  };

  return (
    <StyledRootBox>
      <Box display="flex" flexDirection={"row"} height={"100%"}>
        <Box flex={1} height={"100%"}>
          <Editor
            ref={editor}
            toolbar={{
              options: [
                "inline",
                "blockType",
                "list",
                "fontSize",
                "textAlign",
                "link",
                "history",
              ],
              inline: {
                component: inlineButtons,
              },
              blockType: {
                component: BlockTypeToolbarButton,
              },
              list: {
                component: ListToolbarButton,
              },
              textAlign: {
                component: GetTextAlign,
              },
              link: {
                link: {
                  className: "toolbarButtons",
                },
                unlink: {
                  className: "toolbarButtons",
                },
              },
              fontSize: {
                className: "fontSizeCustomButton",
              },
              history: {
                undo: { className: "toolbarButtons" },
                redo: { className: "toolbarButtons" },
              },
            }}
            placeholder={""}
            editorState={content}
            wrapperClassName={"wrapper"}
            editorClassName={"editor"}
            toolbarClassName={"toolbar"}
            onEditorStateChange={(val: any) => {
              setContent(val);
              if (data) {
                data.content = val;
              }
            }}
            // @ts-ignore
            onPaste={() => document.execCommand("insertText", false)}
          />
        </Box>
      </Box>
    </StyledRootBox>
  );
};

export default MessageModalEditor;
