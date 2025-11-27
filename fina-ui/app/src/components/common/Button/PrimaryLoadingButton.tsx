import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";
import { styled } from "@mui/system";

const StyledLoadingButton = styled(LoadingButton)<{ fontSize?: string }>(
  ({ theme, fontSize }) => ({
    ...(theme as any).primaryBtn,
    borderRadius: (theme as any).btn.borderRadius,
    padding: "8px 24px",
    lineHeight: (theme as any).btn.lineHeight,
    fontSize: fontSize ? `${fontSize}px` : "12px",
    "& .MuiSvgIcon-root": {
      width: (theme as any).icon.iconWidth,
      height: (theme as any).icon.iconHeight,
    },
  })
);

interface PrimaryLoadingButtonProps {
  text?: string;
  hidden?: boolean;
  fontSize?: string;
  loading?: boolean;
  icon?: any;
  width?: number;
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: object;
  sx?: object;
}

const PrimaryLoadingButton: React.FC<PrimaryLoadingButtonProps> = ({
  text,
  hidden,
  fontSize,
  loading = false,
  icon,
  disabled = false,
  onClick,
  children,
  ...props
}) => {
  return hidden ? null : (
    <StyledLoadingButton
      fontSize={fontSize}
      color={"primary"}
      loading={loading}
      loadingPosition="end"
      endIcon={icon}
      disabled={disabled}
      onClick={onClick}
      data-testid={"loadingBtn"}
      {...props}
    >
      <span
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {text ? text : children}
      </span>
    </StyledLoadingButton>
  );
};

export default PrimaryLoadingButton;
