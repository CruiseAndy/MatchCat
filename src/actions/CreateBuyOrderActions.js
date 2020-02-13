/* Types */
import {
  BUY_ORDER_CREATE_SUCCESS,
  BUY_ORDER_CREATE_FAIL,
  BUY_ORDER_VERIFY_SUCCESS,
  BUY_ORDER_VERIFY_FAIL,
  BUY_ORDER_CANCEL_SUCCESS,
  BUY_ORDER_CANCEL_FAIL,
  BUY_ORDER_QUERY_EXIST_SUCCESS,
  BUY_ORDER_QUERY_EXIST_FAIL,
  BUY_ORDER_QUERY_CARDINFO_SUCCESS,
  BUY_ORDER_QUERY_CARDINFO_FAIL
} from "./types";
import {
  axiosIns,
  API_CREATE_BUY_ORDERS,
  API_UPDATE_BUY_ORDERS,
  API_BUY_ORDERS
} from "./api";

export const createOrderRequest = (auth_token, amount) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: "post",
        url: API_CREATE_BUY_ORDERS,
        data: { auth_token, amount }
      })
        .then(async response => {
          await dispatch(orderCreatrSuccess(response));
          await resolve("OK");
        })
        .catch(async error => {
          await dispatch(orderCreateFail(error));
          await reject("ERROR");
        });
    });
  };
};

const orderCreatrSuccess = resp => {
  return {
    type: BUY_ORDER_CREATE_SUCCESS,
    payload: resp.data
  };
};

const orderCreateFail = err => {
  return {
    type: BUY_ORDER_CREATE_FAIL,
    errMsg: err.response.data
  };
};

export const verifyOrderRequest = (auth_token, order_num) => {
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

export const cancelOrderRequest = (auth_token, order_num) => {
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

export const requestBuyOrderExist = auth_token => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: "get",
        url: `${API_BUY_ORDERS}/exist`,
        params: {
          auth_token
        }
      })
        .then(async response => {
          await dispatch(existQuerySuccess(response));
          await resolve("OK");
        })
        .catch(async error => {
          await dispatch(existQueryFail(error));
          await reject("ERROR");
        });
    });
  };
};

const existQuerySuccess = resp => {
  return {
    type: BUY_ORDER_QUERY_EXIST_SUCCESS,
    payload: resp.data.content
  };
};

const existQueryFail = err => {
  return {
    type: BUY_ORDER_QUERY_EXIST_FAIL,
    errMsg: err.response.data
  };
};

export const requestBuyOrderCardInfo = (auth_token, order_num) => {
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
