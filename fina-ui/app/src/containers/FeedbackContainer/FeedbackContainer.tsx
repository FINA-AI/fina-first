import FeedbackMainPage from "../../components/Feedback/FeedbackMain/FeedbackMainPage";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/system";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useEffect, useState } from "react";
import {
  deleteFeedbackService,
  getFeedbackService,
} from "../../api/services/feedbackService";
import useErrorWindow from "../../hoc/ErrorWindow/useErrorWindow";
import { FeedbackType } from "../../types/feedback.type";

const FeedbackContainer = () => {
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();

  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [totalResult, setTotalResult] = useState(0); // TOTAL RESULT FROM BACK

  const [data, setData] = useState<FeedbackType[]>([]);

  const columns = [
    {
      field: "category",
      headerName: t("category"),
      flex: 1,
    },
    {
      field: "description",
      headerName: t("description"),
      flex: 1,
    },
    {
      field: "rating",
      headerName: t("rating"),
      hideCopy: true,
      flex: 1,
      renderCell: (value: number) => {
        let newArr = new Array(value).fill(0);
        return (
          <Box display={"flex"}>
            {newArr.map((_, index) => {
              return (
                <Box key={index}>
                  <StarRoundedIcon style={{ color: "#FF8D00" }} />
                </Box>
              );
            })}
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    loadFeedbackHandler();
  }, [pagingPage, pagingLimit]);

  const loadFeedbackHandler = async () => {
    try {
      const response = await getFeedbackService(pagingPage, pagingLimit);
      const data: FeedbackType[] = response.data.list;
      setTotalResult(response.data.totalResults);
      setData(
        data.map((item: FeedbackType) => ({
          ...item,
          category: item.feedbackCategory.name,
        }))
      );
    } catch (err) {
      openErrorWindow(err, t("error"), true);
    }
  };

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const onDelete = (id: number) => {
    deleteFeedbackService(id)
      .then(() => {
        let tmp = data.filter((item) => item.id !== id);
        setData(tmp);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  return (
    <FeedbackMainPage
      data={data}
      setData={setData}
      columns={columns}
      pagingPage={pagingPage}
      onPagingLimitChange={onPagingLimitChange}
      pagingLimit={pagingLimit}
      setPagingPage={setPagingPage}
      totalResult={totalResult}
      onDelete={onDelete}
    />
  );
};

export default FeedbackContainer;
