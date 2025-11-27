import { Box } from "@mui/system";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonIcon from "@mui/icons-material/Person";
import React from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { GroupAndUsersDataType } from "../../../../../types/fi.type";

interface StyledProps {
  theme?: any;
  _row: GroupAndUsersDataType;
  _isPerrmited: boolean;
}

const StyledRoot = styled(Box, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})<{
  _row: GroupAndUsersDataType;
  _isPerrmited: boolean;
}>(({ theme, _row, _isPerrmited }) => ({
  "& .MuiSvgIcon-root": {
    width: "17px",
    height: "17px",
    marginRight: "10px",
    color: _isPerrmited && _row.opened ? theme.palette.primary.main : "#8695B1",
  },
}));

const commonStyles = (
  theme: any,
  _row: GroupAndUsersDataType,
  _isPerrmited: boolean
) => ({
  color:
    _isPerrmited && _row.opened
      ? theme.palette.primary.main
      : theme.palette.mode === "dark"
      ? "#5D789A"
      : "#98A7BC",
});

const StyledPersonalIcon = styled(PersonIcon, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})(({ theme, _row, _isPerrmited }: StyledProps) => ({
  ...commonStyles(theme, _row, _isPerrmited),
}));

const StyledBox = styled(Box, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})(({ theme, _row, _isPerrmited }: StyledProps) => ({
  ...commonStyles(theme, _row, _isPerrmited),
}));

const StyledText = styled(Typography, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})(({ theme, _row, _isPerrmited }: StyledProps) => ({
  color:
    _isPerrmited && _row.opened
      ? theme?.palette.primary.main
      : theme?.palette.mode === "light"
      ? "#2C3644"
      : "#F5F7FA",
  fontSize: 12,
  fontWeight: 400,
  lineHeight: "20px",
}));

interface PermittedUserIconProps {
  row: GroupAndUsersDataType;
  isPerrmited: boolean;
}

const PermittedUserIcon: React.FC<PermittedUserIconProps> = ({
  row,
  isPerrmited,
}) => {
  return (
    <StyledRoot
      display={"flex"}
      alignItems={"center"}
      _row={row}
      _isPerrmited={isPerrmited}
    >
      {!row.group ? (
        <Box display={"flex"} alignItems={"center"}>
          <StyledPersonalIcon _row={row} _isPerrmited={isPerrmited} />
          <StyledText
            _row={row}
            _isPerrmited={isPerrmited}
            data-testid={"login-label"}
          >
            {row.login ? row.login : row.code}
          </StyledText>
        </Box>
      ) : (
        <StyledBox
          display="flex"
          alignItems="center"
          _row={row}
          _isPerrmited={isPerrmited}
        >
          <PeopleAltIcon />
          <StyledText
            _row={row}
            _isPerrmited={isPerrmited}
            data-testid={"login-label"}
          >
            {row.code}
          </StyledText>
        </StyledBox>
      )}
    </StyledRoot>
  );
};

// @ts-ignore
export default PermittedUserIcon;
