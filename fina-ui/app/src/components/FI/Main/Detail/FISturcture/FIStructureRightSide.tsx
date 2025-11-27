import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import PrimaryBtn from "../../../../common/Button/PrimaryBtn";
import { useTranslation } from "react-i18next";
import withLoading from "../../../../../hoc/withLoading";
import EditIcon from "@mui/icons-material/Edit";
import GhostBtn from "../../../../common/Button/GhostBtn";
import PrimaryLoadingButton from "../../../../common/Button/PrimaryLoadingButton";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import FIGroupGridSkeleton from "../../../Skeleton/Configuration/FIStructure/FIGroupGridSkeleton";
import NoRecordIndicator from "../../../../common/NoRecordIndicator/NoRecordIndicator";
import useConfig from "../../../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../../../api/permissions";
import { styled } from "@mui/material/styles";
import { FiStructureDataType } from "../../../../../types/fi.type";
import { CSSObject } from "@mui/system";

const StyledToolbar = styled(Box)(({ theme }: any) => ({
  padding: theme.toolbar.padding,
}));

const StyledListItemText = styled(ListItemText)(({ theme }: any) => ({
  "& .MuiListItemText-primary": {
    ...theme.cellText,
    marginLeft: "10px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
}));

const StyledCheckBoxRoot = styled(Checkbox)({
  padding: 0,
  display: "block !important",
  "& .MuiSvgIcon-root": {
    display: "block !important",
  },
  "& .MuiDivider-root": {
    display: "block !important",
  },
});

const commonTypographyStyles: CSSObject = {
  textTransform: "none",
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: 12,
};

const StyledTypography = styled(Typography)({
  ...commonTypographyStyles,
});

const StyledEditIcon = styled(EditIcon)(({ theme }: any) => ({
  ...theme.smallIcon,
}));

const StyledCancelTypography = styled(Typography)(({ theme }: any) => ({
  color: theme.palette.textColor,
  ...commonTypographyStyles,
}));

interface FIStructureRightSideProps {
  data: FiStructureDataType[];
  selectedCriterion?: FiStructureDataType | null;
  setCheckedItems: () => void;
  checkedItemsData: FiStructureDataType[];
  setCheckedItemsData: React.Dispatch<
    React.SetStateAction<FiStructureDataType[]>
  >;
  setIsCancelModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  groupLoading: boolean;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const FIStructureRightSide: React.FC<FIStructureRightSideProps> = ({
  data,
  selectedCriterion,
  setCheckedItems,
  checkedItemsData,
  setCheckedItemsData,
  setIsCancelModalOpen,
  groupLoading,
  editMode,
  setEditMode,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();

  const [loading] = useState(false);

  const checkboxFunc = (item: FiStructureDataType) => {
    const filtered = checkedItemsData.filter(
      (row) => row.parentId !== item.parentId
    );
    if (selectedCriterion?.isDefault) {
      setCheckedItemsData([...filtered, item]);
    } else {
      if (checked(item)) {
        const tmp = checkedItemsData.filter((r) => r.id !== item.id);
        setCheckedItemsData(tmp);
      } else {
        setCheckedItemsData([...filtered, item]);
      }
    }
  };

  const checked = (item: FiStructureDataType): boolean => {
    return checkedItemsData.some((checked) => checked.id === item.id);
  };

  const ToolBar = () => {
    return (
      <Box display={"flex"} flexDirection={"column"} data-testid={"toolbar"}>
        <StyledToolbar
          display={"flex"}
          justifyContent={"flex-end"}
          alignItems={"center"}
        >
          {!editMode ? (
            <PrimaryBtn
              onClick={() => {
                setEditMode(true);
              }}
              disabled={!selectedCriterion}
              endIcon={<StyledEditIcon />}
              data-testid={"edit-button"}
            >
              <StyledTypography>{t("edit")}</StyledTypography>
            </PrimaryBtn>
          ) : (
            <>
              <GhostBtn
                onClick={() => {
                  setIsCancelModalOpen(true);
                }}
                width={84}
                data-testid={"cancel-button"}
              >
                <StyledCancelTypography>{t("cancel")}</StyledCancelTypography>
              </GhostBtn>
              &nbsp;&nbsp;
              <PrimaryLoadingButton
                onClick={() => {
                  setCheckedItems();
                  setEditMode(false);
                }}
                text={t("save")}
                icon={<DoneRoundedIcon />}
              />
            </>
          )}
        </StyledToolbar>
        <Divider />
      </Box>
    );
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      width={"100%"}
      height={"100%"}
      data-testid={"fi-structure-grid"}
    >
      {hasPermission(PERMISSIONS.FI_AMEND) && <ToolBar />}
      {groupLoading ? (
        <FIGroupGridSkeleton />
      ) : (
        <Box style={{ overflow: "auto", width: "100%", height: "100%" }}>
          <List
            component="nav"
            disablePadding
            sx={{
              width: "100%",
              height: "100%",
              overflow: "auto",
              boxSizing: "border-box",
            }}
          >
            {!loading && data.length === 0 && <NoRecordIndicator />}
            {data.map((item, i) => {
              return (
                <React.Fragment key={item.id}>
                  <ListItem
                    button
                    sx={{
                      height: "48px",
                    }}
                    data-testid={"item-" + i}
                  >
                    <StyledCheckBoxRoot
                      disabled={!editMode}
                      checked={checked(item)}
                      onClick={() => {
                        if (editMode) {
                          checkboxFunc(item);
                        }
                      }}
                      size={"small"}
                      data-testid={"checkbox"}
                    />
                    &nbsp;&nbsp;
                    <StyledListItemText
                      primary={item.code + " / " + item.name}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              );
            })}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default withLoading(FIStructureRightSide);
