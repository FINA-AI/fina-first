import FeedbackCategoryPage from "../../components/Feedback/FeedbackCategory/FeedbackCategoryPage";
import React, { useEffect, useState } from "react";
import {
  deleteFeedbackCategoryService,
  editFeedbackCategoryService,
  getFeedbackCategoryService,
  saveFeedbackCategoryService,
} from "../../api/services/feedbackService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { useTranslation } from "react-i18next";
import AddCategoryModal from "../../components/Feedback/FeedbackCategory/AddCategoryModal";
import { FeedbackCategoryType } from "../../types/feedback.type";

interface FeedbackCategoryContainerType {
  setIsAddNewOpen: React.Dispatch<
    React.SetStateAction<{ isOpen: boolean; card: FeedbackCategoryType }>
  >;
  isAddNewOpen: { isOpen: boolean; card: FeedbackCategoryType };
}
const FeedbackCategoryContainer: React.FC<FeedbackCategoryContainerType> = ({
  setIsAddNewOpen,
  isAddNewOpen,
}) => {
  const { openErrorWindow } = useErrorWindow();
  const { t } = useTranslation();

  const [data, setData] = useState<FeedbackCategoryType[]>([]);
  const [pagingPage, setPagingPage] = useState<number>(1);
  const [pagingLimit, setPagingLimit] = useState<number>(25);
  const [totalResult, setTotalResult] = useState<number>(0);

  useEffect(() => {
    loadFeedbackCategoryHandler();
  }, [pagingPage, pagingLimit]);

  const loadFeedbackCategoryHandler = async () => {
    try {
      const response = await getFeedbackCategoryService(
        pagingPage,
        pagingLimit
      );
      const data = response.data;
      setTotalResult(data.length);
      setData(data);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };
  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const onDeleteCategory = (id: number | null) => {
    deleteFeedbackCategoryService(id)
      .then(() => {
        const tmp = data.filter((item) => item.id !== id);
        setData(tmp);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const saveCategoryHandler = async (newFeedback: FeedbackCategoryType) => {
    try {
      const resp = await saveFeedbackCategoryService(newFeedback);
      setData([...data, resp.data]);
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  const editCategoryHandler = async (editItem: FeedbackCategoryType) => {
    try {
      const response = await editFeedbackCategoryService(editItem);
      setData(
        data.map((item) =>
          item.id === response.data.id ? response.data : item
        )
      );
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  return (
    <>
      <FeedbackCategoryPage
        data={data}
        setIsAddNewOpen={setIsAddNewOpen}
        totalResult={totalResult}
        pagingPage={pagingPage}
        pagingLimit={pagingLimit}
        onPagingLimitChange={onPagingLimitChange}
        onDeleteCategory={onDeleteCategory}
        setPagingPage={setPagingPage}
      />
      {isAddNewOpen.isOpen && (
        <AddCategoryModal
          setIsAddNewOpen={setIsAddNewOpen}
          isAddNewOpen={isAddNewOpen}
          currItem={isAddNewOpen.card}
          saveCategoryHandler={saveCategoryHandler}
          editCategoryHandler={editCategoryHandler}
        />
      )}
    </>
  );
};

export default FeedbackCategoryContainer;
