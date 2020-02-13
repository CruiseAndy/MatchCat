/* Types */
import {
  ADD_WECHAT_ACCOUNT_SUCCESS,
  ADD_WECHAT_ACCOUNT_FAIL,
  UPDATE_WECHAT_ACCOUNT_SUCCESS,
  UPDATE_WECHAT_ACCOUNT_FAIL,
  TRANSLATOR_WECHAT_QRCODE_SUCCESS,
  TRANSLATOR_QRCODE_FAIL,
  ADD_WECHAT_QRCODE_SUCCESS,
  ADD_QRCODE_FAIL,
  UPDATE_QRCODE_SUCCESS,
  UPDATE_QRCODE_FAIL
} from './types';
import {
  axiosIns,
  API_ADD_WECHAT_ACCOUNT,
  API_QRCODE_TRANSLATOR,
  API_PROFILE_ACCOUNTS
} from './api';

/****************** create wechat account *******************/
export const addWixAccount = data => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: 'post',
        url: API_ADD_WECHAT_ACCOUNT,
        data
      })
      .then( async response => {
        await dispatch(addWixAccountSuccess(response));
        await resolve("OK");
      }).catch( async error => {
        await dispatch(addWixAccountFail(error));
        await reject("ERROR");
      });  
    })
  }
}

const addWixAccountSuccess = resp => {
  return {
    type: ADD_WECHAT_ACCOUNT_SUCCESS,
    addAccountRlt: resp.data
  }
}

const addWixAccountFail = err => {
  return {
    type: ADD_WECHAT_ACCOUNT_FAIL,
    errMsg: err.response
  }
}

/****************** update wechat account *******************/
export const updateWixAccount = (acct_id, data) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: 'put',
        url: `${API_PROFILE_ACCOUNTS}/${acct_id}/update`,
        data
      })
      .then( async response => {
        await dispatch(updateWixAccountSuccess(response));
        await resolve("OK");
      }).catch( async error => {
        await dispatch(updateWixAccountFail(error));
        await reject("ERROR");
      });  
    })
  }
}

const updateWixAccountSuccess = resp => {
  return {
    type: UPDATE_WECHAT_ACCOUNT_SUCCESS,
    updateAccountRlt: resp.data
  }
}

const updateWixAccountFail = err => {
  return {
    type: UPDATE_WECHAT_ACCOUNT_FAIL,
    errMsg: err.response
  }
}

/****************** translate qrcode image to address *******************/
export const translatorWixQRcode = qr_image => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: 'put',
        url: API_QRCODE_TRANSLATOR,
        headers: { 'content-type': 'multipart/form-data' },
        data: qr_image
      })
      .then( async response => {
        await dispatch(translatorWixQRcodeSuccess(response));
        await resolve("OK");
      }).catch( async error => {
        await dispatch(translatorWixQRcodeFail(error));
        await reject("ERROR");
      });  
    })
  }
}

const translatorWixQRcodeSuccess = resp => {
  return {
    type: TRANSLATOR_WECHAT_QRCODE_SUCCESS,
    translateQRcodeRlt: resp.data
  }
}

const translatorWixQRcodeFail = err => {
  return {
    type: TRANSLATOR_QRCODE_FAIL,
    errMsg: err.response
  }
}

/****************** add wechat qrcode *******************/
export const addWixQRcode = (auth_token, url, remark, acct_id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: 'post',
        url: `${API_PROFILE_ACCOUNTS}/${acct_id}/codes/create`,
        data: { auth_token, url, remark }
      })
      .then( async response => {
        await dispatch(addWixQRcodeSuccess(response));
        await resolve("OK");
      }).catch( async error => {
        await dispatch(addWixQRcodeFail(error));
        await reject("ERROR");
      });  
    })
  }
}

const addWixQRcodeSuccess = resp => {
  return {
    type: ADD_WECHAT_QRCODE_SUCCESS,
    addQRcodeRlt: resp.data
  }
}

const addWixQRcodeFail = err => {
  return {
    type: ADD_QRCODE_FAIL,
    errMsg: err.response
  }
}

/****************** update qrcode of wechat account *******************/
export const updateWixQRcode = (auth_token, url, remark, acct_id, code_id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: 'put',
        url: `${API_PROFILE_ACCOUNTS}/${acct_id}/codes/${code_id}/update`,
        data: { auth_token, url, remark }
      })
      .then( async response => {
        await dispatch(updateWixQRcodeSuccess(response));
        await resolve("OK");
      }).catch( async error => {
        await dispatch(updateWixQRcodeFail(error));
        await reject("ERROR");
      });  
    })
  }
}

const updateWixQRcodeSuccess = resp => {
  return {
    type: UPDATE_QRCODE_SUCCESS,
    updateQRcodeRlt: resp.data
  }
}

const updateWixQRcodeFail = err => {
  return {
    type: UPDATE_QRCODE_FAIL,
    errMsg: err.response
  }
}