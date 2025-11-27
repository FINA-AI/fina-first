import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { KeyboardArrowDownRounded } from "@mui/icons-material";
import React, { memo } from "react";
import MDTTreeNodeIcon from "./MDTTreeNodeIcon";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/system";
import { MdtNode } from "../../../types/mdt.type";
import ListBoxComponent from "../../common/Field/ListBoxVirtualComponent";

interface MDTSearchFieldProps {
  data: MdtNode[];
  label?: string;
  selectedItem?: string;
  onChange: (value: MdtNode, e: any) => void;
  onInputChange: (inputValue: string) => void;
  virtualized: boolean;
  loading: boolean;
  displayFieldFunction: (item: MdtNode) => string;
}

const StyledAutocomplete = styled(Autocomplete, {
  shouldForwardProp: (prop: string) => !prop.startsWith("_"),
})(({ theme }: { theme: any }) => ({
  width: "100%",
  "& .MuiAutocomplete-root": {
    // Custom root styles
    "& .MuiSvgIcon-root": {
      ...theme.smallIcon,
    },
    width: "100%",
    height: "36px",
    "& .MuiInputAdornment-positionStart": {
      "& svg": {
        top: "0px",
      },
    },
  },
  "& .MuiAutocomplete-popupIndicator": {
    borderRadius: "1px",
    marginRight: "0px",
    background: "inherit",
    border: "inherit",
    "&:hover": {
      color: "#596D89 !important",
      backgroundColor: "transparent",
    },
  },
  "& .MuiAutocomplete-popper": {
    position: "fixed",
    "& .MuiAutocomplete-listbox": {
      "& :hover": {
        '& .MuiAutocomplete-option[aria-selected="true"]': {
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0F4FF !important"
              : theme.palette.lightBackgroundColor,
        },
      },
    },
  },
}));

export const MDTSearchField: React.FC<MDTSearchFieldProps> = ({
  data,
  label,
  selectedItem,
  onChange,
  virtualized,
  loading = false,
  onInputChange,
  displayFieldFunction,
}) => {
  const ref = React.createRef<any>();

  return (
    <StyledAutocomplete
      onInputChange={(e: any) => {
        if (onInputChange && e) {
          onInputChange(e.target.value);
        }
      }}
      ref={ref}
      ListboxProps={{
        style: {
          maxHeight: 300,
          overflow: "auto",
          // refWidth: ref ? ref.clientWidth : null,
        },
      }}
      {...(virtualized && { ListboxComponent: ListBoxComponent as any })}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={label}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            autoComplete: "new-password",
            startAdornment: (
              <SearchIcon
                style={{
                  paddingLeft: 10,
                }}
              />
            ),
            endAdornment: (
              <>
                {loading ? (
                  <div
                    style={{
                      right: "15px",
                      display: "flex",
                      alignItems: "center",
                      position: "absolute",
                    }}
                  >
                    <CircularProgress color="inherit" size={"14px"} />
                  </div>
                ) : (
                  params.InputProps.endAdornment
                )}
              </>
            ),
          }}
        />
      )}
      onChange={(e: any, v) => {
        if (e && e.key === "Enter") return;
        onChange(v as MdtNode, e);
      }}
      getOptionLabel={(option: any) => {
        if (!option.id) return option;
        return displayFieldFunction(option) || "";
      }}
      options={data}
      popupIcon={<KeyboardArrowDownRounded />}
      // inputValue={selectedItem}
      value={selectedItem}
      disableClearable
      forcePopupIcon
      freeSolo
      size="small"
      renderOption={(props, option: any) => (
        <Box
          component="li"
          {...props}
          display={"flex"}
          justifyContent={"space-between"}
          width={"100%"}
        >
          <div>
            <MDTTreeNodeIcon nodeType={option.type} />
          </div>
          <div
            style={{
              paddingLeft: 10,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {option.code} {option.name}
          </div>
        </Box>
      )}
    />
  );
};

export default memo(MDTSearchField);
