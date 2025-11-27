import React, { memo } from "react";
import { Badge, ListItemIcon, Tooltip } from "@mui/material";
import { bindActionCreators } from "@reduxjs/toolkit";
import { updateUnreadMessageCounterAction } from "../../redux/actions/messagesActions";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { styled } from "@mui/system";
import { StyledListItem, StyledListItemText } from "./sidebar-jss";

interface BottomMenuItemProps {
  badgeContent?: number;
  Icon?: React.ElementType;
  link: string;
  text: string;
  badgeTooltip?: string;
  hideTooltip?: boolean;
  onClick: VoidFunction;
}

const LinkBtn = React.forwardRef(function LinkBtn(props: any, ref) {
  return <NavLink to={props.to} {...props} innerRef={ref} />; // eslint-disable-line
});

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  color: "white",
  [theme.breakpoints.between(900, 1300)]: {
    minWidth: "40px",
    color: "white",
  },
}));

const StyledBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    fontSize: "0.6rem",
  },
}));

const BottomMenuItem: React.FC<BottomMenuItemProps> = ({
  link,
  text,
  badgeContent,
  Icon,
  badgeTooltip,
  hideTooltip = true,
  onClick,
}) => {
  return (
    <StyledListItem component={LinkBtn} to={link} onClick={onClick}>
      <StyledListItemIcon>
        <Tooltip
          title={badgeTooltip}
          placement="top"
          disableHoverListener={hideTooltip}
        >
          <StyledBadge badgeContent={badgeContent} max={9} color="primary">
            {Icon && <Icon />}
          </StyledBadge>
        </Tooltip>
      </StyledListItemIcon>
      <StyledListItemText
        id="hidden"
        style={{ color: "white" }}
        primary={text}
      />
    </StyledListItem>
  );
};

const reducer = "messages";
const mapStateToProps = (state: any) => ({
  unreadMessageCount: state.getIn([reducer, "unreadMessageCount"]),
});

const mapDispatchToProps = (dispatch: any) => ({
  setUnreadMessageCount: bindActionCreators(
    updateUnreadMessageCounterAction,
    dispatch
  ),
});

const BottomMenuItemWrapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomMenuItem);

export default memo(BottomMenuItemWrapped);
