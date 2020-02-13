/* Types */
import { 
  GET_VERIFY_CODE_SUCCESS,
  GET_VERIFY_CODE_FAIL,
  VERIFY_PHONE_SUCCESS,
  VERIFY_PHONE_FAIL,
} from './types';
import {
  axiosIns,
  API_SEND_SMS,
  API_COMFIRM_USER_PHONE
} from './api';

/************************************* get verify code *************************************/
export const getVerification = (account, phone_code, phone, reset_password) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: 'post',
        url: API_SEND_SMS,
        data: { account, phone_code, phone, reset_password }
      })
      .then( async response => {
        await dispatch(getVerifyCodeSuccess(response));
        await resolve("OK");
      })
      .catch(async error => {
        await dispatch(getVerifyCodeFail(error));
        await reject("ERROR");
      });
    });
  };
}

const getVerifyCodeSuccess = resp => {
  return {
    type: GET_VERIFY_CODE_SUCCESS,
    result: resp.data
  }
}

const getVerifyCodeFail = err => {
  return {
    type: GET_VERIFY_CODE_FAIL,
    errMsg: err.response
  }
}

/************************************* register account *************************************/
export const verifyPhone = (account, sms_token) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      axiosIns({
        method: 'post',
        url: API_COMFIRM_USER_PHONE,
        data: { account, sms_token }
      })
      .then( async response => {
        await dispatch(verifyPhoneSuccess(response));
        await resolve("OK");
      })
      .catch(async error => {
        await dispatch(verifyPhoneFail(error));
        await reject("ERROR");
      });
    });
  };
};

const verifyPhoneSuccess = resp => {
  return {
    type: VERIFY_PHONE_SUCCESS,
    result: resp.data
  }
}

const verifyPhoneFail = err => {
  return {
    type: VERIFY_PHONE_FAIL,
    errMsg: err.response
  };
}