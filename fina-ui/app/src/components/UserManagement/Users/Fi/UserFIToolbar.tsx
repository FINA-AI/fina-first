import { Box, Checkbox, Grid, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import UserFiTabPanel from "./UserFiTabPanel";
import UserFiTabsSkeleton from "./UserFiTabsSkeleton";
import { styled } from "@mui/system";
import CustomAutoComplete from "../../../common/Field/CustomAutoComplete";
import { UserFi, UserFiData, UserFiType } from "../../../../types/user.type";

interface UserFIToolbarProps {
  fiTypes: UserFiData[];
  selectedFIType?: UserFiType;
  mainData: number[];
  editMode: boolean;
  onFilterClear: VoidFunction;
  handleOnClear: VoidFunction;
  handleOnChange(item: UserFi): void;
  onFilterClick(searchValue: string): void;
  onCheck(row: any, checked: boolean, isMulti?: boolean): void;
  changeFIRootCode(item: UserFiType): void;
}

const StyledMenuBar = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.toolbar.padding,
}));

const StyledCheckbox = styled(Checkbox)(() => ({
  "&.MuiCheckbox-root": {
    margin: 0,
  },
  "&.Mui-checked": {},
  "&.MuiCheckbox-indeterminate": {},
}));

const StyleSelectAllText = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: 12,
  whiteSpace: "nowrap",
}));

const UserFIToolbar: React.FC<UserFIToolbarProps> = ({
  fiTypes,
  selectedFIType,
  changeFIRootCode,
  mainData,
  editMode,
  onCheck,
  onFilterClick,
  handleOnChange,
  handleOnClear,
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState({});

  const fis = useMemo(() => {
    return fiTypes.flatMap((item) => item.fis);
  }, [fiTypes, mainData]);

  const getMemoizedSelectedFiTypeIds = useMemo(() => {
    return fiTypes.length !== 0 && selectedFIType
      ? fiTypes
          ?.find((f) => f.parent.id === selectedFIType.id)
          ?.["fis"].filter((fi) => !fi.roleFi)
          .map((fi) => fi.id)
      : [];
  }, [selectedFIType]);

  const checkedAll = getMemoizedSelectedFiTypeIds?.every((fiId) =>
    mainData.includes(fiId)
  );

  const selectAll = (event: any) => {
    let data = event.target.checked
      ? getMemoizedSelectedFiTypeIds?.filter((fiId) => !mainData.includes(fiId))
      : getMemoizedSelectedFiTypeIds;
    onCheck(data, event.target.checked, true);
  };

  return (
    <Grid sx={{ marginLeft: "-3px" }} data-testid={"toolbar"}>
      <StyledMenuBar>
        {fiTypes && fiTypes.length > 0 ? (
          <UserFiTabPanel
            fiTypes={fiTypes}
            changeFIRootCode={changeFIRootCode}
            mainData={mainData}
            selectedFIType={selectedFIType}
          />
        ) : (
          <UserFiTabsSkeleton />
        )}
        <Box display={"flex"} alignItems={"center"}>
          {fiTypes && (
            <Box style={{ width: "280px", margin: "0px 10px" }}>
              <CustomAutoComplete
                data={fis}
                virtualized={true}
                selectedItem={searchValue}
                valueFieldName={"id"}
                label={t("search")}
                displayFieldFunction={(item) => {
                  return `${item.name} - ${item.code}`;
                }}
                onKeyDown={onFilterClick}
                onChange={(item) => {
                  handleOnChange(item);
                  setSearchValue(item);
                }}
                onClear={() => {
                  setSearchValue({});
                  handleOnClear();
                }}
              />
            </Box>
          )}
          {editMode && (
            <>
              <StyledCheckbox
                size={"small"}
                checked={checkedAll}
                onClick={selectAll}
                indeterminate={
                  checkedAll
                    ? false
                    : getMemoizedSelectedFiTypeIds?.some((fiId) =>
                        mainData.includes(fiId)
                      )
                }
                data-testid={"select-all-checkbox"}
              />
              <StyleSelectAllText>{t("selectAll")}</StyleSelectAllText>
            </>
          )}
        </Box>
      </StyledMenuBar>
    </Grid>
  );
};

export default UserFIToolbar;
