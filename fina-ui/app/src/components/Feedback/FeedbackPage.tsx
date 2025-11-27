import { Box } from "@mui/system";
import FeedbackHeader from "./FeedbackHeader";
import React, { useState } from "react";
import FeedbackContainer from "../../containers/FeedbackContainer/FeedbackContainer";
import FeedbackCategoryContainer from "../../containers/FeedbackContainer/FeedbackCategoryContainer";
import { FeedbackCategoryType } from "../../types/feedback.type";

const FeedbackPage = () => {
  const [activeTab, setActiveTab] = useState("feedback");
  const [isAddNewOpen, setIsAddNewOpen] = useState<{
    isOpen: boolean;
    card: FeedbackCategoryType;
  }>({
    isOpen: false,
    card: { id: 0, name: "", nameStrId: 0 },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <FeedbackHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsAddNewOpen={setIsAddNewOpen}
      />
      {activeTab === "feedback" ? (
        <FeedbackContainer />
      ) : (
        <FeedbackCategoryContainer
          setIsAddNewOpen={setIsAddNewOpen}
          isAddNewOpen={isAddNewOpen}
        />
      )}
    </Box>
  );
};

export default FeedbackPage;
