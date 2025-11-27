import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import { Box, IconButton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import React, { useEffect, useRef, useState } from "react";
import { convertToRaw, EditorState } from "draft-js";
import classNames from "classnames";
import draftToHtml from "draftjs-to-html";
import { MoreHoriz, Send } from "@mui/icons-material";
import FileAttachmentBox from "./FileAttachmentBox";
import AttachmentIcon from "@mui/icons-material/Attachment";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatAlignLeftRoundedIcon from "@mui/icons-material/FormatAlignLeftRounded";
import FormatAlignJustifyRoundedIcon from "@mui/icons-material/FormatAlignJustifyRounded";
import FormatAlignRightRoundedIcon from "@mui/icons-material/FormatAlignRightRounded";
import { useDropzone } from "react-dropzone";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/system";
import { CommAttachmentType } from "../../../types/communicator.common.type";

interface ChatEditorProps {
  onSendMessage: (message: string, attachments: CommAttachmentType[]) => void;
  isSendBtnDisabled: boolean;
  setIsSendBtnDisabled: (value: boolean) => void;
  attachments: CommAttachmentType[];
  setAttachments: (attachments: CommAttachmentType[]) => void;
  openBox: boolean;
  setOpenBox: (open: boolean) => void;
  fullControl?: boolean;
  withOptionBtn?: boolean;
}

const StyledRootBox = styled(Box)<{ _isSendBtnDisabled: boolean }>(
  ({ theme, _isSendBtnDisabled }) => ({
    display: "flex",
    flexDirection: "column",
    "& .DraftEditor-editorContainer, .DraftEditor-root, .public-DraftEditor-content":
      {
        height: "auto !important",
      },
    "& .rdw-editor-main": {
      height: "inherit",
    },
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
    "& .rdw-editor-wrapper": {
      height: "100%",
      "& .rdw-editor-main": {
        height: "100px",
      },
    },
    "& .rdw-dropdown-selectedtext": {
      backgroundColor: theme.palette.paperBackground,
      color: theme.palette.mode === "light" ? "#8695B1" : "#5D789A",
    },
    "& .rdw-fontsize-option": {
      color: theme.palette.textColor,
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
    },
    "& .public-DraftEditorPlaceholder-root": {
      color: "#5D789A",
    },
    "& .rdw-dropdownoption-active": {
      backgroundColor: theme.palette.action.hover,
    },
    "& .rdw-dropdown-carettoopen": {
      borderTop: "5px solid #8695B1",
    },
    "& .rdw-dropdown-carettoclose": {
      borderBottom: "5px solid #8695B1",
    },
    "& .rdw-dropdown-optionwrapper": {
      backgroundColor: theme.palette.paperBackground,
      bottom: "275px!important",
      border: theme.palette.borderColor,
      boxShadow: "unset",
    },

    "& .rdw-link-modal": {
      background: theme.palette.paperBackground,
      top: "-240px !important",
      borderRadius: 4,
      border: theme.palette.borderColor,
      boxShadow: theme.palette.paperBoxShadow,
      left: "-35px",
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
    "& .rdw-link-modal-btn": {
      ...(theme as any).primaryBtn,
      border: "none",
      color: "#fff",
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
      '& input[type="checkbox"]:not(:checked)': {
        appearance: "none",
        width: 13,
        height: 13,
        borderRadius: 2,
        backgroundColor: "inherit",
        border: theme.palette.borderColor,
      },
    },
    "& .rdw-link-modal-target-option > span": {
      color: theme.palette.secondaryTextColor,
    },
    "& .rdw-fontsize-wrapper": {
      backgroundColor: theme.palette.paperBackground,
      marginBottom: 0,
    },
    "& .rdw-link-modal-input": {
      backgroundColor: theme.palette.paperBackground,
      border: theme.palette.borderColor,
    },
    "& #linkTitle, & #linkTarget": {
      color: theme.palette.textColor,
    },
    "& .rdw-link-wrapper": {
      marginBottom: 0,
    },
    "& .rdw-history-wrapper  ": {
      marginBottom: 1,
    },
    "& .rdw-option-wrapper": {
      border: "none",
      height: "15px",
      padding: "2px 0px 2px 0px",
      background: "inherit",
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
      background: "inherit",
      border: "unset",
      boxShadow: "unset",
      margin: "0px",
    },

    "& .sendMessage": {
      color: _isSendBtnDisabled
        ? "rgba(0, 0, 0, 0.26)"
        : `${theme.palette.primary.main} !important`,
      "& .MuiSvgIcon-root": {
        color: _isSendBtnDisabled
          ? "rgba(0, 0, 0, 0.26)"
          : `${theme.palette.primary.main} !important`,
        margin: "0px !important",
      },
      border: "none",
    },

    "& .toolbarButtons": {
      height: "15px !important",
      background: `${theme.palette.paperBackground} !important`,
      border: "none!important",
      borderRadius: "50% !important",
      padding: "2px 0px 2px 0px !important",
      "&:hover": {
        boxShadow: "none !important",
        background: "none",
      },
      "& img": {
        filter:
          "invert(71%) sepia(6%) saturate(1396%) hue-rotate(181deg) brightness(82%) contrast(86%) !important",
        height: "12px",
      },
    },

    "& .fontSizeCustomButton": {
      height: "15px !important",
      background: `${theme.palette.paperBackground} !important`,
      border: "none!important",
      marginTop: "4px",
      borderRadius: "50% !important",
      padding: "2px 0px 2px 0px !important",
      "&:hover": {
        boxShadow: "none !important",
        background: "inherit !important",
      },
    },

    "& .wrapper": {
      display: "flex",
      border: theme.palette.borderColor,
      flexDirection: "column-reverse",
      margin: "10px 0",
      borderRadius: 8,
    },

    "& .editor": {
      maxHeight: "150px",
      minHeight: "56px",
      fontSize: "12px",
      lineHeight: 1,
      border: "none",
      margin: "8px 12px 0 12px",
      color: "",
      borderRadius: "20px",
      padding: "0px 10px",
      expandedEditor: {
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        minHeight: "45px",
      },
      "& h1": {
        fontSize: "22px !important",
        fontWeight: 400,
        color: theme.palette.textColor,
      },
      "& h2": {
        fontSize: "18px !important",
        fontWeight: 400,
        color: theme.palette.textColor,
      },
      "& h3": {
        fontSize: "14px !important",
        fontWeight: 400,
        color: theme.palette.textColor,
      },
    },

    "& .toolbar": {
      backgroundColor: "inherit",
      margin: 0,
      padding: 0,
      paddingLeft: "20px",
      display: "flex",
      alignItems: "center",
      height: "100%",
      minHeight: 20,
      maxHeight: 24,
      paddingBottom: 25,
      paddingTop: 15,
      border: "none !important",
      borderTop: "none",
      width: "80%",
      "& .MuiSvgIcon-root": {
        display: "flex",
        justifyContent: "center",
        color: theme.palette.mode === "light" ? "#8695B1" : "#5D789A",
        fontSize: 16,
        marginRight: 8,
        cursor: "pointer",
      },

      "& .MuiTypography-root": {
        color: theme.palette.mode === "light" ? "#8695B1" : "#5D789A",
        marginRight: 8,
        cursor: "pointer",
        fontSize: 13,
      },
    },

    "& .editorActionBtn": {
      position: "absolute",
      right: "36px",
    },
  })
);

const StyledAttachtn = styled(IconButton)(({ theme }) => ({
  "& .MuiSvgIcon-root": {
    color: theme.palette.mode === "light" ? "#b8bcc4" : "#5D789A",
    margin: "0px !important",
  },
}));

const StyledExpandedEditorBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  paddingLeft: 10,
  paddingRight: 10,
}));

