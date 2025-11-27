import { Box, styled } from "@mui/system";
import UserAndGroupVirtualized from "./UserAndGroupVirtualized";
import React, { useEffect, useRef, useState } from "react";
import { Select as MuiSelect } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { loadUsersAndGroups } from "../../api/services/userManagerService";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { UserAndGroup, UserType } from "../../types/user.type";
import { RecipientType } from "../../types/messages.type";

interface UserAndGroupVirtualizedSelectProps {
  selectedUsers?: any;
  setSelectedUsers: any;
  label?: string;
  size?: string;
  width?: number;
  singleSelect?: boolean;
  disabled?: boolean;
  data?: any;
  loading?: boolean;
  filterMode?: boolean;
  onlyExternals?: boolean;
}

const StyledRootBox = styled(Box)(() => ({
  "& .MuiOutlinedInput-root fieldset legend span": {
    fontSize: 9,
  },
}));

const StyledFormControl = styled(FormControl)<{ _size?: string }>(
  ({ theme, _size }) => ({
    ...(theme as any).customizeInput({ _size }).textField,
    "& .MuiSvgIcon-root": {
      ...(theme as any).smallIcon,
      color: "#98A7BC",
      padding: "4px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10px 0 10px 14px!important",
    },
    "& .MuiOutlinedInput-root": {
      height: _size === "small" ? "32px" : "36px",
      "& .MuiSelect-select": {
        display: "flex",
        alignItems: "center",

        fontWeight: 500,
        lineHeight: "16px",
        fontSize: _size === "default" ? "12px" : "11px",
        textTransform: "capitalize",
        color: "#596D89",
      },
    },
  })
);

const StyledInputLabel = styled(InputLabel)<{
  _size?: string;
  _disabled: boolean;
}>(({ theme, _size, _disabled }) => ({
  ...(theme as any).customizeInput({ _size }).fieldLabel,
  opacity: _disabled ? 0.6 : 1,
}));

const StyledChip = styled("div")(({ theme }) => ({
  color: theme.palette.textColor,
  borderRadius: "3px",
  backgroundColor: theme.palette.lightBackgroundColor,
  padding: "2px 4px",
  border: theme.palette.borderColor,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 2,
}));

const StyledSelect = styled(MuiSelect)<{
  _width?: number;
  _paperMinWith: string;
}>(({ _width, _paperMinWith }) => ({
  "& .MuiSelect-root": {
    // Add custom styles here
  },
  "& .MuiPaper-root": {
    width: _width
      ? _width
      : _paperMinWith
      ? `${_paperMinWith}px !important`
      : "inherit",
    boxSizing: "border-box",
    borderRight: "0px !important",
    borderLeft: "0px !important",
    maxHeight: "300px",
  },
}));

const UserAndGroupVirtualizedSelect: React.FC<
  UserAndGroupVirtualizedSelectProps
> = ({
  selectedUsers,
  setSelectedUsers,
  label,
  size,
  width,
  singleSelect,
  disabled = false,
  data,
  loading,
  filterMode,
  onlyExternals = false,
}) => {
  const boxRef = useRef<any>();
  const [paperWidth, setPaperWidth] = useState("auto");
  const [fieldValue, setFieldValue] = useState("");
  const [users, setUsers] = useState<UserAndGroup[] | null>(null);
  const id = label && label.replace(" ", "_");
  let minPaperWidth = 375;

  useEffect(() => {
    if (boxRef.current) {
      setPaperWidth(
        boxRef.current.clientWidth >= minPaperWidth
          ? `${boxRef.current.clientWidth}`
          : "375"
      );
    }
  }, [boxRef.current?.clientWidth]);

  useEffect(() => {
    setFieldValue(selectedUsers && selectedUsers?.length > 0 ? "users" : "");
  }, [selectedUsers]);

  useEffect(() => {
    loadUsersFunction();
  }, []);

  useEffect(() => {
    if (filterMode) {
      setUsers(data);
    }
  }, [data]);

  const loadUsersFunction = () => {
    if (!filterMode) {
      if (!data) {
        loadUsersAndGroups(onlyExternals).then((res) => {
          const data = res.data;
          setUsers(data);
        });
      } else {
        setUsers(data);
      }
    }
  };

  return (
    <StyledRootBox ref={boxRef} data-testid={"userAndGroupsSelect"}>
      <StyledFormControl variant={"outlined"} _size={size}>
        {label && (
          <StyledInputLabel htmlFor={id} _size={size} _disabled={disabled}>
            {label}
          </StyledInputLabel>
        )}
        <StyledSelect
          _width={width}
          _paperMinWith={paperWidth}
          disabled={disabled}
          value={fieldValue}
          onChange={() => {}}
          label={label}
          multiple={false}
          inputProps={{
            id: id,
          }}
          MenuProps={{
            // classes: { paper: classes.selectMenu },
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
          }}
          IconComponent={KeyboardArrowDownIcon}
        >
          <MenuItem style={{ display: "none" }} value={"users"}>
            <Box display={"flex"} width={"80%"} overflow={"hidden"}>
              {selectedUsers?.map((item: UserType | RecipientType) => {
                return <StyledChip>{item.login}</StyledChip>;
              })}
            </Box>
          </MenuItem>
          <Box key={label}>
            <Box
              width={"100% !important"}
              height={"100%"}
              marginTop={"5px"}
              maxWidth={`${paperWidth}px`}
            >
              <UserAndGroupVirtualized
                setSelectedUsers={setSelectedUsers}
                selectedUsers={selectedUsers}
                data={users}
                singleSelect={singleSelect}
                size={"small"}
                usersLoading={loading}
                onlyExternals={onlyExternals}
              />
            </Box>
          </Box>
        </StyledSelect>
      </StyledFormControl>
    </StyledRootBox>
  );
};

export default UserAndGroupVirtualizedSelect;
