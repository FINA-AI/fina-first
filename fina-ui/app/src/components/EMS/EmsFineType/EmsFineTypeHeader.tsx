import { Tab, Tabs, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { FiType } from "../../../types/fi.type";
import { styled } from "@mui/material/styles";

interface EmsFineTypeHeaderProps {
  fiTypes: FiType[];
  activeTab: string | null;
  setActiveTab: (value: string) => void;
}

const StyledHeader = styled(Box)(({ theme }: any) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 12px",
  backgroundColor: theme.palette.paperBackground,
}));

const StyledTab = styled(Tab)({
  padding: 4,
  minWidth: 0,
  minHeight: 0,
  bottom: "auto",
  fontWeight: 600,
  fontSize: 14,
  lineHeight: "21px",
  marginRight: 24,
  textTransform: "capitalize",
  background: "inherit",
});

const EmsFineTypeHeader: React.FC<EmsFineTypeHeaderProps> = ({
  fiTypes,
  activeTab,
  setActiveTab,
}) => {
  useEffect(() => {
    if (fiTypes.length > 0) {
      setActiveTab(fiTypes[0].code);
    }
  }, [fiTypes]);

  return (
    <StyledHeader data-testid={"header"}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {fiTypes && fiTypes.length !== 0 && activeTab && (
          <Tabs
            value={activeTab}
            sx={{ minHeight: 0 }}
            data-testid={"tabs-container"}
          >
            {fiTypes.map((type: FiType, index: number) => (
              <StyledTab
                key={index}
                label={
                  <Tooltip title={type.name}>
                    <span>{type.code}</span>
                  </Tooltip>
                }
                value={type.code}
                onClick={() => setActiveTab(type.code)}
                data-testid={"item-" + index}
              />
            ))}
          </Tabs>
        )}
      </Box>
    </StyledHeader>
  );
};

export default EmsFineTypeHeader;
