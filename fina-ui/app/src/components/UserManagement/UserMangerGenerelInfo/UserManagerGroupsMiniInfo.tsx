import { Box, Grid, IconButton, Tooltip } from "@mui/material";
import React, { memo, ReactElement, useState } from "react";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import PrimaryBtn from "../../common/Button/SubmitBtn";
import { useTranslation } from "react-i18next";
import TextButton from "../../common/Button/TextButton";
import Divider from "@mui/material/Divider";
import MiniInfoItem from "./MiniInfoItem";
import MiniInfoEditFields from "./MiniInfoEditFields";
import DeleteForm from "../../common/Delete/DeleteForm";
import useConfig from "../../../hoc/config/useConfig";
import { PERMISSIONS } from "../../../api/permissions";
import { styled } from "@mui/system";
import { Group } from "../../../types/group.type";
import { LegalFormIcon } from "../../../api/ui/icons/LegalFormIcon";

interface UserManagerGroupsMiniInfoProps {
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
  title?: string;
  value?: string;
  icon?: ReactElement;
  currItem?: Partial<Group>;
  updateGroup: VoidFunction;
  onCancelFunction: VoidFunction;
  addGroup: VoidFunction;
  setDescription: (value: string) => void;
  setGroupsData: (data: Group[]) => void;
  groupsData: Group[];
  deleteGroupHandler: () => void;
  onChangeGroupData(object: Partial<Group>): void;
}

const StyledBoxItem = styled(Box)(() => ({
  paddingBottom: "20px",
  paddingTop: "20px",
  "& .MuiAccordionSummary-expandIconWrapper": {
    display: "none !important",
  },
}));

const StyledGridItem = styled(Grid)(() => ({
  width: "100%",
  flexDirection: "row",
}));

const StyledInfoContainer = styled(Grid)(() => ({
  borderRadius: "8px",
  paddingBottom: "5px",
  width: "100%",
}));

const StyledTitle = styled(Grid)(({ theme }) => ({
  paddingLeft: 10,
  height: "40px",
  backgroundColor: theme.palette.mode === "dark" ? "#596D89" : "#F0F4FF",
  borderRadius: "4px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  width: "100%",
}));

const StyledDeleteBtn = styled(IconButton)(() => ({
  color: "#FF4128",
  borderRadius: "8px",
  width: 40,
  height: 40,
}));

const UserManagerGroupsMiniInfo: React.FC<UserManagerGroupsMiniInfoProps> = ({
  setEditMode,
  editMode,
  currItem,
  updateGroup,
  onCancelFunction,
  onChangeGroupData,
  addGroup,
  setDescription,
  setGroupsData,
  groupsData,
  deleteGroupHandler,
}) => {
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { hasPermission } = useConfig();
  const editButtonHandler = () => {
    setEditMode(true);
  };

  const BoxItem = ({
    item,
    flex = 1,
  }: {
    item: ReactElement;
    flex?: number;
  }) => {
    return (
      <StyledBoxItem
        display={"flex"}
        flex={flex}
        width={"20%"}
        p={2}
        overflow={"hidden"}
      >
        <Grid container direction={"column"} spacing={2}>
          <StyledGridItem item>{item}</StyledGridItem>
        </Grid>
      </StyledBoxItem>
    );
  };

  return (
    <Grid container direction={"column"}>
      <StyledInfoContainer item>
        <Box
          flex={1}
          display={"flex"}
          width={"100%"}
          height={"72px"}
          overflow={"hidden"}
        >
          {!editMode ? (
            <BoxItem
              flex={2}
              item={
                <StyledTitle
                  display={"flex"}
                  alignItems={"center"}
                  overflow={"hidden"}
                >
                  <Typography noWrap>{currItem?.code}</Typography>
                </StyledTitle>
              }
            />
          ) : (
            <MiniInfoEditFields
              onChange={(value: string) => {
                onChangeGroupData({ code: value });
              }}
              label={t("code")}
              value={currItem?.code}
              isIcon={false}
              isRequired={true}
            />
          )}
          {!editMode ? (
            <BoxItem
              flex={2}
              item={
                <MiniInfoItem
                  title={t("description")}
                  value={currItem?.description}
                  icon={<LegalFormIcon />}
                  editMode={editMode}
                />
              }
            />
          ) : (
            <MiniInfoEditFields
              value={currItem?.description}
              onChange={(value: string) => {
                let newData = groupsData.map((el) => {
                  if (currItem?.id === el.id) {
                    return { ...el, description: value };
                  }
                  return el;
                });
                setGroupsData(newData);
                setDescription(value);
                onChangeGroupData({ description: value });
              }}
              label={t("description")}
            />
          )}

          {!editMode ? (
            <BoxItem
              item={
                <>
                  <Box
                    display={"flex"}
                    flex={1}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                  >
                    {hasPermission(PERMISSIONS.USER_AMEND) && (
                      <PrimaryBtn
                        variant="contained"
                        color="primary"
                        endIcon={<EditIcon />}
                        onClick={editButtonHandler}
                        style={{
                          margin: "5px",
                        }}
                      >
                        {t("edit")}
                      </PrimaryBtn>
                    )}

                    {hasPermission(PERMISSIONS.USER_DELETE) && (
                      <Tooltip title={"Delete"} arrow>
                        <StyledDeleteBtn
                          onClick={() => setShowDeleteModal(true)}
                          size="large"
                        >
                          <DeleteIcon />
                        </StyledDeleteBtn>
                      </Tooltip>
                    )}
                  </Box>
                </>
              }
            />
          ) : (
            <BoxItem
              item={
                <>
                  <Box
                    display={"flex"}
                    flex={1}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                  >
                    <TextButton color={"secondary"} onClick={onCancelFunction}>
                      {t("cancel")}
                    </TextButton>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <TextButton
                      onClick={() => {
                        if (currItem && currItem.id && currItem.id != 0) {
                          updateGroup();
                        } else {
                          addGroup();
                        }
                      }}
                      endIcon={
                        <CheckIcon sx={{ width: "12px", height: "12px" }} />
                      }
                    >
                      {t("save")}
                    </TextButton>
                  </Box>
                </>
              }
            />
          )}
        </Box>
      </StyledInfoContainer>
      {showDeleteModal && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("group")}
          onDelete={() => {
            deleteGroupHandler();
            setShowDeleteModal(false);
          }}
          setIsDeleteModalOpen={setShowDeleteModal}
          isDeleteModalOpen={showDeleteModal}
        />
      )}
    </Grid>
  );
};

export default memo(UserManagerGroupsMiniInfo);
