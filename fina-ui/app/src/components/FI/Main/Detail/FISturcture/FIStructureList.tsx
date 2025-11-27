import { Box, Checkbox, Divider, ListItem, ListItemText } from "@mui/material";
import List from "@mui/material/List";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import React, { useEffect, useState } from "react";
import {
  load,
  makeDefaultCriterion,
} from "../../../../../api/services/fi/fiStructureService";
import ConfirmModal from "../../../../common/Modal/ConfirmModal";
import { useTranslation } from "react-i18next";
import { styled, useTheme } from "@mui/material/styles";
import useErrorWindow from "../../../../../hoc/ErrorWindow/useErrorWindow";
import { FiStructureDataType } from "../../../../../types/fi.type";
import { CancelIcon } from "../../../../../api/ui/icons/CancelIcon";

const StyledListItem = styled(ListItem)(({ theme }: any) => ({
  width: "100%",
  height: "64px",
  padding: "12px",
  "&.Mui-focusVisible": {
    backgroundColor: "none",
  },
  "&.Mui-selected": {
    color: theme.palette.mode === "dark" ? "#3C4D68" : "#FFF",
    backgroundColor: `${theme.palette.primary.main} !important`,
    "& p": {
      color: theme.palette.mode === "dark" ? "#3C4D68" : "#FFF",
    },
    "& .MuiListItem-button:hover": {
      backgroundColor: `${theme.palette.buttons.primary.hover} !important`,
    },
    "& .MuiListItemText-root .MuiListItemText-primary": {
      color: theme.palette.mode === "dark" ? "#3C4D68" : "#FFF",
    },
  },
}));

const StyledListItemText = styled(ListItemText)(({ theme }: any) => ({
  "& .MuiListItemText-primary": {
    ...theme.sideMenu.mainText,
    marginBottom: "4px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  "& .MuiListItemText-secondary": {
    ...theme.sideMenu.secondaryText,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
}));

interface FIStructureListProps {
  selectedItem?: FiStructureDataType;
  setSelectedItem: React.Dispatch<
    React.SetStateAction<FiStructureDataType | undefined>
  >;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const FIStructureList: React.FC<FIStructureListProps> = ({
  selectedItem,
  setSelectedItem,
  editMode,
  setEditMode,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();
  const [data, setData] = useState<FiStructureDataType[]>([]);
  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean;
    data?: FiStructureDataType;
  }>({ isOpen: false });
  const theme = useTheme();

  useEffect(() => {
    loadCriterions();
  }, []);

  const loadCriterions = () => {
    load().then((resp) => {
      setData(resp.data);
    });
  };

  const makeDefault = (criterion: FiStructureDataType) => {
    makeDefaultCriterion(criterion.id)
      .then(() => {
        loadCriterions();
      })
      .catch((err) => {
        openErrorWindow(err, t("Warning"), true, "warning");
      });
  };

  return (
    <Box
      display={"flex"}
      flex={1}
      width={"100%"}
      height={"100%"}
      data-testid={"fi-structure-list"}
    >
      <Box
        display={"flex"}
        width={"100%"}
        flexDirection={"column"}
        overflow={"hidden"}
      >
        <Box
          style={{
            overflow: "auto",
          }}
        >
          <List
            component="nav"
            disablePadding
            sx={{
              overflowX: "hidden",
              overflowY: "auto",
            }}
          >
            {data.map((item, i) => (
              <React.Fragment key={item?.id}>
                <StyledListItem
                  selected={item.code === selectedItem?.code}
                  onClick={() => {
                    if (editMode) {
                      setCancelModal({ isOpen: true, data: item });
                    } else {
                      setSelectedItem(item);
                    }
                  }}
                  data-testid={"item-" + i}
                >
                  <Box
                    display={"flex"}
                    alignItems={"flex-start"}
                    width={"100%"}
                    sx={{ cursor: "pointer" }}
                  >
                    <Checkbox
                      onClick={(e) => {
                        e.stopPropagation();
                        makeDefault(item);
                      }}
                      style={{
                        padding: 6,
                      }}
                      icon={
                        <StarOutlineIcon
                          style={{
                            color:
                              item.code === selectedItem?.code
                                ? theme.palette.mode === "light"
                                  ? "#FFF"
                                  : "#3C4D68"
                                : "rgba(104, 122, 158, 0.8)",
                          }}
                        />
                      }
                      data-testid="checkbox"
                      checked={item.isDefault}
                      checkedIcon={<StarIcon style={{ color: "#FF8D00" }} />}
                    />
                    <Box pl={"5px"} style={{ overflow: "hidden" }}>
                      <StyledListItemText
                        primary={item.code}
                        secondary={item.name}
                      />
                    </Box>
                  </Box>
                </StyledListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Box>
      <Box display={"flex"}>
        <Divider orientation="vertical" flexItem />
      </Box>

      {cancelModal.isOpen && (
        <ConfirmModal
          isOpen={cancelModal.isOpen}
          setIsOpen={() => setCancelModal({ isOpen: false })}
          onConfirm={() => {
            setSelectedItem(cancelModal.data);
            setCancelModal({ isOpen: false });
            setEditMode(false);
          }}
          confirmBtnTitle={t("confirm")}
          headerText={t("cancel")}
          bodyText={t("cancelBodyText")}
          additionalBodyText={t("changes")}
          icon={<CancelIcon />}
        />
      )}
    </Box>
  );
};

export default FIStructureList;
