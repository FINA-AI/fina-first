import React, { useEffect, useState } from "react";
import { Popover } from "@mui/material";
import PropTypes from "prop-types";

const StyledPopover = ({
  dataArray,
  anchorElement,
  handlePopoverClose,
  isOpen,
}) => {
  const [open, setOpen] = useState(isOpen);

  const onClose = () => {
    setOpen(false);
    if (handlePopoverClose) {
      handlePopoverClose();
    }
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <Popover
      sx={{
        pointerEvents: "none",
      }}
      open={open}
      anchorEl={anchorElement}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      onClose={onClose}
      disableRestoreFocus
    >
      <div style={{ margin: "10px" }}>
        <ul>
          {dataArray.map((d, i) => (
            <li key={"SPopoverListKey_" + i}>
              <b>{d.key}:</b> {d.value}
            </li>
          ))}
        </ul>
      </div>
    </Popover>
  );
};

StyledPopover.propTypes = {
  dataArray: PropTypes.array.isRequired,
  handlePopoverClose: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  anchorElement: PropTypes.object.isRequired,
};

export default StyledPopover;
