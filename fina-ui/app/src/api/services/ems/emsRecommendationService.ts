import { emsInstance } from "../../axios";
import { PagingType } from "../../../types/common.type";
import { recomendationDataType } from "../../../types/recomendation.type";

export const loadRecommendations = (
  page: number,
  limit: number,
  filter: any
) => {
  return emsInstance.get<PagingType<recomendationDataType>>(
    "sanction/recommendations",
    {
      params: {
        page: page,
        limit: limit,
        filter: filter,
      },
    }
  );
};
