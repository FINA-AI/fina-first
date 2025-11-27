import React, { useEffect, useRef, useState } from "react";
import { Checkbox, Popover } from "@mui/material";
import { FixedSizeList as List } from "react-window";
import { AutoSizer } from "react-virtualized";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import TextField from "../../../common/Field/TextField";
import { InspectorDataType } from "../../../../types/emsFiProfile.type";
import { styled, useTheme } from "@mui/material/styles";

interface EmsProfileInspectorPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  inspectorSelectionHandler: (
    checked: boolean,
    inspectorItem: InspectorDataType
  ) => void;
  selectedInspectors: InspectorDataType[];
  inspectors: InspectorDataType[];
}

const StyledPopoverInnerBox = styled(Box)({
  padding: "10px 10px 50px 10px",
  height: "400px",
  width: "300px",
});

const StyledLabelDiv = styled("div")({
  fontSize: "12px",
  width: "250px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const StyledCheckBox = styled(Checkbox)({
  "&:hover": {
    backgroundColor: "transparent",
  },
  "&.Mui-checked": {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
});

const EmsProfileInspectorPopover: React.FC<EmsProfileInspectorPopoverProps> = ({
  anchorEl,
  onClose,
  inspectorSelectionHandler,
  selectedInspectors,
  inspectors,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [originalInspectors, setOriginalInspectors] = useState<
    InspectorDataType[]
  >([]);
  const [filteredInspectors, setFilteredInspectors] =
    useState<InspectorDataType[]>(inspectors);

  const listRef = useRef<any>(null);

  useEffect(() => {
    if (inspectors.length > 0) {
      setOriginalInspectors(inspectors);
    }
  }, [inspectors]);

  const filteredData = (val: string) => {
    const filter = originalInspectors.filter(
      (item: any) =>
        item.login?.toLowerCase().includes(val.toLowerCase()) ||
        item.description?.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredInspectors(filter);
  };

  function getSelectedRowStyle(
    style: React.CSSProperties,
    item: { login: string; description: string },
    selectedInspectors: InspectorDataType[]
  ): React.CSSProperties {
    return {
      ...style,
      paddingTop: 0,
      paddingBottom: 0,
      margin: 0,
      background: selectedInspectors.find(
        (row: InspectorDataType) =>
          row.login === item.login && row.description === item.description
      )
        ? `${theme.palette.action.hover}`
        : "",
    };
  }

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      data-testid={"inspector-popover"}
    >
      <StyledPopoverInnerBox>
        <Box marginBottom={"10px"}>
          <TextField
            label={`${t("search")}...`}
            onChange={(val: any) => {
              filteredData(val);
            }}
            size={"small"}
          />
        </Box>

        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => (
            <List
              height={height}
              itemCount={filteredInspectors.length}
              itemSize={40}
              width={width}
              ref={listRef}
              style={{ overflow: "hidden", overflowY: "auto" }}
            >
              {({ index, style }: { index: number; style: any }) => {
                const item = filteredInspectors[index];
                return (
                  <div
                    style={getSelectedRowStyle(style, item, selectedInspectors)}
                    data-testid={"item-" + index}
                  >
                    <FormControlLabel
                      sx={{ width: "100% !important", marginLeft: "0px" }}
                      control={
                        <StyledCheckBox
                          size={"small"}
                          checked={Boolean(
                            selectedInspectors.find(
                              (row: InspectorDataType) =>
                                row.login === item.login &&
                                row.description === item.description
                            )
                          )}
                          onChange={(e) =>
                            inspectorSelectionHandler(e.target.checked, item)
                          }
                          data-testid={"checkbox"}
                        />
                      }
                      label={
                        <StyledLabelDiv data-testid={"label"}>
                          <span>{`${item?.login} (${item?.description})`}</span>
                        </StyledLabelDiv>
                      }
                    />
                  </div>
                );
              }}
            </List>
          )}
        </AutoSizer>
      </StyledPopoverInnerBox>
    </Popover>
  );
};

export default EmsProfileInspectorPopover;
