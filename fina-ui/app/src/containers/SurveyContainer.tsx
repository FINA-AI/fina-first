import React, { useEffect, useState } from "react";
import {
  getSurvey,
  loadSurvey,
  uploadSurvey,
} from "../api/services/surveyService";
import { useTranslation } from "react-i18next";
import SurveyPage from "../components/survey/SurveyPage";
import useErrorWindow from "../hoc/ErrorWindow/useErrorWindow";
import { Survey, SurveyResult, SurveyUploadModal } from "../types/survey.type";
import { useSnackbar } from "notistack";

const SurveyContainer = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const { openErrorWindow } = useErrorWindow();
  const { enqueueSnackbar } = useSnackbar();

  const [list, setList] = useState<Survey[]>([]);
  const [surveyResult, setSurveyResult] = useState<SurveyResult[]>([]);
  const [isPublicUpload, setIsPublicUpload] = useState(false);
  const [pagingPage, setPagingPage] = useState(1);
  const [pagingLimit, setPagingLimit] = useState(25);
  const [totalResult, setTotalResult] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState<SurveyUploadModal>({
    title: "",
    open: false,
  });

  const columnHeaders = [
    { field: "userName", headerName: t("userName") },
    { field: "name", headerName: t("surveyName") },
  ];

  useEffect(() => {
    fetchData();
  }, [pagingPage, pagingLimit]);

  const onPagingLimitChange = (limit: number) => {
    setPagingPage(1);
    setPagingLimit(limit);
  };

  const fetchData = async (sortField?: string | number, sortDir?: string) => {
    setLoading(true);
    let resp = await loadSurvey(pagingPage, pagingLimit, sortField, sortDir);
    setList(resp.data.list);
    setTotalResult(resp.data.totalResults);
    setLoading(false);
  };

  const uploadFile = (file: File) => {
    let formData = new FormData();
    formData.append("file", file);
    uploadSurvey(formData, isPublicUpload)
      .then(() => {
        enqueueSnackbar(t("Upload Successfully"), {
          variant: "success",
        });
        setUploadModal({ title: "", open: false });
        setIsPublicUpload(false);
        fetchData(0);
      })
      .catch((err) => {
        openErrorWindow(err, t("error"), true);
      });
  };

  const mapDataToSurvey = async (
    result: string,
    surveyName: string,
    username: string
  ) => {
    let surveyResultTmp = [];

    try {
      let resp = await getSurvey(surveyName, username === "Anonymous");
      let data = resp.data;
      let resultToJson = JSON.parse(result);

      if (data) {
        if (data[i18n.language]) {
          data = data[i18n.language];
        }

        const questions = findArrayByKeys(data, "questions", "elements");

        if (!questions) return;

        for (let question of questions) {
          let elementsLength = question?.elements?.length || 1;
          for (let i = 0; i < elementsLength; i++) {
            let surveyResultItem: any = {};
            const targetKey = Array.isArray(question?.elements)
              ? question.elements[i]?.name
              : question.name;
            let currentQuestionResult = resultToJson[targetKey];

            if (currentQuestionResult) {
              surveyResultItem.key = question.title || question.name;

              switch (question.type) {
                case "checkbox":
                  if (
                    question.choices &&
                    typeof question.choices[0] === "string"
                  ) {
                    surveyResultItem.value = currentQuestionResult.join(", ");
                  } else {
                    surveyResultItem.value = currentQuestionResult
                      .map(
                        (el: any) =>
                          question.choices.find((q: any) => q.value === el)
                            ?.text
                      )
                      .join(", ");
                  }
                  break;
                case "matrix":
                  let tmp: any = {};
                  for (let item in currentQuestionResult) {
                    let key = question.rows.find(
                      (el: any) => el.value === item
                    )?.text;
                    let val = question.columns.find(
                      (el: any) => el.value === currentQuestionResult[item]
                    )?.text;
                    tmp[key] = val;
                  }
                  surveyResultItem.value = JSON.stringify(tmp);
                  break;
                case "boolean": {
                  if (typeof currentQuestionResult === "boolean") {
                    surveyResultItem.value = currentQuestionResult.toString();
                  }
                  break;
                }
                case "matrixdropdown":
                  if (question?.rows?.length) {
                    surveyResultItem.value = question.rows
                      .map((row: any) => row?.text)
                      .join(", ");
                  }
                  break;
                case "tagbox":
                case "multipletext":
                  if (typeof currentQuestionResult === "object") {
                    surveyResultItem.value = Object.values(
                      currentQuestionResult
                    ).join(", ");
                  }
                  break;
                default:
                  surveyResultItem.value = currentQuestionResult;
              }
              surveyResultTmp.push(surveyResultItem);
            }
          }
        }
      }
    } catch (e) {
      try {
        let obj = JSON.parse(result);
        for (let key in obj) {
          surveyResultTmp.push({ key: key, val: JSON.stringify(obj[key]) });
        }
      } catch (e) {
        console.error(e);
      }
    }

    setSurveyResult(surveyResultTmp);
  };

  const orderRowByHeader = (sortField: string, sortDir: string) => {
    fetchData(sortField, sortDir === "up" ? "ASC" : "DESC");
  };

  const findArrayByKeys = (obj: any, key1: string, key2: string) => {
    if (!obj || typeof obj !== "object") return null;

    for (const [key, value] of Object.entries(obj)) {
      if ((key === key1 || key === key2) && Array.isArray(value)) return value;
      if (typeof value === "object") {
        const result: any = findArrayByKeys(value, key1, key2);
        if (result) return result;
      }
    }

    return null;
  };

  return (
    <SurveyPage
      list={list}
      setList={setList}
      totalResult={totalResult}
      mapDataToSurvey={mapDataToSurvey}
      surveyResult={surveyResult}
      setIsPublicUpload={setIsPublicUpload}
      uploadFile={uploadFile}
      columnHeaders={columnHeaders}
      pagingPage={pagingPage}
      pagingLimit={pagingLimit}
      onPagingLimitChange={onPagingLimitChange}
      setPagingPage={setPagingPage}
      loading={loading}
      uploadModal={uploadModal}
      setUploadModal={setUploadModal}
      orderRowByHeader={orderRowByHeader}
    />
  );
};

export default SurveyContainer;
