import { Box, Grid, IconButton, Tooltip } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import React, { ReactElement, useState } from "react";
import Typography from "@mui/material/Typography";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import PrimaryBtn from "../../common/Button/SubmitBtn";
import { useTranslation } from "react-i18next";
import TextButton from "../../common/Button/TextButton";
import Divider from "@mui/material/Divider";
import MiniInfoItem from "./MiniInfoItem";
import DeleteForm from "../../common/Delete/DeleteForm";
import { PERMISSIONS } from "../../../api/permissions";
import useConfig from "../../../hoc/config/useConfig";
import { styled } from "@mui/material/styles";
import { UserTypeWithUIProps } from "../../../types/user.type";
import { LegalFormIcon } from "../../../api/ui/icons/LegalFormIcon";

interface UserManagerMiniInfoProps {
  onCancelFunction: VoidFunction;
  onEditFunction: (editMode: boolean) => void;
  editMode: boolean;
  title?: string;
  value?: string;
  icon?: ReactElement;
  currItem: Partial<UserTypeWithUIProps>;
  disabledSaveBtn: boolean;
  formValidationHelper: any;
  deleteUserFunction(userId?: number): Promise<void>;
  onSaveFunction(formValidationHelper: any): void;
}

const StyledUserManagerTitle = styled(Box)(({ theme }) => ({
  paddingLeft: 10,
  height: "40px",
  backgroundColor: theme.palette.mode === "dark" ? "#344258" : "#F0F4FF",
  borderRadius: "4px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  width: "100%",
}));

const StyledActionButton = styled(IconButton)({
  color: "#FF4128",
  borderRadius: "8px",
  width: 40,
  height: 40,
  border: "none",
});

const StyledBoxItem = styled(Box)(() => ({
  overflow: "hidden",
  paddingBottom: "20px",
  paddingTop: "20px",
  "& .MuiAccordionSummary-expandIconWrapper": {
    display: "none !important",
  },
}));

const UserManagerMiniInfo: React.FC<UserManagerMiniInfoProps> = ({
  editMode,
  currItem,
  onEditFunction,
  onCancelFunction,
  onSaveFunction,
  disabledSaveBtn,
  deleteUserFunction,
  formValidationHelper,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = useConfig();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const getItem = (item: ReactElement) => {
    return (
      <StyledBoxItem display={"flex"} flex={0.2} p={2}>
        <Box width={"100%"}>{item}</Box>
      </StyledBoxItem>
    );
  };

  return (
    <Grid container direction={"column"} data-testid={"mini-info"}>
      <Grid
        item
        sx={{ borderRadius: "8px", paddingBottom: "5px", width: "100%" }}
      >
        <Box
          flex={1}
          display={"flex"}
          width={"100%"}
          height={"72px"}
          flexDirection={"row"}
        >
          {getItem(
            <StyledUserManagerTitle display={"flex"} alignItems={"center"}>
              <Typography noWrap data-testid={"login"}>
                {currItem?.login}
              </Typography>
            </StyledUserManagerTitle>
          )}
          {getItem(
            <MiniInfoItem
              title={t("fullname")}
              value={currItem?.description}
              icon={<LegalFormIcon />}
              editMode={editMode}
              dataKey={"full-name"}
            />
          )}
          {getItem(
            <MiniInfoItem
              title={"Title"}
              value={currItem?.titleDescription}
              icon={<ContentPasteIcon />}
              editMode={editMode}
              dataKey={"title"}
            />
          )}
          {getItem(
            <MiniInfoItem
              title={"Contact Person"}
              value={currItem?.contactPerson}
              icon={<PersonOutlineIcon />}
              editMode={editMode}
              dataKey={"contact-person"}
            />
          )}
          {!editMode
            ? getItem(
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
                        onClick={() => onEditFunction(true)}
                        style={{ margin: "5px", fontWeight: 500 }}
                        data-testid={"edit-button"}
                      >
                        {t("edit")}
                      </PrimaryBtn>
                    )}
                    {hasPermission(PERMISSIONS.USER_DELETE) && (
                      <Tooltip title={"Delete"} arrow>
                        <StyledActionButton
                          onClick={() => setIsDeleteConfirmOpen(true)}
                          size="large"
                          data-testid={"delete-button"}
                        >
                          <DeleteIcon />
                        </StyledActionButton>
                      </Tooltip>
                    )}
                  </Box>
                </>
              )
            : getItem(
                <>
                  <Box
                    display={"flex"}
                    flex={1}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                  >
                    <TextButton
                      onClick={onCancelFunction}
                      data-testid={"cancel-button"}
                    >
                      {t("cancel")}
                    </TextButton>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <TextButton
                      onClick={() => onSaveFunction(formValidationHelper)}
                      disabled={disabledSaveBtn}
                      endIcon={
                        <CheckIcon sx={{ width: "12px", height: "12px" }} />
                      }
                      data-testid={"save-button"}
                    >
                      {t("save")}
                    </TextButton>
                  </Box>
                </>
              )}
        </Box>
      </Grid>
      {isDeleteConfirmOpen && (
        <DeleteForm
          headerText={t("delete")}
          bodyText={t("deleteWarning")}
          additionalBodyText={t("user")}
          isDeleteModalOpen={isDeleteConfirmOpen}
          setIsDeleteModalOpen={setIsDeleteConfirmOpen}
          onDelete={() => {
            deleteUserFunction(currItem?.id);
            setIsDeleteConfirmOpen(false);
          }}
          showConfirm={false}
        />
      )}
    </Grid>
  );
};

export default React.memo(UserManagerMiniInfo);
