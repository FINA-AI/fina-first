import * as React from "react";
import { useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import { UserFiData, UserFiType } from "../../../../types/user.type";

interface UserFiTabPanelProps {
  fiTypes: UserFiData[];
  mainData: number[];
  selectedFIType?: UserFiType;
  changeFIRootCode(item: UserFiType): void;
}

const StyledTabs = styled(Box)(({ theme }) => ({
  minWidth: 200,
  "& .MuiButtonBase-root": {
    background: "inherit",
  },
  "& .Mui-selected": {
    color: theme.palette.primary.main,
  },
  "& .MuiTabs-scrollButtons": {
    color: theme.palette.primary.main,
    marginTop: "10px",
    width: "25px",
    height: "25px",
    "&:hover": {
      borderRadius: "50%",
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const UserFiTabPanel: React.FC<UserFiTabPanelProps> = ({
  fiTypes,
  mainData,
  changeFIRootCode,
  selectedFIType,
}) => {
  const [activeTab, setActiveTab] = React.useState(0);

  useEffect(() => {
    const index = fiTypes.findIndex(
      (fiType) => fiType.parent.code === selectedFIType?.code
    );
    if (index === -1) return;
    setActiveTab(index);
  }, [selectedFIType]);

  const handleChange = (event: any, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <StyledTabs>
      <Tabs value={activeTab} onChange={handleChange} variant="scrollable">
        {fiTypes.map((fiType, i) => {
          let item = fiType.parent;
          let ids = fiType.fis.map((f) => f.id);
          let code = `${item.code}`;
          let count = ` (${mainData.filter((f) => ids.includes(f)).length})`;
          return (
            <Tab
              key={item.code}
              onClick={() => changeFIRootCode(item)}
              data-targetid={item.code}
              sx={{ minWidth: 50 }}
              label={
                <span style={{ fontSize: "14px" }}>
                  {code}
                  {count}
                </span>
              }
              data-testid={"tab-" + i}
            />
          );
        })}
      </Tabs>
    </StyledTabs>
  );
};

export default UserFiTabPanel;
