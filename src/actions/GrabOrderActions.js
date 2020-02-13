/* Types */
import {
  CHANGE_GRAB_ORDER_STATUS_SUCCESS,
  CHANGE_GRAB_ORDER_STATUS_FAIL,
  GRAB_ORDER_SUCCESS,
  GRAB_ORDER_FAIL,
  GRAB_ORDER_NO_RECIVE_PAY_SUCCESS,
  GRAB_ORDER_NO_RECIVE_PAY_FAIL,
  GRAB_ORDER_RECIVE_PAY_SUCCESS,
  GRAB_ORDER_RECIVE_PAY_FAIL
} from './types';
import {
  axiosIns,
  API_CHANGE_GRAB_ORDER_STATUS,
  API_GRAB_ORDER,
  API_SELL_ORDERS
} from './api';

export const changeGrabOrderStatus = ({auth_token, status}) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: 'put',
        url: API_CHANGE_GRAB_ORDER_STATUS,
        data: { auth_token, status }
      })
      .then( async response => {
        await dispatch(changeGrabOrderSuccess(response));
        await resolve("OK");
      }).catch( async error => {
        await dispatch(changeGrabOrderFail(error));
        await reject("ERROR");
      });  
    })
  }
}

const changeGrabOrderSuccess = resp => {
  return {
    type: CHANGE_GRAB_ORDER_STATUS_SUCCESS,
    changeGrabOrderStatusRlt: resp.data
  }
}

const changeGrabOrderFail = err => {
  return {
    type: CHANGE_GRAB_ORDER_STATUS_FAIL,
    errMsg: err.response
  }
}

export const setGrabOrderData = data => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: GRAB_ORDER_SUCCESS,
        grabOrderRlt: {
          content: data
        }
      })
      resolve();
    });
  }
}

export const startGrabOrder = auth_token => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns.get(API_GRAB_ORDER, {
        params: { auth_token }
      })
      .then( async response => {
        await dispatch(startGrabOrderSuccess(response));
        await resolve("OK");
      }).catch( async error => {
        await dispatch(startGrabOrderFail(error));
        await reject("ERROR");
      });  
    })
  }
}

const startGrabOrderSuccess = resp => {
  return {
    type: GRAB_ORDER_SUCCESS,
    grabOrderRlt: resp.data
  }
}

const startGrabOrderFail = err => {
  return {
    type: GRAB_ORDER_FAIL,
    errMsg: err.response
  }
}

export const grabOrderNoRecivePay = (auth_token, order_num, received_amount) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: 'put',
        url: `${API_SELL_ORDERS}/${order_num}/expire`,
        data: { auth_token, received_amount }
      })
      .then( async response => {
        await dispatch(grabOrderNoRecivePaySuccess(response));
        await resolve("OK");
      }).catch( async error => {
        await dispatch(grabOrderNoRecivePayFail(error));
        await reject("ERROR");
      });  
    })
  }
}

const grabOrderNoRecivePaySuccess = resp => {
  return {
    type: GRAB_ORDER_NO_RECIVE_PAY_SUCCESS,
    orderExpireRlt: resp.data
  }
}

const grabOrderNoRecivePayFail = err => {
  return {
    type: GRAB_ORDER_NO_RECIVE_PAY_FAIL,
    errMsg: err.response
  }
}

export const grabOrderConfirm = (auth_token, amount, order_num) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: 'put',
        url: `${API_SELL_ORDERS}/${order_num}/confirm`,
        data: { auth_token, amount }
      })
      .then( async response => {
        await dispatch(grabOrderRecivePaySuccess(response));
        await resolve("OK");
      }).catch( async error => {
        await dispatch(grabOrderRecivePayFail(error));
        await reject("ERROR");
      });  
    })
  }
}

const grabOrderRecivePaySuccess = resp => {
  return {
    type: GRAB_ORDER_RECIVE_PAY_SUCCESS,
    orderConfirmRlt: resp.data
  }
}

const grabOrderRecivePayFail = err => {
  return {
    type: GRAB_ORDER_RECIVE_PAY_FAIL,
    errMsg: err.response
  }
}