import Popover from "@mui/material/Popover";
import { Box } from "@mui/system";
import React, {
  CSSProperties,
  memo,
  ReactElement,
  useEffect,
  useState,
} from "react";
import GhostBtn from "../Button/GhostBtn";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { SvgIconProps } from "@mui/material/SvgIcon";
import { styled } from "@mui/material/styles";

export const PrintFieldOptions = [
  { type: "HTML", key: "html" },
  { type: "ODS", key: "ods" },
  { type: "PDF", key: "pdf" },
  { type: "XLS", key: "xls" },
  { type: "XLSX", key: "xlsx" },
  { type: "CSV", key: "csv" },
];

interface displayOptionsType {
  type: string;
  value?: string;
  key?: string;
}

interface FilePrintFieldProps {
  label?: string;
  icon?: ReactElement<SvgIconProps>;
  handleClick: (val: string, item: displayOptionsType) => void;
  displayOptions?: displayOptionsType[];
  isDisabled?: () => boolean;
  buttonProps?: any;
  style?: CSSProperties;
}

const StyledPopover = styled(Popover)(() => ({
  top: 4,
  "& .MuiPopover-paper": {
    width: "110px",
    padding: "4px",
  },
}));

const StyledStatusItem = styled(Box)(({ theme }: any) => ({
  cursor: "pointer",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "16px",
  textTransform: "capitalize",
  padding: "4px",
  "&:hover": {
    background:
      theme.palette.mode === "light" ? "rgba(255, 255, 255, 0.1)" : "#344258",
  },
}));

const FilePrintField: React.FC<FilePrintFieldProps> = ({
  label,
  icon,
  handleClick,
  displayOptions,
  isDisabled = () => {
    return false;
  },
  buttonProps = {},
}) => {
  const [data, setData] = useState<displayOptionsType[]>(PrintFieldOptions);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (displayOptions && displayOptions?.length > 0) {
      setData(displayOptions);
    }
  }, [displayOptions]);

  const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <GhostBtn
        onClick={onClick}
        disabled={isDisabled()}
        {...buttonProps}
        startIcon={icon && icon}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </GhostBtn>
      <StyledPopover
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        data-testid={"file-print-field-popover"}
      >
        {data.map((item, index) => {
          return (
            <StyledStatusItem
              key={index}
              onClick={() => {
                setAnchorEl(null);
                if (item.type) {
                  handleClick(item.type, item);
                }
              }}
              data-testid={item?.key}
            >
              {item.type}
            </StyledStatusItem>
          );
        })}
      </StyledPopover>
    </>
  );
};

export default memo(FilePrintField);
