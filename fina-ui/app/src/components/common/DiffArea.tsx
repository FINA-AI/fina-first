import * as diff from "diff";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";

window.Diff = diff;

interface Row {
  entityPropertyOldValue?: string;
  entityPropertyNewValue?: string;
}

interface Group {
  value: string;
  added: boolean;
  removed: boolean;
}

interface Styles {
  added: object;
  removed: object;
  font: object;
}

interface DiffAreaProps {
  row: Row;
  mode: "characters" | "words";
}

const DiffArea: React.FC<DiffAreaProps> = ({ row, mode }) => {
  const theme: any = useTheme();
  const [groups, setGroups] = useState<Group[]>([]);

  const styles: Styles = {
    added: {
      color: "#289E20",
      backgroundColor:
        theme.palette.mode === "dark"
          ? theme.palette.paperBackground
          : "#E9F5E9",
    },
    removed: {
      color: "#FF4128",
      backgroundColor:
        theme.palette.mode === "dark"
          ? theme.palette.paperBackground
          : "#FFECE9",
    },
    font: {
      fontSize: "11px",
      lineHeight: "16px",
      fontWeight: 400,
      lineBreak: "anywhere",
    },
  };

  useEffect(() => {
    let oldValue = row.entityPropertyOldValue || "";
    let newValue = row.entityPropertyNewValue || "";

    let changes: diff.Change[];
    if (mode === "characters") {
      changes = diff.diffChars(oldValue, newValue) as diff.Change[];
    } else {
      changes = diff.diffWords(oldValue, newValue) as diff.Change[];
    }

    setGroups(
      changes.map((change) => ({
        value: change.value,
        added: change.added || false,
        removed: change.removed || false,
      }))
    );
  }, [row, mode]);
  return (
    <span data-testid={"diff-area"}>
      {groups.map((group, index) => {
        const { value, added, removed } = group;
        let nodeStyles: object;
        if (added) {
          nodeStyles = { ...styles.added, ...styles.font };
        } else if (removed) {
          nodeStyles = { ...styles.removed, ...styles.font };
        } else {
          nodeStyles = { ...styles.font };
        }
        return (
          <span key={index} style={nodeStyles}>
            {value}
          </span>
        );
      })}
    </span>
  );
};

export default DiffArea;
