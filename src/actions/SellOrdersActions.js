/* Types */
import {
  SELL_ORDER_QUERY_SUCCESS,
  SELL_ORDER_QUERY_FAIL,
  SELL_SUMMARY_QUERY_SUCCESS,
  SELL_SUMMARY_QUERY_FAIL,
  SELL_WECHAT_ACCOUNT_QUERY_SUCCESS,
  SELL_WECHAT_ACCOUNT_QUERY_FAIL
} from "./types";
import { axiosIns, API_SELL_ORDERS, API_SELL_ORDERS_SUMMARY } from "./api";

export const querySellOrders = (
  auth_token,
  page,
  per_page,
  period_type,
  period_before
) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: "get",
        url: API_SELL_ORDERS,
        params: {
          auth_token,
          page,
          per_page,
          period_type,
          period_before
        }
      })
        .then(async response => {
          await dispatch(ordersQuerySuccess(response));
          await resolve("OK");
        })
        .catch(async error => {
          await dispatch(ordersQueryFail(error));
          await reject("ERROR");
        });
    });
  };
};

const ordersQuerySuccess = resp => {
  return {
    type: SELL_ORDER_QUERY_SUCCESS,
    payload: resp.data.content
  };
};

const ordersQueryFail = err => {
  return {
    type: SELL_ORDER_QUERY_FAIL,
    errMsg: err.response.data
  };
};

export const querySellSummary = (auth_token, period_type) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: "get",
        url: API_SELL_ORDERS_SUMMARY,
        params: {
          auth_token,
          period_type
        }
      })
        .then(async response => {
          await dispatch(summaryQuerySuccess(response));
          await resolve("OK");
        })
        .catch(async error => {
          await dispatch(summaryQueryFail(error));
          await reject("ERROR");
        });
    });
  };
};

const summaryQuerySuccess = resp => {
  return {
    type: SELL_SUMMARY_QUERY_SUCCESS,
    payload: resp.data.content
  };
};

const summaryQueryFail = err => {
  return {
    type: SELL_SUMMARY_QUERY_FAIL,
    errMsg: err.response.data
  };
};

export const queryWechatAccount = (auth_token, order_num) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: "get",
        url: `${API_SELL_ORDERS}/${order_num}`,
        params: {
          auth_token,
          order_num
        }
      })
        .then(async response => {
          await dispatch(weChatAccountQuerySuccess(response));
          await resolve("OK");
        })
        .catch(async error => {
          await dispatch(weChatAccountQueryFail(error));
          await reject("ERROR");
        });
    });
  };
};

const weChatAccountQuerySuccess = resp => {
  return {
    type: SELL_WECHAT_ACCOUNT_QUERY_SUCCESS,
    payload: resp.data.content
  };
};

const weChatAccountQueryFail = err => {
  return {
    type: SELL_WECHAT_ACCOUNT_QUERY_FAIL,
    errMsg: err.response.data
  };
};
