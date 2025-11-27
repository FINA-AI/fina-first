import { Box, ListItemButton, Typography } from "@mui/material";
import List from "@mui/material/List";
import { getFormattedDateValue } from "../../../util/appUtil";
import useConfig from "../../../hoc/config/useConfig";
import React from "react";
import { UserFile } from "../../../types/userFileSpace.type";
import { ConfigType } from "../../../types/common.type";
import { styled } from "@mui/material/styles";

interface UserFileListProps {
  onSelect: (val: UserFile) => void;
  data: UserFile[];
  itemName: string;
}

const StyledRoot = styled(Box)({
  width: "100%",
  height: "100%",
  overflow: "auto",
  "& .MuiButtonBase-root": {
    display: "block !Important",
  },
});

const StyledListItemButton = styled(ListItemButton)(({ theme }: any) => ({
  width: "100%",
  height: "80px",
  padding: "12px",
  borderBottom: theme.palette.borderColor,
  "&.Mui-focusVisible": {
    backgroundColor: "none",
  },
  "&.Mui-selected": {
    backgroundColor: `${theme.palette.secondary.light}!important`,
    color: theme.palette.mode === "dark" ? "#2D3747" : "#FFF",
    "& p": {
      color: theme.palette.mode === "dark" ? "#2D3747" : "#FFF",
    },
    "&.MuiListItem-button:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },

  "&.MuiListItem-button:hover": {
    backgroundColor: theme.palette.buttons.primary.hover,
  },
}));

const StyledHeaderText = styled(Typography)(({ theme }: any) => ({
  fontSize: "11px",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  color: theme.palette.secondaryText,
  width: "100%",
  lineHeight: "12px",
  fontWeight: 500,
}));

const StyledPrimaryText = styled(Typography)(({ theme }: any) => ({
  fontSize: "13px",
  color: theme.palette.textColor,
  fontWeight: 500,
  lineHeight: "20px",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  width: "100%",
  overflow: "hidden",
  fontFamily: "Inter",
  paddingTop: "4px",
}));

const StyledSecondaryText = styled(StyledPrimaryText)(({ theme }: any) => ({
  fontSize: "11px",
  color: theme.palette.secondaryText,
  fontWeight: 400,
  lineHeight: "16px",
}));

const UserFileList: React.FC<UserFileListProps> = ({
  itemName,
  data,
  onSelect,
}) => {
  const { getDateFormat } = useConfig();
  const { config }: { config: ConfigType } = useConfig();

  const isSelected = (item: UserFile) => {
    return itemName === item.name;
  };

  return (
    <StyledRoot display="flex" flexDirection="column">
      <Box flex={1}>
        <List component="nav" disablePadding data-testid={"user-file-list"}>
          {data?.map((item, i) => {
            return (
              <StyledListItemButton
                autoFocus={isSelected(item)}
                dense
                selected={isSelected(item)}
                onClick={() => onSelect(item)}
                data-testid={"item-" + i}
              >
                <div key={i}>
                  <StyledHeaderText
                    style={{
                      color: isSelected(item)
                        ? "#F0F4FF"
                        : "rgba(104, 122, 158, 0.8)",
                      opacity: isSelected(item) ? 0.6 : 1,
                    }}
                    data-testid={"date"}
                  >
                    {getFormattedDateValue(
                      item?.lastModified,
                      getDateFormat(true)
                    )}
                  </StyledHeaderText>
                  <StyledPrimaryText data-testid={"name"}>
                    {item.name}
                  </StyledPrimaryText>
                  <StyledSecondaryText data-testid={"description"}>
                    {
                      item.descriptions?.find(
                        (desc) => desc?.lc === config.language
                      )?.dc
                    }
                  </StyledSecondaryText>
                </div>
              </StyledListItemButton>
            );
          })}
        </List>
      </Box>
    </StyledRoot>
  );
};

export default UserFileList;
