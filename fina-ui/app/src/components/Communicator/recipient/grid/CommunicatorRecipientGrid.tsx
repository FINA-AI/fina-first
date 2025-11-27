import { Box, Grid } from "@mui/material";
import React, { ReactElement, useEffect, useRef } from "react";
import EmptyRecipientPage from "./EmptyRecipientPage";
import { keyframes, styled } from "@mui/material/styles";
import { CommRecipientType } from "../../../../types/communicator.common.type";

interface CommunicatorRecipientGridProps {
  dataLength: number;
  recipients: CommRecipientType[];
  setSelectedRecipient: (rec: CommRecipientType) => void;
  setSelectedItem: (item: CommRecipientType) => void;
  onItemSelect?: (item: CommRecipientType) => void;
  selectedItemId?: number;
  emptyGridMainText: string;
  emptyGridAdditionalText: string;
  EmptyGridIcon: () => ReactElement;
  RecipientCardComponent({
    recipient,
    onRecipientMessageSelect,
    isSelected,
  }: {
    recipient: CommRecipientType;
    onRecipientMessageSelect?: (rec: CommRecipientType) => void;
    isSelected?: boolean;
  }): any;
}

const recipientAnimation = keyframes({
  "0%": {
    opacity: 0,
  },
  "100%": {
    opacity: 1,
  },
});

const StyledMainWrapper = styled(Box)({
  boxSizing: "border-box",
  padding: "4px 8px",
  height: "100%",
  display: "flex",
  overflow: "auto !important",
});

const StyledRecipientContainer = styled(Grid)({
  opacity: 1,
  transition: "400",
  animation: `${recipientAnimation} 1s ease-in-out`,
});

const CommunicatorRecipientGrid: React.FC<CommunicatorRecipientGridProps> = ({
  dataLength,
  recipients,
  setSelectedItem,
  setSelectedRecipient,
  selectedItemId,
  onItemSelect,
  emptyGridMainText,
  emptyGridAdditionalText,
  EmptyGridIcon,
  RecipientCardComponent,
}) => {
  const scrollContainerRef = useRef<null | HTMLElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [recipients]);

  return (
    <StyledMainWrapper ref={scrollContainerRef}>
      {dataLength > 0 ? (
        <StyledRecipientContainer container>
          <Grid item xs={12} data-testid={"recipients-grid"}>
            {recipients.map((item, index) => (
              <Box
                onClick={() => {
                  setSelectedRecipient && item && setSelectedRecipient(item);
                  setSelectedItem(item);
                }}
                key={"item" + index}
                data-testid={`card-${index}-wrapper`}
              >
                <RecipientCardComponent
                  isSelected={
                    selectedItemId ? item?.id === selectedItemId : false
                  }
                  recipient={item}
                  onRecipientMessageSelect={onItemSelect}
                />
              </Box>
            ))}
          </Grid>
        </StyledRecipientContainer>
      ) : (
        <EmptyRecipientPage
          icon={<EmptyGridIcon />}
          mainText={emptyGridMainText}
          additionalText={emptyGridAdditionalText}
        />
      )}
    </StyledMainWrapper>
  );
};

export default CommunicatorRecipientGrid;
