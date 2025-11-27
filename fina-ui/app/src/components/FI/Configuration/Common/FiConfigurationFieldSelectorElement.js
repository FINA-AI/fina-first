import { List, ListItem } from "@mui/material";
import { DragIndicator } from "@mui/icons-material";
import PropTypes from "prop-types";
import CloseBtn from "../../../common/Button/CloseBtn";
import CheckBoxBtn from "../../../common/Checkbox/CheckboxBtn";
import Tooltip from "../../../common/Tooltip/Tooltip";
import { styled } from "@mui/material/styles";
import { EmptyDataIcon } from "../../../../api/ui/icons/EmptyDataIcon";

const StyledRoot = styled(List)({
  padding: "7px 0px 0px 0px",
  overflow: "hidden",
  maxWidth: "329px",
  "&.MuiList-root .MuiListItem-root": {
    backgroundColor: "#EAEBF080",
    borderRadius: "8px",
    maxWidth: "329px",
    maxHeight: "48px",
    marginBottom: "8px",
  },
});

const FiConfigurationFieldSelectorElement = ({
  columns,
  isSourceColumn,
  isDragging,
  setIsDragging,
  handleDragStart,
  handleTransfer,
  stepperIndex,
}) => {
  const getList = () => {
    return (
      <StyledRoot>
        {columns.map((element, index) => {
          if (
            isSourceColumn ||
            (element.isSelected && element.stepperIndex === stepperIndex)
          ) {
            return (
              <ListItem
                data-index={index}
                style={{
                  justifyContent: "space-between",
                  display: "flex",
                }}
                key={index}
                draggable={
                  isSourceColumn && element.isSelected ? false : isDragging
                }
                onDragStart={(e) => handleDragStart(e, isSourceColumn, index)}
              >
                <div>
                  <DragIndicator
                    style={{
                      cursor: "move",
                      color: "rgba(104, 122, 158, 0.8)",
                      verticalAlign: "middle",
                    }}
                    key={index}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                  />
                  {isSourceColumn && (
                    <CheckBoxBtn
                      onClick={() => handleTransfer(index, element)}
                      checked={element.isSelected}
                      disabled={isSourceColumn && element.isSelected}
                    />
                  )}
                  <Tooltip title={element.headerName}>
                    <span style={{ paddingLeft: !isSourceColumn && "10px" }}>
                      {element.headerName.length > 25
                        ? element.headerName.slice(0, 25) + "..."
                        : element.headerName}
                    </span>
                  </Tooltip>
                </div>
                {!isSourceColumn && element.isSelected ? (
                  <div>
                    <CloseBtn onClick={() => handleTransfer(index, element)} />
                  </div>
                ) : null}
              </ListItem>
            );
          }
        })}
      </StyledRoot>
    );
  };

  return isSourceColumn ||
    (columns &&
      columns.length > 0 &&
      columns.filter(
        (c) => c.isSelected === true && c.stepperIndex === stepperIndex
      ).length > 0) ? (
    getList()
  ) : (
    <div>
      <div
        style={{
          paddingTop: "10%",
          textAlign: "center",
        }}
      >
        <EmptyDataIcon />
      </div>
      <div style={{ textAlign: "center" }}>{"Fields are not selected"}</div>
    </div>
  );
};

FiConfigurationFieldSelectorElement.propTypes = {
  columns: PropTypes.array.isRequired,
  isSourceColumn: PropTypes.bool.isRequired,
  isDragging: PropTypes.bool,
  setIsDragging: PropTypes.func,
  handleDragStart: PropTypes.func,
  handleTransfer: PropTypes.func,
  stepperIndex: PropTypes.number.isRequired,
};

export default FiConfigurationFieldSelectorElement;
