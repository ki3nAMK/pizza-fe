/* eslint-disable class-methods-use-this */
import axios, { AxiosInstance } from 'axios';
import {
  isArray,
  isDate,
  isEmpty,
  isFunction,
  isNil,
  isObject,
  isString,
  keys,
  map,
  omitBy,
  reduce,
  reject,
  trim,
} from 'lodash';

import AsyncStorage from '@react-native-async-storage/async-storage';

type IRequestCredentials = "include" | "omit" | "same-origin";

type IAnyObject = {
  [key: string]: string | number | boolean | undefined | any;
};

export const trimObjectValues = (
  values: any,
  { omitEmpty }: { omitEmpty?: boolean } = { omitEmpty: false }
): any => {
  try {
    const isRemove = (val: any) => {
      if (isObject(val) && !isFunction(val) && !isDate(val))
        return isEmpty(val);
      if (isString(val)) return !val;
      return isNil(val);
    };

    const trims = (val: any): any => {
      if (isString(val)) return trim(val);
      if (isFunction(val) || isDate(val) || !isObject(val)) return val;
      if (Array.isArray(val)) {
        const results = map(val, (v) => trims(v));
        return omitEmpty ? reject(results, (it) => isRemove(it)) : results;
      }

      const results = reduce(
        keys(val),
        (prev: any, key: string) => ({
          ...prev,
          [key]: trims((val as Record<string, any>)[key]),
        }),
        {}
      );

      return omitEmpty ? omitBy(results, (it) => isRemove(it)) : results;
    };

    return trims(values);
  } catch (error) {
    return values;
  }
};

interface IRequestUrlInfo {
  baseURL?: string;
  params?: IAnyObject;
  url: string;
  queries?: IAnyObject;
}

interface IRequestConfig {
  headers?: any;
  revalidate?: number;
  baseURL?: string;
  timeout?: number;
  cacheTags?: string[];
  credentials?: IRequestCredentials;
}

interface IGetRequest extends IRequestUrlInfo, IRequestConfig {}
interface IPostRequest extends IRequestUrlInfo, IRequestConfig {
  data: IAnyObject;
}

class Http {
  private headers: any;
  private revalidate: number;
  private timeout: number;
  private credentials: IRequestCredentials;
  private cacheTags: string[];
  private baseURL: string;
  axios: AxiosInstance;

  constructor({
    headers,
    revalidate,
    cacheTags,
    baseURL,
    credentials,
    timeout,
  }: IRequestConfig) {
    this.baseURL = baseURL || "/api/";
    this.headers = headers || {};
    if (!this.headers["Content-Type"])
      this.headers["Content-Type"] = "application/json";
    this.timeout = (timeout || 10) * 1000;
    this.revalidate = revalidate || 1;
    this.credentials = credentials || "include";
    this.cacheTags = cacheTags || ["all"];

    this.axios = axios.create({
      baseURL: this.baseURL,
      headers: this.headers,
      timeout: this.timeout,
      withCredentials: false,
    });

    this.axios.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.axios.interceptors.response.use(this.handleResponse, this.handleError);
  }

  private handleResponse(res: any) {
    if (!isEmpty(res?.data?.data) && isArray(res?.data?.data))
      return res?.data || res;
    return res?.data?.data || res?.data || res;
  }

  private handleError(error: any) {
    return Promise.reject(error);
  }

  private getRequestUrl({
    baseURL,
    params,
    url,
    queries,
    isAxios = false,
  }: IRequestUrlInfo & { isAxios?: boolean }) {
    let requestUrl = `${isAxios ? "" : (baseURL || this.baseURL).replace(/\/$/, "")}/${url.replace(/^\//, "")}`;

    if (!isEmpty(queries)) {
      const trimmedQueries = trimObjectValues(queries, { omitEmpty: true });
      if (!isEmpty(trimmedQueries)) {
        requestUrl = reduce(
          keys(trimmedQueries),
          (prev, curr) => prev.replace(`:${curr}`, trimmedQueries[curr]),
          requestUrl
        );
      }
    }

    if (isEmpty(params)) return requestUrl;

    const originalParams = trimObjectValues(params, { omitEmpty: true });
    if (!isEmpty(originalParams)) {
      const searchParams = new URLSearchParams();
      Object.keys(originalParams).forEach((key) =>
        searchParams.append(key, originalParams[key])
      );
      requestUrl = `${requestUrl}?${searchParams.toString()}`;
    }

    return requestUrl;
  }

  get<T>({ baseURL, url, queries, params }: IGetRequest): Promise<T> {
    return this.axios.request({
      method: "GET",
      url: this.getRequestUrl({ url, queries, params, baseURL, isAxios: true }),
      ...(baseURL && this.baseURL !== baseURL && { baseURL }),
    });
  }

  post<T>({ baseURL, data, url, queries, params }: IPostRequest): Promise<T> {
    return this.axios.request({
      method: "POST",
      url: this.getRequestUrl({ url, queries, params, baseURL, isAxios: true }),
      data: trimObjectValues(data, { omitEmpty: true }),
      ...(baseURL && this.baseURL !== baseURL && { baseURL }),
    });
  }

  patch<T>({ baseURL, data, url, queries, params }: IPostRequest): Promise<T> {
    return this.axios.request({
      method: "PATCH",
      url: this.getRequestUrl({ url, queries, params, baseURL, isAxios: true }),
      data: trimObjectValues(data, { omitEmpty: true }),
      ...(baseURL && this.baseURL !== baseURL && { baseURL }),
    });
  }

  delete<T>({ baseURL, url, queries, params }: IGetRequest): Promise<T> {
    return this.axios.request({
      method: "DELETE",
      url: this.getRequestUrl({ url, queries, params, baseURL, isAxios: true }),
      ...(baseURL && this.baseURL !== baseURL && { baseURL }),
    });
  }
}

export const http = new Http({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  credentials: "omit",
});
