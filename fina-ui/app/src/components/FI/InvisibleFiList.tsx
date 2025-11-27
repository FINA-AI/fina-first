import * as React from "react";
import Popover from "@mui/material/Popover";
import { Box } from "@mui/system";

interface InvisibleFiListProps {
  children: React.ReactNode[];
  invisibleFisCount: number;
}

const InvisibleFiList: React.FC<InvisibleFiListProps> = ({
  children,
  invisibleFisCount,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (!invisibleFisCount) return <></>;

  return (
    <div>
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "2px 5px 10px",
          cursor: "pointer",
          marginLeft: "10px",
        }}
        data-testid={"additional-fi-types-button"}
      >
        <Box
          sx={(theme) => ({
            display: "flex",
            width: "24px",
            height: "20px",
            borderRadius: "2px",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              theme.palette.mode === "dark" ? "#3c4d68" : "#e3eaf3",
          })}
        >
          {invisibleFisCount > 9 ? `9+` : invisibleFisCount}
        </Box>
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: 0,
          horizontal: "right",
        }}
        sx={(theme: any) => ({
          "& .MuiPaper-root": {
            border: theme.palette.borderColor,
            maxHeight: "250px",
            width: "200px",
            padding: "10px",
            borderRadius: "3px",
          },
          "& .MuiPopover-paper": {
            marginTop: "8px",
          },
        })}
      >
        {React.Children.map(children, (child: any) => {
          return React.cloneElement(child, {
            onClick: (event: any) => {
              child.props.onClick?.(event);
              handleClose();
            },
          });
        })}
      </Popover>
    </div>
  );
};

export default InvisibleFiList;
