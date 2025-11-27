import { Box, List, ListItemButton, Typography } from "@mui/material";
import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import GroupIcon from "@mui/icons-material/Group";
import Tooltip from "../../common/Tooltip/Tooltip";
import { styled } from "@mui/system";
import { Group } from "../../../types/group.type";

interface GroupsListProps {
  data: Group[];
  group: Partial<Group>;
  groupName: string;
  onGroupSelectChange(item: Group): void;
}

const StyledRootContainer = styled(Box)(() => ({
  height: "100%",
  boxSizing: "border-box",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
}));

const StyledListContainer = styled(Box)(() => ({
  width: "100%",
  height: "100%",
  overflow: "auto",
  "& .MuiButtonBase-root": {
    display: "block !Important",
  },
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  padding: 16,
  borderBottom: theme.palette.borderColor,
  display: "flex",
  justifyContent: "space-between",
}));

const StyledTitle = styled(Typography)(() => ({
  fontWeight: 600,
  fontFamily: "Inter",
  fontSize: "15px",
}));

const StyledCodeTypography = styled(Typography)<{ _active: boolean }>(
  ({ _active }) => ({
    height: "20px",
    paddingLeft: "8px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "13px",
    fontWeight: 500,
    lineHeight: "20px",
    color: _active ? "#FFFFFF !important" : "",
  })
);

const StyledListItem = styled(ListItemButton)<{ _active: boolean }>(
  ({ theme, _active }) => ({
    width: "100%",
    height: "56px",
    borderBottom: theme.palette.borderColor,
    cursor: "pointer",
    "&.Mui-focusVisible": {
      backgroundColor: "none",
    },
    "&.Mui-selected": {
      color: "#FFF",
      "& p": {
        color: "#FFF",
      },
    },
    "&:hover": {
      backgroundColor: _active
        ? theme.palette.primary.main
        : theme.palette.buttons.secondary.hover,
    },
    backgroundColor: _active && theme.palette.primary.main,
  })
);

const StyledDescription = styled(Typography)<{ _active: boolean }>(
  ({ _active }) => ({
    height: "20px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: _active ? "#FFFFFF !important" : "#9AA7BE",
    fontSize: "11px",
    fontWeight: 400,
    lineHeight: "16px",
    paddingLeft: 8,
  })
);

const StyledGroupIcon = styled(GroupIcon)<{ _active: boolean }>(
  ({ _active }) => ({
    width: "20px",
    color: _active ? "#FFFFFF !important" : "#8695B1",
    paddingLeft: "8px",
  })
);

const GroupsList: React.FC<GroupsListProps> = ({
  data,
  group,
  groupName,
  onGroupSelectChange,
}) => {
  const { t } = useTranslation();

  const NewItem = ({ groupName }: { groupName: string }) => {
    return (
      <StyledListItem _active={true} key={"reference0"}>
        <StyledGroupIcon _active={true} />
        <StyledDescription _active={true}>
          <span>{groupName}</span>
        </StyledDescription>
      </StyledListItem>
    );
  };

  const memoizedGroupList = useMemo(() => {
    return (
      <>
        {data?.map((item, i) => {
          return (
            <StyledListItem
              _active={item.id === group.id}
              key={"reference" + i}
              autoFocus={group.id === item.id}
              dense
              onClick={() => {
                onGroupSelectChange(item);
              }}
            >
              <Box width={"100%"}>
                <Box display={"flex"} alignItems={"center"} overflow={"hidden"}>
                  <StyledGroupIcon _active={item.id === group.id} />
                  <Tooltip title={item.description}>
                    <StyledDescription _active={item.id === group.id}>
                      {item.description}
                    </StyledDescription>
                  </Tooltip>
                </Box>

                <Box display={"flex"} alignItems={"center"} overflow={"hidden"}>
                  <Tooltip title={item.code}>
                    <StyledCodeTypography _active={item.id === group.id}>
                      {item.code}
                    </StyledCodeTypography>
                  </Tooltip>
                </Box>
              </Box>
            </StyledListItem>
          );
        })}
      </>
    );
  }, [data, group]);

  return (
    <StyledRootContainer>
      <StyledHeader display={"flex"} justifyContent={"space-between"}>
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <StyledTitle> {t("groups")} </StyledTitle>
        </Box>
      </StyledHeader>
      <StyledListContainer>
        <Box flex={1}>
          <List
            sx={{
              padding: "0px",
            }}
          >
            {group.id == 0 && <NewItem groupName={groupName} />}
            {memoizedGroupList}
          </List>
        </Box>
      </StyledListContainer>
    </StyledRootContainer>
  );
};

export default memo(GroupsList, (prevProps, nextProps) => {
  return (
    prevProps.group?.id === nextProps.group?.id &&
    prevProps.data === nextProps.data &&
    prevProps.groupName === nextProps.groupName
  );
});
