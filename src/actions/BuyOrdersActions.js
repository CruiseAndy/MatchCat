/* Types */
import {
  BUY_ORDER_QUERY_SUCCESS,
  BUY_ORDER_QUERY_FAIL,
  BUY_SUMMARY_QUERY_SUCCESS,
  BUY_SUMMARY_QUERY_FAIL,
  BUY_ORDER_VERIFY_SUCCESS,
  BUY_ORDER_VERIFY_FAIL,
  BUY_ORDER_CANCEL_SUCCESS,
  BUY_ORDER_CANCEL_FAIL,
  BUY_ORDER_QUERY_CARDINFO_SUCCESS,
  BUY_ORDER_QUERY_CARDINFO_FAIL
} from "./types";
import { axiosIns, API_BUY_ORDERS, API_UPDATE_BUY_ORDERS } from "./api";

export const queryBuyOrders = (
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
        url: API_BUY_ORDERS,
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
    type: BUY_ORDER_QUERY_SUCCESS,
    payload: resp.data.content
  };
};

const ordersQueryFail = err => {
  return {
    type: BUY_ORDER_QUERY_FAIL,
    errMsg: err.response.data
  };
};

export const queryBuySummary = (auth_token, period_type) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: "get",
        url: `${API_BUY_ORDERS}/summary`,
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
    type: BUY_SUMMARY_QUERY_SUCCESS,
    payload: resp.data.content
  };
};

const summaryQueryFail = err => {
  return {
    type: BUY_SUMMARY_QUERY_FAIL,
    errMsg: err.response.data
  };
};
export const verifyBuyOrder = (auth_token, order_num) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: "put",
        url: `${API_UPDATE_BUY_ORDERS}/${order_num}/verify`,
        data: { auth_token, order_num }
      })
        .then(async response => {
          await dispatch(orderVerifySuccess(response));
          await resolve("OK");
        })
        .catch(async error => {
          await dispatch(orderVerifyFail(error));
          await reject("ERROR");
        });
    });
  };
};

const orderVerifySuccess = resp => {
  return {
    type: BUY_ORDER_VERIFY_SUCCESS,
    payload: resp.data
  };
};

const orderVerifyFail = err => {
  return {
    type: BUY_ORDER_VERIFY_FAIL,
    errMsg: err.response.data
  };
};

export const cancelBuyOrder = (auth_token, order_num) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: "put",
        url: `${API_UPDATE_BUY_ORDERS}/${order_num}/cancel`,
        data: { auth_token, order_num }
      })
        .then(async response => {
          await dispatch(orderCancelSuccess(response));
          await resolve("OK");
        })
        .catch(async error => {
          await dispatch(orderCancelFail(error));
          await reject("ERROR");
        });
    });
  };
};

const orderCancelSuccess = resp => {
  return {
    type: BUY_ORDER_CANCEL_SUCCESS,
    payload: resp.data
  };
};

const orderCancelFail = err => {
  return {
    type: BUY_ORDER_CANCEL_FAIL,
    errMsg: err.response.data
  };
};

export const requestCardInfo = (auth_token, order_num) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: "get",
        url: `${API_BUY_ORDERS}/${order_num}/card_info`,
        params: {
          auth_token,
          order_num
        }
      })
        .then(async response => {
          await dispatch(cardQuerySuccess(response));
          await resolve("OK");
        })
        .catch(async error => {
          await dispatch(cardQueryFail(error));
          await reject("ERROR");
        });
    });
  };
};

const cardQuerySuccess = resp => {
  return {
    type: BUY_ORDER_QUERY_CARDINFO_SUCCESS,
    payload: resp.data.content
  };
};

const cardQueryFail = err => {
  return {
    type: BUY_ORDER_QUERY_CARDINFO_FAIL,
    errMsg: err.response.data
  };
};
