import { emsInstance } from "../../axios";
import { PagingType } from "../../../types/common.type";
import {
  FollowUpFilterType,
  FollowUpRecommendationType,
  FollowUpType,
} from "../../../types/followUp.type";

export const loadFollowUp = (
  filter: FollowUpFilterType,
  page: number,
  limit: number
) => {
  return emsInstance.get<PagingType<FollowUpType>>("/inspection/followup", {
    params: {
      page,
      limit,
      ...filter,
    },
  });
};

export const loadFollowUpRecommendations = (
  page: number,
  limit: number,
  id: number,
  filters: FollowUpFilterType
) => {
  return emsInstance.get<PagingType<FollowUpRecommendationType>>(
    `/inspection/followup/recommendations/${id}`,
    {
      params: {
        page: page,
        limit: limit,
        ...filters,
      },
    }
  );
};

export const updateFollowUpRecommendation = (
  id: number,
  recommendationId: number,
  data: FollowUpRecommendationType
) => {
  return emsInstance.put(
    `/inspection/followup/recommendations/${id}/${recommendationId}`,
    data
  );
};

export const postFollowUpRecommendation = (
  id: number,
  data: FollowUpRecommendationType
) => {
  return emsInstance.post(`/inspection/followup/recommendations/${id}`, data);
};

export const deleteFollowUpRecommendation = (
  id: number,
  recommendationId: number
) => {
  return emsInstance.delete(
    `/inspection/followup/recommendations/${id}/${recommendationId}`
  );
};

export const createFollowUp = (data: FollowUpType) => {
  return emsInstance.post(`/inspection/followup/`, data);
};

export const updateFollowUp = (followupId: number, data: FollowUpType) => {
  return emsInstance.put(`/inspection/followup/${followupId}`, data);
};

export const deleteFollowUp = (id: number) => {
  return emsInstance.delete(`/inspection/followup/${id}`);
};

export const loadFollowUpInspection = () => {
  return emsInstance.get(`/inspection/followup/inspection`, {
    params: {
      page: 1,
      limit: 1000000,
    },
  });
};
