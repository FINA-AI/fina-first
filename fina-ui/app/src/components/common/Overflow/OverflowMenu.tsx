import React, { useLayoutEffect, useMemo, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";

interface OverflowMenuProps {
  children: React.ReactElement;
  visibilityMap: { [key: string]: boolean };
}

const StyledRootBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "30px",
}));

const StyledMenu = styled(Menu)({
  "& li": { background: "unset !important", padding: "4px" },
});

const OverflowMenu: React.FC<OverflowMenuProps> = ({
  children,
  visibilityMap,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  useLayoutEffect(() => {
    const selectedMenu = React.Children.toArray(children).find(
      (child): child is React.ReactElement<any> =>
        React.isValidElement(child) && child.props?.isselectedmenu === "true"
    );

    setIsSelected(
      Boolean(
        selectedMenu && visibilityMap[selectedMenu.props["data-targetid"]]
      )
    );
  }, [visibilityMap, children]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const shouldShowMenu = useMemo(
    () => Object.values(visibilityMap).some((v) => v === false),
    [visibilityMap]
  );

  if (!shouldShowMenu) {
    return null;
  }

  return (
    <StyledRootBox>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ padding: isSelected ? "2px" : "inherit" }}
      >
        <MoreVertIcon />
      </IconButton>
      <StyledMenu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        {React.Children.map(children, (child) => {
          if (!visibilityMap[child.props["data-targetid"]]) {
            return (
              <MenuItem key={child.key} onClick={handleClose}>
                {React.cloneElement(child, {
                  style: {
                    ...child.props.style,
                    display: "block",
                    maxWidth: 200,
                    width: "100%",
                    marginRight: "0px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                })}
              </MenuItem>
            );
          }
          return null;
        })}
      </StyledMenu>
    </StyledRootBox>
  );
};

export default OverflowMenu;
