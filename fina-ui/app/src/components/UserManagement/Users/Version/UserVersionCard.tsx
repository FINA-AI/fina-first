import { Box, styled } from "@mui/system";
import { Checkbox, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GroupVersion } from "../../../../types/group.type";

interface UserVersionCardProps {
  versionItem: GroupVersion;
  editMode: boolean;
  checkBoxOnChange(
    type: string,
    checked: boolean,
    versionItem: GroupVersion
  ): void;
}

const StyledGridItem = styled(Grid)(() => ({
  padding: 4,
  display: "flex",
  width: "100%",
}));

const StyledContent = styled("div")(({ theme }) => ({
  border: `1px solid ${theme.palette.mode === "dark" ? "#4d5c72" : "#EAEBF0"}`,
  borderRadius: "4px",
  backgroundColor: theme.palette.mode === "dark" ? "#2b3748" : "#FFFFFF",
  height: "122px",
  width: "100%",
}));

const StyledHeaderHeader = styled("div")<{ _inactive: boolean }>(
  ({ theme, _inactive }) => ({
    borderRadius: "1px",
    border: `0.5px solid ${_inactive ? "#8695B1" : theme.palette.primary.main}`,
    padding: "4px 8px",
    color: _inactive ? "#8695B1 !important" : theme.palette.primary.main,
    fontWeight: 500,
    fontSize: "12px",
    lineHeight: "16px",
    textTransform: "capitalize",
    marginRight: "4px",
    maxWidth: "120px",
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "& .MuiCheckbox-root": {
      padding: "0px",
      marginRight: "3px",
      cursor: "pointer",
    },
  })
);

const StyledVersionTypography = styled(Typography)(({ theme }) => ({
  marginTop: 12,
  fontWeight: 500,
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#434B59",
  fontSize: 13,
  lineHeight: "20px",
}));

const StyledDescriptionTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "16px",
  color: theme.palette.mode === "dark" ? "#FFFFFF" : "#596D89",
  overflow: "hidden",
  textOverflow: "ellipsis",
  marginTop: "8px",
}));

const UserVersionCard: React.FC<UserVersionCardProps> = ({
  versionItem,
  checkBoxOnChange,
  editMode,
}) => {
  const { t } = useTranslation();
  const [isReviewChecked, setIsReviewChecked] = useState(false);
  const [isAmendChecked, setIsAmendChecked] = useState(false);

  useEffect(() => {
    setIsReviewChecked(versionItem.canUserReview);
    setIsAmendChecked(versionItem.canUserAmend);
  }, [versionItem]);

  return (
    <StyledGridItem item xs={3} flex={1}>
      <StyledContent>
        <div style={{ padding: "12px", color: "#8695B1" }}>
          {!editMode && !isReviewChecked ? (
            <Box display={"flex"} alignItems={"center"}>
              <StyledHeaderHeader _inactive={true}>
                {t("Non Permitted")}
              </StyledHeaderHeader>
            </Box>
          ) : (
            <Box display={"flex"} alignItems={"center"}>
              <StyledHeaderHeader _inactive={editMode || !isReviewChecked}>
                {editMode && (
                  <Checkbox
                    checked={isReviewChecked}
                    onChange={(event, value) => {
                      checkBoxOnChange("review", value, versionItem);
                      setIsReviewChecked(event.target.checked);
                    }}
                    disabled={versionItem["userRoleReturnVersion"]}
                    size="small"
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 18,
                      },
                    }}
                  />
                )}
                {t("review")}
              </StyledHeaderHeader>
              <StyledHeaderHeader _inactive={editMode || !isAmendChecked}>
                {editMode && (
                  <Checkbox
                    checked={isAmendChecked}
                    onChange={(event, value) => {
                      checkBoxOnChange("amend", value, versionItem);
                    }}
                    disabled={versionItem.hasAmendFromRole}
                    size="small"
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 18,
                      },
                    }}
                  />
                )}
                {t("amend")}
              </StyledHeaderHeader>
            </Box>
          )}
          <StyledVersionTypography>{versionItem.code}</StyledVersionTypography>
          <StyledDescriptionTypography>
            {versionItem.name}
          </StyledDescriptionTypography>
        </div>
      </StyledContent>
    </StyledGridItem>
  );
};

export default UserVersionCard;
