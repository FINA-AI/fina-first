import React, { FC, useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";

interface EditableLabelProps {
  initialValue: string;
  save: (v: string) => void;
  disableKeys?: boolean;
  inputName?: string;
  inputId?: string;
}

const StyledInput = styled("input")(({ theme }: any) => ({
  width: 100,
  color: theme.palette.mode === "dark" ? "#FFF" : "#2C3644",
  border: "none",
  "&:focus": {
    background: theme.palette.paperBackground,
    outline: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.mode === "dark" ? "#FFF" : "#2C3644",
  },
}));

const EditableLabel: FC<EditableLabelProps> = ({
  initialValue,
  save,
  disableKeys,
  inputName,
  inputId,
}) => {
  const [view, setView] = useState("label");
  const [value, setValue] = useState(initialValue);
  const [previous, setPrevious] = useState(initialValue);
  const textInput: any = useRef(null);

  useEffect(() => {
    if (view === "text") {
      textInput.current.focus();
    } else if (isEmpty(value)) {
      setValue(previous);
    }
  }, [view, textInput]);

  const isEmpty = (v: string) => {
    return !(!v || v.trim().length > 0);
  };

  const keyUp = (e: any) => {
    if (disableKeys === true) {
      return;
    }

    if (e.key === "Escape") {
      setValue(previous);
      setView("label");
    } else if (e.key === "Enter") {
      if (isEmpty(e.target.value)) {
        setValue(previous);
        setView("label");
      } else {
        setValue(e.target.value);
        setPrevious(e.target.value);
        setView("label");

        save(e.target.value);
      }
    }
  };

  const renderLabel = () => {
    return (
      <span
        onClick={() => {
          setView("text");
        }}
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
        data-testid={inputName}
      >
        {value}
      </span>
    );
  };

  const renderInput = () => {
    return (
      <div>
        <StyledInput
          type="text"
          value={value}
          ref={textInput}
          id={inputId !== undefined ? inputId : ""}
          name={inputName !== undefined ? inputName : ""}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onBlur={(e) => {
            setView("label");

            const v = e.target.value;
            if (!isEmpty(v)) {
              setPrevious(v);
              save(v);
            }
          }}
          onKeyUp={keyUp}
        />
      </div>
    );
  };

  return view === "label" ? renderLabel() : renderInput();
};

export default EditableLabel;