const ChatEditor: React.FC<ChatEditorProps> = ({
  fullControl = false,
  withOptionBtn = false,
  onSendMessage,
  isSendBtnDisabled,
  setIsSendBtnDisabled,
  attachments,
  setAttachments,
  openBox,
  setOpenBox,
}) => {
  const [expanded, setExpanded] = useState(true);
  const { t } = useTranslation();
  const editor = useRef<any>();
  const { hasPermission } = useConfig();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    disabled: false,
    noKeyboard: true,
    multiple: true,
  });

  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setAttachments(attachments.concat(Object.values(acceptedFiles)));
      setOpenBox(acceptedFiles.length > 0);
    }
  }, [acceptedFiles]);

  const removeAttachement = (index: number) => {
    let files = [];
    for (let i = 0; i < attachments.length; i++) {
      if (i != index) {
        files.push(attachments[i]);
      }
    }
    setAttachments(files);
    files.length > 0 ? setOpenBox(true) : setOpenBox(false);
  };

  const checkTextByConvertedRaw = (convertedRaw: any) => {
    if (convertedRaw.length === 0) {
      return true;
    } else if (convertedRaw.length === 1) {
      return convertedRaw[0].text.trim() === "";
    } else {
      for (let i of convertedRaw) {
        if (i.text.trim() !== "") {
          return false;
        }
      }
      return true;
    }
  };

  useEffect(() => {
    if (inputTextIsEmpty()) {
      setIsSendBtnDisabled(false);
    } else {
      setIsSendBtnDisabled(true);
    }
  }, [editorState]);

  const inputTextIsEmpty = () => {
    const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
    return !checkTextByConvertedRaw(blocks);
  };

  const sendMessage = async () => {
    setIsSendBtnDisabled(true);
    if (inputTextIsEmpty() || attachments.length !== 0) {
      let blocks = convertToRaw(editorState.getCurrentContent()).blocks.filter(
        (el) => el.text.trim() !== ""
      );
      let content = {
        blocks: blocks,
        entityMap: convertToRaw(editorState.getCurrentContent()).entityMap,
      };
      await onSendMessage(draftToHtml(content), attachments);
      setEditorState(() => EditorState.createEmpty());
      setIsSendBtnDisabled(true);
    }
  };

  const fileUpload = () => {
    open();
    setExpanded(true);
  };

  const InlineToolbarButton = ({ currentState, onChange }: any) => {
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

  const BlockTypeToolbarButton = ({ currentState, onChange }: any) => {
    const toggle = (prop: any) => {
      onChange(currentState["blockType"] !== prop ? prop : "Normal");
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

  const ListToolbarButton = ({ currentState, onChange }: any) => {
    const toggle = (prop: any) => {
      onChange(currentState !== prop ? prop : undefined);
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

  const ActionButtons = () => {
    return (
      <Box display={"flex"}>
        {withOptionBtn && (
          <MoreHoriz
            fontSize={"small"}
            className={classNames("actionButton", "primaryButton")}
            classes={{
              root: "toggleButton",
            }}
            onClick={() => setExpanded(!expanded)}
          />
        )}

        <Box {...getRootProps()}>
          <StyledAttachtn
            size={"small"}
            onClick={fileUpload}
            style={{ border: "none" }}
          >
            <input {...getInputProps()} />
            <AttachmentIcon fontSize="small" />
          </StyledAttachtn>
        </Box>

        <IconButton
          disabled={isSendBtnDisabled}
          className={classNames("actionButton", "primaryButton", "sendMessage")}
          onClick={sendMessage}
          size={"small"}
        >
          <Send fontSize="small" />
        </IconButton>
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

  const ExpandedEditor = () => {
    return (
      <StyledExpandedEditorBox
        sx={{
          pointerEvents: !hasPermission(
            PERMISSIONS.FINA_COMMUNICATOR_MESSAGES_AMEND
          )
            ? "none"
            : "auto",
        }}
      >
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
              component: InlineToolbarButton,
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
          placeholder={t("typeAMessage")}
          editorState={editorState}
          wrapperClassName={"wrapper"}
          editorClassName={classNames("editor", "expandedEditor")}
          toolbarClassName={"toolbar"}
          onEditorStateChange={setEditorState}
          toolbarCustomButtons={[
            <div className={"editorActionBtn"}>{ActionButtons()}</div>,
          ]}
          // @ts-ignore
          onPaste={() => document.execCommand("insertText", false)}
        />
      </StyledExpandedEditorBox>
    );
  };

  const CollapsedEditor = () => {
    return (
      <Box
        display="flex"
        flexDirection={"row"}
        className={"collapsedBoxWrapper"}
      >
        <Box flex={1}>
          <Editor
            ref={editor}
            placeholder={t("typeAMessage")}
            editorState={editorState}
            wrapperClassName={"wrapperCollapsed"}
            editorClassName={classNames("editor", "collapsedEditor")}
            toolbarClassName={"toolbarHidden"}
            onEditorStateChange={setEditorState}
            // @ts-ignore
            onPaste={() => document.execCommand("insertText", false)}
          />
        </Box>
        <Box display="flex" flexDirection={"column-reverse"}>
          <Box>{ActionButtons()}</Box>
        </Box>
      </Box>
    );
  };

  return (
    <StyledRootBox _isSendBtnDisabled={isSendBtnDisabled}>
      <FileAttachmentBox
        files={attachments}
        remove={removeAttachement}
        open={openBox}
      />
      {expanded && <>{fullControl ? CollapsedEditor() : ExpandedEditor()}</>}
    </StyledRootBox>
  );
};

export default ChatEditor;
