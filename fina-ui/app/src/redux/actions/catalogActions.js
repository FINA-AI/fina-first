import * as types from "../constants/catalogConstants";

export const changeCatalogLoadAction = (catalog) => ({
  type: types.LOAD_CATALOG,
  payload: catalog,
});

export const changeCatalogPagingPageAction = (page) => ({
  type: types.CHANGE_CATALOG_PAGING_PAGE,
  payload: page,
});

export const changeCatalogPagingLimitAction = (limit) => ({
  type: types.CHANGE_CATALOG_PAGING_LIMIT,
  payload: limit,
});

export const changeCatalogFilter = (filterValue) => ({
  type: types.CHANGE_CATALOG_FILTER,
  payload: filterValue,
});

export const changeCatalogItemFilter = (filterValue) => ({
  type: types.CHANGE_CATALOG_ITEM_FILTER,
  payload: filterValue,
});
