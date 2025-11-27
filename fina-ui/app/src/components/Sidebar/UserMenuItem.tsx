import { Badge, Skeleton, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import ProfileMenu from "./ProfileMenu";
import React, { memo } from "react";
import { getLanguage } from "../../util/appUtil";
import { styled } from "@mui/material/styles";
import { StyledListItem } from "./sidebar-jss";
import { Config } from "../../types/config.type";

interface UserMenuItemProps {
  setHovered: (hovered: boolean) => void;
  config: Config;
  userAttr: { avatar: string; name: Record<string, string> };
}

const getLogoStyles = (theme: any) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "20px",
  height: "20px",
  background: theme.palette.primary.main,
  borderRadius: 10,
  fontSize: "12px",
  fontWeight: 500,
  color: "#FFFFFF",
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  ...getLogoStyles(theme),
}));
const StyledSkeleton = styled(Skeleton)(({ theme }) => ({
  ...getLogoStyles(theme),
}));

const StyledTitle = styled(Typography)(({ theme }: { theme: any }) => ({
  color: theme.general.textColor,
  paddingLeft: "35px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "65px",
  [theme.breakpoints.between(900, 1300)]: {
    paddingLeft: "20px",
  },
}));
const UserMenuItem: React.FC<UserMenuItemProps> = ({
  setHovered,
  config,
  userAttr,
}) => {
  const transform = 0;
  const langCode = getLanguage();
  const userName = userAttr.name[langCode];
  return (
    <StyledListItem>
      <Box display={"flex"} width={"100%"}>
        <Box
          display={"flex"}
          width={"100%"}
          justifyContent={"space-between"}
          alignItems={"center"}
          style={{
            opacity: 1 - transform / 100,
            marginTop: transform * -0.3,
            color: "white",
          }}
        >
          <Box display={"flex"} alignItems={"center"}>
            {userName ? (
              <StyledBadge overlap="circular">
                {userName.toUpperCase().slice(0, 1)}
              </StyledBadge>
            ) : (
              <StyledSkeleton variant="rectangular" />
            )}
            <Tooltip title={userName && userName.toUpperCase()}>
              <StyledTitle>{userName}</StyledTitle>
            </Tooltip>
          </Box>
          <Box>
            <ProfileMenu setHovered={setHovered} config={config} />
          </Box>
        </Box>
      </Box>
    </StyledListItem>
  );
};

export default memo(UserMenuItem);
